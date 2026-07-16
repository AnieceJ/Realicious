"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Share2, Bookmark, Reply } from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ArticlePage {
	id: string;
	title: string;
	content: string;
	date: string;
	author: string;
	category: string;
}

interface ArticleDetailPageProps {
	params: Promise<{ id: string }>;
}

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

export default function ArticlePages({ params }: ArticleDetailPageProps) {
	const { id } = React.use(params);
	const [page, setPage] = React.useState<ArticlePage | null>(null);
	const [loading, setLoading] = React.useState(true);
	React.useEffect(() => {
		const fetchSingleArticle = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/article/page?id=${id}`);
				if (!response.ok) throw new Error("fetch failed");
				const data = await response.json();
				if (data.page && data.page.length > 0) {
					setPage(data.page[0]);
				} else {
					setPage(null);
				}
			} catch (error) {
				console.error("Error fetching categories:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchSingleArticle();
	}, [id]);

	const comment = Comments[0];
	const reply = Replies[0];

	if (loading) {
		return <div className="p-6 text-center">載入中</div>;
	}
	if (!page) {
		return <div className="p-6 text-center">找不到文章！</div>;
	}

	return (
		<>
			<div className="max-w-7xl mx-auto w-full p-3">
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
				<div className="flex p-4">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink render={<Link href="/">Home</Link>} />
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink render={<Link href="/article">Article</Link>} />
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<article>
					<div className=" bg-white p-6 border border-black">
						<div className="flex justify-between items-center">
							<h1 className="text-3xl mb-3 font-bold">{page.title}</h1>
						</div>
						<div className="justify-start">
							<hr className="border-black border" />
							<ul className="flex gap-x-4 my-2">
								<li className="flex items-center gap-x-1.5">
									<div className="w-1.5 h-1.5 rounded-full bg-black" />
									分類：{page.category}
								</li>
								<li className="flex items-center gap-x-1.5">
									<div className="w-1.5 h-1.5 rounded-full bg-black" />
									作者：{page.author}
								</li>
								<li className="flex items-center gap-x-1.5">
									<div className="w-1.5 h-1.5 rounded-full bg-black" />
									日期：{page.date}
								</li>
							</ul>
							<hr className="border-black border" />
						</div>
						<div
							className="article-content first-letter:mr-2 first-letter:text-5xl first-letter:font-bold first-letter:text-red-500"
							dangerouslySetInnerHTML={{ __html: page.content }}
						/>
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
											src="/article/braised-pork.jpg"
											alt="profile"
											className="rounded-full object-cover"
											width={32}
											height={32}
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
											src="/article/braised-pork.jpg"
											alt="profile"
											className="rounded-full object-cover"
											width={30}
											height={30}
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
			</div>
		</>
	);
}
