"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
	Menubar,
	MenubarContent,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarTrigger,
} from "@/components/ui/menubar";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

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

interface SubCategory {
	id: string;
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

	const fetchUserArticles = async (subCategoryId?: string) => {
		const url = subCategoryId
			? `/api/article/user-articles?user_id=1&sub_cat_id=${subCategoryId}`
			: `/api/article/user-articles?user_id=1`;

		const res = await fetch(url);
		if (!res.ok) throw new Error("Fetch failed");
		const data: UserArticlesResponse = await res.json();
		setUserArticles(data.articles);
	};

	// 刪除文章
	const handleDeleteArticle = async (articleId: string) => {
		const isConfirm = window.confirm("確定要刪除嗎？");
		if (!isConfirm) return;
		try {
			const response = await fetch(`/api/article/articles/${articleId}`, {
				method: "DELETE",
			});
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
				await fetchUserArticles();
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
			<div className="max-w-7xl mx-auto w-full pt-3">
				<div className="flex items-center md:flex-row md:items-center justify-between gap-4 p-3 bg-white border border-black">
					<div className="flex gap-4">
						<Link href="/article">
							<ChevronLeft
								size={30}
								className="bg-slate-100 h-10 border border-black"
							/>
						</Link>
						<Menubar className="h-10 bg-black text-slate-100 border border-slate-100 justify-start shrink-0">
							<MenubarMenu>
								<MenubarTrigger
									onClick={async () => {
										setSelectedSubCategory("");
										await fetchUserArticles();
									}}
								>
									全部
								</MenubarTrigger>
							</MenubarMenu>
							{loading ? (
								<div className="px-3 text-sm text-gray-400 self-center">
									載入中...
								</div>
							) : (
								categories.map((cat) => (
									<MenubarMenu key={cat.category_name}>
										<MenubarTrigger>{cat.category_name}</MenubarTrigger>
										<MenubarContent>
											<MenubarRadioGroup
												value={selectedSubCategory}
												onValueChange={async (value) => {
													setSelectedSubCategory(value);
													await fetchUserArticles(value);
												}}
											>
												{cat.sub_category.map((sub) => (
													<MenubarRadioItem key={sub.id} value={sub.id}>
														{sub.sub_category_name}
													</MenubarRadioItem>
												))}
											</MenubarRadioGroup>
										</MenubarContent>
									</MenubarMenu>
								))
							)}
						</Menubar>
					</div>
					<div className="flex items-center w-full max-w-md gap-2">
						<Field orientation="horizontal" className="flex-1 gap-0">
							<Input
								type="search"
								placeholder="Search..."
								className="border-b-gray-500 bg-gray-200"
							/>
							<Button className="border-0">Search</Button>
						</Field>
						<Link
							href="/article/edit"
							className="flex w-10 h-10 bg-black items-center justify-center"
						>
							<SquarePen color="#FFFFFF" />
						</Link>
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
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>My Article</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				{/* 文章列表 */}
				<div className=" bg-white p-6 border border-black">
					<div className="flex flex-col">
						{userArticles.length === 0 ? (
							<p className="text-black text-center py-6">目前沒有任何文章。</p>
						) : (
							userArticles.map((art) => (
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
											<div className="ml-1 text-sm">收藏次數</div>
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
			</div>
			{/* 分頁...保持不變 */}
			<div className="m-4 flex justify-center">
				<nav aria-label="Pagination" className="inline-flex shadow-xs">
					<a
						href="#"
						className="relative inline-flex items-center px-2 py-2 bg-page-red text-white border border-black hover:bg-red-400 focus:z-20 focus:outline-offset-0"
					>
						<span className="sr-only">Previous</span>
						<ChevronLeftIcon aria-hidden="true" className="size-5" />
					</a>
					<a
						href="#"
						aria-current="page"
						className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						1
					</a>
					<a
						href="#"
						className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						2
					</a>
					<a
						href="#"
						className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
					>
						3
					</a>
					<span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 focus:outline-offset-0">
						...
					</span>
					<a
						href="#"
						className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
					>
						8
					</a>
					<a
						href="#"
						className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						9
					</a>
					<a
						href="#"
						className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						10
					</a>
					<a
						href="#"
						className="relative inline-flex items-center px-2 py-2 bg-page-red text-white border border-black hover:bg-red-400 focus:z-20 focus:outline-offset-0"
					>
						<span className="sr-only">Next</span>
						<ChevronRightIcon aria-hidden="true" className="size-5" />
					</a>
				</nav>
			</div>
		</>
	);
}
