"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, SquarePen, House } from "lucide-react";
import Pagination from "@/components/articlePagination";
import { Button } from "@/components/ui/button";
import SearchBar from "../_components/search_bar";
import Link from "next/link";
import {
	Menubar,
	MenubarContent,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarTrigger,
} from "@/components/ui/menubar";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

interface SubCategory {
	id: number;
	sub_category_name: string;
}

interface Category {
	category_name: string;
	sub_category: SubCategory[];
}

interface CategoriesResponse {
	category: Category[];
}

interface UserArticle {
	id: string;
	title: string;
	content: string;
	date: string;
}

interface UserArticlesResponse {
	articles: UserArticle[];
}

export default function ArticleManagePage() {
	const router = useRouter();
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [userArticles, setUserArticles] = React.useState<UserArticle[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [selectedSubCategory, setSelectedSubCategory] =
		React.useState<string>("");
	const [savedCounts, setSavedCounts] = React.useState<{
		[key: string]: number;
	}>({});
	const [currentPage, setCurrentPage] = React.useState(1);
	const itemsPerPage = 10;
	const updatePageInUrl = (page: number) => {
		const params = new URLSearchParams(window.location.search);
		params.set("page", String(page));
		window.history.replaceState(
			null,
			"",
			`/article/manage?${params.toString()}`,
		);
	};

	const fetchUserArticles = async (
		subCategoryId?: number,
		keyword?: string,
	) => {
		const params = new URLSearchParams();
		// params.append("user_id", "1");
		const token = Cookies.get("token");
		if (subCategoryId) {
			params.append("sub_cat_id", String(subCategoryId));
		}
		if (keyword?.trim()) {
			params.append("keyword", keyword);
		}
		const res = await fetch(`/api/article/user-articles?${params.toString()}`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) throw new Error("Fetch failed");
		const data: UserArticlesResponse = await res.json();
		setUserArticles(data.articles);
		return data.articles;
	};
	const totalPages = Math.ceil(userArticles.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedArticles = userArticles.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	//savedCount
	React.useEffect(() => {
		userArticles.forEach((art) => {
			fetch(`/api/article/saved-count?article_id=${art.id}`)
				.then((r) => r.json())
				.then((data) =>
					setSavedCounts((prev) => ({ ...prev, [art.id]: data.saved.count })),
				);
		});
	}, [userArticles]);

	// 刪除文章
	const handleDeleteArticle = async (articleId: string) => {
		const isConfirm = window.confirm("確定要刪除嗎？");
		if (!isConfirm) return;
		try {
			const token = Cookies.get("token");
			const response = await fetch(`/api/article/articles/${articleId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(response);
			if (!response.ok) {
				throw new Error("後端刪除失敗");
			}
			const data = await response.json();
			if (data.success) {
				alert("文章已成功刪除！");
				setUserArticles((prevArticles) =>
					prevArticles.filter((art) => art.id !== articleId),
				);
			}
		} catch (error) {
			console.error("刪除請求出錯:", error);
			alert("刪除失敗，請檢查網路或稍後再試。");
		}
	};

	React.useEffect(() => {
		const initAllData = async () => {
			try {
				setLoading(true);

				const catResponse = await fetch("/api/article/categories");
				if (!catResponse.ok) throw new Error("Fetch failed");

				const catData: CategoriesResponse = await catResponse.json();
				setCategories(catData.category);
				const initialArticles = await fetchUserArticles();
				const page = Number(
					new URLSearchParams(window.location.search).get("page"),
				);
				if (Number.isInteger(page) && page > 0) {
					const maxPage = Math.max(
						1,
						Math.ceil(initialArticles.length / itemsPerPage),
					);
					setCurrentPage(Math.min(page, maxPage));
				}
			} catch (error) {
				console.error("Error fetching categories:", error);
			} finally {
				setLoading(false);
			}
		};
		initAllData();
	}, []);

	if (loading) {
		return <div className="p-6 text-center">資料載入中，請稍候...</div>;
	}

	return (
		<>
			<div className="min-h-screen">
				<div className="max-w-7xl mx-auto w-full py-4">
					<div className="relative border-2 border-black">
						<div
							className="absolute inset-0 opacity-[0.5] pointer-events-none"
							style={{
								backgroundImage: "url('/article/noise.png')",
								backgroundRepeat: "repeat",
								backgroundSize: "90px",
							}}
						/>
						<div className="relative z-10">
							<div className="flex items-center w-full justify-between lg:flex-row md:flex-row md:items-center gap-4 p-3 bg-black">
								<div className="flex items-center">
									<Link
										href="/article"
										className="flex h-10 w-10 items-center justify-center bg-black text-white hover:bg-gray-800"
									>
										<House size={22} />
									</Link>
									<Menubar className="h-10 bg-black text-slate-100 border-0 justify-start shrink-0">
										<MenubarMenu>
											<MenubarTrigger
												onClick={async () => {
													setSelectedSubCategory("");
													setCurrentPage(1);
													updatePageInUrl(1);
													await fetchUserArticles();
												}}
											>
												全部
											</MenubarTrigger>
										</MenubarMenu>
										<div className="mx-1 h-5 w-px bg-gray-500 self-center"></div>

										{loading ? (
											<div className="px-3 text-sm text-gray-400 self-center">
												載入中...
											</div>
										) : (
											categories.map((cat, index) => (
												<React.Fragment key={cat.category_name}>
													<MenubarMenu>
														<MenubarTrigger>{cat.category_name}</MenubarTrigger>
														<MenubarContent>
															<MenubarRadioGroup
																value={selectedSubCategory}
																onValueChange={async (value) => {
																	setSelectedSubCategory(value);
																	setCurrentPage(1);
																	updatePageInUrl(1);
																	fetchUserArticles(Number(value));
																}}
															>
																{cat.sub_category.map((sub) => (
																	<MenubarRadioItem
																		key={sub.id}
																		value={String(sub.id)}
																	>
																		{sub.sub_category_name}
																	</MenubarRadioItem>
																))}
															</MenubarRadioGroup>
														</MenubarContent>
													</MenubarMenu>
													{index < categories.length - 1 && (
														<div className="mx-1 h-5 w-px bg-gray-500 self-center" />
													)}
												</React.Fragment>
											))
										)}
									</Menubar>
								</div>
								<div className="flex items-center w-full lg:w-auto max-w-md gap-2">
									<div className="border-white border">
										<SearchBar
											onSearch={(keyword) => {
												fetchUserArticles(
													selectedSubCategory
														? Number(selectedSubCategory)
														: undefined,
													keyword,
												);
												setCurrentPage(1);
												updatePageInUrl(1);
											}}
										/>
									</div>
									<Link
										href="/article/edit"
										className="flex w-10 h-10 bg-black items-center justify-center border-white border"
									>
										<SquarePen color="#FFFFFF" />
									</Link>
								</div>
							</div>
							{/* breadcrumb */}
							<div className="p-4">
								<div className="flex justify-between items-center">
									<Breadcrumb>
										<BreadcrumbList>
											<BreadcrumbItem>
												<BreadcrumbLink render={<Link href="/">Home</Link>} />
											</BreadcrumbItem>
											<BreadcrumbSeparator />
											<BreadcrumbItem>
												<BreadcrumbPage>My Article</BreadcrumbPage>
											</BreadcrumbItem>
										</BreadcrumbList>
									</Breadcrumb>
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										setCurrentPage={setCurrentPage}
										onPageChange={updatePageInUrl}
									/>
								</div>
								<div className="mt-4 border-b border-black" />
							</div>

							{/* 文章列表 */}
							<div className="p-4 md:p-6">
								<div className="flex flex-col">
									{paginatedArticles.length === 0 ? (
										<p className="text-black text-center py-6">
											目前沒有任何文章。
										</p>
									) : (
										paginatedArticles.map((art) => (
											<div
												key={art.id}
												className="min-h-32 border-b border-black flex flex-col justify-between gap-2 py-3"
											>
												{/* 1. 調整標題區塊為垂直居中齊平 */}
												<div className="flex justify-between items-center gap-4">
													<h3 className="font-bold text-lg text-slate-900 flex-1 truncate">
														{art.title}
													</h3>
													{/* 將日期與按鈕包在一起，推到最右側 */}
													<div className="flex items-center gap-4 shrink-0">
														<p className="whitespace-nowrap text-xs text-gray-500">
															{art.date}
														</p>
														<DropdownMenu>
															<DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none">
																<FontAwesomeIcon icon={faEllipsis} />
															</DropdownMenuTrigger>
															{/* 3. 限制選單寬度 min-w-[5rem] 並讓文字居中 */}
															<DropdownMenuContent
																align="end"
																className="min-w-20 text-center"
															>
																<DropdownMenuItem
																	className="justify-center cursor-pointer"
																	onClick={() =>
																		router.push(`/article/edit?id=${art.id}`)
																	}
																>
																	編輯
																</DropdownMenuItem>
																<DropdownMenuItem
																	className="justify-center cursor-pointer text-red-600 focus:text-red-600"
																	onClick={() => handleDeleteArticle(art.id)}
																>
																	刪除
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</div>
												<div
													className="article-content overflow-hidden wrap-break-word text-base line-clamp-3 text-gray-600"
													dangerouslySetInnerHTML={{ __html: art.content }}
												/>
												<div className="flex justify-between items-end mt-1.5">
													<div className="flex items-center text-gray-500">
														<Eye size={16} />
														<div className="ml-1 text-sm">
															收藏次數({savedCounts[art.id] || 0})
														</div>
													</div>
													<Link href={`/article/${art.id}`}>
														<Button
															variant="outline"
															size="sm"
															className="h-7 border-black bg-red-600 text-slate-100 px-3 text-xs hover:bg-red-700 hover:text-white"
														>
															閱讀全文
														</Button>
													</Link>
												</div>
											</div>
										))
									)}
								</div>
							</div>
							<div className="m-4 flex justify-end">
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									setCurrentPage={setCurrentPage}
									onPageChange={updatePageInUrl}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
