import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Sparkles, ShieldCheck, Star, Truck, ArrowRight, Leaf,
    ChevronLeft, ChevronRight
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// IMPORT YOUR BANNERS
import banner1 from "../../public/banner/banner-1.jpg";
import banner2 from "../../public/banner/banner-2.jpg";
import banner3 from "../../public/banner/banner-3.jpg";

// SLIDE DATA
const bannerSlides = [
    {
        image: banner2,
        subtitle: "Glow Naturally",
        title: "Beauty Redefined",
        description: "Unlock your skin's natural radiance with dermatologist-approved rituals.",
    },
    {
        image: banner1,
        subtitle: "New Collection",
        title: "Radiance Skincare",
        description: "Premium serums and creams crafted for luminous, healthy skin.",
    },
    {
        image: banner3,
        subtitle: "Complete Care",
        title: "The Full Collection",
        description: "Everything your skin needs for a complete transformation.",
    },
];

const Hero = () => {

    /* ---------------- PARALLAX DEPTH MOTION ---------------- */
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            setMouseX((e.clientX / window.innerWidth) - 0.5);
            setMouseY((e.clientY / window.innerHeight) - 0.5);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    /* ---------------- EMBLA CAROUSEL ---------------- */
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        onSelect();
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    /* ---------------- SCROLL TO PRODUCT SECTION ---------------- */
    const scrollToProducts = () => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative h-screen overflow-hidden">

            {/* ---------- BACKGROUND SLIDER ---------- */}
            <div className="absolute inset-0" ref={emblaRef}>
                <div className="flex h-full">
                    {bannerSlides.map((slide, i) => (
                        <div key={i} className="relative flex-[0_0_100%] min-w-0 h-screen overflow-hidden">

                            {/* BACKGROUND IMAGE WITH PARALLAX ZOOM */}
                            <div
                                className="absolute inset-0 bg-cover bg-center will-change-transform
                                transition-transform duration-[3000ms] ease-out"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    transform: `scale(1.05) translate(${mouseX * 15}px, ${mouseY * 15}px)`
                                }}
                            />

                            {/* WHITE GLASS OVERLAY — same for all slides */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/35 to-transparent" />
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- TEXT CONTENT LAYER ---------- */}
            <div className="relative z-10 h-screen flex items-center">
                <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32 py-20">
                    <div className="max-w-xl lg:max-w-2xl">

                        {/* SUBTITLE BADGE */}
                        <div className="hero-fade mb-6" style={{ animationDelay: "150ms" }}>
                            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5
                            bg-white/70 backdrop-blur-sm border shadow-sm">
                                <Sparkles className="h-4 text-[var(--primary)]" />
                                <span className="text-sm font-medium text-gray-700 tracking-wide">
                                    {bannerSlides[selectedIndex].subtitle}
                                </span>
                            </div>
                        </div>

                        {/* HEADINGS */}
                        <div className="hero-fade mb-6" style={{ animationDelay: "300ms" }}>
                            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-gray-500">
                                Liminara Cosmetics
                            </p>
                            <h1 className="font-serif">
                                <span className="block text-5xl lg:text-6xl text-gray-900">
                                    {bannerSlides[selectedIndex].title}
                                </span>
                            </h1>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="hero-fade text-lg text-gray-600 max-w-lg mb-8"
                            style={{ animationDelay: "450ms" }}>
                            {bannerSlides[selectedIndex].description}
                        </p>

                        {/* CTA BUTTONS */}
                        <div className="hero-fade flex gap-4 mb-10" style={{ animationDelay: "600ms" }}>
                            <Button onClick={scrollToProducts}
                                className="rounded-full bg-black text-white px-8 py-6 text-base hover:bg-gray-900 flex items-center">
                                Explore Collection
                                <ArrowRight className="ml-2 h-5" />
                            </Button>

                            <Button variant="outline"
                                className="rounded-full border-2 px-8 py-6 text-base hover:bg-black/5">
                                Our Story
                            </Button>
                        </div>

                        {/* TRUST BADGES */}
                        <div className="hero-fade flex flex-wrap gap-3" style={{ animationDelay: "750ms" }}>
                            <TrustBadge icon={<ShieldCheck />} text="Dermatologist-Tested" />
                            <TrustBadge icon={<Star />} text="4.9★ Rating" />
                            <TrustBadge icon={<Leaf />} text="Clean Beauty" />
                            <TrustBadge icon={<Truck />} text="Free Shipping" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- CAROUSEL CONTROLS ---------- */}
            <button onClick={scrollPrev} className="hero-arrow left">
                <ChevronLeft className="icon" />
            </button>
            <button onClick={scrollNext} className="hero-arrow right">
                <ChevronRight className="icon" />
            </button>

            {/* SLIDE INDICATORS */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {bannerSlides.map((_, i) => (
                    <button key={i} onClick={() => scrollTo(i)}
                        className={`dot ${i === selectedIndex ? "active" : ""}`} />
                ))}
            </div>
        </section>
    );
};

// Shared badge component
const TrustBadge = ({ icon, text }: { icon: any; text: string }) => (
    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border shadow-sm">
        <span className="text-gray-700">{icon}</span>
        <span className="font-medium text-gray-700">{text}</span>
    </div>
);

export default Hero;
