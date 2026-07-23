"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientSideCustomEditor from "@/components/client-side-custom-editor";
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

export default function ArticleEditPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const articleId = searchParams.get("id");
	const isEditMode = Boolean(articleId);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [subCategoryId, setSubCategoryId] = useState("");

	const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
	const [isArticleLoading, setIsArticleLoading] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		async function initData() {
			try {
				setIsCategoriesLoading(true);
				// A. 先撈分類
				const catRes = await fetch("/api/article/categories");
				if (!catRes.ok) throw new Error("分類載入失敗");
				const catData: CategoriesResponse = await catRes.json();
				setCategories(catData.category);

				// B. 如果是編輯模式，接著撈取特定文章的舊資料
				if (isEditMode && articleId) {
					setIsArticleLoading(true);
					// 這裡使用你之前提過能帶 user_id 檢查或單純查 id 的 articles API
					const artRes = await fetch(`/api/article/articles?id=${articleId}`);
					if (!artRes.ok) throw new Error("舊文章資料載入失敗");

					const artData = await artRes.json();
					// 在陣列中尋找符合當前 id 的文章
					const currentArticle = artData.article?.find(
						(a: { id: string }) => a.id === articleId,
					);

					if (currentArticle) {
						// 🎯 關鍵：將舊資料塞入 state，表單就會自動帶入既有內容！
						setTitle(currentArticle.title || "");
						setContent(currentArticle.content || "");
						// 注意：如果後端分類回傳是 BigInt/Number，這裡要記得轉字串配合 select 元件
						if (currentArticle.subCategoryId) {
							setSubCategoryId(currentArticle.subCategoryId.toString());
						} else {
							setSubCategoryId("");
						}
					} else {
						throw new Error("找不到該文章資料");
					}
				}
			} catch (error) {
				setErrorMessage(
					error instanceof Error ? error.message : "資料載入失敗",
				);
			} finally {
				setIsCategoriesLoading(false);
				setIsArticleLoading(false);
			}
		}

		initData();
	}, [isEditMode, articleId]);

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
			const url = isEditMode
				? `/api/article/articles/${articleId}`
				: "/api/article/articles";

			const method = isEditMode ? "PUT" : "POST";
			const token = Cookies.get("token");
			const payload = {
				title: title.trim(),
				content,
				// userId: 1,
				subCategoryId: Number(subCategoryId),
				status: 1,
			};

			const response = await fetch(url, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},

				body: JSON.stringify(payload),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "發布失敗，請稍後再試");
			}

			alert(isEditMode ? "修改成功！" : "發布成功！");

			// 成功後的路由跳轉
			if (isEditMode) {
				router.push(`/article/${articleId}`); // 編輯完導回該文章頁
			} else {
				const newId = data.articleId ?? data.article?.id ?? data.id;
				router.push(newId ? `/article/${newId}` : "/article/manage");
			}
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : "發布失敗，請稍後再試",
			);
		} finally {
			setIsPublishing(false);
		}
	}

	if (isArticleLoading) {
		return (
			<div className="p-12 text-center text-xl font-bold">
				正在讀取文章既有內容...
			</div>
		);
	}

	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
			<div className=" border-4 border-black bg-white shadow-[6px_6px_0px_-1px_#000]">
				<header className="border-b-4 border-black bg-black px-5 py-4 text-white sm:px-8">
					<p className="text-sm font-bold tracking-widest text-button-yellow">
						ARTICLE
					</p>
					<h1 className="mt-1 text-2xl font-black sm:text-3xl">
						{isEditMode ? "編輯文章" : "撰寫文章"}
					</h1>
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
							<select
								id="article-category"
								className="h-11 w-full border-2 border-black bg-white px-3 text-base outline-none focus:bg-amber-50 focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-zinc-100"
								value={subCategoryId}
								onChange={(event) => setSubCategoryId(event.target.value)}
								disabled={isCategoriesLoading}
							>
								<option value="">
									{isCategoriesLoading ? "分類載入中..." : "請選擇分類"}
								</option>
								{categories.map((category) => (
									<optgroup
										key={category.category_name}
										label={category.category_name}
									>
										{category.sub_category.map((subCategory) => (
											<option
												key={subCategory.id}
												value={subCategory.id.toString()}
											>
												{subCategory.sub_category_name}
											</option>
										))}
									</optgroup>
								))}
							</select>
						</section>
					</div>
					<section>
						<p className="mb-3 text-xl font-black">文章內容</p>
						<div className=" border-2 border-black bg-white">
							<div className="article-editor">
								{!isEditMode || content !== "" ? (
									<ClientSideCustomEditor
										value={content}
										onChange={setContent}
									/>
								) : (
									<div className="p-4 text-center text-zinc-500">
										編輯器載入中...
									</div>
								)}
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
							➤ {isPublishing ? "處理中..." : isEditMode ? "儲存修改" : "發布"}
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
