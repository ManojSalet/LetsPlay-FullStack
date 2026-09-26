const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/LetsPlay';

async function migrateLegacyOrders() {
  try {
    console.log('Connecting to MongoDB for Order Migration:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected successfully.\n');

    const ordersCol = mongoose.connection.db.collection('orders');
    const allOrders = await ordersCol.find({}).toArray();
    console.log(`Found ${allOrders.length} total orders in database.\n`);

    let migratedCount = 0;

    for (const order of allOrders) {
      const updates = {};
      const unsets = {};

      // 1. Normalize Order Status
      let normalizedStatus = order.status;
      if (!normalizedStatus || !['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(normalizedStatus)) {
        if (order.orderStatus && ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
          normalizedStatus = order.orderStatus;
        } else {
          normalizedStatus = 'Pending';
        }
        updates.status = normalizedStatus;
      }
      if (order.orderStatus !== undefined) {
        unsets.orderStatus = '';
      }

      // 2. Generate Readable orderNumber if missing
      if (!order.orderNumber) {
        const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
        const dateStr = orderDate.toISOString().slice(0, 10).replace(/-/g, '');
        const shortId = order._id.toString().slice(-4).toUpperCase();
        updates.orderNumber = `LP-${dateStr}-${shortId}`;
      }

      // 3. Convert totalPrice from Decimal128 / Object to standard Number
      if (order.totalPrice && typeof order.totalPrice === 'object') {
        const parsedTotal = parseFloat(order.totalPrice.toString());
        updates.totalPrice = isNaN(parsedTotal) ? 0 : Math.round(parsedTotal * 100) / 100;
      }

      // 4. Convert items pricing to Number
      if (Array.isArray(order.items)) {
        let itemsModified = false;
        const normalizedItems = order.items.map((item) => {
          const itemCopy = { ...item };
          if (itemCopy.price && typeof itemCopy.price === 'object') {
            const parsedPrice = parseFloat(itemCopy.price.toString());
            itemCopy.price = isNaN(parsedPrice) ? 0 : Math.round(parsedPrice * 100) / 100;
            itemsModified = true;
          }
          return itemCopy;
        });
        if (itemsModified) {
          updates.items = normalizedItems;
        }
      }

      // 5. Ensure statusHistory Audit Trail
      if (!Array.isArray(order.statusHistory) || order.statusHistory.length === 0) {
        const timestamp = order.createdAt ? new Date(order.createdAt) : new Date();
        updates.statusHistory = [
          {
            status: normalizedStatus,
            timestamp: timestamp,
            comment: 'Order recorded in system',
          },
        ];
      }

      // 6. Ensure default paymentMethod if missing
      if (!order.paymentMethod) {
        updates.paymentMethod = 'COD';
      }

      // 7. Apply updates if needed
      const updateDoc = {};
      if (Object.keys(updates).length > 0) updateDoc.$set = updates;
      if (Object.keys(unsets).length > 0) updateDoc.$unset = unsets;

      if (Object.keys(updateDoc).length > 0) {
        await ordersCol.updateOne({ _id: order._id }, updateDoc);
        migratedCount++;
      }
    }

    console.log(`===============================================`);
    console.log(`✅ ORDER MIGRATION COMPLETED SUCCESSFULLY!`);
    console.log(`- Total orders examined: ${allOrders.length}`);
    console.log(`- Orders updated/normalized: ${migratedCount}`);
    console.log(`===============================================\n`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrateLegacyOrders();
