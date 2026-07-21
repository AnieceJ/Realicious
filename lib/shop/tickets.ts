const API_BASE = "http://localhost:3001";

export type Ticket = {
  id: number;
  user_id: number;
  product_id: number | null;
  order_id: number | null;
  name: string;
  type: "product" | "discount" | "cash";
  status: number; // 1:未使用 2:已使用 3:已過期
  discount_value: number;
  min_purchase: number;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
  product_name: string | null;
  product_price: number | null;
  product_img: string | null;
};

export async function getTickets(userId: number) {
  const res = await fetch(`${API_BASE}/tickets?user_id=${userId}`);
  return res.json();
}
