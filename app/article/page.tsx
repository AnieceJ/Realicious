"use client";
import * as React from "react";
import { Eye, House } from "lucide-react";
import Pagination from "@/components/articlePagination";
import { Button } from "@/components/ui/button";
import SearchBar from "./_components/search_bar";
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

interface Article {
	id: string;
	title: string;
	content: string;
	date: string;
}

interface ArticlesResponse {
	article: Article[];
}

const stripHtml = (html: string) => {
	if (typeof document === "undefined") {
		// server-side fallback: remove tags and decode basic entities
		return html
			.replace(/<[^>]+>/g, "")
			.replace(/&nbsp;/g, " ")
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'");
	}
	const div = document.createElement("div");
	div.innerHTML = html;
	return div.textContent || div.innerText || "";
};

export default function ArticlePage() {
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [articles, setArticles] = React.useState<Article[]>([]);
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
		window.history.replaceState(null, "", `/article?${params.toString()}`);
	};

	const fetchArticles = async (subCatId?: number, keyword?: string) => {
		const params = new URLSearchParams();

		//let url = "/api/article/articles";
		if (subCatId !== undefined) {
			params.append("sub_cat_id", String(subCatId));
		}
		if (keyword?.trim()) {
			params.append("keyword", keyword);
		}
		const query = params.toString();
		const artResponse = await fetch(
			query ? `/api/article/articles?${query}` : "/api/article/articles",
		);
		const artData: ArticlesResponse = await artResponse.json();
		setArticles(artData.article);
		return artData.article;
	};
	const totalPages = Math.ceil(articles.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedArticles = articles.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	React.useEffect(() => {
		const initAllData = async () => {
			try {
				setLoading(true);
				const catResponse = await fetch("/api/article/categories");
				if (!catResponse.ok) throw new Error("Fetch failed");
				const catData: CategoriesResponse = await catResponse.json();
				setCategories(catData.category);

				const initialArticles = await fetchArticles();
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

	//savedCount
	React.useEffect(() => {
		articles.forEach((art) => {
			fetch(`/api/article/saved-count?article_id=${art.id}`)
				.then((r) => r.json())
				.then((data) =>
					setSavedCounts((prev) => ({ ...prev, [art.id]: data.saved.count })),
				);
		});
	}, [articles]);

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
										href="/"
										className="flex h-10 w-10 items-center justify-center bg-black text-white hover:bg-gray-800"
									>
										<House size={22} />
									</Link>
									<Menubar className="h-10 bg-black text-slate-100 border-0 justify-start shrink-0">
										<MenubarMenu>
											<MenubarTrigger
												onClick={() => {
													setSelectedSubCategory("");
													setCurrentPage(1);
													updatePageInUrl(1);
													fetchArticles();
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
													<MenubarMenu key={cat.category_name}>
														<MenubarTrigger>{cat.category_name}</MenubarTrigger>
														<MenubarContent>
															<MenubarRadioGroup
																value={selectedSubCategory}
																onValueChange={(value) => {
																	setSelectedSubCategory(value);
																	setCurrentPage(1);
																	updatePageInUrl(1);
																	fetchArticles(Number(value));
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
														<div className="mx-1 h-5 w-px bg-gray-500 self-center"></div>
													)}
												</React.Fragment>
											))
										)}
									</Menubar>
								</div>
								<div className="flex items-center w-full lg:w-auto max-w-md gap-2 border-white border">
									<SearchBar
										onSearch={(keyword) => {
											fetchArticles(
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
												<BreadcrumbPage>Article</BreadcrumbPage>
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
								{/* breadcrumb */}
								<div className="mt-4 border-b border-black" />
							</div>

							{/* 文章列表 */}
							<div className="p-6">
								<div className="flex flex-col">
									{paginatedArticles.length === 0 ? (
										<p className="text-black text-center py-6">
											目前沒有任何文章。
										</p>
									) : (
										paginatedArticles.map((art, idx) => (
											<div
												key={idx}
												className="min-h-32 border-b border-black flex flex-col justify-between gap-2 py-3 first:-mt-3"
											>
												<div className="flex justify-between items-start">
													<h3 className="font-bold text-lg text-slate-900">
														{art.title}
													</h3>
													<p className="whitespace-nowrap pt-1 text-xs text-gray-700">
														{art.date}
													</p>
												</div>
												{/* 內文 */}
												<div>
													<p className="article-content overflow-hidden wrap-break-word text-base line-clamp-3 text-gray-600">
														{stripHtml(art.content)}
													</p>
												</div>
												<div className="flex justify-between items-center mt-1.5">
													<div className="flex items-center">
														<Eye size={16} />
														<div className="ml-1 text-sm">
															收藏次數({savedCounts[art.id] || 0})
														</div>
													</div>
													<Link href={`/article/${art.id}`}>
														<Button
															variant="outline"
															size="sm"
															className="h-7 border-black bg-red-600 text-slate-100 px-3 text-xs"
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
