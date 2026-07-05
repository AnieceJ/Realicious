export default function ShopPage() {
  return (
    <div className="bg-[#FCE384] min-h-screen">
      <div className="max-w-[1280px] mx-auto flex gap-8">
        {/* 左側區塊 */}
        <aside className="w-64 flex-shrink-0">
          <div>首頁 / 商品列表</div>

          <div className="border-2 border-black rounded-xl bg-yellow-200 p-4">
            <ul>
              <li>電子票券</li>
              <li>電子雞服裝</li>
            </ul>
            <hr className="my-4 border-black" />
            <div>價格範圍</div>
            <div className="space-y-2 mt-4">
              <label><input type="checkbox" /> 特價中</label>
              <label><input type="checkbox" /> 只顯示有貨</label>
            </div>
          </div>
        </aside>

        {/* 右側區塊 */}
        <main className="flex-1">
          {/* 頂部操作列 */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Default Search here..."
              className="border border-gray-400 rounded px-4 py-2 w-80"
            />
            <div className="flex gap-4">
              <button>排序</button>
              <button className="relative">🛒 <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span></button>
            </div>
          </div>

          {/* 快速分類標籤 */}
          <div className="flex gap-4 mb-6">
            <span className="border border-black rounded-full px-4 py-1">火鍋</span>
            <span className="border border-black rounded-full px-4 py-1">速食</span>
          </div>

          {/* 推薦商品區 */}
          <section className="bg-blue-100 border-2 border-black p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">推薦商品</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-300">卡片1</div>
              <div className="bg-white rounded-lg p-4 border border-gray-300">卡片2</div>
              <div className="bg-white rounded-lg p-4 border border-gray-300">卡片3</div>
            </div>
          </section>

          {/* 一般商品列表 */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-gray-300">卡片1</div>
            <div className="bg-white rounded-lg p-4 border border-gray-300">卡片2</div>
            <div className="bg-white rounded-lg p-4 border border-gray-300">卡片3</div>
            <div className="bg-white rounded-lg p-4 border border-gray-300">卡片4</div>
            <div className="bg-white rounded-lg p-4 border border-gray-300">卡片5</div>
            <div className="bg-white rounded-lg p-4 border border-gray-300">卡片6</div>
          </div>
        </main>
      </div>
    </div>
  );
}
