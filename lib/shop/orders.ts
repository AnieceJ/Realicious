import Cookies from "js-cookie";

const API_BASE = "http://localhost:3001";

export type OrderContact = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export async function createOrder(
  items: { id: number; name: string; price: number; qty: number }[],
  contact: OrderContact,
) {
  const token = Cookies.get("token");
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      items,
      address: contact.address,
      recipient_name: contact.name,
      recipient_email: contact.email,
      recipient_phone: contact.phone,
    }),
  });
  return res.json();
}

export type Order = {
  id: number;
  user_id: number;
  status: number | string;
  created_at: string;
  user_name: string;
  total_price: number;
};

export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product_name: string;
  is_active?: number | boolean | null;
};

export async function getOrders(userId?: number) {
  const url = userId ? `${API_BASE}/orders?user_id=${userId}` : `${API_BASE}/orders`;
  const res = await fetch(url);
  return res.json();
}

export async function getOrderDetail(orderId: number) {
  const res = await fetch(`${API_BASE}/orders/detail/${orderId}`);
  return res.json();
}
