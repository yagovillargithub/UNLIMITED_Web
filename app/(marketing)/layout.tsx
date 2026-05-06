import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CursorBlob } from "@/components/cursor-blob";
import { SmoothScroll } from "@/components/smooth-scroll";
import { RevealController } from "@/components/reveal";
import { TweaksPanel } from "@/components/tweaks/panel";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <CursorBlob />
      <Nav />
      <main>{children}</main>
      <Footer />
      <RevealController />
      <TweaksPanel />
    </>
  );
}
