import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProductCarouselProps {
    children: React.ReactNode[];
    autoplay?: boolean;
    autoplayDelay?: number;
}

export function ProductCarousel({
    children,
    autoplay = true,
    autoplayDelay = 5000,
}: ProductCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
    });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    // Autoplay
    useEffect(() => {
        if (!autoplay || !emblaApi) return;

        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, autoplayDelay);

        return () => clearInterval(interval);
    }, [autoplay, autoplayDelay, emblaApi]);

    return (
        <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {children.map((child, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg z-10 hidden md:flex"
                onClick={scrollPrev}
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg z-10 hidden md:flex"
                onClick={scrollNext}
            >
                <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                ? "bg-liminara-rose w-8"
                                : "bg-liminara-rose/30 hover:bg-liminara-rose/50"
                            }`}
                        onClick={() => scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
}
