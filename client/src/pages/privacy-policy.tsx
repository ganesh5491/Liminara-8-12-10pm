import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Cookie, Database, Mail, FileText } from "lucide-react";

export default function PrivacyPolicy() {
    const sections = [
        {
            icon: Database,
            title: "Information We Collect",
            content: [
                "Personal identification information (Name, email address, phone number, etc.)",
                "Shipping and billing addresses",
                "Payment information (processed securely through third-party payment processors)",
                "Order history and preferences",
                "Device and browser information",
                "IP address and location data",
                "Cookies and similar tracking technologies",
            ],
        },
        {
            icon: Lock,
            title: "How We Use Your Information",
            content: [
                "Process and fulfill your orders",
                "Communicate with you about your orders and account",
                "Send promotional emails and marketing communications (with your consent)",
                "Improve our website and services",
                "Prevent fraud and enhance security",
                "Comply with legal obligations",
                "Analyze usage patterns and trends",
            ],
        },
        {
            icon: Shield,
            title: "Data Protection & Security",
            content: [
                "We implement industry-standard security measures to protect your data",
                "SSL encryption for all data transmission",
                "Secure payment processing through PCI-DSS compliant providers",
                "Regular security audits and updates",
                "Access controls and authentication protocols",
                "Data backup and disaster recovery procedures",
                "Employee training on data protection",
            ],
        },
        {
            icon: Cookie,
            title: "Cookies & Tracking",
            content: [
                "Essential cookies for website functionality",
                "Analytics cookies to understand user behavior",
                "Marketing cookies for personalized advertising",
                "You can control cookie preferences through your browser settings",
                "Third-party cookies from analytics and advertising partners",
                "Session cookies that expire when you close your browser",
                "Persistent cookies that remain on your device",
            ],
        },
        {
            icon: FileText,
            title: "Your Rights",
            content: [
                "Access your personal data",
                "Request correction of inaccurate data",
                "Request deletion of your data (subject to legal requirements)",
                "Object to processing of your data",
                "Request data portability",
                "Withdraw consent for marketing communications",
                "Lodge a complaint with data protection authorities",
            ],
        },
        {
            icon: Mail,
            title: "Contact Us",
            content: [
                "If you have questions about this Privacy Policy, please contact us:",
                "Email: privacy@liminara.com",
                "Phone: +91 70830 96332",
                "Address: Liminara House, 123 Pharma Plaza, Mumbai, Maharashtra 400001, India",
                "Data Protection Officer: dpo@liminara.com",
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
                    <div className="inline-flex items-center bg-gradient-to-r from-liminara-rose/10 to-liminara-rosegold/10 rounded-full px-6 py-3 mb-6">
                        <Shield className="h-5 w-5 text-liminara-rose mr-2" />
                        <span className="text-sm font-semibold text-liminara-charcoal">
                            Your Privacy Matters
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-liminara-charcoal mb-6">
                        Privacy Policy
                    </h1>

                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
                        At Liminara, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
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
                            <Card className="p-8 hover-lift bg-white/80 backdrop-blur-sm border-2 border-liminara-mint/30">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-liminara-rose to-liminara-rosegold rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <section.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-liminara-charcoal mb-4">
                                            {section.title}
                                        </h2>
                                        <ul className="space-y-3">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                                    <span className="text-liminara-rose mt-1.5">•</span>
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

                {/* Footer Note */}
                <motion.div
                    className="mt-16 p-8 bg-gradient-to-br from-liminara-cream to-liminara-mint/20 rounded-2xl border-2 border-liminara-mint/30"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-xl font-bold text-liminara-charcoal mb-4">
                        Changes to This Policy
                    </h3>
                    <p className="text-gray-700 mb-4">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                    <p className="text-gray-700">
                        Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
