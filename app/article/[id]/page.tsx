"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Share2, Bookmark } from "lucide-react";

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
			"這是文章 2 的詳細完整內文... 想要做部落格或新聞網站嗎？動態路由是必學的技巧。本文教你如何在 article 頁面透過 map 渲染動態網址，並在 [id]/page 內正確撈取對應的資料帶入。",
	},
];

interface ArticleDetailPageProps {
	params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
	const { id } = React.use(params);
	const article = Articles.find((item) => item.id === id);
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
							<h1 className="text-3xl bold mb-3">{article.title}</h1>
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
						<div className="w-200 h-200 border text-center border-black m-6">
							放照片
						</div>
						<div className="first-letter:text-5xl first-letter:font-bold first-letter:text-red-500 first-letter:mr-2">
							<p>{article.content}</p>
						</div>
						<div className="py-4 px-2 my-4 h-15 border-black border-2 relative">
							<span>覺得這篇文章有幫助嗎？</span>
							<span>\收藏或分享/</span>
							<div className="absolute bottom-2.5 right-2.5">
								<button className="p-1 mr-2 border-black border-2">
									<Share2 />
								</button>
								<button className="p-1 ml-2 border-black border-2">
									<Bookmark />
								</button>
							</div>
						</div>
						<div>
							<div>留言區</div>
						</div>
					</div>
				</article>
			)}
		</div>
	);
}
