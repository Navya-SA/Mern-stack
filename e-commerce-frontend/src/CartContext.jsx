import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchCart } from "./cartUtils";

const CartContext = createContext({ cartCount: 0, refreshCart: () => {} });

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("_id");

  const refreshCart = useCallback(async () => {
    if (!userId) { setCartCount(0); return; }
    try {
      const items = await fetchCart(userId);
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch { setCartCount(0); }
  }, [userId]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  // Sync cart count when user returns to this tab
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) refreshCart();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }