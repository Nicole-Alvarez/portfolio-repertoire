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
    <div className="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,_#063328_0%,_#04231b_55%,_#031811_100%)] text-[#f8f0df]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#d4b06a33] blur-3xl"
        style={{ transform: `translate3d(0, ${scrollY * 0.16}px, 0)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-[36rem] h-96 w-96 rounded-full bg-[#2f6f5d40] blur-3xl"
        style={{ transform: `translate3d(0, ${scrollY * -0.1}px, 0)` }}
      />

      <header className="sticky top-0 z-30 border-b border-[#d4b06a40] bg-[#04231bd9] backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="#top"
            onClick={handleSmoothScroll("#top")}
            className="font-['var(--font-cormorant)'] text-2xl font-semibold tracking-wide text-[#f5e8cc]"
          >
            Aurielle
          </a>
          <div className="flex gap-2 sm:gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleSmoothScroll(item.href)}
                className="rounded-full border border-[#d4b06a55] px-4 py-1.5 text-sm text-[#f5e8cc] transition hover:bg-[#d4b06a24] hover:text-[#ecd6a2]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-16">
        <section className="grid gap-8 rounded-3xl border border-[#d4b06a40] bg-[#0f433633] p-8 sm:grid-cols-[1.2fr_0.8fr] sm:p-12">
          <div>
            <p className="mb-4 inline-block rounded-full border border-[#ecd6a266] bg-[#ecd6a112] px-4 py-1 text-xs tracking-[0.2em] text-[#ecd6a2]">
              CREATIVE PORTFOLIO
            </p>
            <h1 className="text-5xl leading-tight text-[#f8f0df] sm:text-6xl">Aurielle Fia Cadelina</h1>
            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-[#ecd6a2]">
              UGC Creator • UGC Project Manager • Creative Director • AD Scriptwriter
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#b7d6c9]">
              I&apos;m a UGC Project Manager with 3+ years of experience in managing creators and content pipelines for DTC eCommerce brands across wellness, beauty, pet, and lifestyle niches.
            </p>
          </div>
          <div className="rounded-2xl border border-[#d4b06a44] bg-[#031811cc] p-6">
            <p className="text-xs tracking-[0.18em] text-[#ecd6a2]">LOCATION</p>
            <p className="mt-2 text-lg text-[#f5e8cc]">Bohol, Philippines</p>
            <p className="mt-4 text-xs tracking-[0.18em] text-[#ecd6a2]">SOCIALS</p>
            <div className="mt-2 flex flex-col gap-2 text-sm text-[#b7d6c9]">
              <a className="hover:text-[#ecd6a2]" href="https://www.instagram.com/ugcaurielle/" target="_blank" rel="noreferrer">
                Instagram: @ugcaurielle
              </a>
              <a
                className="hover:text-[#ecd6a2]"
                href="https://www.tiktok.com/@ugcaurielle?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noreferrer"
              >
                TikTok: @ugcaurielle
              </a>
              <a className="hover:text-[#ecd6a2]" href="mailto:aurielle.ugcpm@gmail.com">
                aurielle.ugcpm@gmail.com
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="mt-20 scroll-mt-24">
          <h2 className="text-4xl text-[#f8f0df] sm:text-5xl">Hi! I&apos;m Aurielle.</h2>
          <p className="mt-5 max-w-4xl leading-8 text-[#b7d6c9]">
            I specialize in creator sourcing, coordination, quality control, and ensuring content is delivered on-brief and ready for performance marketing. I&apos;m a Bachelor of Science in Business Administration graduate, major in General Management, and an IELTS passer with strong written and verbal English communication skills. I thrive in fast-paced remote environments where organization, clarity, and execution matter. Plus, I am a UGC Creator myself.
          </p>
        </section>

        <section id="services" className="mt-20 scroll-mt-24">
          <h2 className="text-4xl text-[#f8f0df] sm:text-5xl">Services Offered</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-[#d4b06a40] bg-[#0f433624] p-6">
              <h3 className="text-2xl text-[#f5e8cc]">UGC Creator</h3>
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
                  <span key={item} className="rounded-full border border-[#d4b06a7a] bg-[#ecd6a112] px-3 py-1 text-xs text-[#ecd6a2]">
                    {item}
                  </span>
                ))}
              </div>
            </article>
            <article className="rounded-2xl border border-[#d4b06a40] bg-[#0f433624] p-6">
              <h3 className="text-2xl text-[#f5e8cc]">UGC Project Manager / Creative Director</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#b7d6c9]">
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
          <h2 className="text-4xl text-[#f8f0df] sm:text-5xl">Client List</h2>
          <p className="mt-4 max-w-3xl text-[#b7d6c9]">
            DTC eCommerce brands in wellness, beauty, pet, and lifestyle niches, and more.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Wellness", "Beauty", "Pet", "Lifestyle", "& More"].map((item) => (
              <span key={item} className="rounded-full border border-[#d4b06a7a] bg-[#ecd6a112] px-4 py-2 text-xs text-[#ecd6a2]">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-[#d4b06a40] bg-[#04231ba8] p-8 sm:p-10">
          <h2 className="text-4xl text-[#f8f0df] sm:text-5xl">Proof of Work</h2>
          <p className="mt-4 text-[#b7d6c9]">Can I share these with you? Click below to view my framework and work references.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a
              className="rounded-xl border border-[#ecd6a166] bg-[#d4b06a14] px-4 py-3 text-sm text-[#f5e8cc] transition hover:bg-[#d4b06a2e]"
              href="https://drive.google.com/file/d/1ArF90rXv3BDam3MJ8mzu9byswDu9u1pp/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Framework
            </a>
            <a
              className="rounded-xl border border-[#ecd6a166] bg-[#d4b06a14] px-4 py-3 text-sm text-[#f5e8cc] transition hover:bg-[#d4b06a2e]"
              href="https://drive.google.com/file/d/1KV-XCx3dkMCx2PFSxrob16s7Tv-3q5tz/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Proof of Work
            </a>
            <a
              className="rounded-xl border border-[#ecd6a166] bg-[#d4b06a14] px-4 py-3 text-sm text-[#f5e8cc] transition hover:bg-[#d4b06a2e]"
              href="https://drive.google.com/file/d/1Qv_geNn-HCjHAOKqymyybHJqUxobpayf/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Creator Lists for Brands
            </a>
          </div>
        </section>

        <section id="testimonials" className="mt-20 scroll-mt-24">
          <h2 className="text-4xl text-[#f8f0df] sm:text-5xl">Testimonials</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              "I really like your work. It is very structured and you have a good feeling for the right creators. When you work, you do it very well. You do what is absolutely necessary.",
              "Good day! We saw your ecora video and we loved the content you made. Thank you so much!",
              "You were not joking when you said you can get some decent people on this. Love it! I like the way you communicate as well.",
            ].map((quote) => (
              <article key={quote} className="rounded-2xl border border-[#d4b06a40] bg-[#0f433624] p-6 text-[#b7d6c9]">
                <p className="leading-7">&ldquo;{quote}&rdquo;</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 scroll-mt-24 rounded-3xl border border-[#d4b06a40] bg-[#0f433633] p-8 sm:p-10">
          <h2 className="text-4xl text-[#f8f0df] sm:text-5xl">Let&apos;s Work Together</h2>
          <p className="mt-4 text-[#b7d6c9]">You could be next here, and I can&apos;t wait to impress you.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:aurielle.ugcpm@gmail.com"
              className="inline-flex rounded-full border border-[#ecd6a1] bg-[#d4b06a1a] px-6 py-3 text-sm font-semibold tracking-wide text-[#f5e8cc] transition hover:bg-[#d4b06a30]"
            >
              Email Me
            </a>
            <a
              href="https://www.linkedin.com/in/aurielle-fia-cadeli%C3%B1a-2094b0305/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[#d4b06a7a] px-6 py-3 text-sm font-semibold tracking-wide text-[#f5e8cc] transition hover:bg-[#d4b06a20]"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
