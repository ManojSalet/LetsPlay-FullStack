import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Searchbar from "./components/Home/SearchBar/Searchbar";
import Login from "./components/Auth/Login/Login";
import Signin from "./components/Auth/SignIn/Signin";
import Category from "./components/Category/Categories";
import HomeMain from "./components/Home/HomeMain";
import ProductView from "./components/ProductView/ProductView";

import { AuthProvider } from "./components/Auth/AuthContext";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import ProtectedRoutes from "./components/Auth/ProtectedRoutes";
import { CartProvider } from "./Context/CartContext";
import OrderSummary from "./components/OrderSummary/OrderSummary";
import OrderHistory from "./components/Order History/OrderHistory";
import Equipment from "./components/Equipment/Equipment";
import Wishlist from "./components/Wishlist/Wishlist";
import SearchResults from "./components/Search/SearchResults";
import NotFound from "./components/NotFound/NotFound";
import AdminRoute from "./components/Admin/AdminRoute";
import AdminLayout from "./components/Admin/AdminLayout";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  if (isAdminPath) {
    return (
      <Routes>
        <Route
          path="/admin/*"
          element={<AdminRoute element={<AdminLayout />} />}
        />
      </Routes>
    );
  }

  const excludedPaths = [
    "/login",
    "/signup",
    "/productview",
    "/checkout",
    "/ordersummary",
    "/search",
  ];

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        {/* Conditionally render Searchbar if not on excluded paths */}
        {!excludedPaths.some((path) => location.pathname.startsWith(path)) && (
          <Searchbar />
        )}
        <Routes>
          <Route path="/" element={<HomeMain />} />
          <Route path="/productview/:id" element={<ProductView />} />
          <Route path="/category" element={<Category />} />
          <Route path="/equipment/:id" element={<Equipment />} />
          <Route
            path="/wishlist"
            element={<ProtectedRoutes element={<Wishlist />} />}
          />
          <Route
            path="/cart"
            element={<ProtectedRoutes element={<Cart />} />}
          />
          <Route
            path="/checkout"
            element={<ProtectedRoutes element={<Checkout />} />}
          />
          <Route
            path="/ordersummary"
            element={<ProtectedRoutes element={<OrderSummary />} />}
          />
          <Route
            path="/orderhistory"
            element={<ProtectedRoutes element={<OrderHistory />} />}
          />
          <Route path="/search" element={<SearchResults />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signin />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
