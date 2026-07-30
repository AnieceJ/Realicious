export default function ArticleLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <div className="article-page">{children}</div>;
}
