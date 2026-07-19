const API_BASE = "http://localhost:3001";

export async function createOrder(items: { id: number; name: string; price: number; qty: number }[]) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return res.json();
}

export type Order = {
  id: number;
  user_id: number;
  status: string;
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
};

export async function getOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  return res.json();
}

export async function getOrderDetail(orderId: number) {
  const res = await fetch(`${API_BASE}/orders/detail/${orderId}`);
  return res.json();
}
