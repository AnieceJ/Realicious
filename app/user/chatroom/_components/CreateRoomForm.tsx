import { useState } from "react";

interface CreateRoomFormProps {
  onCreateRoom: (
    name: string,
    type: "PUBLIC_GROUP" | "PRIVATE_GROUP",
    password?: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export default function CreateRoomForm({ onCreateRoom }: CreateRoomFormProps) {
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState<"PUBLIC_GROUP" | "PRIVATE_GROUP">("PUBLIC_GROUP");
  const [newRoomPassword, setNewRoomPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    if (newRoomType === "PRIVATE_GROUP" && !newRoomPassword.trim()) {
      alert("建立私密房間時請設定密碼！");
      return;
    }

    const result = await onCreateRoom(newRoomName, newRoomType, newRoomPassword);
    if (result.success) {
      setNewRoomName("");
      setNewRoomPassword("");
      setNewRoomType("PUBLIC_GROUP");
    } else {
      alert(result.message || "建立房間失敗");
    }
  };

  return (
    <div className="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-2.5 md:p-4 shadow-sm shrink-0">
      <h3 className="mb-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
        ➕ 建立房間
      </h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="名稱..."
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-2.5 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <div className="flex items-center justify-between text-[11px] md:text-xs text-slate-600">
          <div className="flex gap-2">
            <label className="flex items-center gap-0.5 cursor-pointer">
              <input
                type="radio"
                value="PUBLIC_GROUP"
                checked={newRoomType === "PUBLIC_GROUP"}
                onChange={() => setNewRoomType("PUBLIC_GROUP")}
                className="accent-indigo-600"
              />
              公開
            </label>
            <label className="flex items-center gap-0.5 cursor-pointer">
              <input
                type="radio"
                value="PRIVATE_GROUP"
                checked={newRoomType === "PRIVATE_GROUP"}
                onChange={() => setNewRoomType("PRIVATE_GROUP")}
                className="accent-indigo-600"
              />
              私密🔒
            </label>
          </div>

          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            建立
          </button>
        </div>

        {newRoomType === "PRIVATE_GROUP" && (
          <input
            type="password"
            placeholder="密碼..."
            value={newRoomPassword}
            onChange={(e) => setNewRoomPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        )}
      </form>
    </div>
  );
}