"use client";
import * as React from "react";
import { ChevronLeft, Eye } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
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

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SubCategory {
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

export default function ArticlePage() {
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [articles, setArticles] = React.useState<Article[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [selectedSubCategory, setSelectedSubCategory] =
		React.useState<string>("");

	React.useEffect(() => {
		const initAllData = async () => {
			try {
				setLoading(true);

				const catResponse = await fetch("/api/article/categories");
				if (!catResponse.ok) throw new Error("Fetch failed");
				const catData: CategoriesResponse = await catResponse.json();
				setCategories(catData.category);

				const artResponse = await fetch("/api/article/articles");
				if (!artResponse.ok) throw new Error("Fetch failed");
				const artData: ArticlesResponse = await artResponse.json();
				setArticles(artData.article);
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
			<div className="max-w-7xl mx-auto w-full">
				<div className="flex items-center w-full justify-between lg:flex-row md:flex-row md:items-center gap-4 p-3 bg-white border border-black">
					<div className="flex gap-4 items-center">
						<Link href="/">
							<ChevronLeft
								size={30}
								className="bg-slate-100 h-10 border border-black"
							/>
						</Link>
						<Menubar className="h-10 bg-black text-slate-100 border border-slate-100 justify-start shrink-0">
							<MenubarMenu>
								<MenubarTrigger>
									<Link href="/article">全部</Link>
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
												onValueChange={(value) => setSelectedSubCategory(value)}
											>
												{cat.sub_category.map((sub) => (
													<MenubarRadioItem
														key={sub.sub_category_name}
														value={sub.sub_category_name}
													>
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
					<Field orientation="horizontal" className="max-w-sm gap-0">
						<Input
							type="search"
							placeholder="Search..."
							className="border-b-gray-500 bg-gray-200"
						/>
						<Button className="border-0">Search</Button>
					</Field>
				</div>

				{/* breadcrumb */}
				<div className="flex p-4">
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
				</div>
				{/* breadcrumb */}

				{/* 文章列表 */}
				<div className="bg-white p-6 border border-black">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold">所有文章</h1>
					</div>
					<div className="flex flex-col">
						{articles.length === 0 ? (
							<p className="text-black text-center py-6">目前沒有任何文章。</p>
						) : (
							articles.map((art, idx) => (
								<div
									key={idx}
									className="min-h-32 border-b border-black flex flex-col justify-between gap-2 py-3"
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
										<p className=" text-m wrap-break-word line-clamp-4">
											{art.content}
										</p>
									</div>
									<div className="flex justify-between items-center mt-1.5">
										<div className="flex items-center">
											<Eye size={16} />
											<div className="ml-1 text-sm">瀏覽次數</div>
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
			</div>
			<div className="m-4 flex justify-center">
				<nav aria-label="Pagination" className="inline-flex shadow-xs">
					<a
						href="#"
						className="relative inline-flex items-center px-2 py-2 bg-red-700 text-white border border-black hover:bg-red-400 focus:z-20 focus:outline-offset-0"
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
						className="relative inline-flex items-center px-2 py-2 bg-red-700 text-white border border-black hover:bg-red-400 focus:z-20 focus:outline-offset-0"
					>
						<span className="sr-only">Next</span>
						<ChevronRightIcon aria-hidden="true" className="size-5" />
					</a>
				</nav>
			</div>
		</>
	);
}
