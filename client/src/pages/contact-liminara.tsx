import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    Upload,
    MessageSquare,
    Building2,
    Factory,
    FlaskConical,
    Users,
    CheckCircle2,
} from "lucide-react";

export default function ContactLiminara() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "sales",
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setAttachments([...attachments, ...files]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        toast.loading("Sending your message...");

        // Simulate API call
        setTimeout(() => {
            toast.dismiss();
            toast.success("Message sent successfully! We'll get back to you within 24 hours.", {
                duration: 4000,
                icon: "✅",
            });
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
                inquiryType: "sales",
            });
            setAttachments([]);
            setIsSubmitting(false);
        }, 2000);
    };

    const contactMethods = [
        {
            icon: Phone,
            title: "Phone",
            value: "+91 70830 96332",
            link: "tel:+919876543210",
            color: "from-[#4B3A2F] to-[#5C4A3A]",
        },
        {
            icon: Mail,
            title: "Email",
            value: "info@liminara.com",
            link: "mailto:info@liminara.com",
            color: "from-liminara-rose to-liminara-rosegold",
        },
        {
            icon: MessageSquare,
            title: "WhatsApp",
            value: "+91 70830 96332",
            link: "https://wa.me/919876543210",
            color: "from-green-500 to-green-600",
        },
    ];

    const offices = [
        {
            type: "Headquarters",
            icon: Building2,
            address: "Liminara House, 123 Pharma Plaza",
            city: "Mumbai, Maharashtra 400001",
            country: "India",
            color: "from-liminara-rose to-liminara-rosegold",
        },
        {
            type: "Manufacturing Plant",
            icon: Factory,
            address: "Plot No. 45, Industrial Area Phase-II",
            city: "Baddi, Himachal Pradesh 173205",
            country: "India",
            color: "from-[#4B3A2F] to-[#5C4A3A]",
        },
        {
            type: "R&D Center",
            icon: FlaskConical,
            address: "Tech Park, Building 7, Floor 3",
            city: "Bangalore, Karnataka 560100",
            country: "India",
            color: "from-[#FFF4E8]0 to-purple-600",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-center" />

            {/* Section 1: Contact Hero */}
            <section className="relative py-24 bg-gradient-to-br from-liminara-cream via-white to-liminara-mint/20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-liminara-rose/40 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-liminara-sage/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-6 border-2 border-liminara-rose/40">
                            <MessageSquare className="h-5 w-5 text-liminara-rose mr-2" />
                            <span className="text-sm font-semibold text-liminara-charcoal">
                                Get in Touch
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-liminara-charcoal mb-6 leading-tight">
                            Let's Talk —{" "}
                            <span className="bg-gradient-to-r from-liminara-rose via-liminara-rosegold to-liminara-rose bg-clip-text text-transparent">
                                Sales • Manufacturing • R&D
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12">
                            Whether you're looking for product information, partnership opportunities,
                            or technical support — we're here to help.
                        </p>

                        {/* Contact Methods */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {contactMethods.map((method, index) => (
                                <motion.a
                                    key={index}
                                    href={method.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card className="p-6 hover-lift bg-white/80 backdrop-blur-sm border-2 border-liminara-mint/30 hover:border-liminara-rose/50 transition-all duration-300">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <method.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-liminara-charcoal mb-2">
                                            {method.title}
                                        </h3>
                                        <p className="text-gray-600 group-hover:text-liminara-rose transition-colors">
                                            {method.value}
                                        </p>
                                    </Card>
                                </motion.a>
                            ))}
                        </div>

                        {/* Business Hours */}
                        <motion.div
                            className="mt-12 inline-flex items-center bg-white/60 backdrop-blur-md rounded-2xl px-8 py-4 border border-liminara-mint/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Clock className="h-6 w-6 text-liminara-rose mr-3" />
                            <div className="text-left">
                                <div className="text-sm font-semibold text-liminara-charcoal">
                                    Business Hours
                                </div>
                                <div className="text-sm text-gray-600">
                                    Monday - Saturday: 9:00 AM - 6:00 PM IST
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Office Locations & Map */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center bg-gradient-to-r from-liminara-rose/10 to-liminara-rosegold/10 rounded-full px-6 py-2 mb-6">
                            <MapPin className="h-5 w-5 text-liminara-rose mr-2" />
                            <span className="text-sm font-semibold text-liminara-charcoal">
                                Our Locations
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-liminara-charcoal mb-6">
                            Visit Our Facilities
                        </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            We operate state-of-the-art facilities across India
                        </p>
                    </motion.div>

                    {/* Office Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {offices.map((office, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-8 hover-lift bg-gradient-to-br from-white to-liminara-cream/20 border-2 border-liminara-mint/30 hover:border-liminara-rose/50 transition-all duration-300 h-full">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${office.color} rounded-2xl mb-6 flex items-center justify-center`}>
                                        <office.icon className="h-10 w-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-liminara-charcoal mb-4">
                                        {office.type}
                                    </h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p className="flex items-start gap-2">
                                            <MapPin className="h-5 w-5 text-liminara-rose mt-0.5 flex-shrink-0" />
                                            <span>{office.address}</span>
                                        </p>
                                        <p className="ml-7">{office.city}</p>
                                        <p className="ml-7 font-semibold">{office.country}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Google Map Embed */}
                    <motion.div
                        className="rounded-3xl overflow-hidden shadow-2xl border-4 border-liminara-mint/30"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="aspect-video bg-gradient-to-br from-liminara-cream to-liminara-mint/20 flex items-center justify-center">
                            {/* Placeholder for Google Maps */}
                            <div className="text-center">
                                <MapPin className="h-24 w-24 text-liminara-rose mx-auto mb-4" />
                                <p className="text-gray-600 text-lg">
                                    Google Maps Integration
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Embed your Google Maps iframe here
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section 3: Support & Inquiry Form */}
            <section className="py-24 bg-gradient-to-b from-white to-liminara-cream/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center bg-gradient-to-r from-liminara-rose/10 to-liminara-rosegold/10 rounded-full px-6 py-2 mb-6">
                            <Send className="h-5 w-5 text-liminara-rose mr-2" />
                            <span className="text-sm font-semibold text-liminara-charcoal">
                                Send Us a Message
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-liminara-charcoal mb-6">
                            Get in Touch
                        </h2>
                        <p className="text-xl text-gray-700">
                            Fill out the form below and we'll respond within 24 hours
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-sm shadow-2xl border-2 border-liminara-mint/30">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Inquiry Type */}
                                <div>
                                    <Label htmlFor="inquiryType" className="text-base font-semibold mb-3 block">
                                        Inquiry Type *
                                    </Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {["sales", "manufacturing", "r&d"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, inquiryType: type })}
                                                className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.inquiryType === type
                                                    ? "border-liminara-rose bg-liminara-rose/10 text-liminara-rose"
                                                    : "border-gray-200 hover:border-liminara-rose/50"
                                                    }`}
                                            >
                                                <div className="font-semibold capitalize">{type}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name & Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name" className="text-base font-semibold mb-2 block">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="text-base py-6 border-2 focus:border-liminara-rose transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="text-base font-semibold mb-2 block">
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="text-base py-6 border-2 focus:border-liminara-rose transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone & Subject */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="phone" className="text-base font-semibold mb-2 block">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 70830 96332"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="text-base py-6 border-2 focus:border-liminara-rose transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="subject" className="text-base font-semibold mb-2 block">
                                            Subject *
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            placeholder="Product inquiry"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="text-base py-6 border-2 focus:border-liminara-rose transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <Label htmlFor="message" className="text-base font-semibold mb-2 block">
                                        Message *
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us about your requirements..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="text-base min-h-[150px] border-2 focus:border-liminara-rose transition-colors resize-none"
                                        required
                                    />
                                </div>

                                {/* File Upload */}
                                <div>
                                    <Label htmlFor="attachments" className="text-base font-semibold mb-2 block">
                                        Attachments (Spec Sheets, Documents)
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-liminara-rose transition-colors">
                                        <input
                                            id="attachments"
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        />
                                        <label htmlFor="attachments" className="cursor-pointer">
                                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PDF, DOC, XLS, JPG, PNG (Max 10MB)
                                            </p>
                                        </label>
                                    </div>

                                    {/* Attachment List */}
                                    {attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-liminara-cream/50 rounded-lg"
                                                >
                                                    <span className="text-sm text-gray-700 truncate">
                                                        {file.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-red-500 hover:text-red-700 ml-2"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-liminara-rose to-liminara-rosegold hover:from-liminara-rose/90 hover:to-liminara-rosegold/90 text-white text-lg py-7 shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-sm text-center text-gray-500 mt-4">
                                    We respect your privacy. Your information will never be shared with third parties.
                                </p>
                            </form>
                        </Card>
                    </motion.div>

                    {/* Quick Contact Info */}
                    <motion.div
                        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-6 bg-gradient-to-br from-[#FFF4E8] to-white border-2 border-[#E3C7A0]">
                            <Users className="h-10 w-10 text-[#4B3A2F] mb-4" />
                            <h3 className="text-xl font-bold text-liminara-charcoal mb-2">
                                Sales Inquiries
                            </h3>
                            <p className="text-gray-600 mb-3">
                                For product information and pricing
                            </p>
                            <a
                                href="mailto:sales@liminara.com"
                                className="text-[#4B3A2F] hover:text-[#3B2D25] font-semibold"
                            >
                                sales@liminara.com
                            </a>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
                            <FlaskConical className="h-10 w-10 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold text-liminara-charcoal mb-2">
                                Technical Support
                            </h3>
                            <p className="text-gray-600 mb-3">
                                For formulation and R&D queries
                            </p>
                            <a
                                href="mailto:support@liminara.com"
                                className="text-green-600 hover:text-green-700 font-semibold"
                            >
                                support@liminara.com
                            </a>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
