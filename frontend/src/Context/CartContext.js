import React, { createContext, useContext, useEffect, useState } from "react";
import { getCart, updateCartQuantity, removeFromCart } from "../API/apiService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]); // Cart data (items)
  const [allCartData, setAllCartData] = useState([]); // Full cart data
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [totalSellingPrice, setTotalSellingPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  // Fetch Cart Data from API
  const fetchCart = async () => {
    try {
      setIsLoading(true); // Start loading
      const cartItem = await getCart(); // Fetch cart data from API
      setAllCartData(cartItem); // Store full response data

      // Check if the cart has items and handle empty cart scenario
      if (
        cartItem &&
        cartItem.cart &&
        Array.isArray(cartItem.cart.items)
      ) {
        setCartData(cartItem.cart.items.filter((item) => item && item.product));
      } else {
        setCartData([]); // Clear cart data if cart is empty
      }
    } catch (error) {
      console.error("Error fetching cart", error);
      setCartData([]); // Clear cart data on error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Recalculate cart totals
  const calculateTotalPrice = () => {
    let totalSelling = 0;
    let totalOriginalSelling = 0;
    let totalOriginalPrice = 0;
    let totalDisc = 0;

    cartData.forEach((item) => {
      if (!item || !item.product) return;
      const product = item.product;
      const qty = parseInt(item.quantity) || 1;
      const rawPrice = parseFloat(product.price?.$numberDecimal || product.price) || 0;
      const rawSellingPrice = parseFloat(product.selling_price?.$numberDecimal || product.selling_price) || rawPrice;
      const discount = parseFloat(product.discountPer) || 0;

      const effectiveSelling = discount > 0 
        ? rawSellingPrice - (rawSellingPrice * discount) / 100 
        : rawSellingPrice;

      totalSelling += effectiveSelling * qty;
      totalOriginalSelling += rawSellingPrice * qty;
      totalOriginalPrice += rawPrice * qty;
      totalDisc += (rawSellingPrice * discount * qty) / 100;
    });

    setTotalSellingPrice(totalSelling);
    setTotalPrice(totalOriginalPrice);
    setTotalDiscount(totalDisc);
    setSellingPrice(totalOriginalSelling);
  };

  // Remove item from cart
  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart(); // Re-fetch cart after removing an item
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  // Update quantity in the cart
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await updateCartQuantity(productId, newQuantity);
      await fetchCart(); // Re-fetch cart after updating quantity
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  // Fetch cart on initial mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Recalculate totals whenever cartData changes
  useEffect(() => {
    if (cartData.length > 0) {
      calculateTotalPrice();
    } else {
      setTotalPrice(0); // Reset totals when cart is empty
      setSellingPrice(0);
      setTotalSellingPrice(0);
      setTotalDiscount(0);
    }
  }, [cartData]);

  const value = {
    cartData,
    allCartData,
    isLoading,
    totalPrice,
    sellingPrice,
    totalSellingPrice,
    totalDiscount,
    handleRemove,
    handleQuantityChange,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
