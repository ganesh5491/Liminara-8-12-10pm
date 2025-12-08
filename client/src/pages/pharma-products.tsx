import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pill,
    Filter,
    Search,
    FileText,
    Award,
    ChevronDown,
    ShoppingCart,
    Eye,
    ArrowRight,
} from "lucide-react";

// Sample product data
const products = [
    {
        id: 1,
        name: "Immune Boost Capsules",
        composition: "Vitamin C 500mg, Zinc 15mg",
        benefit: "Strengthens immunity, daily wellness support",
        packSizes: ["30 capsules", "60 capsules", "90 capsules"],
        price: "₹599",
        category: "Nutraceuticals",
        therapeuticArea: "Immunity",
        dosageForm: "Capsules",
        certification: "GMP",
    },
    {
        id: 2,
        name: "Pain Relief Tablets",
        composition: "Paracetamol 500mg",
        benefit: "Fast-acting pain and fever relief",
        packSizes: ["10 tablets", "20 tablets", "50 tablets"],
        price: "₹89",
        category: "Analgesics",
        therapeuticArea: "Pain Management",
        dosageForm: "Tablets",
        certification: "WHO-GMP",
    },
    {
        id: 3,
        name: "Digestive Enzyme Syrup",
        composition: "Diastase, Pepsin",
        benefit: "Improves digestion, reduces bloating",
        packSizes: ["100ml", "200ml"],
        price: "₹149",
        category: "Digestive Health",
        therapeuticArea: "Gastroenterology",
        dosageForm: "Syrup",
        certification: "GMP",
    },
    {
        id: 4,
        name: "Calcium + D3 Tablets",
        composition: "Calcium Carbonate 500mg, Vitamin D3 250IU",
        benefit: "Bone health, prevents osteoporosis",
        packSizes: ["30 tablets", "60 tablets"],
        price: "₹399",
        category: "Nutraceuticals",
        therapeuticArea: "Bone Health",
        dosageForm: "Tablets",
        certification: "GMP",
    },
    {
        id: 5,
        name: "Multivitamin Capsules",
        composition: "Vitamins A, B, C, D, E + Minerals",
        benefit: "Complete daily nutrition support",
        packSizes: ["30 capsules", "60 capsules"],
        price: "₹699",
        category: "Nutraceuticals",
        therapeuticArea: "General Wellness",
        dosageForm: "Capsules",
        certification: "WHO-GMP",
    },
    {
        id: 6,
        name: "Cough Relief Syrup",
        composition: "Dextromethorphan 10mg/5ml",
        benefit: "Relieves dry cough, soothes throat",
        packSizes: ["100ml", "200ml"],
        price: "₹129",
        category: "Respiratory",
        therapeuticArea: "Respiratory Health",
        dosageForm: "Syrup",
        certification: "GMP",
    },
];

export default function PharmaProducts() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDosageForm, setSelectedDosageForm] = useState("all");
    const [selectedTherapeuticArea, setSelectedTherapeuticArea] = useState("all");
    const [selectedCertification, setSelectedCertification] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.composition.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDosageForm =
            selectedDosageForm === "all" || product.dosageForm === selectedDosageForm;
        const matchesTherapeuticArea =
            selectedTherapeuticArea === "all" ||
            product.therapeuticArea === selectedTherapeuticArea;
        const matchesCertification =
            selectedCertification === "all" ||
            product.certification === selectedCertification;

        return (
            matchesSearch &&
            matchesDosageForm &&
            matchesTherapeuticArea &&
            matchesCertification
        );
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Section 1: Category Hero & Filters */}
            <section className="bg-gradient-to-br from-[#FFF4E8] via-white to-[#FFF4E8]/30 py-16 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="p-4 bg-blue-100 rounded-2xl">
                                <Pill className="h-10 w-10 text-[#4B3A2F]" />
                            </div>
                            <h1 className="text-5xl font-display font-bold text-liminara-charcoal">
                                Pharmaceutical Catalog
                            </h1>
                        </div>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Browse our GMP-certified formulations by dosage form, therapeutic
                            area and regulatory status
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        className="max-w-2xl mx-auto mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by product name or composition..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 py-6 text-lg"
                            />
                        </div>
                    </motion.div>

                    {/* Filter Toggle Button */}
                    <div className="text-center mb-6">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""
                                    }`}
                            />
                        </Button>
                    </div>

                    {/* Filters Panel */}
                    <motion.div
                        initial={false}
                        animate={{
                            height: showFilters ? "auto" : 0,
                            opacity: showFilters ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <Card className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Dosage Form
                                    </label>
                                    <Select
                                        value={selectedDosageForm}
                                        onValueChange={setSelectedDosageForm}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Forms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Forms</SelectItem>
                                            <SelectItem value="Tablets">Tablets</SelectItem>
                                            <SelectItem value="Capsules">Capsules</SelectItem>
                                            <SelectItem value="Syrup">Syrup</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Therapeutic Area
                                    </label>
                                    <Select
                                        value={selectedTherapeuticArea}
                                        onValueChange={setSelectedTherapeuticArea}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Areas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Areas</SelectItem>
                                            <SelectItem value="Immunity">Immunity</SelectItem>
                                            <SelectItem value="Pain Management">
                                                Pain Management
                                            </SelectItem>
                                            <SelectItem value="Gastroenterology">
                                                Gastroenterology
                                            </SelectItem>
                                            <SelectItem value="Bone Health">Bone Health</SelectItem>
                                            <SelectItem value="General Wellness">
                                                General Wellness
                                            </SelectItem>
                                            <SelectItem value="Respiratory Health">
                                                Respiratory Health
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Certification
                                    </label>
                                    <Select
                                        value={selectedCertification}
                                        onValueChange={setSelectedCertification}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Certifications" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Certifications</SelectItem>
                                            <SelectItem value="GMP">GMP</SelectItem>
                                            <SelectItem value="WHO-GMP">WHO-GMP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSelectedDosageForm("all");
                                        setSelectedTherapeuticArea("all");
                                        setSelectedCertification("all");
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Product Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-muted-foreground">
                            Showing {filteredProducts.length} products
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                            >
                                <Card className="p-6 hover-lift group h-full flex flex-col">
                                    {/* Product Image Placeholder */}
                                    <div className="aspect-square bg-gradient-to-br from-[#FFF4E8] to-[#F5D7B0] rounded-xl mb-4 flex items-center justify-center">
                                        <Pill className="h-20 w-20 text-[#4B3A2F]" />
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-2 mb-3">
                                        <Badge variant="secondary" className="bg-blue-100 text-[#3B2D25]">
                                            {product.dosageForm}
                                        </Badge>
                                        <Badge variant="outline" className="border-green-600 text-green-700">
                                            <Award className="h-3 w-3 mr-1" />
                                            {product.certification}
                                        </Badge>
                                    </div>

                                    {/* Product Info */}
                                    <h3 className="text-xl font-bold text-liminara-charcoal mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        <span className="font-medium">Composition:</span>{" "}
                                        {product.composition}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                                        {product.benefit}
                                    </p>

                                    {/* Pack Sizes */}
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                            Available Pack Sizes:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {product.packSizes.map((size, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {size}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price & Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <span className="text-2xl font-bold text-[#4B3A2F]">
                                            {product.price}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="group/btn"
                                            >
                                                <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-[#4B3A2F] hover:bg-[#3B2D25]"
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>

                                    {/* View Details Link */}
                                    <Link to={`/product/${product.id}`}>
                                        <Button
                                            variant="ghost"
                                            className="w-full mt-3 group-hover:bg-blue-50"
                                        >
                                            View Details
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16">
                            <Pill className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-liminara-charcoal mb-2">
                                No products found
                            </h3>
                            <p className="text-muted-foreground">
                                Try adjusting your filters or search query
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Section 3: Featured Formulations / New Releases */}
            <section className="py-16 bg-gradient-to-br from-[#FFF4E8] to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-display font-bold text-liminara-charcoal mb-4">
                            New API Formulations
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Latest releases with clinical highlights
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                name: "Advanced Probiotic Complex",
                                highlight: "10 billion CFU, clinically proven gut health",
                                status: "New Release",
                            },
                            {
                                name: "Omega-3 Triple Strength",
                                highlight: "EPA 500mg + DHA 250mg, heart health support",
                                status: "New Release",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Card className="p-6 border-2 border-[#E3C7A0] hover-lift">
                                    <Badge className="bg-[#4B3A2F] text-white mb-4">
                                        {item.status}
                                    </Badge>
                                    <h3 className="text-2xl font-bold text-liminara-charcoal mb-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">{item.highlight}</p>
                                    <Button className="bg-[#4B3A2F] hover:bg-[#3B2D25]">
                                        Learn More
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Regulatory / QA Panel */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-8 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-green-100 rounded-2xl">
                                    <FileText className="h-10 w-10 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-display font-bold text-liminara-charcoal mb-4">
                                        Batch Release & Stability
                                    </h2>
                                    <p className="text-lg text-muted-foreground mb-6">
                                        Every batch comes with a Certificate of Analysis (COA) and
                                        stability data. Request samples or COA documents for your
                                        specific requirements.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Button className="bg-green-600 hover:bg-green-700">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Request COA
                                        </Button>
                                        <Button variant="outline" className="border-green-600 text-green-700">
                                            Request Sample
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
