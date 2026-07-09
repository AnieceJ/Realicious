"use client";
import * as React from "react";
import { ChevronLeft, SquarePen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarTrigger,
} from "@/components/ui/menubar";

export default function ArticlePage() {
	const [noodle, setNoodle] = React.useState("pasta");
	const [rice, setRice] = React.useState("curry");

	return (
		<>
			<div className="max-w-7xl mx-auto w-full">
				<div className="flex items-center lg:flex-row md:flex-row md:items-center justify-between gap-4 p-3 bg-white border border-black">
					<div className="flex items-center gap-2">
						<Link href="/">
							<ChevronLeft
								size={30}
								className="bg-slate-100 h-10 border border-black"
							/>
						</Link>
						<Menubar className="h-10 bg-black text-slate-100 border border-slate-100 justify-start flex-shrink-0">
							<MenubarMenu>
								<MenubarTrigger className="">麵類</MenubarTrigger>
								<MenubarContent>
									<MenubarRadioGroup value={noodle} onValueChange={setNoodle}>
										<MenubarRadioItem value="beef">牛肉麵</MenubarRadioItem>
										<MenubarRadioItem value="dumpling">餛飩麵</MenubarRadioItem>
										<MenubarRadioItem value="pasta">義大利麵</MenubarRadioItem>
									</MenubarRadioGroup>
								</MenubarContent>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger>飯類</MenubarTrigger>
								<MenubarContent>
									<MenubarRadioGroup value={rice} onValueChange={setRice}>
										<MenubarRadioItem value="curry">咖哩飯</MenubarRadioItem>
										<MenubarRadioItem value="tonkatsu">
											豬排丼飯
										</MenubarRadioItem>
										<MenubarRadioItem value="fried">炒飯</MenubarRadioItem>
									</MenubarRadioGroup>
								</MenubarContent>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger>飯類</MenubarTrigger>
								<MenubarContent>
									<MenubarRadioGroup value={rice} onValueChange={setRice}>
										<MenubarRadioItem value="curry">咖哩飯</MenubarRadioItem>
										<MenubarRadioItem value="tonkatsu">
											豬排丼飯
										</MenubarRadioItem>
										<MenubarRadioItem value="fried">炒飯</MenubarRadioItem>
									</MenubarRadioGroup>
								</MenubarContent>
							</MenubarMenu>
						</Menubar>
						<Field orientation="horizontal">
							<Input type="search" placeholder="Search..." />
							<Button className=" border-0">Search</Button>
						</Field>
					</div>
					<div className="flex items-center gap-2 flex-1 md:w-auto justify-end">
						<div className="w-10 h-10 bg-black ml-2">
							<Link
								href="/article/edit"
								className="flex w-full h-full items-center justify-center"
							>
								<SquarePen color="#FFFFFF" />
							</Link>
						</div>
					</div>
				</div>

				{/* 文章列表 */}
				<div className=" bg-white p-6 border border-black">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold">所有文章</h1>
					</div>
					<div className="flex flex-col">
						<div className="min-h-32 border-b border-black flex flex-col justify-between gap-2 py-3">
							<div className="flex justify-between item-start">
								<h3 className="font-bold text-lg text-slate-900">
									這是一篇文章
								</h3>
								<p className="whitespace-nowrap pt-1 text-xs text-gray-700">
									2026/07/05
								</p>
							</div>
							{/* 內文 */}
							<div>
								<p className=" text-m wrap-break-word line-clamp-4">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Deleniti asperiores velit cumque dolore ab. Harum deserunt
									itaque minima temporibus a laborum vitae quis, numquam
									similique repellendus illum, explicabo suscipit quam. Lorem,
									ipsum dolor sit amet consectetur adipisicing elit. Dicta
									explicabo ducimus dolorem iusto sunt labore odio sed quaerat
									assumenda, facilis, id nam quae distinctio itaque culpa, ab
									voluptatem quas sequi! Molestiae accusantium et voluptatibus
									quis in. Dolorum, cumque saepe dolor laborum iusto
									necessitatibus molestiae minus sapiente beatae consequatur cum
									esse repudiandae officiis voluptate rem itaque iste neque
									inventore modi veritatis. Quae veniam et voluptates dicta
									maxime magni quis, voluptatum totam nostrum atque voluptas,
									necessitatibus, commodi rem laudantium. Obcaecati aut atque
									mollitia aperiam? Rerum aut adipisci dolores excepturi nihil
									sint sunt!
								</p>
							</div>
							<div className="flex justify-between items-end mt-1.5">
								<div className="flex items-center">
									<Eye size={16} />
									<div className="ml-1 text-sm">瀏覽次數</div>
								</div>
								<Link href="/article/1">
									<Button
										variant="outline"
										size="sm"
										className="h-7 border-black bg-red-600 text-slate-100 px-3 text-xs shadow-[0px_5px_0px_0px_#000000]"
									>
										閱讀全文
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
