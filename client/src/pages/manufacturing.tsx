import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FlaskConical,
    Microscope,
    Factory,
    Shield,
    Globe,
    Beaker,
    CheckCircle2,
    ArrowRight,
    Lightbulb,
    TrendingUp,
} from "lucide-react";

export default function ManufacturingPage() {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        formulationType: "",
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Custom Formulation Request:", formData);
        // Handle form submission
    };

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Section 1: R&D Lab Overview */}
            <section className="py-16 bg-gradient-to-br from-[#FFF4E8] via-white to-[#FFF4E8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="p-4 bg-purple-100 rounded-2xl">
                                <FlaskConical className="h-12 w-12 text-purple-600" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display font-bold text-liminara-charcoal mb-6">
                            Manufacturing & R&D Excellence
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            State-of-the-art facilities for pharmaceutical and cosmetic
                            innovation
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FlaskConical,
                                title: "Clinical Formulation",
                                description:
                                    "Advanced R&D lab with cutting-edge formulation capabilities",
                                features: [
                                    "Pharmaceutical development",
                                    "Cosmetic formulation",
                                    "Nutraceutical research",
                                    "Novel delivery systems",
                                ],
                            },
                            {
                                icon: Microscope,
                                title: "Stability Chambers",
                                description:
                                    "Controlled environment testing for product shelf life",
                                features: [
                                    "Accelerated stability",
                                    "Long-term studies",
                                    "Photostability testing",
                                    "Temperature cycling",
                                ],
                            },
                            {
                                icon: Beaker,
                                title: "Microbial Testing",
                                description: "Comprehensive microbiological analysis and safety",
                                features: [
                                    "Sterility testing",
                                    "Bioburden analysis",
                                    "Preservative efficacy",
                                    "Endotoxin testing",
                                ],
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 hover-lift h-full">
                                    <div className="inline-flex p-4 bg-purple-100 rounded-2xl mb-4">
                                        <item.icon className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-liminara-charcoal mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">{item.description}</p>
                                    <ul className="space-y-2">
                                        {item.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: Process Flow */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-4">
                            Our Manufacturing Process
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            From concept to delivery — a seamless, quality-driven workflow
                        </p>
                    </motion.div>

                    {/* Process Steps */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-purple-200 -translate-y-1/2 hidden lg:block" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative">
                            {[
                                {
                                    icon: Microscope,
                                    title: "Sourcing",
                                    description: "Premium raw materials from certified suppliers",
                                },
                                {
                                    icon: FlaskConical,
                                    title: "Formulation",
                                    description: "R&D team develops optimal formulas",
                                },
                                {
                                    icon: Beaker,
                                    title: "Pilot Batch",
                                    description: "Small-scale testing and validation",
                                },
                                {
                                    icon: Factory,
                                    title: "Scale-Up",
                                    description: "Full-scale GMP production",
                                },
                                {
                                    icon: Shield,
                                    title: "QA Testing",
                                    description: "Comprehensive quality checks",
                                },
                                {
                                    icon: Globe,
                                    title: "Packaging",
                                    description: "Final packaging and distribution",
                                },
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <div className="relative z-10 mb-4">
                                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <step.icon className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto -mt-2 mb-3">
                                            <span className="text-sm font-bold text-purple-600">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-liminara-charcoal mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Innovation Cases */}
            <section className="py-24 bg-gradient-to-b from-liminara-cream/30 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-4">
                            Innovation Case Studies
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Breakthrough formulations and patented technologies
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Lightbulb,
                                title: "Nano-Encapsulation Technology",
                                category: "Cosmetics",
                                description:
                                    "Developed proprietary nano-encapsulation for enhanced vitamin C stability and penetration",
                                results: [
                                    "300% improved stability",
                                    "2x better skin absorption",
                                    "Patent pending",
                                ],
                            },
                            {
                                icon: TrendingUp,
                                title: "Extended-Release Formulation",
                                category: "Pharmaceuticals",
                                description:
                                    "Novel matrix system for 24-hour sustained release of active ingredients",
                                results: [
                                    "Once-daily dosing",
                                    "Improved compliance",
                                    "Reduced side effects",
                                ],
                            },
                            {
                                icon: Beaker,
                                title: "Probiotic Stability Solution",
                                category: "Nutraceuticals",
                                description:
                                    "Breakthrough stabilization technology for live probiotic cultures",
                                results: [
                                    "18-month shelf life",
                                    "No refrigeration needed",
                                    "10B CFU guaranteed",
                                ],
                            },
                        ].map((caseStudy, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-8 hover-lift h-full border-2 border-purple-100">
                                    <div className="inline-flex p-4 bg-purple-100 rounded-2xl mb-4">
                                        <caseStudy.icon className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="mb-3">
                                        <span className="text-sm font-medium text-purple-600">
                                            {caseStudy.category}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-liminara-charcoal mb-3">
                                        {caseStudy.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        {caseStudy.description}
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-liminara-charcoal">
                                            Key Results:
                                        </p>
                                        {caseStudy.results.map((result, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">{result}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Request Custom Formulation */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-4">
                            Request Custom Formulation
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Let our R&D team bring your product vision to life
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-8 shadow-rose">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Your Name *
                                        </label>
                                        <Input
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Company Name *
                                        </label>
                                        <Input
                                            required
                                            placeholder="Your Company"
                                            value={formData.company}
                                            onChange={(e) => handleChange("company", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Email *
                                        </label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="john@company.com"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Phone *
                                        </label>
                                        <Input
                                            required
                                            type="tel"
                                            placeholder="+91 70830 96332"
                                            value={formData.phone}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Formulation Type *
                                    </label>
                                    <Select
                                        value={formData.formulationType}
                                        onValueChange={(value) =>
                                            handleChange("formulationType", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select formulation type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pharmaceutical">
                                                Pharmaceutical
                                            </SelectItem>
                                            <SelectItem value="cosmetic">Cosmetic</SelectItem>
                                            <SelectItem value="nutraceutical">Nutraceutical</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Project Description *
                                    </label>
                                    <Textarea
                                        required
                                        placeholder="Describe your formulation requirements, target market, desired features, regulatory needs, etc."
                                        rows={6}
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
                                >
                                    <FlaskConical className="mr-2 h-5 w-5" />
                                    Submit Formulation Request
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>

                                <p className="text-sm text-muted-foreground text-center">
                                    Our R&D team will review your request and contact you within 48
                                    hours to discuss feasibility and next steps.
                                </p>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
