"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Share2, Bookmark, Reply } from "lucide-react";

const Articles = [
	{
		id: "1",
		author: "Wei C",
		title: "全台34家推薦魯肉飯大評比",
		date: "2026/07/05",
		views: 120,
		category: "滷肉飯",
		content:
			"如果我只能寫一種料理，那肯定是「台灣小吃」;又如果我只能分享一種美食，那也肯定是「魯肉飯」。這篇懶人包集合了我這五年部落格生涯吃過的上百家魯肉飯，挑選了我覺得想寫、可以寫(但和美味沒有必然關系)中的34家。不過，這當中的文章有些年代久遠，照片爛到我自己看了都想吐..這點得先跟大家的雙眼說聲抱歉。再則本篇的味覺絕絕對對是我個人的主觀，看倌且瞧且參考，別往「味」裡去。開頭特別感謝「右上」幫我完成這個想了很久卻一直沒動手的「懶人包」工程。 ",
	},
	{
		id: "2",
		author: "Ash C",
		title: "Next.js App Router 動態路由 [id] 完全指南",
		date: "2026/07/06",
		views: 85,
		category: "義大利麵",
		content:
			"若是說到臺灣「米派」王者，非滷肉飯莫屬。吃滷肉飯是日常裡的小事，對於你的胃而言，卻是件大事——一碗熱騰騰的白飯，淋上香鹹肉汁與肥瘦均勻的碎肉——銅板價就能擁有的大滿足，幾乎無人能抵抗。這次，米麵研究社邀請到臺灣飲食文化研究者、500 碗評審曹銘宗擔任引路人，一起揭開滷肉飯的神秘身世，也跟著曹老師老饕級味蕾，穿梭滷肉飯間，來一場「肥瘦之間」的大比拼！明仔載的氣力，滷肉飯！滷肉飯被稱為臺灣的「國飯」其來有自。1990 年代，愛滷肉飯成痴的曹老師開始在基隆廟口一帶尋找滷肉飯的根源，查遍史料、地方誌，竟都查無此飯，「滷肉飯」這三個字在戰前就像幽靈一樣，找不到任何從異鄉飄洋過海來臺的蹤跡。查無戶口，卻能成為國民美食，曹老師推測滷肉飯起源於戰後臺灣，彼時經濟起飛，勞動人口增加，米飯淋上豬油及料理用剩下的邊角碎肉，滿滿的澱粉與油脂，供應了勞工工作所需的能量，這樣便宜又方便的庶民美食遂逐漸在各地鋪展開來。特別的是，「滷肉飯」一詞在南臺灣與北臺灣有著不盡相同的面貌：在北部，白飯淋上肥瘦均勻的碎肉稱之為滷肉飯；南部普遍指的是白飯放上大塊爌肉（在北部稱為爌肉飯），取用豬背皮脂、瘦肉下去滷的則稱為「肉燥飯」。一碗簡單的滷肉飯，吃著吃著，竟如武林般地分裂出多個門派——有的崇尚鹹香油潤，入口即化；有的則主打甘甜醬香，皮脂 Q 彈⋯⋯。在滷肉爭霸展開之前，「白飯」的選擇成為一切勝負的根基。",
	},
];

const Comments = [
	{
		id: "1",
		author: "Wei C",
		date: "2026/07/08",
		content: "我愛黑金滷肉飯！",
	},
	{
		id: "2",
		author: "Wei C",
		date: "2026/07/08",
		content: "我愛黑金滷肉飯！",
	},
];

const Replies = [
	{
		id: "1",
		author: "Wei C",
		date: "2026/07/08",
		content: "謝謝你喜歡！",
	},
	{
		id: "2",
		author: "Wei C",
		date: "2026/07/08",
		content: "謝謝你喜歡！",
	},
];

interface ArticleDetailPageProps {
	params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
	const { id } = React.use(params);
	const article = Articles.find((item) => item.id === id);
	const comment = Comments.find((item) => item.id === id);
	const reply = Replies.find((item) => item.id === id);
	return (
		<div className="max-w-7xl mx-auto w-full py-6 space-y-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-white border border-black">
				<div className="flex items-center gap-2">
					<Link href="/article">
						<ChevronLeft
							size={30}
							className="bg-slate-100 h-10 border border-black p-1"
						/>
					</Link>
				</div>
				<div className="flex items-center gap-2 w-full md:w-auto justify-end">
					2026 夏季刊//台北美食地圖
				</div>
			</div>

			{!article ? (
				<p>找不到該文章！</p>
			) : (
				<article>
					<div className=" bg-white p-6 border border-black">
						<div className="flex justify-between items-center">
							<h1 className="text-3xl mb-3 font-bold">{article.title}</h1>
						</div>
						<div className="justify-start">
							<hr className="border-black border" />
							<ul className="flex gap-x-4 my-2">
								<li className="flex items-center gap-x-1.5">
									<div className="w-1.5 h-1.5 rounded-full bg-black" />
									分類：{article.category}
								</li>
								<li className="flex items-center gap-x-1.5">
									<div className="w-1.5 h-1.5 rounded-full bg-black" />
									作者：{article.author}
								</li>
								<li className="flex items-center gap-x-1.5">
									<div className="w-1.5 h-1.5 rounded-full bg-black" />
									日期：{article.date}
								</li>
							</ul>
							<hr className="border-black border" />
						</div>
						<div className="w-200 h-200 border text-center border-black m-6 shadow-[3px_3px_0px_1px_rgba(0,0,0,1)] ">
							<Image src="/image.png" alt="滷肉飯" width={2000} height={2000} />
						</div>
						<div className="first-letter:text-5xl first-letter:font-bold first-letter:text-red-500 first-letter:mr-2">
							<p>{article.content}</p>
						</div>
						<div className="p-4 mt-6 flex items-center justify-between h-15 bg-article-gray border-black border shadow-[3px_3px_0px_1px_rgba(0,0,0,1)] relative">
							<span>覺得這篇文章有幫助嗎？\收藏或分享/</span>
							<div className=" flex gap-2">
								<button className="w-9 h-9 flex items-center justify-center gap-2 border-black border-2 bg-white shadow-[3px_3px_0px_1px_rgba(0,0,0,1)]">
									<Share2 size={18} />
								</button>
								<button className="w-9 h-9 flex items-center justify-center gap-2 border-black border-2 bg-white shadow-[3px_3px_0px_1px_rgba(0,0,0,1)]">
									<Bookmark size={18} />
								</button>
							</div>
						</div>
						<div>
							<hr className="border-black border mt-12 border-dashed" />
						</div>

						<div>
							<h2 className="text-2xl mt-12 font-semibold ">
								留言區（留言總數）
							</h2>
							<div className="h-auto p-4 border-black border-2 mt-2 shadow-[3px_3px_0px_1px_rgba(0,0,0,1)] ">
								<div className="flex gap-4">
									<div className="shrink-0">
										<Image
											src="/image.png"
											alt="profile"
											height={50}
											width={50}
											className="rounded-full"
										/>
									</div>
									<div className="flex-1">
										<div className="flex justify-between items-center">
											<div className="font-semibold">{comment?.author}</div>
											<div className="text-sm text-gray-500">
												{comment?.date}
											</div>
										</div>
										<div className="mt-3">{comment?.content}</div>

										<button className="flex item-center gap-2 mt-3 text-sm">
											<Reply size={16} />
											<span>回覆</span>
										</button>
									</div>
								</div>
								<div className="flex gap-4 mt-6 ml-14 border-l-2 border-l-gray-300 pl-4">
									<div className="shrink-0">
										<Image
											src="/image.png"
											alt="profile"
											width={40}
											height={40}
											className="rounded-full"
										/>
									</div>
									<div className="flex-1">
										<div className="flex gap-2 items-center">
											<div className="font-semibold">{reply?.author}</div>
											<div className="text-sm text-gray-500">{reply?.date}</div>
										</div>
										<div className="mt-2">{reply?.content}</div>
									</div>
								</div>
							</div>
							{/* 留言編輯區 */}
							<div className="mt-4">
								<textarea className="h-auto w-full p-4 border-black border-2 mt-2 shadow-[3px_3px_0px_1px_rgba(0,0,0,1)] "></textarea>
								<button className="bg-black text-white p-2 mt-4">留言</button>
							</div>
						</div>
					</div>
				</article>
			)}
		</div>
	);
}
