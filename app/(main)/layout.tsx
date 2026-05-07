import BottomNav from "@/components/shared/BottomNav";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pb-24">{children}</div>
      <BottomNav />
    </>
  );
}
