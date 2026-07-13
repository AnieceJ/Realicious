const API_BASE = "http://localhost:3001/api";

export async function getProducts(params?: {
  page?: number;
  category_id?: string;
  keyword?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.category_id) query.set("category_id", params.category_id);
  if (params?.keyword) query.set("keyword", params.keyword);

  const res = await fetch(`${API_BASE}/shop/products?${query}`);
  return res.json();
}
