// components/client-side-custom-editor.js
"use client"; // Required only in App Router.
import dynamic from "next/dynamic";
import React from "react";

// 動態載入真正的 CustomEditor
const CustomEditor = dynamic(() => import("@/components/custom-editor"), {
	ssr: false,
});

// 🎯 定義 Props 的型別介面
interface ClientSideCustomEditorProps {
	value?: string;
	onChange: (html: string) => void;
}

// 🎯 幫參數加上剛定義好的型別
export default function ClientSideCustomEditor({
	value = "",
	onChange,
}: ClientSideCustomEditorProps) {
	return <CustomEditor value={value} onChange={onChange} />;
}
