export type CartItem = {
  id: number;
  name: string;
  price: number;
  main_img: string;
  qty: number;
};

const STORAGE_KEY = "realicious-cart";

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addToCart(product: { id: number; name: string; price: number; main_img?: string }, qty: number) {
  const cart = getCart();
  const exist = cart.find((item) => item.id === product.id);

  if (exist) {
    exist.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, main_img: product.main_img || "", qty });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: number) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  return cart;
}

export function updateQty(productId: number, qty: number) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) item.qty = Math.max(1, qty);
  saveCart(cart);
  return cart;
}

export function getCartItems(): CartItem[] {
  return getCart();
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEY);
}
