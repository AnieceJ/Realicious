"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientSideCustomEditor from "@/components/client-side-custom-editor";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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

export default function ArticleEditPage() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [subCategoryId, setSubCategoryId] = useState("");
	const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
	const [categoryError, setCategoryError] = useState("");
	const [isPublishing, setIsPublishing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const categoryItems = categories.flatMap((category) =>
		category.sub_category.map((subCategory) => ({
			label: subCategory.sub_category_name,
			value: String(subCategory.id),
		})),
	);

	useEffect(() => {
		async function fetchCategories() {
			try {
				const response = await fetch("/api/article/categories");
				if (!response.ok) throw new Error("分類載入失敗");

				const data: CategoriesResponse = await response.json();
				setCategories(data.category);
			} catch (error) {
				setCategoryError(
					error instanceof Error ? error.message : "分類載入失敗，請稍後再試",
				);
			} finally {
				setIsCategoriesLoading(false);
			}
		}

		fetchCategories();
	}, []);

	async function publish() {
		if (!title.trim() || !content.trim()) {
			setErrorMessage("請填寫標題與文章內容");
			return;
		}
		if (title.trim().length > 20) {
			setErrorMessage("標題不可超過 20 個字");
			return;
		}
		if (!subCategoryId) {
			setErrorMessage("請選擇文章分類");
			return;
		}

		setIsPublishing(true);
		setErrorMessage("");

		try {
			const response = await fetch("/api/article/articles", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: title.trim(),
					content,
					userId: 1,
					subCategoryId: Number(subCategoryId),
					status: 1,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "發布失敗，請稍後再試");
			}

			const articleId = data.articleId ?? data.article?.id ?? data.id;
			router.push(articleId ? `/article/${articleId}` : "/article/manage");
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : "發布失敗，請稍後再試",
			);
		} finally {
			setIsPublishing(false);
		}
	}

	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
			<div className="overflow-hidden border-4 border-black bg-white shadow-[6px_6px_0px_-1px_#000]">
				<header className="border-b-4 border-black bg-black px-5 py-4 text-white sm:px-8">
					<p className="text-sm font-bold tracking-widest text-button-yellow">
						ARTICLE
					</p>
					<h1 className="mt-1 text-2xl font-black sm:text-3xl">撰寫文章</h1>
				</header>

				<div className="space-y-8 p-5 sm:p-8">
					<div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(13rem,1fr)] md:items-end">
						<section className="min-w-0">
							<label
								className="mb-2 flex items-center justify-between text-xl font-black"
								htmlFor="article-title"
							>
								<span>標題</span>
								<span className="text-sm font-medium text-zinc-500">
									{title.length}/20
								</span>
							</label>
							<input
								id="article-title"
								className="h-11 w-full border-2 border-black bg-white px-3 text-base outline-none transition placeholder:text-zinc-400 focus:bg-amber-50 focus:ring-2 focus:ring-black"
								value={title}
								onChange={(event) => setTitle(event.target.value.slice(0, 20))}
								maxLength={20}
								placeholder="請輸入文章標題"
							/>
						</section>
						<section>
							<label
								className="mb-2 block text-xl font-black"
								htmlFor="article-category"
							>
								文章分類
							</label>
						<Select
							items={categoryItems}
							value={subCategoryId || null}
							onValueChange={(value) =>
								setSubCategoryId(typeof value === "string" ? value : "")
							}
							disabled={isCategoriesLoading || Boolean(categoryError)}
						>
							<SelectTrigger id="article-category">
								<SelectValue
									placeholder={isCategoriesLoading ? "分類載入中..." : "請選擇分類"}
								/>
							</SelectTrigger>
							<SelectContent>
								{categories.map((category, index) => (
									<Fragment key={category.category_name}>
										{index > 0 && <SelectSeparator />}
										<SelectGroup>
											<SelectLabel>{category.category_name}</SelectLabel>
											{category.sub_category.map((subCategory) => (
												<SelectItem key={subCategory.id} value={String(subCategory.id)}>
													{subCategory.sub_category_name}
												</SelectItem>
											))}
										</SelectGroup>
									</Fragment>
								))}
							</SelectContent>
						</Select>
							{categoryError && (
								<p className="mt-2 text-sm font-bold text-red-700">
									{categoryError}
								</p>
							)}
						</section>
					</div>
					<section>
						<p className="mb-3 text-xl font-black">文章內容</p>
						<div className="overflow-hidden border-2 border-black bg-white">
							<div className="article-editor">
								<ClientSideCustomEditor onChange={setContent} />
							</div>
						</div>
					</section>

					<div className="flex flex-col-reverse gap-3 border-t-2 border-black pt-6 sm:flex-row sm:justify-end">
						<button
							type="button"
							onClick={() => router.back()}
							disabled={isPublishing}
							className="h-13 border-2 border-black bg-button-yellow px-8 text-xl font-bold shadow-[4px_4px_0px_-1px_#000] disabled:cursor-not-allowed disabled:opacity-50"
						>
							➤ 捨棄
						</button>
						<button
							type="button"
							onClick={publish}
							disabled={isPublishing}
							className="h-13 border-2 border-black bg-page-red px-8 text-xl font-bold text-white shadow-[4px_4px_0px_-1px_#000] disabled:cursor-not-allowed disabled:opacity-50"
						>
							➤ {isPublishing ? "發布中..." : "發布"}
						</button>
					</div>

					{errorMessage && (
						<p className="border-2 border-red-700 bg-red-50 px-4 py-3 font-bold text-red-700">
							{errorMessage}
						</p>
					)}
				</div>
			</div>
		</main>
	);
}
