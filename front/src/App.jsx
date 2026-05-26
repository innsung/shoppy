// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import PayResult from './pages/PayResult.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Support from './pages/Support.jsx';

import '@/styles/cgvSignup.css';
import '@/styles/cgv.css';
import '@/styles/commons.css';
import '@/styles/shoppy.css';
import '@/styles/cart.css';
import '@/styles/checkoutinfo.css';

// ✅ 로그인 필요한 페이지 보호
const PrivateRoute = ({ children }) => {
  const isLogin = useAuthStore((s) => s.isLogin);
  return isLogin ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const authChecked = useAuthStore((s) => s.authChecked);

  // ① 앱 시작 시 1회 — refreshToken으로 로그인 상태 복구
  useEffect(() => {
    const restoreLogin = async () => {
      try {
        // ✅ instance 대신 별도 axios 사용 (인터셉터 제외)
        const res = await axios.post(
          "http://192.168.7.25:9000/member/refresh",
          {},
          {
            withCredentials: true,
            validateStatus: (status) => status < 500, // ✅ 401도 throw 안 함
          },
        );

        if (res.status === 401) {
          // ✅ 비로그인 처리
          logout();
          return;
        }

        login({ ...res.data, isLogin: true });
      } catch {
        logout();
      }
    };

    restoreLogin();
  }, [login, logout]);

  // ② 복구 완료 전까지 렌더링 보류 (깜빡임 방지)
  if (!authChecked) return null; // 또는 <div>로딩 중...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:pid" element={<ProductDetail />} />
          {/* <Route path="cart" element={<Cart />} /> */}
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="support"
            element={
              <PrivateRoute>
                <Support />
              </PrivateRoute>
            }
          />
          {/* <Route path="checkout" element={<Checkout />} /> */}
          <Route path="payresult" element={<PayResult />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          {/* <Route path="support" element={<Support />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}