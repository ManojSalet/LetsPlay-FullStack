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
        Array.isArray(cartItem.cart.items) &&
        cartItem.cart.items.length > 0
      ) {
        setCartData(cartItem.cart.items); // Set the cart items
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
    const totalSelling = cartData.reduce((acc, item) => {
      const sellingPrice =
        parseFloat(item.product.selling_price?.$numberDecimal) || 0;
      const quantity = parseInt(item.quantity) || 0;
      const discount = parseFloat(item.product.discountPer) || 0;
      const discountAmount = (sellingPrice * discount) / 100;
      return acc + (sellingPrice - discountAmount) * quantity;
    }, 0);

    const totalOriginalSellingPrice = cartData.reduce((acc, item) => {
      const sellingPrice =
        parseFloat(item.product.selling_price?.$numberDecimal) || 0;
      return acc + sellingPrice * item.quantity;
    }, 0);

    const totalPrice = cartData.reduce((acc, item) => {
      const price = parseFloat(item.product.price?.$numberDecimal) || 0;
      return acc + price * item.quantity;
    }, 0);

    const totalDiscount = cartData.reduce((acc, item) => {
      const sellingPrice =
        parseFloat(item.product.selling_price?.$numberDecimal) || 0;
      const discount = parseFloat(item.product.discountPer) || 0;
      return acc + (sellingPrice * discount * item.quantity) / 100;
    }, 0);

    setTotalSellingPrice(totalSelling);
    setTotalPrice(totalPrice);
    setTotalDiscount(totalDiscount);
    setSellingPrice(totalOriginalSellingPrice);
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
