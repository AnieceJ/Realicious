export type Tx = {
  id: string;
  date: string;
  category: string;
  name: string;
  amount: number;
  type: "income" | "expense";
};

const BASE = "/api/accounting";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

const PUT = (body: unknown) => ({
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export async function fetchTxs(): Promise<Tx[]> {
  const d = await json<{ txs: Tx[] }>(await fetch(`${BASE}/transactions`));
  return d.txs;
}

export async function createTx(tx: Omit<Tx, "id">): Promise<Tx> {
  const d = await json<{ tx: Tx }>(
    await fetch(`${BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    }),
  );
  return d.tx;
}

export async function deleteTx(id: string): Promise<void> {
  await json(await fetch(`${BASE}/transactions/${id}`, { method: "DELETE" }));
}

export async function fetchBudget() {
  return json<{ budget: number; junkMode: boolean }>(await fetch(`${BASE}/budget`));
}

export async function saveBudget(patch: { budget?: number; junkMode?: boolean }) {
  return json<{ budget: number; junkMode: boolean }>(
    await fetch(`${BASE}/budget`, PUT(patch)),
  );
}

export async function fetchPet() {
  return json<{ petName: string }>(await fetch(`${BASE}/pet`));
}

export async function savePet(petName: string) {
  return json<{ petName: string }>(await fetch(`${BASE}/pet`, PUT({ petName })));
}