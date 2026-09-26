import axios from "axios";

// Base API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers based on session context (admin in sessionStorage vs customer in localStorage)
api.interceptors.request.use((config) => {
  const adminToken = sessionStorage.getItem("admin_token");
  const customerToken = localStorage.getItem("customer_token") || localStorage.getItem("token");

  // Prioritize adminToken when making administrative calls or when inside /admin
  const isAdminRequest =
    config.url.includes("/admin") ||
    config.url.includes("/upload") ||
    window.location.pathname.startsWith("/admin");

  const token = isAdminRequest && adminToken 
    ? adminToken 
    : (customerToken || adminToken);

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

//get all Products from backend
export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get("/products/all", { params });
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
  const token = localStorage.getItem("customer_token") || localStorage.getItem("token") || sessionStorage.getItem("admin_token");
  try {
    if (token) {
      const response = await api.get("/cart/");
      return response.data;
    }
    return { cart: { items: [] } };
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

// ==========================================
// Admin APIs (Protected by protect & adminOnly)
// ==========================================

// Categories
export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories/");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch categories";
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/categories/add", categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create category";
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/categories/update/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update category";
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/categories/delete/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete category";
  }
};

// Sports
export const createSport = async (sportData) => {
  try {
    const response = await api.post("/sports/add", sportData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create sport";
  }
};

export const updateSport = async (sportId, sportData) => {
  try {
    const response = await api.put(`/sports/update/${sportId}`, sportData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update sport";
  }
};

export const deleteSport = async (sportId) => {
  try {
    const response = await api.delete(`/sports/delete/${sportId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete sport";
  }
};

// Equipment
export const getAllEquipment = async () => {
  try {
    const response = await api.get("/equipment/");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch equipment";
  }
};

export const createEquipment = async (equipmentData) => {
  try {
    const response = await api.post("/equipment/add", equipmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create equipment";
  }
};

export const updateEquipment = async (equipmentId, equipmentData) => {
  try {
    const response = await api.put(`/equipment/update/${equipmentId}`, equipmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update equipment";
  }
};

export const deleteEquipment = async (equipmentId) => {
  try {
    const response = await api.delete(`/equipment/delete/${equipmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete equipment";
  }
};

// Products Admin CRUD
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products/addProduct", productData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create product";
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/updateProduct/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update product";
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/deleteProduct/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete product";
  }
};

export const restoreProduct = async (productId) => {
  try {
    const response = await api.put(`/products/restoreProduct/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to restore product";
  }
};

// Image Upload API (Multipart)
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to upload image";
  }
};

// Helper to resolve relative and absolute image paths
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  const apiRoot = BASE_URL.replace(/\/api\/?$/, "");
  return `${apiRoot}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

// Admin Orders
export const getAdminOrders = async () => {
  try {
    const response = await api.get("/orders/admin/all");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch admin orders";
  }
};

export const updateOrderStatus = async (orderId, status, note = "") => {
  try {
    const response = await api.put(`/orders/admin/status/${orderId}`, { status, note });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update order status";
  }
};

export default createOrder;
