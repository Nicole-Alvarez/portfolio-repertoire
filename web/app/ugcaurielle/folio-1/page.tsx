"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

export default function FoliOnePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Client List", href: "#clients" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  const handleSmoothScroll = (targetId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const section = document.querySelector(targetId);
    if (section instanceof HTMLElement) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,_#2f0714_0%,_#12080d_55%,_#1b0b12_100%)] text-[#f8efe4]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#cfac6840] blur-3xl"
        style={{ transform: `translate3d(0, ${scrollY * 0.16}px, 0)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-[36rem] h-96 w-96 rounded-full bg-[#7d294540] blur-3xl"
        style={{ transform: `translate3d(0, ${scrollY * -0.1}px, 0)` }}
      />

      <header className="sticky top-0 z-30 border-b border-[#cfac6840] bg-[#2f0714d9] backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="#top"
            onClick={handleSmoothScroll("#top")}
            className="font-['var(--font-cormorant)'] text-2xl font-semibold tracking-wide text-[#f4e7d4]"
          >
            Aurielle
          </a>
          <div className="flex gap-2 sm:gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleSmoothScroll(item.href)}
                className="rounded-full border border-[#cfac6850] px-4 py-1.5 text-sm text-[#f4e7d4] transition hover:bg-[#cfac6829] hover:text-[#ebd2a1]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-16">
        <section className="grid gap-8 rounded-3xl border border-[#cfac6840] bg-[#4f102333] p-8 sm:grid-cols-[1.2fr_0.8fr] sm:p-12">
          <div>
            <p className="mb-4 inline-block rounded-full border border-[#ebd2a166] bg-[#ebd2a114] px-4 py-1 text-xs tracking-[0.2em] text-[#ebd2a1]">
              CREATIVE PORTFOLIO
            </p>
            <h1 className="text-5xl leading-tight text-[#f8efe4] sm:text-6xl">Aurielle Fia Cadelina</h1>
            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-[#ebd2a1]">
              UGC Creator • UGC Project Manager • Creative Director • AD Scriptwriter
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#d6adb8]">
              I&apos;m a UGC Project Manager with 3+ years of experience in managing creators and content pipelines for DTC eCommerce brands across wellness, beauty, pet, and lifestyle niches.
            </p>
          </div>
          <div className="rounded-2xl border border-[#cfac6844] bg-[#12080dcc] p-6">
            <p className="text-xs tracking-[0.18em] text-[#ebd2a1]">LOCATION</p>
            <p className="mt-2 text-lg text-[#f4e7d4]">Bohol, Philippines</p>
            <p className="mt-4 text-xs tracking-[0.18em] text-[#ebd2a1]">SOCIALS</p>
            <div className="mt-2 flex flex-col gap-2 text-sm text-[#d6adb8]">
              <a className="hover:text-[#ebd2a1]" href="https://www.instagram.com/ugcaurielle/" target="_blank" rel="noreferrer">
                Instagram: @ugcaurielle
              </a>
              <a
                className="hover:text-[#ebd2a1]"
                href="https://www.tiktok.com/@ugcaurielle?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noreferrer"
              >
                TikTok: @ugcaurielle
              </a>
              <a className="hover:text-[#ebd2a1]" href="mailto:aurielle.ugcpm@gmail.com">
                aurielle.ugcpm@gmail.com
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="mt-20 scroll-mt-24">
          <h2 className="text-4xl text-[#f8efe4] sm:text-5xl">Hi! I&apos;m Aurielle.</h2>
          <p className="mt-5 max-w-4xl leading-8 text-[#d6adb8]">
            I specialize in creator sourcing, coordination, quality control, and ensuring content is delivered on-brief and ready for performance marketing. I&apos;m a Bachelor of Science in Business Administration graduate, major in General Management, and an IELTS passer with strong written and verbal English communication skills. I thrive in fast-paced remote environments where organization, clarity, and execution matter. Plus, I am a UGC Creator myself.
          </p>
        </section>

        <section id="services" className="mt-20 scroll-mt-24">
          <h2 className="text-4xl text-[#f8efe4] sm:text-5xl">Services Offered</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-[#cfac6840] bg-[#4f10231f] p-6">
              <h3 className="text-2xl text-[#f4e7d4]">UGC Creator</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Testimonials",
                  "Spokesperson",
                  "Script Read",
                  "Voiceovers",
                  "Product Demos",
                  "B-Roll Footage",
                  "Paid Ads",
                  "Organic Posting",
                  "Usage Rights",
                  "Whitelisting",
                  "Script Writing",
                  "Photography",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-[#cfac6870] bg-[#ebd2a112] px-3 py-1 text-xs text-[#ebd2a1]">
                    {item}
                  </span>
                ))}
              </div>
            </article>
            <article className="rounded-2xl border border-[#cfac6840] bg-[#4f10231f] p-6">
              <h3 className="text-2xl text-[#f4e7d4]">UGC Project Manager / Creative Director</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#d6adb8]">
                <li>Creator sourcing and onboarding aligned to brand goals and target audience.</li>
                <li>Campaign coordination and negotiation with creators to match budgets and timelines.</li>
                <li>Product fulfillment tracking for timely and accurate shipments.</li>
                <li>Delivery and deadline monitoring to keep all campaign assets on schedule.</li>
                <li>Content quality assurance to match brand standards and creative guidelines.</li>
                <li>Post-production review to ensure raw footage edits are polished and ready to publish.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="clients" className="mt-20 scroll-mt-24">
          <h2 className="text-4xl text-[#f8efe4] sm:text-5xl">Client List</h2>
          <p className="mt-4 max-w-3xl text-[#d6adb8]">
            DTC eCommerce brands in wellness, beauty, pet, and lifestyle niches, and more.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Wellness", "Beauty", "Pet", "Lifestyle", "& More"].map((item) => (
              <span key={item} className="rounded-full border border-[#cfac6870] bg-[#ebd2a112] px-4 py-2 text-xs text-[#ebd2a1]">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-[#cfac6840] bg-[#2f0714a8] p-8 sm:p-10">
          <h2 className="text-4xl text-[#f8efe4] sm:text-5xl">Proof of Work</h2>
          <p className="mt-4 text-[#d6adb8]">Can I share these with you? Click below to view my framework and work references.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a
              className="rounded-xl border border-[#ebd2a166] bg-[#cfac6815] px-4 py-3 text-sm text-[#f4e7d4] transition hover:bg-[#cfac6830]"
              href="https://drive.google.com/file/d/1ArF90rXv3BDam3MJ8mzu9byswDu9u1pp/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Framework
            </a>
            <a
              className="rounded-xl border border-[#ebd2a166] bg-[#cfac6815] px-4 py-3 text-sm text-[#f4e7d4] transition hover:bg-[#cfac6830]"
              href="https://drive.google.com/file/d/1KV-XCx3dkMCx2PFSxrob16s7Tv-3q5tz/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Proof of Work
            </a>
            <a
              className="rounded-xl border border-[#ebd2a166] bg-[#cfac6815] px-4 py-3 text-sm text-[#f4e7d4] transition hover:bg-[#cfac6830]"
              href="https://drive.google.com/file/d/1Qv_geNn-HCjHAOKqymyybHJqUxobpayf/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Creator Lists for Brands
            </a>
          </div>
        </section>

        <section id="testimonials" className="mt-20 scroll-mt-24">
          <h2 className="text-4xl text-[#f8efe4] sm:text-5xl">Testimonials</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              "I really like your work. It is very structured and you have a good feeling for the right creators. When you work, you do it very well. You do what is absolutely necessary.",
              "Good day! We saw your ecora video and we loved the content you made. Thank you so much!",
              "You were not joking when you said you can get some decent people on this. Love it! I like the way you communicate as well.",
            ].map((quote) => (
              <article key={quote} className="rounded-2xl border border-[#cfac6840] bg-[#4f10231f] p-6 text-[#d6adb8]">
                <p className="leading-7">&ldquo;{quote}&rdquo;</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 scroll-mt-24 rounded-3xl border border-[#cfac6840] bg-[#4f102333] p-8 sm:p-10">
          <h2 className="text-4xl text-[#f8efe4] sm:text-5xl">Let&apos;s Work Together</h2>
          <p className="mt-4 text-[#d6adb8]">You could be next here, and I can&apos;t wait to impress you.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:aurielle.ugcpm@gmail.com"
              className="inline-flex rounded-full border border-[#ebd2a1] bg-[#cfac681a] px-6 py-3 text-sm font-semibold tracking-wide text-[#f4e7d4] transition hover:bg-[#cfac6830]"
            >
              Email Me
            </a>
            <a
              href="https://www.linkedin.com/in/aurielle-fia-cadeli%C3%B1a-2094b0305/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[#cfac6870] px-6 py-3 text-sm font-semibold tracking-wide text-[#f4e7d4] transition hover:bg-[#cfac6822]"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
