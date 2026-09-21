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
  const excludedPaths = [
    "/login",
    "/signup",
    "/productview",
    "/checkout",
    "/ordersummary",
  ];
  const location = useLocation();

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        {/* Conditionally render Searchbar if not on /login and search route */}
        {!excludedPaths.some((path) => location.pathname.startsWith(path)) && (
          <Searchbar />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomeMain />
              </>
            }
          />
          <Route path="/productview/:id" element={<ProductView />} />
          <Route path="/category" element={<Category />} />
          <Route path="/equipment/:id" element={<Equipment/>}/>
          <Route path="/wishlist" element={<h1>Wishlist</h1>} />
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

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signin />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
