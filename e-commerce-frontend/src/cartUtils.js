import api from "./api";

export const fetchCart = (userId) =>
  api.get(`/cart/${userId}`).then((r) => r.data.cart);

export const addToCart = (userId, productId) =>
  api.post("/cart/add", { userId, productId });

export const updateQty = (userId, productId, quantity) =>
  api.patch("/cart/update", { userId, productId, quantity });

export const removeFromCart = (userId, productId) =>
  api.delete(`/cart/${userId}/${productId}`);

export const clearCart = (userId) =>
  api.delete(`/cart/${userId}`);