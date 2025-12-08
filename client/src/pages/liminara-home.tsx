import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import {
    Microscope,
    Shield,
    Truck,
    Award,
    CheckCircle2,
    ArrowRight,
    Pill,
    Sparkles,
    FlaskConical,
    Factory,
    Users,
    Globe,
    Star,
    BadgeCheck,
} from "lucide-react";
import { CountUpStat } from "@/components/count-up-stat";
import { TimelineStep } from "@/components/timeline-step";
import { ProductCarousel } from "@/components/product-carousel";

export default function LiminaraHome() {
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [interest, setInterest] = useState("pharma");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Mouse parallax effect
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / innerWidth;
        const y = (clientY - innerHeight / 2) / innerHeight;
        setMousePosition({ x, y });
    };

    // Floating particles animation
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        size: 2 + Math.random() * 4,
    }));

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Simulate API call
        toast.loading("Subscribing...");

        setTimeout(() => {
            toast.dismiss();
            toast.success("Thank you! You'll start receiving updates shortly.", {
                duration: 4000,
                icon: "✅",
            });
            setEmail("");
            setCompany("");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-center" />

            {/* Section 1: Hero - "Medicine + Beauty, Trusted Worldwide" */}
            <section
                className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-liminara-cream via-white to-liminara-mint/20"
                onMouseMove={handleMouseMove}
            >
                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute rounded-full bg-liminara-rose/20"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.6, 0.2],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                delay: particle.delay,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Parallax Background Blobs */}
                <motion.div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                    <div className="absolute top-20 left-20 w-96 h-96 bg-liminara-rose/40 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-liminara-sage/40 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-liminara-rosegold/30 rounded-full blur-3xl" />
                </motion.div>

                {/* FDA/ISO Badge */}
                <motion.div
                    className="absolute top-8 right-8 glass-effect px-6 py-3 rounded-full flex items-center gap-2 z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <BadgeCheck className="h-5 w-5 text-liminara-rose animate-glow-pulse" />
                    <span className="text-sm font-semibold text-liminara-charcoal">
                        FDA/ISO Certified
                    </span>
                </motion.div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-liminara-charcoal mb-6 leading-tight">
                            Innovating Health & Beauty,{" "}
                            <span className="bg-gradient-to-r from-liminara-rose via-liminara-rosegold to-liminara-rose bg-clip-text text-transparent animate-glow-pulse">
                                Scientifically
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        GMP-grade pharmaceuticals and dermatologically tested cosmetics —
                        made for safety, backed by science.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        <Link to="/pharma-products">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-[#4B3A2F] to-[#3B2D25] hover:from-[#3B2D25] hover:to-[#2B1D15] text-white px-10 py-7 text-lg group shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Pill className="mr-2 h-6 w-6" />
                                Explore Pharma
                                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/products">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-[#4B3A2F] text-[#4B3A2F] hover:bg-[#FFF4E8] px-10 py-7 text-lg group shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Sparkles className="mr-2 h-6 w-6" />
                                Explore Cosmetics
                                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Quick Trust Strip */}
            <section className="py-10 bg-white border-y border-border relative overflow-hidden">
                {/* Subtle animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-liminara-rose/5 to-transparent animate-shimmer" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <p className="text-center text-sm text-muted-foreground mb-8 font-medium">
                        Global certifications and clinical standards you can trust
                    </p>

                    <div className="overflow-hidden">
                        <motion.div
                            className="flex gap-8 md:gap-12 items-center justify-center flex-wrap"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            {[
                                { icon: Award, text: "ISO Certified" },
                                { icon: Shield, text: "WHO-GMP" },
                                { icon: CheckCircle2, text: "FDA-Compliant" },
                                { icon: Microscope, text: "Dermatologist Tested" },
                                { icon: Users, text: "10+ Years Experience" },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center gap-3 text-liminara-charcoal group cursor-pointer"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="p-2 bg-liminara-rose/10 rounded-full group-hover:bg-liminara-rose/20 transition-colors">
                                        <item.icon className="h-6 w-6 text-liminara-rose" />
                                    </div>
                                    <span className="font-semibold text-sm md:text-base">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 3: Product Categories (Split View) */}
            <section className="py-24 bg-gradient-to-b from-white to-liminara-cream/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-liminara-charcoal mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover our comprehensive range of pharmaceutical and cosmetic products
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Pharma Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="p-8 hover-lift bg-gradient-to-br from-[#FFF4E8] via-white to-[#FFF4E8]/50 border-2 border-[#E3C7A0] h-full group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                                        <Pill className="h-10 w-10 text-[#4B3A2F]" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-display font-bold text-liminara-charcoal">
                                        Pharmaceuticals
                                    </h3>
                                </div>

                                <p className="text-muted-foreground mb-6">
                                    GMP-certified pharmaceutical formulations for healthcare excellence
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {["Tablets", "Capsules", "Syrups", "Nutraceuticals"].map((item, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-center gap-3 text-lg"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-[#4B3A2F] flex-shrink-0" />
                                            <span>{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                <Link to="/pharma-products">
                                    <Button className="w-full bg-[#4B3A2F] hover:bg-[#3B2D25] text-white group/btn py-6 text-lg">
                                        View All Pharma
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </Card>
                        </motion.div>

                        {/* Cosmetics Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="p-8 hover-lift bg-gradient-to-br from-[#FFF4E8] via-white to-[#FFF4E8]/50 border-2 border-[#F5D7B0] h-full group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-[#F5D7B0] rounded-2xl group-hover:bg-[#E3C7A0] transition-colors">
                                        <Sparkles className="h-10 w-10 text-[#4B3A2F]" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-display font-bold text-liminara-charcoal">
                                        Cosmetics
                                    </h3>
                                </div>

                                <p className="text-muted-foreground mb-6">
                                    Dermatologically tested beauty solutions for radiant skin
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {["Face Care", "Hair Care", "Serums", "Organic Range"].map((item, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-center gap-3 text-lg"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-[#4B3A2F] flex-shrink-0" />
                                            <span>{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                <Link to="/products">
                                    <Button className="w-full bg-[#4B3A2F] hover:bg-[#3B2D25] text-white group/btn py-6 text-lg">
                                        View All Cosmetics
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 4: Featured Products Carousel */}
            {/* <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-liminara-charcoal mb-4">
                            Featured Formulations & Bestsellers
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover our most trusted and effective products
                        </p>
                    </motion.div>

                    <ProductCarousel autoplay autoplayDelay={5000}>
                        {[
                            {
                                name: "Liminara Vita C Serum",
                                benefit: "Brightening Vitamin C formula for radiant skin",
                                price: "₹799",
                                category: "cosmetics",
                                badge: "Top Seller",
                                rating: 4.8,
                            },
                            {
                                name: "Immune Boost Capsules",
                                benefit: "Strengthens immunity with natural ingredients",
                                price: "₹599",
                                category: "pharma",
                                badge: "GMP Certified",
                                rating: 4.9,
                            },
                            {
                                name: "Anti-Aging Night Cream",
                                benefit: "Reduces wrinkles with deep hydration",
                                price: "₹1,299",
                                category: "cosmetics",
                                badge: "New",
                                rating: 4.7,
                            },
                            {
                                name: "Multivitamin Tablets",
                                benefit: "Complete daily nutrition in one tablet",
                                price: "₹449",
                                category: "pharma",
                                badge: "Best Value",
                                rating: 4.6,
                            },
                            {
                                name: "Hyaluronic Acid Serum",
                                benefit: "Intense hydration for plump, youthful skin",
                                price: "₹899",
                                category: "cosmetics",
                                badge: "Top Seller",
                                rating: 4.9,
                            },
                        ].map((product, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 hover-lift group cursor-pointer tilt-3d h-full flex flex-col">
                                    <div className="absolute top-4 right-4 z-10">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold text-white ${product.badge === "New"
                                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                                : product.badge === "Top Seller"
                                                    ? "bg-gradient-to-r from-liminara-rose to-liminara-rosegold"
                                                    : product.badge === "GMP Certified"
                                                        ? "bg-gradient-to-r from-[#FFF4E8]0 to-[#5C4A3A]"
                                                        : "bg-gradient-to-r from-purple-500 to-purple-600"
                                                }`}
                                        >
                                            {product.badge}
                                        </span>
                                    </div>

                                    <div className="aspect-square bg-gradient-to-br from-liminara-cream to-liminara-mint/20 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                        {product.category === "cosmetics" ? (
                                            <Sparkles className="h-20 w-20 text-liminara-rose" />
                                        ) : (
                                            <Pill className="h-20 w-20 text-[#4B3A2F]" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </div>

[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
5:17:40 pm [vite] Pre-transform error: D:\Cybaemtech\Liminara\client\src\pages\about-liminara.tsx: Unexpected token, expected "," (183:28)

  181 |         },
  182 |         className = "relative"
> 183 |                             initial = {{ opacity: 0, x: 50 }}
      |                             ^
  184 | animate = {{ opacity: 1, x: 0 }}
  185 | transition = {{ duration: 0.8, delay: 0.2 }}
  186 |                         >
PS D:\Cybaemtech\Liminara>                                     <h3 className="text-xl font-bold text-liminara-charcoal mb-2 group-hover:text-liminara-rose transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                                        {product.benefit}
                                    </p>

                                    <div className="flex items-center gap-1 mb-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(product.rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-sm text-muted-foreground ml-1">
                                            ({product.rating})
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-liminara-rose">
                                            {product.price}
                                        </span>
                                        <Button
                                            size="sm"
                                            className={
                                                product.category === "cosmetics"
                                                    ? "bg-[#4B3A2F] hover:bg-[#3B2D25]"
                                                    : "bg-[#4B3A2F] hover:bg-[#3B2D25]"
                                            }
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>

                                    <Link to={`/product/${index + 1}`}>
                                        <Button
                                            variant="ghost"
                                            className="w-full group-hover:bg-liminara-cream/50 transition-colors"
                                        >
                                            View Details
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </Card>
                            </motion.div>
                        ))}
                    </ProductCarousel>
                </div>
            </section> */}

            {/* Section 5: Why Liminara (3 Key Pillars) */}
            <section className="py-24 bg-gradient-to-b from-liminara-cream/30 via-white to-liminara-mint/10 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, #E3C7A0 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-liminara-charcoal mb-4">
                            Why Liminara
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Science • Safety • Supply — Our commitment to excellence
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FlaskConical,
                                title: "Science",
                                stats: 500,
                                suffix: "+",
                                label: "Formulations",
                                points: [
                                    "Clinically validated formulas",
                                    "Research-backed ingredients",
                                    "Continuous innovation",
                                ],
                            },
                            {
                                icon: Shield,
                                title: "Safety",
                                stats: 100,
                                suffix: "%",
                                label: "Quality Control",
                                points: [
                                    "GMP-certified manufacturing",
                                    "Batch-by-batch testing",
                                    "Zero compromise on safety",
                                ],
                            },
                            {
                                icon: Truck,
                                title: "Supply",
                                stats: 50,
                                suffix: "+",
                                label: "Countries",
                                points: [
                                    "Scalable manufacturing",
                                    "Global distribution",
                                    "Reliable partnerships",
                                ],
                            },
                        ].map((pillar, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-8 text-center hover-lift h-full bg-white/80 backdrop-blur-sm">
                                    <motion.div
                                        className="inline-flex p-6 bg-gradient-to-br from-liminara-rose/10 to-liminara-rosegold/10 rounded-full mb-6"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <pillar.icon className="h-12 w-12 text-liminara-rose" />
                                    </motion.div>
                                    <h3 className="text-3xl md:text-4xl font-display font-bold text-liminara-charcoal mb-4">
                                        {pillar.title}
                                    </h3>
                                    <div className="text-5xl md:text-6xl font-bold text-liminara-rose mb-2">
                                        <CountUpStat
                                            end={pillar.stats}
                                            suffix={pillar.suffix}
                                            duration={2.5}
                                        />
                                    </div>
                                    <p className="text-muted-foreground mb-6 font-medium">
                                        {pillar.label}
                                    </p>
                                    <ul className="space-y-3 text-left">
                                        {pillar.points.map((point, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex items-start gap-2"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                            >
                                                <CheckCircle2 className="h-5 w-5 text-liminara-rose mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">{point}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/certifications">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-liminara-rose text-liminara-rose hover:bg-liminara-rose/10 px-8 py-6 text-lg group"
                            >
                                View Certifications
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Section 6: Manufacturing Snapshot + CTA */}
            <section className="py-24 bg-gradient-to-br from-liminara-charcoal via-gray-900 to-liminara-charcoal text-white relative overflow-hidden">
                {/* Animated background grid */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                            From Lab to Shelf — Our Process
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            End-to-end GMP manufacturing, traceable raw material sourcing,
                            stability testing for every batch.
                        </p>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative mb-16">
                        {/* Connection Line */}
                        <div className="absolute top-10 left-0 right-0 h-1 bg-liminara-rose/30 hidden md:block" />

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative">
                            {[
                                { icon: FlaskConical, label: "Lab Research" },
                                { icon: Microscope, label: "Raw Material Sourcing" },
                                { icon: Factory, label: "Formulation & Manufacturing" },
                                { icon: Shield, label: "QA & Stability Testing" },
                                { icon: Globe, label: "Packaging & Dispatch" },
                            ].map((step, index) => (
                                <TimelineStep
                                    key={index}
                                    icon={step.icon}
                                    label={step.label}
                                    index={index}
                                    isLast={index === 4}
                                />
                            ))}
                        </div>
                    </div>

                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/manufacturing">
                            <Button
                                size="lg"
                                className="bg-white text-liminara-charcoal hover:bg-gray-100 px-10 py-6 text-lg group shadow-xl"
                            >
                                See Manufacturing Process
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Section 7: Newsletter / B2B Inquiry CTA */}
            <section className="py-24 bg-gradient-to-br from-liminara-rose/10 via-white to-liminara-sage/10 relative overflow-hidden">
                {/* Floating shapes */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-liminara-rose/10 rounded-full blur-2xl animate-float" />
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-liminara-sage/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-4">
                            Get formulations, private label, or bulk pricing
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Join our industry mailing list — product releases, clinical news,
                            and trade offers.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-8 md:p-10 shadow-rose bg-white/80 backdrop-blur-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Input
                                        type="email"
                                        placeholder="Your email address *"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="text-lg py-6 border-2 focus:border-liminara-rose transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Company name (optional)"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="text-lg py-6 border-2 focus:border-liminara-rose transition-colors"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-3">
                                        I'm interested in:
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            type="button"
                                            variant={interest === "pharma" ? "default" : "outline"}
                                            onClick={() => setInterest("pharma")}
                                            className={`${interest === "pharma"
                                                ? "bg-[#4B3A2F] hover:bg-[#3B2D25] text-white"
                                                : "border-2 hover:bg-blue-50"
                                                } transition-all duration-300`}
                                        >
                                            <Pill className="mr-2 h-4 w-4" />
                                            Pharma
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={interest === "cosmetics" ? "default" : "outline"}
                                            onClick={() => setInterest("cosmetics")}
                                            className={`${interest === "cosmetics"
                                                ? "bg-[#4B3A2F] hover:bg-[#3B2D25] text-white"
                                                : "border-2 hover:bg-[#FFF4E8]"
                                                } transition-all duration-300`}
                                        >
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Cosmetics
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={interest === "both" ? "default" : "outline"}
                                            onClick={() => setInterest("both")}
                                            className={`${interest === "both"
                                                ? "bg-liminara-rose hover:bg-liminara-rose/90 text-white"
                                                : "border-2 hover:bg-liminara-rose/10"
                                                } transition-all duration-300`}
                                        >
                                            Both
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-liminara-rose to-liminara-rosegold hover:from-liminara-rose/90 hover:to-liminara-rosegold/90 text-white text-lg py-7 shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    Subscribe Now
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    💎 Get free sample catalog PDF upon subscription
                                </p>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
