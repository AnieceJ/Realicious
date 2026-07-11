// app/page.js (App Router)
// pages/index.js (Pages Router)

import ClientSideCustomEditor from "@/components/client-side-custom-editor";

export default function Home() {
	return (
		<>
			<div className="max-w-7xl mx-auto w-full flex flex-col bg-white border-black border-3">
				<div className="w-full h-10 items-center bg-black"></div>
				<div className="article-editor">
					<ClientSideCustomEditor />
				</div>
				<div className="flex gap-4 m-4 text-xl font-bold">
					<div className="flex items-center justify-center border border-black bg-amber-50 w-24 h-10 shadow-[4px_5px_0px_-1px]">
						TAG
					</div>
					<div className="flex items-center justify-center border border-black bg-amber-50 w-24 h-10 shadow-[4px_5px_0px_-1px]">
						TAG
					</div>
					<div className="flex items-center justify-center border border-black bg-amber-50 w-24 h-10 shadow-[4px_5px_0px_-1px]">
						TAG
					</div>
				</div>
			</div>
			<div className="max-w-7xl mx-auto w-full flex gap-4 bg-white">
				<div className="ml-auto flex gap-4">
					<button className="mt-6 w-40 h-16 border-black border-2 bg-button-yellow text-2xl shadow-[4px_5px_0px_-1px_#000]">
						➤ 捨棄
					</button>
					<button className="mt-6 w-40 h-16 border-black border-2 bg-red-700 text-white text-2xl shadow-[4px_5px_0px_-1px_#000]">
						➤ 發布
					</button>
				</div>
			</div>
		</>
	);
}
