"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Share2 } from "lucide-react";
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
import { useToast } from "../_components/article_toast";
import Cookies from "js-cookie";

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
	const router = useRouter();
	const [page, setPage] = React.useState<ArticlePage | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [isSaved, setIsSaved] = React.useState(false);
	const [savingArticle, setSavingArticle] = React.useState(false);
	const [comments, setComments] = React.useState<Comment[]>([]);
	const hasToken = Boolean(Cookies.get("token"));
	const { toastComponent, showToast } = useToast();
	// 留言送出
	const [inputText, setInputText] = React.useState("");
	const [submitting, setSubmitting] = React.useState(false);

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
			const token = Cookies.get("token");
			if (!token) return;

			try {
				const response = await fetch("/api/article/articles", {
					headers: { Authorization: `Bearer ${token}` },
				});
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
	}, [id, hasToken]);

	const handleShare = async () => {
		if (!page) return;

		const shareData = {
			title: page.title,
			text: `要不要一起吃：${page.title}`,
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);

				// 使用者完成分享流程（分享或複製連結都會到這裡）
				showToast("分享完成");
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(shareData.url);
				showToast("連結已複製");
			} else {
				showToast("此瀏覽器不支援分享功能");
			}
		} catch (error) {
			// 使用者按取消，不提示錯誤
			if (error instanceof DOMException && error.name === "AbortError") {
				return;
			}

			console.error("Error sharing article:", error);
			showToast("分享失敗，請稍後再試");
		}
	};

	// 儲存文章
	const handleSaveArticle = async () => {
		const token = Cookies.get("token");
		if (!token) {
			alert("請先登入才能儲存文章");
			return;
		}

		if (!id) return;

		setSavingArticle(true);
		try {
			const response = await fetch("/api/article/saved-articles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
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

	// 新增留言
	const handleSaveComment = async () => {
		if (!inputText.trim()) return;
		const token = Cookies.get("token");
		if (!token) {
			alert("登入才能留言哦！");
			return;
		}
		setSubmitting(true);
		try {
			const response = await fetch("/api/article/comments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					article_id: id,
					content: inputText.trim(),
				}),
			});
			const data = await response.json();
			if (response.ok) {
				setComments((prev) => [...prev, data.comment]);
				setInputText("");
			} else {
				alert(`操作失敗：${data.error || "未知錯誤"}`);
			}
		} catch (error) {
			console.error("Error submitting comment:", error);
			alert("伺服器連線失敗");
		} finally {
			setSubmitting(false);
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
			{toastComponent}
			<div className="max-w-7xl mx-auto w-full p-3">
				<div className="flex flex-row items-center justify-between gap-4 p-3 bg-black border border-black text-white">
					<div className="flex items-center gap-2 shrink-0">
						<button
							type="button"
							onClick={() => router.back()}
							aria-label="返回上一頁"
						>
							<ChevronLeft size={30} className="h-10 p-1 hover:bg-gray-400" />
						</button>
					</div>
					<div className="flex items-center justify-end min-w-0 text-right">
						<span className="truncate">2026 夏季刊//台北美食地圖</span>
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
					<div className="relative bg-white p-6 border border-black">
						<div className="flex justify-between items-center">
							<div
								className="absolute inset-0 opacity-[0.5] pointer-events-none"
								style={{
									backgroundImage: "url('/article/noise.png')",
									backgroundRepeat: "repeat",
									backgroundSize: "90px",
								}}
							/>
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
							<span>喜歡這篇文章嗎？快收藏或分享！</span>
							<div className=" flex gap-2">
								<button
									onClick={handleShare}
									className="w-9 h-9 flex items-center justify-center gap-2 border-black border-2 bg-white shadow-[3px_3px_0px_1px_rgba(0,0,0,1)] hover:opacity-75 transition-opacity"
									title="複製文章連結"
									aria-label="複製文章連結"
								>
									<Share2 size={18} />
								</button>
								<button
									onClick={handleSaveArticle}
									disabled={savingArticle}
									className="w-9 h-9 flex items-center justify-center gap-2 border-black border-2 bg-white shadow-[3px_3px_0px_1px_rgba(0,0,0,1)] hover:opacity-75 transition-opacity disabled:opacity-50"
									title={hasToken ? "點擊儲存文章" : "請先登入"}
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
															src="/article/chicken_happy.png"
															alt="profile"
															className="rounded-full object-cover border border-black"
															width={60}
															height={60}
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
										value={inputText}
										onChange={(e) => setInputText(e.target.value)}
										placeholder={
											hasToken ? "想說什麼嗎？" : "請先登入以發表留言"
										}
										disabled={!hasToken}
										className="w-full p-3 border-black border-2 mt-2 bg-white focus:outline-none text-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
									></textarea>
									<div className="flex justify-end mt-2">
										<button
											onClick={handleSaveComment}
											disabled={!hasToken || submitting || !inputText.trim()}
											className="bg-black text-white px-6 py-1.5 text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
										>
											{submitting ? "傳送中..." : "送出留言"}
										</button>
									</div>
								</div>
							</div>
							{/* 推薦文章 */}
							{/* <div className="w-full h-full lg:top-4 p-4 bg-slate-100/70 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								<h2 className="text-xl font-bold mb-4 tracking-tight">
									推薦閱讀
								</h2>
								<div className="flex flex-col gap-3">
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
							</div> */}
						</div>
					</div>
				</article>
			</div>
		</>
	);
}
