import axios from 'axios';

const BASE = 'http://localhost:3000/wishlist';

export const fetchWishlist = (userId) =>
  axios.get(`${BASE}/${userId}`).then((r) => r.data.wishlist);

export const addWishlist = (userId, productId) =>
  axios.post(BASE, { userId, productId });

export const removeWishlist = (userId, productId) =>
  axios.delete(`${BASE}/${userId}/${productId}`);

export const checkWishlisted = (userId, productId) =>
  axios.get(`${BASE}/${userId}/${productId}`).then((r) => r.data.wishlisted);