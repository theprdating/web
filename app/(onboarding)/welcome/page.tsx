import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PageDots from "@/components/onboarding/PageDots";
import PageTransition from "@/components/shared/PageTransition";

export default function Welcome() {
  return (
    <PageTransition>
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 relative">
        <Image src="/illustrations/welcome.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-parchment/0 via-parchment/0 to-parchment" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="font-display text-3xl text-walnut">歡迎來到</h2>
          <h1 className="font-display text-7xl text-walnut mt-2 tracking-wide">Folio</h1>
          <p className="mt-6 text-walnut-soft text-lg leading-relaxed">在書頁之間，<br/>遇見懂你的靈魂。</p>
        </div>
      </div>

      <div className="px-6 pb-10 pt-2">
        <PageDots total={4} current={0} />
        <div className="mt-6">
          <Link href="/intro/2"><Button>開始旅程</Button></Link>
          <div className="mt-3 text-center text-walnut-soft text-sm">
            已有帳號？<Link href="/auth" className="underline">登入</Link>
          </div>
        </div>
      </div>
    </main>
    </PageTransition>
  );
}
