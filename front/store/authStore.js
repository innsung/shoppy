import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  userId: null,
  role: null,
  accessToken: null,
  isLogin: false,
  authChecked: true,      // DB 없으므로 즉시 true
  cartCount: 0,
  cartList: [],          // 장바구니 리스트 공유 - Cart, CheckOut 컴포넌트
  isUpdateFlag: false,    // 장바구니 리스트 수량 변경

  login: ({ userId, role, accessToken, isLogin }) =>
    set({ userId, role, accessToken, isLogin, authChecked: true }),

  logout: () =>
    set({ userId: null, role: null, accessToken: null, isLogin: false, authChecked: true, cartCount: 0, cartItems: [] }),

  initCartCount: (count) => set(() => ({ cartCount: count })),
  setCartCount: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  setIsUpdateFlag: () => set((state) => ({ isUpdateFlag: !state.isUpdateFlag })),
  setCartList: (cartList) => set(() => ({cartList: cartList})),
}));