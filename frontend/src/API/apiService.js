import axios from "axios";

// Base API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//add token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

//register user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

//get all Products fro backend
export const getAllProducts = async () => {
  try {
    const response = await api.get("/products/all");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch products";
  }
};

//get product by id
export const getProductById = async (id) => {
  try {
    const response = await api.get("/products/" + id);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch product";
  }
};

//add product to cart
export const addToCart = async (productId, quantity) => {
  try {
    const response = await api.post("/cart/add", { productId, quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add item to cart";
  }
};

//get all product to cart
export const getCart = async () => {
  const token = localStorage.getItem("token");
  try {
    if (token) {
      const response = await api.get("/cart/");
      return response.data;
    }
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch cart";
  }
};

//update cart quantity
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const response = await api.put("/cart/update", { productId, quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update cart";
  }
};

//remove product from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete("/cart/remove/" + productId);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to remove item from cart";
  }
};

//save address

export const saveAddress = async (addressData) => {
  try {
    const response = await api.post("/addresses/add", addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to save address";
  }
};

//get Address
export const getAddress = async (userId) => {
  try {
    const response = await api.get("/addresses/" + userId);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch address";
  }
};

//Create Order
export const createOrder = async (addressId) => {
  try {
    const response = await api.post("/orders/create", {
      shippingAddress: addressId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create order";
  }
};

//get order by id
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get("/orders/" + orderId);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch orders";
  }
};

//get all orders by userid
export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders/allOrders");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch orders";
  }
};

//payment process
export const paymentProcess = async (orderId, paymentMethod) => {
  try {
    const response = await api.post("/payments/process", {
      order: orderId,
      paymentMethod: paymentMethod,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to process payment";
  }
};

//catergory api parts

//get all sports
export const getAllSports = async () => {
  try {
    const response = await api.get("/sports/");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch sports";
  }
};


//get equipment by sport id
export const getEquipmentBySportId = async (sportId) => {
  try {
    const response = await api.get("/equipment/by-sport/" + sportId);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch equipment";
  }
};

// get products by equipment id
export const getProductsByEquipment = async (equipmentId) => {
  try {
    const response = await api.get("/products/equipment/" + equipmentId);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { products: [] };
    }
    throw error.response?.data?.message || "Failed to fetch products for equipment";
  }
};

// Wishlist APIs
export const getWishlist = async () => {
  try {
    const response = await api.get("/wishlist/");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { wishlist: { wishlist: [] } };
    }
    throw error.response?.data?.message || "Failed to fetch wishlist";
  }
};

export const addToWishlist = async (productId) => {
  try {
    const response = await api.post("/wishlist/add", {
      wishlist: [{ product: productId }],
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add to wishlist";
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete("/wishlist/remove", {
      data: { productId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to remove from wishlist";
  }
};

// Reviews APIs
export const getProductReviews = async (productId) => {
  try {
    const response = await api.get("/reviews/product/" + productId);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { reviews: [] };
    }
    throw error.response?.data?.message || "Failed to fetch reviews";
  }
};

export const addReview = async (reviewData) => {
  try {
    const response = await api.post("/reviews/add", reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to submit review";
  }
};

export default createOrder;
