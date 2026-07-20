"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Share2, Reply } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useUser } from "@/app/context/user";

interface ArticlePage {
	id: string;
	title: string;
	content: string;
	date: string;
	author: string;
	category: string;
	isSaved: boolean;
}

interface ArticleDetailPageProps {
	params: Promise<{ id: string }>;
}

interface Comment {
	author: string;
	content: string;
	created_at: string;
}

export default function ArticlePages({ params }: ArticleDetailPageProps) {
	const { id } = React.use(params);
	const { user, loading: userLoading } = useUser();
	const [page, setPage] = React.useState<ArticlePage | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [isSaved, setIsSaved] = React.useState(false);
	const [savingArticle, setSavingArticle] = React.useState(false);
	const [comments, setComments] = React.useState<Comment[]>([]);

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
				console.error("Error fetching article:", error);
			} finally {
				setLoading(false);
			}
		};

		const checkIfSaved = async () => {
			if (!user?.id) return;

			try {
				// 用列表 API 檢查當前文章是否已保存
				const response = await fetch(
					`/api/article/articles?user_id=${user.id}`,
				);
				if (response.ok) {
					const data = await response.json();
					const article = data.article.find((a: ArticlePage) => a.id === id);
					if (article) {
						setIsSaved(article.isSaved || false);
					}
				}
			} catch (error) {
				console.error("Error checking saved status:", error);
			}
		};

		const fetchComments = async () => {
			try {
				const response = await fetch(`/api/article/comments?article_id=${id}`);
				if (response.ok) {
					const data = await response.json();
					setComments(data.comment || []);
				}
			} catch (error) {
				console.error("Error checking saved status:", error);
			}
		};

		fetchSingleArticle();
		checkIfSaved();
		fetchComments();
	}, [id, user?.id]);

	// 儲存文章
	const handleSaveArticle = async () => {
		if (!user?.id) {
			alert("請先登入才能儲存文章");
			return;
		}

		if (!id) return;

		setSavingArticle(true);
		try {
			const response = await fetch("/api/article/saved-articles", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					user_id: String(user.id),
					saved_article_id: String(id),
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setIsSaved(data.isSaved);
				alert(data.message);
			} else {
				alert(`操作失敗：${data.message || "未知錯誤"}`);
			}
		} catch (error) {
			console.error("Error saving article:", error);
			alert("伺服器連線失敗");
		} finally {
			setSavingArticle(false);
		}
	};

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
						<Link href="/article/manage">
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
								<button className="w-9 h-9 flex items-center justify-center gap-2 border-black border-2 bg-white shadow-[3px_3px_0px_1px_rgba(0,0,0,1)] hover:opacity-75 transition-opacity">
									<Share2 size={18} />
								</button>
								<button
									onClick={handleSaveArticle}
									disabled={savingArticle || userLoading}
									className="w-9 h-9 flex items-center justify-center gap-2 border-black border-2 bg-white shadow-[3px_3px_0px_1px_rgba(0,0,0,1)] hover:opacity-75 transition-opacity disabled:opacity-50"
									title={user?.id ? "點擊儲存文章" : "請先登入"}
								>
									{isSaved ? (
										<FontAwesomeIcon icon={faBookmark} />
									) : (
										<FontAwesomeIcon icon={farBookmark} />
									)}
								</button>
							</div>
						</div>
						<div>
							<hr className="border-black border mt-12 border-dashed" />
						</div>
						<div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full text-left">
							<div className="lg:col-span-2 w-full">
								<h2 className="text-2xl font-semibold">
									留言區（{comments.length}）
								</h2>
								{comments.length === 0 ? (
									<div className="p-6 text-center text-gray-500 border-black border-2 mt-2 bg-slate-50">
										目前還沒有留言，快來當第一個留言的人吧！
									</div>
								) : (
									<div className="flex flex-col gap-4 mt-2">
										{comments.map((comment, index) => (
											<div
												key={index}
												className="h-auto p-4 border-black border-2 bg-white shadow-[3px_3px_0px_1px_rgba(0,0,0,1)]"
											>
												<div className="flex gap-4">
													<div className="shrink-0">
														<Image
															src="/article/braised-pork.jpg"
															alt="profile"
															className="rounded-full object-cover border border-black"
															width={32}
															height={32}
														/>
													</div>
													<div className="flex-1">
														<div className="flex justify-between items-center">
															<div className="font-semibold">
																{comment.author}
															</div>
															<div className="text-sm text-gray-500">
																{comment.created_at}
															</div>
														</div>
														<div className="mt-2 text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
															{comment.content}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
								{/* 留言編輯區 */}
								<div className="mt-6 p-4 bg-slate-50 border-2 border-black shadow-[3px_3px_0px_1px_rgba(0,0,0,1)]">
									<span className="text-sm font-bold">發表留言</span>
									<textarea
										rows={3}
										placeholder={
											user?.id ? "想說點什麼嗎..." : "請先登入以發表留言"
										}
										disabled={!user?.id}
										className="w-full p-3 border-black border-2 mt-2 bg-white focus:outline-none text-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
									></textarea>
									{/* 💡 按鈕靠右，增加畫面層級感 */}
									<div className="flex justify-end mt-2">
										<button
											disabled={!user?.id}
											className="bg-black text-white px-6 py-1.5 text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
										>
											送出留言
										</button>
									</div>
								</div>
							</div>
							{/* 推薦文章 */}
							<div className="w-full h-full lg:top-4 p-4 bg-slate-100/70 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								{/* 使用 sticky 讓網頁往下滑時側邊欄跟著滾動 */}
								<h2 className="text-xl font-bold mb-4 tracking-tight">
									推薦閱讀
								</h2>
								<div className="flex flex-col gap-3">
									{/* 💡 模擬從 API 撈進來的動態資料陣列，未來可以直接替換成你的 State */}
									{[
										{
											id: "example-1",
											title: "師大夜市必吃！流沙西多士與極厚菠蘿油",
											author: "Wei C",
										},
										{
											id: "example-2",
											title: "民生社區不限時老宅咖啡廳，昭和硬布丁必點",
											author: "Anon",
										},
										{
											id: "example-3",
											title: "萬華三代老店！傳承甲子的秘製紅燒肉",
											author: "美食探員",
										},
									].map((article) => (
										<Link
											key={article.id}
											href={`/article/page?id=${article.id}`}
											className="block group"
										>
											{/* 卡片保持乾淨的白底，與外層的淺灰底形成漂亮的圖層對比 */}
											<div className="p-3.5 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-px group-hover:translate-y-px group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
												<h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:underline">
													{article.title}
												</h3>
												<p className="text-xs text-gray-500 mt-1.5 font-medium">
													作者：{article.author}
												</p>
											</div>
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</article>
			</div>
		</>
	);
}
