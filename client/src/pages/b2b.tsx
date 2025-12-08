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
    Building2,
    Package,
    Clock,
    Globe,
    CheckCircle2,
    ArrowRight,
    FileText,
    Truck,
    Factory,
    Users,
} from "lucide-react";

export default function B2BPage() {
    const [formData, setFormData] = useState({
        company: "",
        gst: "",
        contactName: "",
        email: "",
        phone: "",
        product: "",
        quantity: "",
        timeline: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("B2B Quote Request:", formData);
        // Handle form submission
    };

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Section 1: Enterprise Hero */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF4E8] via-white to-[#FFF4E8]">
                <motion.div
                    className="absolute inset-0 opacity-10"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <div className="absolute top-20 left-20 w-64 h-64 bg-[#4B3A2F]/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
                </motion.div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="p-4 bg-blue-100 rounded-2xl">
                                <Building2 className="h-12 w-12 text-[#4B3A2F]" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-liminara-charcoal mb-6">
                            Private Label, Custom Formulations,{" "}
                            <span className="text-[#4B3A2F]">Contract Manufacturing</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            Partner with Liminara for scalable pharmaceutical and cosmetic
                            manufacturing solutions
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-2 text-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <span>GMP Certified</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <span>Global Export</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <span>Custom Formulations</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Quote Form */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-4">
                            Request a Quote
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Fill out the form below and our B2B team will contact you within 24
                            hours
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
                                {/* Company Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-liminara-charcoal">
                                        Company Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Company Name *
                                            </label>
                                            <Input
                                                required
                                                placeholder="Your Company Pvt Ltd"
                                                value={formData.company}
                                                onChange={(e) => handleChange("company", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                GST Number *
                                            </label>
                                            <Input
                                                required
                                                placeholder="22AAAAA0000A1Z5"
                                                value={formData.gst}
                                                onChange={(e) => handleChange("gst", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-liminara-charcoal">
                                        Contact Information
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Contact Name *
                                            </label>
                                            <Input
                                                required
                                                placeholder="John Doe"
                                                value={formData.contactName}
                                                onChange={(e) =>
                                                    handleChange("contactName", e.target.value)
                                                }
                                            />
                                        </div>
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
                                </div>

                                {/* Order Details */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-liminara-charcoal">
                                        Order Requirements
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Product Type *
                                            </label>
                                            <Select
                                                value={formData.product}
                                                onValueChange={(value) => handleChange("product", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select product type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pharma-tablets">
                                                        Pharmaceutical - Tablets
                                                    </SelectItem>
                                                    <SelectItem value="pharma-capsules">
                                                        Pharmaceutical - Capsules
                                                    </SelectItem>
                                                    <SelectItem value="pharma-syrups">
                                                        Pharmaceutical - Syrups
                                                    </SelectItem>
                                                    <SelectItem value="cosmetics-face">
                                                        Cosmetics - Face Care
                                                    </SelectItem>
                                                    <SelectItem value="cosmetics-hair">
                                                        Cosmetics - Hair Care
                                                    </SelectItem>
                                                    <SelectItem value="cosmetics-serums">
                                                        Cosmetics - Serums
                                                    </SelectItem>
                                                    <SelectItem value="custom">
                                                        Custom Formulation
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Estimated Quantity *
                                            </label>
                                            <Input
                                                required
                                                placeholder="e.g., 10,000 units"
                                                value={formData.quantity}
                                                onChange={(e) => handleChange("quantity", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Required Timeline *
                                        </label>
                                        <Select
                                            value={formData.timeline}
                                            onValueChange={(value) => handleChange("timeline", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select timeline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                                                <SelectItem value="1month">1 Month</SelectItem>
                                                <SelectItem value="2-3months">2-3 Months</SelectItem>
                                                <SelectItem value="3+months">3+ Months</SelectItem>
                                                <SelectItem value="flexible">Flexible</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Additional Requirements / Message
                                    </label>
                                    <Textarea
                                        placeholder="Tell us about your specific requirements, formulation needs, packaging preferences, etc."
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => handleChange("message", e.target.value)}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-[#4B3A2F] hover:bg-[#3B2D25] text-white text-lg py-6"
                                >
                                    <FileText className="mr-2 h-5 w-5" />
                                    Submit Quote Request
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>

                                <p className="text-sm text-muted-foreground text-center">
                                    By submitting this form, you agree to our terms and conditions.
                                    We'll contact you within 24 business hours.
                                </p>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Section 3: Why Partner */}
            <section className="py-24 bg-gradient-to-b from-liminara-cream/30 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-4">
                            Why Partner with Liminara
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Package,
                                title: "Flexible MOQ",
                                description: "Minimum order quantities starting from 5,000 units",
                                details: "Scalable from small batches to large-scale production",
                            },
                            {
                                icon: Clock,
                                title: "Fast Lead Times",
                                description: "Standard delivery in 4-6 weeks",
                                details: "Rush orders available with 2-week turnaround",
                            },
                            {
                                icon: Factory,
                                title: "Contract Terms",
                                description: "Flexible agreements tailored to your needs",
                                details: "Long-term partnerships with volume discounts",
                            },
                            {
                                icon: Globe,
                                title: "Export Capability",
                                description: "Global shipping to 50+ countries",
                                details: "Full regulatory support and documentation",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 hover-lift h-full">
                                    <div className="inline-flex p-4 bg-blue-100 rounded-2xl mb-4">
                                        <item.icon className="h-8 w-8 text-[#4B3A2F]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-liminara-charcoal mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-2">{item.description}</p>
                                    <p className="text-sm text-muted-foreground">{item.details}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Benefits */}
                    <motion.div
                        className="mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-8 bg-gradient-to-br from-[#FFF4E8] to-[#FFF4E8] border-2 border-[#E3C7A0]">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-liminara-charcoal mb-4">
                                        Private Label Services
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Custom branding and packaging design",
                                            "Your logo and brand identity",
                                            "Multiple packaging options",
                                            "Regulatory compliance support",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-[#4B3A2F] mt-0.5 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-liminara-charcoal mb-4">
                                        Custom Formulation
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            "R&D team for new product development",
                                            "Stability testing and validation",
                                            "Clinical trial support",
                                            "Patent and IP protection assistance",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-lg text-muted-foreground mb-6">
                            Have questions? Our B2B team is here to help
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" variant="outline" className="border-[#4B3A2F] text-[#4B3A2F]">
                                <Users className="mr-2 h-5 w-5" />
                                Schedule a Call
                            </Button>
                            <Button size="lg" variant="outline" className="border-[#4B3A2F] text-[#4B3A2F]">
                                <Truck className="mr-2 h-5 w-5" />
                                View Sample Products
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
