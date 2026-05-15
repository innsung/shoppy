import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:pid" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payresult" element={<PayResult />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
