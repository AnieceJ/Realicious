import "@/app/accounting/pixel/fx.css";
import "./shop-theme.css";
import ShopAmbientBackground from "./_components/ShopAmbientBackground";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shop-theme relative min-h-full">
      <ShopAmbientBackground />
      <div className="relative">{children}</div>
    </div>
  );
}
