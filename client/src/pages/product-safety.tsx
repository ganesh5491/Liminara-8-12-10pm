import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import {
    AlertTriangle,
    Shield,
    FileText,
    Phone,
    Mail,
    Upload,
    Send,
    CheckCircle2,
    AlertCircle,
    Activity,
    Pill,
    Droplet,
} from "lucide-react";

export default function ProductSafety() {
    const [reportForm, setReportForm] = useState({
        reporterName: "",
        reporterEmail: "",
        reporterPhone: "",
        patientAge: "",
        patientGender: "",
        productName: "",
        batchNumber: "",
        dateOfPurchase: "",
        dateOfReaction: "",
        adverseEvent: "",
        severity: "mild",
        medicalHistory: "",
        concomitantMedications: "",
        outcome: "",
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setReportForm({
            ...reportForm,
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

        if (!reportForm.reporterEmail || !reportForm.productName || !reportForm.adverseEvent) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        toast.loading("Submitting adverse event report...");

        setTimeout(() => {
            toast.dismiss();
            toast.success(
                "Report submitted successfully! Our pharmacovigilance team will review it within 24 hours.",
                { duration: 5000, icon: "✅" }
            );
            setReportForm({
                reporterName: "",
                reporterEmail: "",
                reporterPhone: "",
                patientAge: "",
                patientGender: "",
                productName: "",
                batchNumber: "",
                dateOfPurchase: "",
                dateOfReaction: "",
                adverseEvent: "",
                severity: "mild",
                medicalHistory: "",
                concomitantMedications: "",
                outcome: "",
            });
            setAttachments([]);
            setIsSubmitting(false);
        }, 2000);
    };

    const safetyInfo = [
        {
            icon: Shield,
            title: "Quality Assurance",
            description: "All products manufactured under WHO-GMP standards with rigorous quality control.",
            color: "from-[#4B3A2F] to-[#5C4A3A]",
        },
        {
            icon: Activity,
            title: "Clinical Testing",
            description: "Dermatologically tested and clinically validated for safety and efficacy.",
            color: "from-green-500 to-green-600",
        },
        {
            icon: FileText,
            title: "Regulatory Compliance",
            description: "Compliant with Indian pharmaceutical and cosmetic regulations.",
            color: "from-purple-500 to-purple-600",
        },
        {
            icon: AlertCircle,
            title: "Adverse Event Monitoring",
            description: "24/7 pharmacovigilance system to track and respond to safety concerns.",
            color: "from-orange-500 to-orange-600",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-center" />

            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-red-50 via-white to-orange-50 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-red-400 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-orange-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-6 border-2 border-red-200">
                            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                            <span className="text-sm font-semibold text-red-800">
                                Product Safety & Pharmacovigilance
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-liminara-charcoal mb-6">
                            Your Safety is Our Priority
                        </h1>

                        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                            We are committed to monitoring and ensuring the safety of all our pharmaceutical and cosmetic products. Report any adverse events or safety concerns immediately.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#report-form">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-6 text-lg shadow-lg"
                                >
                                    <AlertTriangle className="mr-2 h-5 w-5" />
                                    Report Adverse Event
                                </Button>
                            </a>
                            <a href="tel:+919876543210">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-red-500 text-red-600 hover:bg-red-50 px-8 py-6 text-lg"
                                >
                                    <Phone className="mr-2 h-5 w-5" />
                                    Emergency Hotline
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    {/* Safety Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {safetyInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 text-center hover-lift bg-white/80 backdrop-blur-sm border-2 border-gray-100 h-full">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                                        <info.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-liminara-charcoal mb-2">
                                        {info.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{info.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What to Report Section */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-liminara-charcoal mb-6">
                            What Should You Report?
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: Pill,
                                title: "Pharmaceutical Products",
                                items: [
                                    "Unexpected side effects",
                                    "Allergic reactions",
                                    "Drug interactions",
                                    "Lack of efficacy",
                                    "Medication errors",
                                    "Product quality issues",
                                ],
                            },
                            {
                                icon: Droplet,
                                title: "Cosmetic Products",
                                items: [
                                    "Skin irritation or rash",
                                    "Allergic reactions",
                                    "Eye irritation",
                                    "Swelling or inflammation",
                                    "Discoloration",
                                    "Product contamination",
                                ],
                            },
                        ].map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <Card className="p-8 border-2 border-gray-100 h-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-liminara-rose to-liminara-rosegold rounded-xl flex items-center justify-center">
                                            <category.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-liminara-charcoal">
                                            {category.title}
                                        </h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {category.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Report Form Section */}
            <section id="report-form" className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 rounded-full px-6 py-2 mb-6">
                            <Send className="h-5 w-5 text-red-600 mr-2" />
                            <span className="text-sm font-semibold text-red-800">
                                Adverse Event Reporting
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-liminara-charcoal mb-4">
                            Report an Adverse Event
                        </h2>
                        <p className="text-lg text-gray-600">
                            All reports are confidential and reviewed by our pharmacovigilance team
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-8 md:p-12 bg-white shadow-2xl border-2 border-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Reporter Information */}
                                <div>
                                    <h3 className="text-xl font-bold text-liminara-charcoal mb-4">
                                        Reporter Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="reporterName" className="text-base mb-2 block">
                                                Your Name
                                            </Label>
                                            <Input
                                                id="reporterName"
                                                name="reporterName"
                                                value={reportForm.reporterName}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                className="text-base py-6"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="reporterEmail" className="text-base mb-2 block">
                                                Email Address *
                                            </Label>
                                            <Input
                                                id="reporterEmail"
                                                name="reporterEmail"
                                                type="email"
                                                value={reportForm.reporterEmail}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                className="text-base py-6"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Label htmlFor="reporterPhone" className="text-base mb-2 block">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="reporterPhone"
                                            name="reporterPhone"
                                            type="tel"
                                            value={reportForm.reporterPhone}
                                            onChange={handleInputChange}
                                            placeholder="+91 70830 96332"
                                            className="text-base py-6"
                                        />
                                    </div>
                                </div>

                                {/* Patient Information */}
                                <div>
                                    <h3 className="text-xl font-bold text-liminara-charcoal mb-4">
                                        Patient Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="patientAge" className="text-base mb-2 block">
                                                Age
                                            </Label>
                                            <Input
                                                id="patientAge"
                                                name="patientAge"
                                                type="number"
                                                value={reportForm.patientAge}
                                                onChange={handleInputChange}
                                                placeholder="25"
                                                className="text-base py-6"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="patientGender" className="text-base mb-2 block">
                                                Gender
                                            </Label>
                                            <select
                                                id="patientGender"
                                                name="patientGender"
                                                value={reportForm.patientGender}
                                                onChange={handleInputChange}
                                                className="w-full text-base py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                                            >
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Information */}
                                <div>
                                    <h3 className="text-xl font-bold text-liminara-charcoal mb-4">
                                        Product Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="productName" className="text-base mb-2 block">
                                                Product Name *
                                            </Label>
                                            <Input
                                                id="productName"
                                                name="productName"
                                                value={reportForm.productName}
                                                onChange={handleInputChange}
                                                placeholder="Product name"
                                                className="text-base py-6"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="batchNumber" className="text-base mb-2 block">
                                                Batch/Lot Number
                                            </Label>
                                            <Input
                                                id="batchNumber"
                                                name="batchNumber"
                                                value={reportForm.batchNumber}
                                                onChange={handleInputChange}
                                                placeholder="Batch number"
                                                className="text-base py-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div>
                                            <Label htmlFor="dateOfPurchase" className="text-base mb-2 block">
                                                Date of Purchase
                                            </Label>
                                            <Input
                                                id="dateOfPurchase"
                                                name="dateOfPurchase"
                                                type="date"
                                                value={reportForm.dateOfPurchase}
                                                onChange={handleInputChange}
                                                className="text-base py-6"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dateOfReaction" className="text-base mb-2 block">
                                                Date of Reaction
                                            </Label>
                                            <Input
                                                id="dateOfReaction"
                                                name="dateOfReaction"
                                                type="date"
                                                value={reportForm.dateOfReaction}
                                                onChange={handleInputChange}
                                                className="text-base py-6"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Adverse Event Details */}
                                <div>
                                    <h3 className="text-xl font-bold text-liminara-charcoal mb-4">
                                        Adverse Event Details
                                    </h3>
                                    <div className="mb-4">
                                        <Label htmlFor="adverseEvent" className="text-base mb-2 block">
                                            Description of Adverse Event *
                                        </Label>
                                        <Textarea
                                            id="adverseEvent"
                                            name="adverseEvent"
                                            value={reportForm.adverseEvent}
                                            onChange={handleInputChange}
                                            placeholder="Please describe the adverse event in detail..."
                                            className="text-base min-h-[120px] resize-none"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="severity" className="text-base mb-2 block">
                                            Severity
                                        </Label>
                                        <select
                                            id="severity"
                                            name="severity"
                                            value={reportForm.severity}
                                            onChange={handleInputChange}
                                            className="w-full text-base py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                                        >
                                            <option value="mild">Mild</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="severe">Severe</option>
                                            <option value="life-threatening">Life-threatening</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="medicalHistory" className="text-base mb-2 block">
                                            Relevant Medical History
                                        </Label>
                                        <Textarea
                                            id="medicalHistory"
                                            name="medicalHistory"
                                            value={reportForm.medicalHistory}
                                            onChange={handleInputChange}
                                            placeholder="Any relevant medical conditions or allergies..."
                                            className="text-base min-h-[80px] resize-none"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="concomitantMedications" className="text-base mb-2 block">
                                            Other Medications Being Taken
                                        </Label>
                                        <Textarea
                                            id="concomitantMedications"
                                            name="concomitantMedications"
                                            value={reportForm.concomitantMedications}
                                            onChange={handleInputChange}
                                            placeholder="List any other medications or supplements..."
                                            className="text-base min-h-[80px] resize-none"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="outcome" className="text-base mb-2 block">
                                            Outcome
                                        </Label>
                                        <Input
                                            id="outcome"
                                            name="outcome"
                                            value={reportForm.outcome}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Recovered, Recovering, Hospitalized"
                                            className="text-base py-6"
                                        />
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <Label className="text-base mb-2 block">
                                        Supporting Documents (Medical reports, photos, etc.)
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-500 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PDF, DOC, JPG, PNG (Max 10MB each)
                                            </p>
                                        </label>
                                    </div>

                                    {attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-7 shadow-lg"
                                >
                                    {isSubmitting ? (
                                        "Submitting Report..."
                                    ) : (
                                        <>
                                            Submit Adverse Event Report
                                            <Send className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-sm text-center text-gray-500 mt-4">
                                    All reports are confidential. For emergencies, please call our 24/7 hotline: +91 70830 96332
                                </p>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Emergency Contact */}
            <section className="py-16 bg-red-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-6 animate-pulse" />
                    <h2 className="text-3xl font-bold mb-4">Medical Emergency?</h2>
                    <p className="text-xl mb-8">
                        If you are experiencing a serious adverse reaction, seek immediate medical attention or call emergency services.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg"
                            asChild
                        >
                            <a href="tel:112">
                                <Phone className="mr-2 h-5 w-5" />
                                Call Emergency (112)
                            </a>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                            asChild
                        >
                            <a href="tel:+919876543210">
                                <Phone className="mr-2 h-5 w-5" />
                                Liminara Hotline
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
