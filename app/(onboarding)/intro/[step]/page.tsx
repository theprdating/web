import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import PageDots from "@/components/onboarding/PageDots";
import { ONBOARDING } from "@/lib/onboarding-content";

export default async function Intro({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  const item = ONBOARDING.find((o) => String(o.step) === step);
  if (!item) notFound();

  const next = item.step < 4 ? `/intro/${item.step + 1}` : "/auth";
  const nextLabel = item.step < 4 ? "繼續" : "開始註冊";

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 relative">
        <Image src={item.image} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-parchment/0 via-parchment/0 to-parchment" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 text-center">
          <h1 className="font-display text-5xl text-walnut">{item.title}</h1>
          <p className="mt-4 text-walnut-soft text-lg leading-relaxed whitespace-pre-line">{item.body}</p>
        </div>
      </div>

      <div className="px-6 pb-10 pt-2">
        <PageDots total={4} current={item.step - 1} />
        <div className="mt-6 space-y-3">
          <Link href={next}><Button>{nextLabel}</Button></Link>
          {item.step < 4 && (
            <Link href="/auth"><Button variant="ghost">略過</Button></Link>
          )}
        </div>
      </div>
    </main>
  );
}
