import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    FlaskConical,
    Microscope,
    Award,
    Shield,
    Heart,
    Leaf,
    Users,
    Target,
    Lightbulb,
    CheckCircle2,
    Factory,
    Globe,
    Sparkles,
    Download,
    ArrowRight,
} from "lucide-react";

export default function AboutLiminara() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);

    // Mouse parallax effect
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / innerWidth;
        const y = (clientY - innerHeight / 2) / innerHeight;
        setMousePosition({ x, y });
    };

    // Company milestones
    const milestones = [
        {
            year: "2010",
            event: "Company founded",
            icon: Factory,
            description: "Liminara began as a small research-driven laboratory",
        },
        {
            year: "2013",
            event: "First R&D lab established",
            icon: FlaskConical,
            description: "Dedicated pharmaceutical research facility launched",
        },
        {
            year: "2016",
            event: "GMP manufacturing facility launched",
            icon: Shield,
            description: "WHO-GMP certified production facility operational",
        },
        {
            year: "2018",
            event: "Cosmetic division added",
            icon: Sparkles,
            description: "Expanded into dermatologically tested beauty products",
        },
        {
            year: "2021",
            event: "Export to 50+ countries",
            icon: Globe,
            description: "Global distribution network established",
        },
        {
            year: "2024",
            event: "500+ SKUs developed",
            icon: Award,
            description: "Comprehensive product portfolio across pharma & cosmetics",
        },
    ];

    // Team members
    const team = [
        {
            name: "Dr. Rajesh Kumar",
            role: "Chief Pharmacist",
            bio: "20+ years in pharmaceutical formulation development",
            image: "/team/pharmacist.jpg",
        },
        {
            name: "Dr. Priya Sharma",
            role: "Lead Dermatologist",
            bio: "Specialist in cosmetic dermatology and clinical testing",
            image: "/team/dermatologist.jpg",
        },
        {
            name: "Dr. Amit Patel",
            role: "Head of R&D",
            bio: "PhD in Chemistry, 15+ years in product innovation",
            image: "/team/scientist.jpg",
        },
        {
            name: "Dr. Sneha Reddy",
            role: "Quality Assurance Director",
            bio: "Expert in GMP compliance and quality control",
            image: "/team/qa.jpg",
        },
        {
            name: "Dr. Vikram Singh",
            role: "Microbiologist",
            bio: "Specialist in stability testing and microbial safety",
            image: "/team/microbiologist.jpg",
        },
        {
            name: "Dr. Kavita Nair",
            role: "Formulation Scientist",
            bio: "Expert in cosmetic chemistry and product development",
            image: "/team/formulation.jpg",
        },
    ];

    // Core values
    const values = [
        {
            icon: Shield,
            title: "Integrity",
            description: "Transparent, ethical practices in every batch",
            color: "from-[#FFF4E8]0 to-[#4B3A2F]",
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description: "R&D-led product development",
            color: "from-[#C4A580] to-[#FFF4E8]0",
        },
        {
            icon: Heart,
            title: "Safety",
            description: "Clinical testing & QC at every stage",
            color: "from-[#4B3A2F] to-[#3B2D25]",
        },
        {
            icon: Leaf,
            title: "Sustainability",
            description: "Eco-friendly processes & packaging",
            color: "from-[#FFF4E8]0 to-[#4B3A2F]",
        },
        {
            icon: Target,
            title: "Accountability",
            description: "Quality assurance with complete traceability",
            color: "from-[#C4A580] to-[#4B3A2F]",
        },
    ];

    // CSR initiatives
    const csrInitiatives = [
        {
            icon: Leaf,
            title: "Eco-Friendly Packaging",
            description: "Recyclable and biodegradable materials",
        },
        {
            icon: FlaskConical,
            title: "Green Chemistry",
            description: "Reducing harsh solvents in formulations",
        },
        {
            icon: Globe,
            title: "Water Conservation",
            description: "Water-saving manufacturing processes",
        },
        {
            icon: Users,
            title: "Community Health",
            description: "Outreach programs and health camps",
        },
        {
            icon: Sparkles,
            title: "Botanical Sourcing",
            description: "Partnerships with local farmers",
        },
        {
            icon: Award,
            title: "Ethical Manufacturing",
            description: "Fair trade and responsible practices",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Section 1: MISSION HERO */}
            <section
                className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF4E8] via-white to-[#F5D7B0]/20"
                onMouseMove={handleMouseMove}
            >
                {/* Parallax Background Elements */}
                <motion.div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                    <div className="absolute top-20 left-20 w-96 h-96 bg-[#C4A580]/40 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#D4B590]/40 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FFF4E8]0/30 rounded-full blur-3xl" />
                </motion.div>

                {/* Floating Molecules */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-[#C4A580]/30 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.6, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                className="inline-flex items-center bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-6 border-2 border-[#C4A580]/40"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <FlaskConical className="h-5 w-5 text-[#4B3A2F] mr-2" />
                                <span className="text-sm font-semibold text-gray-800">
                                    Science-Driven Excellence
                                </span>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight">
                                Our Mission:{" "}
                                <span className="bg-gradient-to-r from-[#FFF4E8]0 via-[#C4A580] to-[#4B3A2F] bg-clip-text text-transparent">
                                    Health + Beauty
                                </span>{" "}
                                through Science
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">
                                We develop safe, effective products that improve lives —
                                combining pharmaceutical rigor with cosmetic innovation.
                            </p>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                We believe that every formulation should meet global safety
                                benchmarks, deliver real results, and be accessible to people
                                everywhere.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-[#FFF4E8]0 to-[#4B3A2F] hover:from-[#4B3A2F] hover:to-[#3B2D25] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    Explore Our Products
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-[#FFF4E8]0 text-[#4B3A2F] hover:bg-[#FFF4E8] px-8 py-6 text-lg"
                                >
                                    <Download className="mr-2 h-5 w-5" />
                                    Company Brochure
                                </Button>
                            </div>
                        </motion.div>

                        {/* Image Content */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative aspect-square bg-gradient-to-br from-[#F5D7B0] to-[#FFF4E8] rounded-3xl overflow-hidden shadow-2xl">
                                {/* Placeholder for lab/product image */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <Microscope className="h-32 w-32 text-[#FFF4E8]0 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg">
                                            Laboratory Excellence
                                        </p>
                                    </div>
                                </div>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                            </div>

                            {/* Floating Stats */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-4xl font-bold text-[#FFF4E8]0 mb-1">
                                    500+
                                </div>
                                <div className="text-sm text-gray-600">
                                    Formulations Developed
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-4xl font-bold text-[#4B3A2F] mb-1">
                                    50+
                                </div>
                                <div className="text-sm text-gray-600">Countries Served</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 2: COMPANY STORY */}
            <section className="py-24 bg-gradient-to-b from-white to-[#FFF4E8]/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center bg-gradient-to-r from-[#F5D7B0] to-[#FFF4E8] rounded-full px-6 py-2 mb-6">
                            <Award className="h-5 w-5 text-[#4B3A2F] mr-2" />
                            <span className="text-sm font-semibold text-gray-800">
                                Our Journey
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
                            Where We Began
                        </h2>
                    </motion.div>

                    {/* Story Text */}
                    <motion.div
                        className="max-w-4xl mx-auto mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                            <p>
                                Founded in 2010, Liminara began as a small research-driven
                                laboratory with a single goal — to create formulations that
                                combine pharmaceutical precision with beauty innovation. Our
                                journey started with a team of passionate scientists who
                                believed that healthcare and cosmetics could coexist under the
                                same rigorous standards.
                            </p>
                            <p>
                                Over the years, our commitment to quality, safety, and
                                science-first development helped us expand into a WHO-GMP
                                certified manufacturing facility. We invested heavily in R&D,
                                building state-of-the-art laboratories and recruiting top talent
                                from pharmaceutical and cosmetic sciences.
                            </p>
                            <p>
                                Today, we supply global partners with clinically validated
                                pharmaceutical products and dermatologist-tested cosmetic
                                solutions, backed by rigorous R&D, stability testing, and
                                ethical sourcing. Our products reach over 50 countries, helping
                                millions of people achieve better health and enhanced beauty.
                            </p>
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Connection Line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#C4A580] via-[#FFF4E8]0 to-[#4B3A2F] opacity-30 hidden md:block" />

                        <div className="space-y-16">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    className="relative"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <div
                                        className={`flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                            } flex-col gap-8`}
                                    >
                                        {/* Content */}
                                        <div className="flex-1 md:px-8">
                                            <Card
                                                className={`p-8 hover-lift bg-white/80 backdrop-blur-sm border-2 border-[#F5D7B0] hover:border-[#C4A580] transition-all duration-300 ${index % 2 === 0 ? "md:text-right" : "md:text-left"
                                                    } text-center`}
                                            >
                                                <div
                                                    className={`inline-block bg-gradient-to-r from-[#FFF4E8]0 to-[#4B3A2F] rounded-xl px-6 py-2 mb-4`}
                                                >
                                                    <span className="text-2xl font-bold text-white">
                                                        {milestone.year}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                    {milestone.event}
                                                </h3>
                                                <p className="text-gray-600">{milestone.description}</p>
                                            </Card>
                                        </div>

                                        {/* Center Icon */}
                                        <div className="flex-shrink-0 relative z-10">
                                            <motion.div
                                                className="w-20 h-20 bg-gradient-to-br from-[#FFF4E8]0 to-[#4B3A2F] rounded-full flex items-center justify-center shadow-lg"
                                                whileHover={{ scale: 1.2, rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <milestone.icon className="h-10 w-10 text-white" />
                                            </motion.div>
                                        </div>

                                        {/* Spacer */}
                                        <div className="flex-1 hidden md:block" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: TEAM & VALUES */}
            < section className="py-24 bg-gradient-to-br from-liminara-charcoal via-gray-900 to-liminara-charcoal text-white relative overflow-hidden" >
                {/* Background Pattern */}
                < div className="absolute inset-0 opacity-5" >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                            backgroundSize: "40px 40px",
                        }}
                    />
                </div >

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center bg-gradient-to-r from-liminara-rose/20 to-liminara-rosegold/20 rounded-full px-6 py-2 mb-6 backdrop-blur-sm border border-liminara-rose/30">
                            <Users className="h-5 w-5 text-liminara-rose mr-2" />
                            <span className="text-sm font-semibold text-white">
                                Our Team
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-liminara-rose to-liminara-rosegold bg-clip-text text-transparent">
                            Experts in Pharma & Dermocosmetics
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Pharmacists, formulation scientists, dermatologists, chemists,
                            microbiologists, and QA specialists — all committed to ethical
                            manufacturing and scientifically validated products.
                        </p>
                    </motion.div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                className="group relative"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                onHoverStart={() => setActiveTeamMember(index)}
                                onHoverEnd={() => setActiveTeamMember(null)}
                            >
                                <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-liminara-rose/50 transition-all duration-300 overflow-hidden">
                                    {/* Image Placeholder */}
                                    <div className="aspect-square bg-gradient-to-br from-liminara-rose/20 to-liminara-rosegold/20 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Users className="h-24 w-24 text-white/50" />
                                        </div>
                                        {/* Hover Overlay */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-t from-liminara-charcoal via-liminara-charcoal/80 to-transparent flex items-end p-6"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: activeTeamMember === index ? 1 : 0,
                                                y: activeTeamMember === index ? 0 : 20,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p className="text-white text-sm">{member.bio}</p>
                                        </motion.div>
                                        {/* Zoom Effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-liminara-rose/10"
                                            initial={{ scale: 1 }}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-6 text-center">
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {member.name}
                                        </h3>
                                        <p className="text-liminara-rose font-semibold">
                                            {member.role}
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Values */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl md:text-4xl font-display font-bold mb-12">
                            Our Core Values
                        </h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className="group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 text-center bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover-lift h-full">
                                    <motion.div
                                        className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <value.icon className="h-8 w-8 text-white" />
                                    </motion.div>
                                    <h4 className="text-lg font-bold text-white mb-2">
                                        {value.title}
                                    </h4>
                                    <p className="text-sm text-gray-400">{value.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Section 4: IMPACT & CSR */}
            
        </div >
    );
}
