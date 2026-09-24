const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Sport = require('../models/Sport');
const Equipment = require('../models/Equipment');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/LetsPlay';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // 1. Clear existing catalog data and default users
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({ email: { $in: ['admin@letsplay.com', 'customer@letsplay.com', 'sinojiyahet189@gmail.com'] } }),
      Category.deleteMany({}),
      Sport.deleteMany({}),
      Equipment.deleteMany({}),
      Product.deleteMany({}),
    ]);

    // 2. Seed Default Admin & Customer Accounts
    console.log('Seeding Users...');
    const adminUser = new User({
      username: 'Admin',
      email: 'admin@letsplay.com',
      password: 'Admin@12345',
      mobile: '9999999999',
      role: 'admin',
      isVerified: true,
    });
    await adminUser.save();

    const customerUser = new User({
      username: 'Manoj',
      email: 'customer@letsplay.com',
      password: 'Customer@123',
      mobile: '9876543210',
      role: 'customer',
      isVerified: true,
    });
    await customerUser.save();

    // 3. Seed Categories
    console.log('Seeding Categories...');
    const outdoorCat = await Category.create({
      name: 'Outdoor Sports',
      slug: 'outdoor-sports',
      description: 'Sports played in open-air environments, emphasizing stamina, agility, and teamwork.',
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=60',
      isActive: true,
    });

    const indoorCat = await Category.create({
      name: 'Indoor Sports',
      slug: 'indoor-sports',
      description: 'Sports played within court facilities, arenas, or indoor stadiums with precise gear.',
      image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&auto=format&fit=crop&q=60',
      isActive: true,
    });

    // 4. Seed Sports
    console.log('Seeding Sports...');
    // Outdoor Sports
    const cricket = await Sport.create({
      name: 'Cricket',
      slug: 'cricket',
      description: 'Tournament-grade cricket equipment, willow bats, leather balls, and protective gear.',
      sport_image: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=60'],
      category: outdoorCat._id,
      isActive: true,
    });

    const soccer = await Sport.create({
      name: 'Soccer',
      slug: 'soccer',
      description: 'Match footballs, goalkeeper gear, shin protectors, and training agility cones.',
      sport_image: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60'],
      category: outdoorCat._id,
      isActive: true,
    });

    const basketball = await Sport.create({
      name: 'Basketball',
      slug: 'basketball',
      description: 'Composite leather basketballs, nets, training boards, and footwear accessories.',
      sport_image: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60'],
      category: outdoorCat._id,
      isActive: true,
    });

    // Indoor Sports
    const badminton = await Sport.create({
      name: 'Badminton',
      slug: 'badminton',
      description: 'High-tension carbon graphite rackets, goose feather shuttlecocks, and court grips.',
      sport_image: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=60'],
      category: indoorCat._id,
      isActive: true,
    });

    const tableTennis = await Sport.create({
      name: 'Table Tennis',
      slug: 'table-tennis',
      description: 'ITTF approved rubber paddles, 3-star celluloid balls, and portable table nets.',
      sport_image: ['https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&auto=format&fit=crop&q=60'],
      category: indoorCat._id,
      isActive: true,
    });

    const chess = await Sport.create({
      name: 'Chess',
      slug: 'chess',
      description: 'FIDE standard weighted wooden chess sets, digital competition timers, and vinyl boards.',
      sport_image: ['https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=60'],
      category: indoorCat._id,
      isActive: true,
    });

    // Link sports back to category arrays for backwards-compatibility
    outdoorCat.sports = [cricket._id, soccer._id, basketball._id];
    await outdoorCat.save();

    indoorCat.sports = [badminton._id, tableTennis._id, chess._id];
    await indoorCat.save();

    // 5. Seed Equipment
    console.log('Seeding Equipment...');
    // Cricket Equipment
    const cricketBats = await Equipment.create({
      name: 'Cricket Bats',
      slug: 'cricket-bats',
      description: 'English willow and Kashmir willow handcrafted cricket bats for all formats.',
      equipment_image: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=60'],
      sport: cricket._id,
      category: outdoorCat._id,
      isActive: true,
    });

    const cricketBalls = await Equipment.create({
      name: 'Cricket Balls',
      slug: 'cricket-balls',
      description: 'Four-piece alumed leather test match balls and club seam balls.',
      equipment_image: ['https://images.unsplash.com/photo-1589801258579-18e091f4ca26?w=600&auto=format&fit=crop&q=60'],
      sport: cricket._id,
      category: outdoorCat._id,
      isActive: true,
    });

    const protectiveGear = await Equipment.create({
      name: 'Protective Pads & Helmets',
      slug: 'protective-pads',
      description: 'High-density foam batting leg guards, titanium helmets, and split-finger gloves.',
      equipment_image: ['https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop&q=60'],
      sport: cricket._id,
      category: outdoorCat._id,
      isActive: true,
    });

    // Badminton Equipment
    const badmintonRackets = await Equipment.create({
      name: 'Badminton Rackets',
      slug: 'badminton-rackets',
      description: 'Isometric lightweight rackets with high repulsion power and aerodynamic frame.',
      equipment_image: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=60'],
      sport: badminton._id,
      category: indoorCat._id,
      isActive: true,
    });

    const shuttlecocks = await Equipment.create({
      name: 'Shuttlecocks',
      slug: 'shuttlecocks',
      description: 'Precision goose feather shuttles and durable synthetic nylon shuttles.',
      equipment_image: ['https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop&q=60'],
      sport: badminton._id,
      category: indoorCat._id,
      isActive: true,
    });

    // Soccer Equipment
    const footballs = await Equipment.create({
      name: 'Footballs',
      slug: 'footballs',
      description: 'FIFA quality thermal bonded 32-panel match footballs.',
      equipment_image: ['https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=60'],
      sport: soccer._id,
      category: outdoorCat._id,
      isActive: true,
    });

    // Link equipment back to sport documents
    cricket.equipment = [cricketBats._id, cricketBalls._id, protectiveGear._id];
    await cricket.save();

    badminton.equipment = [badmintonRackets._id, shuttlecocks._id];
    await badminton.save();

    soccer.equipment = [footballs._id];
    await soccer.save();

    // 6. Seed Products
    console.log('Seeding Products...');
    const productsData = [
      // Cricket Bats
      {
        name: 'SG Player Edition English Willow Cricket Bat',
        sku: 'LP-CRIC-001',
        brand: 'SG',
        description: 'Grade 1 unbleached English willow engineered for explosive stroke play with thick contoured edges and balanced pick up.',
        product_images: [
          'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=60',
        ],
        qty: 25,
        price: 12999,
        selling_price: 9999,
        discountPer: 23,
        equipment: cricketBats._id,
        sport: cricket._id,
        category: outdoorCat._id,
        isActive: true,
      },
      {
        name: 'SS Ton Reserve Edition Kashmir Willow Bat',
        sku: 'LP-CRIC-002',
        brand: 'SS Ton',
        description: 'Carefully selected premium Kashmir willow bat with massive concaved sweet spot ideal for power hitters and club cricket.',
        product_images: [
          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=60',
        ],
        qty: 40,
        price: 3499,
        selling_price: 2799,
        discountPer: 20,
        equipment: cricketBats._id,
        sport: cricket._id,
        category: outdoorCat._id,
        isActive: true,
      },
      // Cricket Balls
      {
        name: 'Kookaburra Turf White Leather Ball (Pack of 2)',
        sku: 'LP-CRIC-003',
        brand: 'Kookaburra',
        description: 'Four-piece alum tanned white leather balls for limited overs matches with hand stitched 5-ply seam.',
        product_images: [
          'https://images.unsplash.com/photo-1589801258579-18e091f4ca26?w=600&auto=format&fit=crop&q=60',
        ],
        qty: 60,
        price: 1999,
        selling_price: 1499,
        discountPer: 25,
        equipment: cricketBalls._id,
        sport: cricket._id,
        category: outdoorCat._id,
        isActive: true,
      },
      // Protective Gear
      {
        name: 'DSC Condor Batting Legguard & Gloves Combo',
        sku: 'LP-CRIC-004',
        brand: 'DSC',
        description: 'High-density contoured cane vertical shin bolster protection paired with sausage-style split finger leather batting gloves.',
        product_images: [
          'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop&q=60',
        ],
        qty: 30,
        price: 4999,
        selling_price: 3899,
        discountPer: 22,
        equipment: protectiveGear._id,
        sport: cricket._id,
        category: outdoorCat._id,
        isActive: true,
      },
      // Badminton Rackets
      {
        name: 'Yonex Astrox 88D Pro Graphite Badminton Racket',
        sku: 'LP-BADM-001',
        brand: 'Yonex',
        description: 'Namd graphite frame with rotational generator system for devastating front court smashes and steep angles.',
        product_images: [
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=60',
        ],
        qty: 20,
        price: 15999,
        selling_price: 12499,
        discountPer: 21,
        equipment: badmintonRackets._id,
        sport: badminton._id,
        category: indoorCat._id,
        isActive: true,
      },
      {
        name: 'Li-Ning Windstorm 72 Superlight Racket',
        sku: 'LP-BADM-002',
        brand: 'Li-Ning',
        description: 'Ultra-lightweight 72g dynamic optimum frame delivering rapid swing speed and quick defensive recoveries.',
        product_images: [
          'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop&q=60',
        ],
        qty: 35,
        price: 6999,
        selling_price: 5299,
        discountPer: 24,
        equipment: badmintonRackets._id,
        sport: badminton._id,
        category: indoorCat._id,
        isActive: true,
      },
      // Shuttlecocks
      {
        name: 'Yonex Aerosensa 30 Goose Feather Shuttlecocks (Tube of 12)',
        sku: 'LP-BADM-003',
        brand: 'Yonex',
        description: 'Tournament grade 100% solid cork base with uniform grade-A goose feathers for consistent flight stability.',
        product_images: [
          'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop&q=60',
        ],
        qty: 100,
        price: 2499,
        selling_price: 1999,
        discountPer: 20,
        equipment: shuttlecocks._id,
        sport: badminton._id,
        category: indoorCat._id,
        isActive: true,
      },
      // Footballs
      {
        name: 'Nivia Storm Thermobonded Match Football (Size 5)',
        sku: 'LP-SOCC-001',
        brand: 'Nivia',
        description: 'FIFA basic certified 32-panel PU microfibre football with high abrasion resistance on turf and natural grass.',
        product_images: [
          'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=60',
        ],
        qty: 45,
        price: 1899,
        selling_price: 1299,
        discountPer: 31,
        equipment: footballs._id,
        sport: soccer._id,
        category: outdoorCat._id,
        isActive: true,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);

    // Update equipment product arrays
    for (const prod of createdProducts) {
      if (prod.equipment) {
        await Equipment.findByIdAndUpdate(prod.equipment, {
          $addToSet: { products: prod._id },
        });
      }
    }

    console.log('\n=========================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=========================================');
    console.log(`- Categories Seeded: 2 (Outdoor & Indoor)`);
    console.log(`- Sports Seeded: 6 (Cricket, Soccer, Basketball, Badminton, Table Tennis, Chess)`);
    console.log(`- Equipment Seeded: 6 categories`);
    console.log(`- Products Seeded: ${createdProducts.length} items`);
    console.log('\n--- Default Test Accounts ---');
    console.log('1. Admin Account:');
    console.log('   Email:    admin@letsplay.com');
    console.log('   Password: Admin@12345');
    console.log('   Role:     admin');
    console.log('\n2. Customer Account:');
    console.log('   Email:    customer@letsplay.com');
    console.log('   Password: Customer@123');
    console.log('   Role:     customer');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
