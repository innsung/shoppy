import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  userId: null,
  role: null,
  accessToken: null,
  isLogin: false,
  authChecked: true,   // DB 없으므로 즉시 true
  cartCount: 0,
  cartItems: [],       // 로컬 장바구니 아이템 목록

  login: ({ userId, role, accessToken, isLogin }) =>
    set({ userId, role, accessToken, isLogin, authChecked: true }),

  logout: () =>
    set({ userId: null, role: null, accessToken: null, isLogin: false, authChecked: true, cartCount: 0, cartItems: [] }),

  setCartCount: (count) => set({ cartCount: count }),

  setCartItems: (items) =>
    set({ cartItems: items, cartCount: items.reduce((sum, i) => sum + i.qty, 0) }),
}));