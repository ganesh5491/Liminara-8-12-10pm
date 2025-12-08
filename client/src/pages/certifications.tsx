import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Shield,
    FileText,
    Download,
    CheckCircle2,
    Search,
    TestTube,
} from "lucide-react";

export default function CertificationsPage() {
    const [batchNumber, setBatchNumber] = useState("");

    const certifications = [
        {
            name: "ISO 9001:2015",
            category: "Quality Management",
            issuer: "International Organization for Standardization",
            validUntil: "December 2025",
            description: "Quality management system certification",
            logo: Award,
        },
        {
            name: "WHO-GMP",
            category: "Manufacturing",
            issuer: "World Health Organization",
            validUntil: "March 2026",
            description: "Good Manufacturing Practice certification",
            logo: Shield,
        },
        {
            name: "FDA Compliance",
            category: "Regulatory",
            issuer: "Food and Drug Administration",
            validUntil: "Ongoing",
            description: "FDA-compliant manufacturing facility",
            logo: Award,
        },
        {
            name: "ISO 22716",
            category: "Cosmetics GMP",
            issuer: "International Organization for Standardization",
            validUntil: "June 2025",
            description: "Cosmetics Good Manufacturing Practice",
            logo: Shield,
        },
        {
            name: "Cruelty-Free Certified",
            category: "Ethics",
            issuer: "PETA",
            validUntil: "Ongoing",
            description: "No animal testing certification",
            logo: Award,
        },
        {
            name: "Organic Certification",
            category: "Ingredients",
            issuer: "USDA Organic",
            validUntil: "September 2025",
            description: "Organic ingredient sourcing certification",
            logo: Shield,
        },
    ];

    const handleCOARequest = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("COA Request for batch:", batchNumber);
        // Handle COA request
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Section 1: Certifications Gallery */}
            <section className="py-16 bg-gradient-to-br from-green-50 via-white to-[#FFF4E8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="p-4 bg-green-100 rounded-2xl">
                                <Award className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display font-bold text-liminara-charcoal mb-6">
                            Certifications & Quality Assurance
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Global certifications and clinical standards you can trust
                        </p>
                    </motion.div>

                    {/* Certifications Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certifications.map((cert, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 hover-lift h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-green-100 rounded-xl">
                                            <cert.logo className="h-8 w-8 text-green-600" />
                                        </div>
                                        <Badge className="bg-green-100 text-green-700">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Active
                                        </Badge>
                                    </div>
                                    <h3 className="text-xl font-bold text-liminara-charcoal mb-2">
                                        {cert.name}
                                    </h3>
                                    <Badge variant="outline" className="mb-3">
                                        {cert.category}
                                    </Badge>
                                    <p className="text-muted-foreground mb-4">{cert.description}</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Issuer:</span>
                                            <span className="font-medium">{cert.issuer}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Valid Until:</span>
                                            <span className="font-medium">{cert.validUntil}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4 border-green-600 text-green-700 hover:bg-green-50"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Certificate
                                    </Button>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: Batch Testing & COA Request */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-4">
                            Batch Testing & COA Request
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Request Certificate of Analysis for any batch number
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-8 shadow-rose">
                            <form onSubmit={handleCOARequest} className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Enter Batch Number
                                    </label>
                                    <div className="flex gap-4">
                                        <Input
                                            required
                                            placeholder="e.g., LIM-2024-001234"
                                            value={batchNumber}
                                            onChange={(e) => setBatchNumber(e.target.value)}
                                            className="flex-1 text-lg py-6"
                                        />
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="bg-green-600 hover:bg-green-700 px-8"
                                        >
                                            <Search className="mr-2 h-5 w-5" />
                                            Search
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Batch number can be found on the product packaging
                                    </p>
                                </div>

                                <div className="bg-blue-50 border-l-4 border-[#4B3A2F] p-6 rounded">
                                    <h3 className="font-semibold text-lg mb-2">
                                        What's included in COA?
                                    </h3>
                                    <ul className="space-y-2">
                                        {[
                                            "Complete batch testing results",
                                            "Microbial analysis",
                                            "Stability data",
                                            "Heavy metal testing",
                                            "Purity and potency verification",
                                            "Manufacturing date and expiry",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-[#4B3A2F] mt-0.5 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-center">
                                    <Button variant="outline" size="lg">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Request Sample COA
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Section 3: Quality Management System */}
            <section className="py-24 bg-gradient-to-b from-liminara-cream/30 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-4">
                            Quality Management System
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Our comprehensive approach to quality assurance
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: TestTube,
                                title: "QA Workflows",
                                description:
                                    "Multi-stage quality checks at every production phase",
                                points: [
                                    "Raw material testing",
                                    "In-process quality control",
                                    "Final product verification",
                                    "Packaging inspection",
                                ],
                            },
                            {
                                icon: Shield,
                                title: "GMP Manufacturing",
                                description:
                                    "WHO-GMP certified facilities with strict protocols",
                                points: [
                                    "Cleanroom environments",
                                    "Validated equipment",
                                    "Trained personnel",
                                    "Standard operating procedures",
                                ],
                            },
                            {
                                icon: FileText,
                                title: "Stability Labs",
                                description: "Advanced testing for product shelf life and safety",
                                points: [
                                    "Accelerated stability testing",
                                    "Real-time stability studies",
                                    "Photostability testing",
                                    "Temperature cycling",
                                ],
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-8 hover-lift h-full">
                                    <div className="inline-flex p-4 bg-green-100 rounded-2xl mb-6">
                                        <item.icon className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-liminara-charcoal mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">{item.description}</p>
                                    <ul className="space-y-2">
                                        {item.points.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <motion.div
                        className="mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-8 bg-gradient-to-br from-green-50 to-[#FFF4E8] border-2 border-green-100">
                            <div className="text-center">
                                <h3 className="text-3xl font-bold text-liminara-charcoal mb-4">
                                    Committed to Excellence
                                </h3>
                                <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                                    Our quality management system ensures every product meets the
                                    highest international standards. We conduct over 50 quality
                                    checks per batch and maintain complete traceability from raw
                                    materials to finished products.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                        <Download className="mr-2 h-5 w-5" />
                                        Download Quality Policy
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-green-600 text-green-700"
                                    >
                                        <FileText className="mr-2 h-5 w-5" />
                                        View Testing Procedures
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
