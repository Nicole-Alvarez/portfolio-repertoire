"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Parallax } from "react-scroll-parallax";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function mixHex(start: string, end: string, t: number) {
  const a = hexToRgb(start);
  const b = hexToRgb(end);
  const p = Math.min(1, Math.max(0, t));
  const r = Math.round(a.r + (b.r - a.r) * p);
  const g = Math.round(a.g + (b.g - a.g) * p);
  const bVal = Math.round(a.b + (b.b - a.b) * p);
  return `rgb(${r}, ${g}, ${bVal})`;
}

export default function FoliOnePage() {
  const [scrollY, setScrollY] = useState(0);
  const [cursor, setCursor] = useState({ x: -9999, y: -9999 });
  const [showIntro, setShowIntro] = useState(true);
  const [startGlow, setStartGlow] = useState(false);
  const [startHeroImage, setStartHeroImage] = useState(false);
  const [startHeroText, setStartHeroText] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showIntro) return;
    const timer = window.setTimeout(() => setStartGlow(true), 900);
    return () => window.clearTimeout(timer);
  }, [showIntro]);

  useEffect(() => {
    if (showIntro) return;
    const timer = window.setTimeout(() => setStartHeroImage(true), 500);
    return () => window.clearTimeout(timer);
  }, [showIntro]);

  useEffect(() => {
    if (!startHeroImage) return;
    const timer = window.setTimeout(() => setStartHeroText(true), 220);
    return () => window.clearTimeout(timer);
  }, [startHeroImage]);

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

  const clientLogos = [
    "/creativeportfolio-images/5ed8b3740a49dc34884560451e308af5.jpg",
    "/creativeportfolio-images/15b1ce7fbe03c65dd713abd9d5e40d69.jpg",
    "/creativeportfolio-images/53ccc63d5b9f8620dda4a15d66ed762c.png",
    "/creativeportfolio-images/55effbce700e6c2984cdbf3b79b397a2.jpg",
    "/creativeportfolio-images/65bca83dc72152b73570240728d1c12d.png",
    "/creativeportfolio-images/71a0533f6e99298599a783f0a6dee320.jpg", 
    "/creativeportfolio-images/255bc8c24e0297df16e807019c3a54aa.jpg",
    "/creativeportfolio-images/04390e884cf62cae507381c5f7092d35.png",
    "/creativeportfolio-images/2434178652de7241d8c685ac92c8c835.jpg",
    "/creativeportfolio-images/09018675034df7c075af9fbe4e38bc0f.png", 
    "/creativeportfolio-images/401372656806def5f9a2d2a25fd81c67.png",
    "/creativeportfolio-images/a3072aded511e5a057e1387891f517a9.png",
    "/creativeportfolio-images/b13c84ff91a8de0f832f908b2bfa1790.jpg",
    "/creativeportfolio-images/c31f6aec6400f36652d2bb1c13a3ac90.png",
    "/creativeportfolio-images/cb99738af584545c0673241eaad1c0f5.jpg",
    "/creativeportfolio-images/d3f27b21660fbf76cfba921a71169b79.png",
    "/creativeportfolio-images/ee095439f6922a008f75b3cb19aa4e7f.jpg",
    "/creativeportfolio-images/f2ac94ad4acdcd38bcf9df191ba0368f.png",
    "/creativeportfolio-images/f7a1ba154d045a2b9285b281fb8e7afb.png", 
  ];

  const proofItems = [
    {
      title: "Framework",
      href: "https://drive.google.com/file/d/1ArF90rXv3BDam3MJ8mzu9byswDu9u1pp/view?usp=sharing",
      thumbnail: "/creativeportfolio-images/Screenshot 2026-03-09 at 2.07.37 PM.png",
    },
    {
      title: "Proof of Work",
      href: "https://drive.google.com/file/d/1KV-XCx3dkMCx2PFSxrob16s7Tv-3q5tz/view?usp=sharing",
      thumbnail: "/creativeportfolio-images/Screenshot 2026-03-09 at 2.08.06 PM.png",
    },
    {
      title: "Creator Lists for Brands",
      href: "https://drive.google.com/file/d/1Qv_geNn-HCjHAOKqymyybHJqUxobpayf/view?usp=sharing",
      thumbnail: "/creativeportfolio-images/Screenshot 2026-03-09 at 2.08.38 PM.png",
    },
  ];

  const coreRoles = [
    "UGC Creator",
    "UGC Project Manager",
    "Creative Director",
    "AD Scriptwriter",
  ]; 

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-black text-[#f8efe4]"
      onMouseMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
      onMouseLeave={() => setCursor({ x: -9999, y: -9999 })}
    >
      {showIntro && (
        <div
          aria-hidden
          className="intro-overlay pointer-events-none fixed inset-0 z-[90]"
        >
          <div className="intro-circle" />
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-200"
        style={{
          background: `radial-gradient(360px circle at ${cursor.x}px ${cursor.y}px, rgba(235, 210, 161, 0.1), rgba(235, 210, 161, 0.03) 42%, transparent 78%)`,
        }}
      />
      <Parallax
        translateY={[-16, 40]}
        className={`${startGlow ? "opacity-100" : "opacity-0"} pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#cfac6840] blur-3xl transition-opacity duration-700`}
      />
      <Parallax
        translateY={[28, -30]}
        className="pointer-events-none absolute -right-28 top-[36rem] h-96 w-96 rounded-full bg-[#7d294540] blur-3xl"
      />

      <header
        className={`${showIntro ? "intro-nav-pre" : "intro-nav-enter"} sticky top-0 z-[100] border-b border-[#cfac6838] bg-[#2a0612cc] backdrop-blur-xl`}
      >
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <a
            href="#top"
            onClick={handleSmoothScroll("#top")}
            className="font-['var(--font-cormorant)'] text-3xl font-semibold tracking-tight text-[#f4e7d4]"
          >
            Aurielle
          </a>
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleSmoothScroll(item.href)}
                className="rounded-full border border-[#cfac6850] bg-[#ffffff08] px-4 py-1.5 text-sm text-[#f4e7d4] transition hover:-translate-y-0.5 hover:bg-[#cfac682c] hover:text-[#ebd2a1]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section
        id="top"
        className="relative isolate z-0 flex h-screen items-start overflow-hidden md:pt-20"
      >
        <Parallax
          translateY={[-100, 100]}
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-row items-center gap-10 px-6"
        >
          <div
            aria-hidden
            className={`${startHeroImage ? "opacity-100 translate-x-0" : "opacity-0 translate-x-48"} border rounded-md pointer-events-none relative z-10 hidden h-[440px] w-[280px] min-w-[280px] max-w-[480px] transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] md:block`}
          >
            <Image
              src="/creativeportfolio-images/ae4ea5e6ba751cc78000fb16e478586c.png"
              alt=""
              fill
              className="object-contain object-top opacity-90 top"
              sizes="(max-width: 1024px) 32vw, 420px"
            />
          </div>
          <div className="z-0">
            <p
              className={`${startHeroText ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"} mb-5 text-xs uppercase tracking-[0.25em] text-[#ebd2a1] transition-all duration-500`}
              style={{ transitionDelay: "0ms" }}
            >
              Aurielle Creative Portfolio
            </p>
            <h1
              className={`${startHeroText ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"} max-w-5xl font-['var(--font-cormorant)'] text-7xl leading-[0.92] tracking-tight text-[#f8efe4] transition-all duration-500 sm:text-8xl md:text-9xl`}
              style={{ transitionDelay: "120ms" }}
            >
              Creativity is my craft.
            </h1>
            <p
              className={`${startHeroText ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"} mt-6 max-w-xl text-base leading-7 text-[#cab2bc] transition-all duration-500`}
              style={{ transitionDelay: "240ms" }}
            >
              UGC Creator, UGC Project Manager, Creative Director, and AD
              Scriptwriter focused on content that is both strategic and
              visually memorable.
            </p>
            <a
              href="#about"
              onClick={handleSmoothScroll("#top-part")}
              className={`${startHeroText ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"} mt-8 inline-flex rounded-full border border-[#cfac6850] bg-[#ffffff0a] px-5 py-2.5 text-sm text-[#f4e7d4] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#cfac6828]`}
              style={{ transitionDelay: "360ms" }}
            >
              Explore Portfolio
            </a>
          </div>
        </Parallax>
      </section>

      <main
        id="content-details"
        className={`${showIntro ? "intro-content-details-pre" : "intro-content-details-enter"} relative z-20 -mt-20 rounded-t-[2.25rem] border-t border-[#cfac6840] bg-[radial-gradient(circle_at_top,_#7b1d3c33,_transparent_46%),radial-gradient(circle_at_80%_20%,_#cfac6822,_transparent_34%),linear-gradient(180deg,_#2f0714_0%,_#12080d_55%,_#1b0b12_100%)] md:-mt-24`}
      >
        <div
          id="top-part"
          className="intro-top-part-enter mx-auto max-w-6xl px-6 pb-24 pt-20"
        >
          <section
            id="about"
            className="grid gap-8 rounded-3xl border border-[#cfac6840] bg-[#4f10232e] p-8 shadow-[0_20px_80px_-45px_rgba(0,0,0,0.95)] sm:grid-cols-[1.2fr_0.8fr] sm:p-12"
          >
            <div>
              <p className="mb-4 inline-block rounded-full border border-[#ebd2a166] bg-[#ebd2a114] px-4 py-1 text-xs tracking-[0.2em] text-[#ebd2a1]">
                CREATIVE PORTFOLIO
              </p>
              <h1 className="text-5xl leading-[1.02] tracking-tight text-[#f8efe4] sm:text-6xl">
                Aurielle Fia Cadelina
              </h1>
              <p className="mt-5 text-sm uppercase tracking-[0.2em] text-[#ebd2a1]">
                Portfolio Focus
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {coreRoles.map((role) => (
                  <div
                    key={role}
                    className="rounded-xl border border-[#cfac6850] bg-[#ffffff06] px-4 py-2 text-sm font-medium text-[#f4e7d4]"
                  >
                    {role}
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#d6adb8]">
                I&apos;m a UGC Project Manager with 3+ years of experience in
                managing creators and content pipelines for DTC eCommerce brands
                across wellness, beauty, pet, and lifestyle niches.
              </p>
            </div>
            <div className="pt-12 flex flex-col gap-6 rounded-2xl border border-[#cfac6844] bg-[#12080dcc] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:flex-row">
              <div className="relative h-[240px] aspect-[4/5] overflow-hidden rounded-xl border border-[#cfac6855]">
                <Image
                  src="/creativeportfolio-images/00ef042d8f6d734a73c8d8379a6b1733.jpg"
                  alt="Aurielle portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 340px"
                />
              </div>
              <div>
                <p className="text-xs tracking-[0.18em] text-[#ebd2a1]">
                  LOCATION
                </p>
                <p className="mt-2 text-lg text-[#f4e7d4]">
                  Bohol, Philippines
                </p>
                <p className="mt-4 text-xs tracking-[0.18em] text-[#ebd2a1]">
                  SOCIALS
                </p>
                <div className="mt-2 flex flex-col gap-2 text-sm text-[#d6adb8]">
                  <a
                    className="hover:text-[#ebd2a1]"
                    href="https://www.instagram.com/ugcaurielle/"
                    target="_blank"
                    rel="noreferrer"
                  >
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
                  <a
                    className="hover:text-[#ebd2a1]"
                    href="mailto:aurielle.ugcpm@gmail.com"
                  >
                    aurielle.ugcpm@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24 scroll-mt-24">
            <h2 className="text-4xl tracking-tight text-[#f8efe4] sm:text-5xl">
              Hi! I&apos;m Aurielle.
            </h2>
            <p className="mt-5 max-w-4xl leading-8 text-[#d6adb8]">
              I specialize in creator sourcing, coordination, quality control,
              and ensuring content is delivered on-brief and ready for
              performance marketing. I&apos;m a Bachelor of Science in Business
              Administration graduate, major in General Management, and an IELTS
              passer with strong written and verbal English communication
              skills. I thrive in fast-paced remote environments where
              organization, clarity, and execution matter. Plus, I am a UGC
              Creator myself.
            </p>
          </section>

          <section id="services" className="mt-24 scroll-mt-24">
            <h2 className="text-4xl tracking-tight text-[#f8efe4] sm:text-5xl">
              Services Offered
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-[#cfac6840] bg-[#4f10231f] p-6 shadow-[0_16px_50px_-38px_rgba(0,0,0,1)]">
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
                    <span
                      key={item}
                      className="rounded-full border border-[#cfac6870] bg-[#ebd2a112] px-3 py-1 text-xs text-[#ebd2a1]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border border-[#cfac6840] bg-[#4f10231f] p-6 shadow-[0_16px_50px_-38px_rgba(0,0,0,1)]">
                <h3 className="text-2xl text-[#f4e7d4]">
                  UGC Project Manager / Creative Director
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#d6adb8]">
                  <li>
                    Creator sourcing and onboarding aligned to brand goals and
                    target audience.
                  </li>
                  <li>
                    Campaign coordination and negotiation with creators to match
                    budgets and timelines.
                  </li>
                  <li>
                    Product fulfillment tracking for timely and accurate
                    shipments.
                  </li>
                  <li>
                    Delivery and deadline monitoring to keep all campaign assets
                    on schedule.
                  </li>
                  <li>
                    Content quality assurance to match brand standards and
                    creative guidelines.
                  </li>
                  <li>
                    Post-production review to ensure raw footage edits are
                    polished and ready to publish.
                  </li>
                </ul>
              </article>
            </div>
          </section>

          <section id="clients" className="mt-24 scroll-mt-24">
            <h2 className="text-4xl tracking-tight text-[#f8efe4] sm:text-5xl">
              Client List
            </h2>
            <p className="mt-4 max-w-3xl text-[#d6adb8]">
              A curated list of brand partners across wellness, beauty, pet, and
              lifestyle.
            </p>
            <div className="mt-8 rounded-3xl border border-[#cfac6840] bg-[#4f102326] p-4 shadow-[0_18px_60px_-42px_rgba(0,0,0,1)] sm:p-6">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {clientLogos.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="group relative mx-auto aspect-square w-full max-w-[170px] overflow-hidden rounded-xl border border-[#cfac6844] bg-[#2f0714b0] p-2 transition duration-300 hover:-translate-y-0.5 hover:border-[#ebd2a1]"
                  >
                    <Image
                      src={src}
                      alt="Client brand visual"
                      fill
                      className="object-contain p-3 transition duration-300 group-hover:scale-105"
                      sizes="96px"
                    />
                  </div>
                ))}
                <div className="mx-auto flex aspect-square w-full max-w-[170px] items-center justify-center rounded-xl border border-dashed border-[#ebd2a199] bg-[#12080da6] px-2 text-center">
                  <span className="text-sm uppercase tracking-[0.2em] text-[#ebd2a1]">
                    &amp; More
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24 rounded-3xl border border-[#cfac6840] bg-[#2f0714a8] p-8 shadow-[0_20px_70px_-42px_rgba(0,0,0,1)] sm:p-10">
            <h2 className="text-4xl tracking-tight text-[#f8efe4] sm:text-5xl">
              Proof of Work
            </h2>
            <p className="mt-4 text-[#d6adb8]">
              Can I share these with you? Click below to view my framework and
              work references.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {proofItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-xl border border-[#cfac6844] bg-[#12080dbd] transition hover:-translate-y-0.5 hover:border-[#ebd2a1]"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={item.thumbnail}
                      alt={`${item.title} thumbnail`}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  </div>
                  <div className="border-t border-[#cfac6840] px-4 py-3 text-sm text-[#f4e7d4]">
                    {item.title}
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section id="testimonials" className="mt-24 scroll-mt-24">
            <h2 className="text-4xl tracking-tight text-[#f8efe4] sm:text-5xl">
              Testimonials
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  quote:
                    "I really like your work. It is very structured and you have a good feeling for the right creators. When you work, you do it very well. You do what is absolutely necessary.",
                  avatar:
                    "/creativeportfolio-images/55effbce700e6c2984cdbf3b79b397a2.jpg",
                },
                {
                  quote:
                    "Good day! We saw your ecora video and we loved the content you made. Thank you so much!",
                  avatar:
                    "/creativeportfolio-images/f7a1ba154d045a2b9285b281fb8e7afb.png",
                },
                {
                  quote:
                    "You were not joking when you said you can get some decent people on this. Love it! I like the way you communicate as well.",
                  avatar:
                    "/creativeportfolio-images/401372656806def5f9a2d2a25fd81c67.png",
                },
              ].map((item) => (
                <article
                  key={item.quote}
                  className="rounded-2xl border border-[#cfac6840] bg-[#4f10231f] p-6 text-[#d6adb8] shadow-[0_14px_45px_-35px_rgba(0,0,0,1)]"
                >
                  <div className="relative mb-4 h-12 w-12 overflow-hidden rounded-full border border-[#cfac6860]">
                    <Image
                      src={item.avatar}
                      alt="Client avatar"
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <p className="leading-7">&ldquo;{item.quote}&rdquo;</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="mt-24 scroll-mt-24 rounded-3xl border border-[#cfac6840] bg-[#4f102333] p-8 shadow-[0_24px_80px_-48px_rgba(0,0,0,1)] sm:p-10"
          >
            <div className="flex flex-col justify-start gap-10 md:flex-row md:items-start md:justify-start">
              <div className="relative h-[200px] w-full max-w-[200px] overflow-hidden rounded-2xl border border-[#cfac6855] bg-[#2f0714b0] shadow-[0_18px_50px_-28px_rgba(0,0,0,1)]">
                <Image
                  src="/creativeportfolio-images/6cb13dd17527409e4ed4b1ffc3be0b30.jpg"
                  alt="Aurielle creative portrait"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 320px, 360px"
                />
              </div>
              <div className="">
                <h2 className="text-4xl tracking-tight text-[#f8efe4] sm:text-5xl">
                  Let&apos;s Work Together
                </h2>
                <p className="mt-4 text-[#d6adb8]">
                  You could be next here, and I can&apos;t wait to impress you.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="mailto:aurielle.ugcpm@gmail.com"
                    className="inline-flex rounded-full border border-[#ebd2a1] bg-[#cfac681a] px-6 py-3 text-sm font-semibold tracking-wide text-[#f4e7d4] transition hover:-translate-y-0.5 hover:bg-[#cfac6830]"
                  >
                    Email Me
                  </a>
                  <a
                    href="https://www.linkedin.com/in/aurielle-fia-cadeli%C3%B1a-2094b0305/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-[#cfac6870] bg-[#ffffff05] px-6 py-3 text-sm font-semibold tracking-wide text-[#f4e7d4] transition hover:-translate-y-0.5 hover:bg-[#cfac6822]"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="border-t border-[#cfac6840] bg-[#170910d9]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-[#d6adb8] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Aurielle Fia Cadelina. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/ugcaurielle/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#ebd2a1]"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@ugcaurielle?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#ebd2a1]"
            >
              TikTok
            </a>
            <a
              href="https://www.linkedin.com/in/aurielle-fia-cadeli%C3%B1a-2094b0305/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#ebd2a1]"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
