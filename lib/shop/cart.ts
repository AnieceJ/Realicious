export type CartItem = {
  id: number;
  name: string;
  price: number;
  main_img: string;
  qty: number;
};

type CartProduct = Pick<CartItem, "id" | "name" | "price"> & { main_img?: string };

const API_BASE = "http://localhost:3001";
const GUEST_STORAGE_KEY = "realicious-guest-cart";
const LEGACY_STORAGE_KEY = "realicious-cart";
const ACTIVE_USER_KEY = "realicious-cart-active-user";
const ORDER_KEY = "realicious-last-order";

function readCart(storageKey: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function getGuestCart() {
  const guestCart = readCart(GUEST_STORAGE_KEY);
  if (guestCart.length > 0 || localStorage.getItem(GUEST_STORAGE_KEY) !== null) return guestCart;
  return readCart(LEGACY_STORAGE_KEY);
}

function getActiveUserId() {
  if (typeof window === "undefined") return null;
  const userId = Number(localStorage.getItem(ACTIVE_USER_KEY));
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

function getStorageKey() {
  const userId = getActiveUserId();
  return userId ? `realicious-user-${userId}-cart` : GUEST_STORAGE_KEY;
}

function getCart() {
  return getActiveUserId() ? readCart(getStorageKey()) : getGuestCart();
}

function notifyCartUpdated() {
  window.dispatchEvent(new Event("cart-updated"));
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(getStorageKey(), JSON.stringify(items));
  if (!getActiveUserId()) localStorage.removeItem(LEGACY_STORAGE_KEY);
  notifyCartUpdated();
}

async function syncRequest(path: string, options: RequestInit) {
  try {
    const response = await fetch(`${API_BASE}${path}`, options);
    if (!response.ok) throw new Error(`購物車同步失敗：${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function syncMemberCart(userId: number, path: string, options: RequestInit) {
  void syncRequest(`/cart/${userId}${path}`, options).then((data) => {
    if (data?.success && Array.isArray(data.items)) {
      localStorage.setItem(`realicious-user-${userId}-cart`, JSON.stringify(data.items));
      if (getActiveUserId() === userId) notifyCartUpdated();
    }
  });
}

export async function syncCartForUser(userId: number) {
  if (typeof window === "undefined") return;
  const guestItems = getGuestCart();
  localStorage.setItem(ACTIVE_USER_KEY, String(userId));

  const data = await syncRequest(`/cart/${userId}/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: guestItems.map((item) => ({ product_id: item.id, qty: item.qty })),
    }),
  });

  if (data?.success && Array.isArray(data.items)) {
    localStorage.setItem(`realicious-user-${userId}-cart`, JSON.stringify(data.items));
    localStorage.removeItem(GUEST_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
  notifyCartUpdated();
}

export function switchToGuestCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_USER_KEY);
  notifyCartUpdated();
}

export function addToCart(product: CartProduct, qty: number) {
  const cart = getCart();
  const exist = cart.find((item) => item.id === product.id);

  if (exist) {
    exist.qty += qty;
    if (product.main_img) exist.main_img = product.main_img;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, main_img: product.main_img || "", qty });
  }

  saveCart(cart);
  const userId = getActiveUserId();
  if (userId) {
    syncMemberCart(userId, "/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id, qty }),
    });
  }
  return cart;
}

export function removeFromCart(productId: number) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  const userId = getActiveUserId();
  if (userId) syncMemberCart(userId, `/items/${productId}`, { method: "DELETE" });
  return cart;
}

export function updateQty(productId: number, qty: number) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);
  const nextQty = Math.max(1, qty);
  if (item) item.qty = nextQty;
  saveCart(cart);
  const userId = getActiveUserId();
  if (userId) {
    syncMemberCart(userId, `/items/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: nextQty }),
    });
  }
  return cart;
}

export function getCartItems(): CartItem[] {
  return getActiveUserId() ? readCart(getStorageKey()) : getGuestCart();
}

export function clearCart() {
  localStorage.removeItem(getStorageKey());
  if (!getActiveUserId()) localStorage.removeItem(LEGACY_STORAGE_KEY);
  const userId = getActiveUserId();
  if (userId) syncMemberCart(userId, "", { method: "DELETE" });
  notifyCartUpdated();
}

export function saveLastOrder(items: CartItem[]) {
  localStorage.setItem(ORDER_KEY, JSON.stringify({ items, date: Date.now() }));
}

export function getLastOrder(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = JSON.parse(localStorage.getItem(ORDER_KEY) || "null");
    return data?.items || [];
  } catch {
    return [];
  }
}
