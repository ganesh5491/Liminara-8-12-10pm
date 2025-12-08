import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FileText, ShoppingCart, Package, RefreshCw, Shield, AlertTriangle, Scale, Globe } from "lucide-react";

export default function TermsConditions() {
    const sections = [
        {
            icon: FileText,
            title: "Acceptance of Terms",
            content: [
                "By accessing and using Liminara's website and services, you accept and agree to be bound by these Terms and Conditions.",
                "If you do not agree to these terms, please do not use our services.",
                "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.",
                "These terms apply to all visitors, users, and customers of our services.",
            ],
        },
        {
            icon: ShoppingCart,
            title: "Product Information & Pricing",
            content: [
                "We strive to provide accurate product descriptions, images, and pricing information.",
                "All prices are listed in Indian Rupees (INR) and are subject to change without notice.",
                "We reserve the right to correct pricing errors and cancel orders placed with incorrect pricing.",
                "Product availability is subject to stock levels and may change without notice.",
                "Pharmaceutical products require valid prescriptions where applicable.",
                "Cosmetic products are for external use only unless otherwise specified.",
            ],
        },
        {
            icon: Package,
            title: "Orders & Payment",
            content: [
                "All orders are subject to acceptance and availability.",
                "We accept payment via credit/debit cards, UPI, net banking, and cash on delivery (where available).",
                "Payment must be received before order processing and shipment.",
                "We reserve the right to refuse or cancel any order for any reason.",
                "Order confirmation will be sent via email after successful payment.",
                "Bulk orders and B2B purchases may have different terms and pricing.",
            ],
        },
        {
            icon: RefreshCw,
            title: "Returns & Refunds",
            content: [
                "Pharmaceutical products: Returns accepted within 7 days if unopened and in original packaging.",
                "Cosmetic products: Returns accepted within 14 days if unopened and unused.",
                "Damaged or defective products: Full refund or replacement within 30 days.",
                "Prescription medications cannot be returned once opened for safety reasons.",
                "Refunds will be processed within 7-10 business days to the original payment method.",
                "Return shipping costs may apply unless the product is defective.",
                "Custom or personalized orders are non-returnable.",
            ],
        },
        {
            icon: Shield,
            title: "Product Safety & Liability",
            content: [
                "All pharmaceutical products are manufactured under WHO-GMP standards.",
                "Cosmetic products are dermatologically tested and comply with safety regulations.",
                "Users must read product labels, warnings, and instructions before use.",
                "Discontinue use and consult a healthcare professional if adverse reactions occur.",
                "We are not liable for misuse, allergic reactions, or improper storage of products.",
                "Keep all products out of reach of children.",
                "Do not use products past their expiration date.",
            ],
        },
        {
            icon: AlertTriangle,
            title: "Disclaimers & Limitations",
            content: [
                "Products are provided 'as is' without warranties of any kind, express or implied.",
                "We do not guarantee specific results from product use.",
                "Individual results may vary based on skin type, health conditions, and usage.",
                "Consult healthcare professionals before using pharmaceutical products.",
                "We are not liable for indirect, incidental, or consequential damages.",
                "Our total liability is limited to the purchase price of the product.",
                "Some jurisdictions do not allow limitation of liability, so these may not apply to you.",
            ],
        },
        {
            icon: Scale,
            title: "Intellectual Property",
            content: [
                "All content, trademarks, logos, and intellectual property belong to Liminara.",
                "You may not reproduce, distribute, or modify our content without written permission.",
                "Product formulations and manufacturing processes are proprietary.",
                "Unauthorized use of our intellectual property may result in legal action.",
                "Customer reviews and testimonials may be used for marketing purposes.",
            ],
        },
        {
            icon: Globe,
            title: "Governing Law & Jurisdiction",
            content: [
                "These terms are governed by the laws of India.",
                "Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.",
                "We comply with Indian pharmaceutical and cosmetic regulations.",
                "International orders are subject to customs duties and import regulations of the destination country.",
                "Export of certain pharmaceutical products may be restricted by law.",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-background py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center bg-gradient-to-r from-[#F5D7B0] to-[#FFF4E8] rounded-full px-6 py-3 mb-6 border-2 border-[#E3C7A0]">
                        <Scale className="h-5 w-5 text-[#4B3A2F] mr-2" />
                        <span className="text-sm font-semibold text-[#3B2D25]">
                            Legal Terms
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-liminara-charcoal mb-6">
                        Terms & Conditions
                    </h1>

                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
                        Please read these Terms and Conditions carefully before using our services. These terms govern your use of Liminara's website, products, and services.
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="p-8 hover-lift bg-white/80 backdrop-blur-sm border-2 border-[#E3C7A0] hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#4B3A2F] to-[#5C4A3A] rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <section.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-liminara-charcoal mb-4">
                                            {section.title}
                                        </h2>
                                        <ul className="space-y-3">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                                    <span className="text-[#4B3A2F] mt-1.5">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Section */}
                <motion.div
                    className="mt-16 p-8 bg-gradient-to-br from-[#FFF4E8] to-white rounded-2xl border-2 border-[#E3C7A0]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-xl font-bold text-liminara-charcoal mb-4">
                        Questions About These Terms?
                    </h3>
                    <p className="text-gray-700 mb-4">
                        If you have any questions or concerns about these Terms and Conditions, please contact us:
                    </p>
                    <div className="space-y-2 text-gray-700">
                        <p>📧 Email: legal@liminara.com</p>
                        <p>📞 Phone: +91 70830 96332</p>
                        <p>📍 Address: Liminara House, 123 Pharma Plaza, Mumbai, Maharashtra 400001, India</p>
                    </div>
                </motion.div>

                {/* Acknowledgment */}
                <motion.div
                    className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-yellow-900 mb-2">Important Notice</h4>
                            <p className="text-yellow-800 text-sm">
                                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of our services immediately.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
