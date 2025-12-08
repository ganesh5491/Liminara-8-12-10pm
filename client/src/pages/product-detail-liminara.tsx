import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    ShoppingCart,
    Heart,
    FileText,
    Award,
    Star,
    ChevronLeft,
    ChevronRight,
    Download,
    TestTube,
    Clock,
    Thermometer,
    AlertCircle,
    CheckCircle2,
    Minus,
    Plus,
} from "lucide-react";

// Sample product data (in real app, fetch from API)
const productData = {
    id: 1,
    name: "Liminara Vita C Serum",
    tagline: "Radiance Booster & Pigmentation Reducer",
    price: 799,
    packSizes: ["15ml", "30ml", "50ml"],
    b2bPack: "Case of 24 units",
    category: "Cosmetics",
    images: [
        "/placeholder-product-1.jpg",
        "/placeholder-product-2.jpg",
        "/placeholder-product-3.jpg",
    ],
    rating: 4.8,
    reviewCount: 342,
    inStock: true,

    // Section 2: Key Benefits & Quick Facts
    benefits: [
        "Brightens skin tone and boosts radiance",
        "Reduces dark spots and pigmentation",
        "Powerful antioxidant protection",
        "Stimulates collagen production",
        "Suitable for all skin types",
    ],
    quickFacts: {
        indication: "Hyperpigmentation, dull skin, uneven tone",
        onset: "Visible results in 2-4 weeks",
        shelfLife: "24 months from manufacturing",
        storage: "Store in cool, dry place away from direct sunlight",
        contraindications: "Avoid if allergic to Vitamin C derivatives",
    },

    // Section 3: Composition & Ingredients
    activeIngredients: [
        { name: "L-Ascorbic Acid (Vitamin C)", strength: "15%", purpose: "Antioxidant, brightening" },
        { name: "Ferulic Acid", strength: "1%", purpose: "Stabilizer, antioxidant" },
        { name: "Vitamin E", strength: "0.5%", purpose: "Moisturizing, protection" },
    ],
    excipients: ["Purified Water", "Glycerin", "Hyaluronic Acid", "Propylene Glycol"],
    allergenWarnings: ["May contain traces of soy"],

    // Section 4: How to Use
    usage: [
        { step: 1, instruction: "Cleanse face thoroughly and pat dry" },
        { step: 2, instruction: "Apply 2-3 drops to face and neck" },
        { step: 3, instruction: "Gently massage in upward circular motions" },
        { step: 4, instruction: "Wait 2-3 minutes before applying moisturizer" },
        { step: 5, instruction: "Use once daily, preferably in the morning" },
        { step: 6, instruction: "Always follow with SPF 30+ sunscreen" },
    ],

    // Section 5: Quality & Certifications
    certifications: [
        { name: "Dermatologist Tested", icon: Award },
        { name: "GMP Certified", icon: Award },
        { name: "Cruelty Free", icon: Award },
        { name: "Stability Tested", icon: TestTube },
    ],
    batchInfo: "COA available for download",

    // Section 6: Reviews & FAQ
    reviews: [
        {
            id: 1,
            author: "Priya M.",
            rating: 5,
            date: "2 weeks ago",
            verified: true,
            comment: "Amazing results! My dark spots have faded significantly. Highly recommend!",
        },
        {
            id: 2,
            author: "Rahul K.",
            rating: 4,
            date: "1 month ago",
            verified: true,
            comment: "Good product, but takes time to show results. Worth the wait though.",
        },
        {
            id: 3,
            author: "Anjali S.",
            rating: 5,
            date: "3 weeks ago",
            verified: true,
            comment: "My skin looks so much brighter! Love the lightweight texture.",
        },
    ],
    faqs: [
        {
            question: "Can I use this serum with other active ingredients?",
            answer: "Yes, but avoid using with retinol or AHAs/BHAs in the same routine. Use Vitamin C in the morning and other actives at night.",
        },
        {
            question: "Is this suitable for sensitive skin?",
            answer: "Yes, but we recommend doing a patch test first. Start with once every other day and gradually increase frequency.",
        },
        {
            question: "How long does one bottle last?",
            answer: "The 30ml bottle typically lasts 2-3 months with daily use (2-3 drops per application).",
        },
    ],
    relatedProducts: [
        { id: 102, name: "Hydrating Face Cream", price: 649 },
        { id: 103, name: "Anti-Aging Night Cream", price: 1299 },
        { id: 104, name: "Organic Aloe Gel", price: 399 },
    ],
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedPackSize, setSelectedPackSize] = useState(productData.packSizes[1]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("benefits");

    const handleQuantityChange = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-liminara-rose">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link to="/cosmetics" className="hover:text-liminara-rose">Cosmetics</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-liminara-charcoal font-medium">{productData.name}</span>
                    </div>
                </div>
            </div>

            {/* Section 1: Product Hero */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Main Image */}
                            <div className="aspect-square bg-gradient-to-br from-[#FFF4E8] to-[#F5D7B0] rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                                <div className="text-center">
                                    <TestTube className="h-32 w-32 text-[#4B3A2F] mx-auto mb-4" />
                                    <p className="text-muted-foreground">Product Image {selectedImage + 1}</p>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className="grid grid-cols-4 gap-4">
                                {[0, 1, 2, 3].map((index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square bg-gradient-to-br from-[#FFF4E8] to-[#F5D7B0] rounded-lg flex items-center justify-center border-2 transition-all ${selectedImage === index
                                            ? "border-[#4B3A2F] scale-105"
                                            : "border-transparent hover:border-[#D4B590]"
                                            }`}
                                    >
                                        <TestTube className="h-8 w-8 text-[#4B3A2F]" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-4">
                                <Badge className="bg-[#F5D7B0] text-[#3B2D25] mb-2">
                                    {productData.category}
                                </Badge>
                                {productData.inStock && (
                                    <Badge className="bg-green-100 text-green-700 ml-2">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        In Stock
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-4xl font-display font-bold text-liminara-charcoal mb-2">
                                {productData.name}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-6">
                                {productData.tagline}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(productData.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="font-semibold">{productData.rating}</span>
                                <span className="text-muted-foreground">
                                    ({productData.reviewCount} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="text-4xl font-bold text-[#4B3A2F] mb-2">
                                    ₹{productData.price}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    B2B Pack: {productData.b2bPack}
                                </p>
                            </div>

                            {/* Pack Size Selector */}
                            <div className="mb-6">
                                <label className="text-sm font-medium mb-3 block">
                                    Select Pack Size
                                </label>
                                <div className="flex gap-3">
                                    {productData.packSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedPackSize(size)}
                                            className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${selectedPackSize === size
                                                ? "border-[#4B3A2F] bg-[#FFF4E8] text-[#3B2D25]"
                                                : "border-gray-200 hover:border-[#D4B590]"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <label className="text-sm font-medium mb-3 block">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="p-3 hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="px-6 font-semibold">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="p-3 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <span className="text-muted-foreground">
                                        Total: ₹{(productData.price * quantity).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-6">
                                <Button
                                    size="lg"
                                    className="flex-1 bg-[#4B3A2F] hover:bg-[#3B2D25] text-white text-lg py-6"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add to Cart
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-[#4B3A2F] text-[#4B3A2F] hover:bg-[#FFF4E8]"
                                >
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Request Sample
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Spec
                                </Button>
                            </div>

                            {/* Certifications */}
                            <div className="mt-8 pt-8 border-t">
                                <div className="flex flex-wrap gap-4">
                                    {productData.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <cert.icon className="h-4 w-4 text-green-600" />
                                            <span className="text-muted-foreground">{cert.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Sections 2-6: Tabbed Content */}
            <section className="py-12 bg-gradient-to-b from-white to-liminara-cream/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-5 mb-8">
                            <TabsTrigger value="benefits">Benefits & Facts</TabsTrigger>
                            <TabsTrigger value="composition">Composition</TabsTrigger>
                            <TabsTrigger value="usage">How to Use</TabsTrigger>
                            <TabsTrigger value="quality">Quality</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews & FAQ</TabsTrigger>
                        </TabsList>

                        {/* Section 2: Key Benefits & Quick Facts */}
                        <TabsContent value="benefits">
                            <Card className="p-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-liminara-charcoal mb-6">
                                            Key Benefits
                                        </h2>
                                        <ul className="space-y-3">
                                            {productData.benefits.map((benefit, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-[#4B3A2F] mt-0.5 flex-shrink-0" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-liminara-charcoal mb-6">
                                            Quick Facts
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <TestTube className="h-5 w-5 text-[#4B3A2F] mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Indication</p>
                                                    <p className="text-muted-foreground">{productData.quickFacts.indication}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock className="h-5 w-5 text-[#4B3A2F] mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Onset of Results</p>
                                                    <p className="text-muted-foreground">{productData.quickFacts.onset}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock className="h-5 w-5 text-[#4B3A2F] mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Shelf Life</p>
                                                    <p className="text-muted-foreground">{productData.quickFacts.shelfLife}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Thermometer className="h-5 w-5 text-[#4B3A2F] mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Storage</p>
                                                    <p className="text-muted-foreground">{productData.quickFacts.storage}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Contraindications</p>
                                                    <p className="text-muted-foreground">{productData.quickFacts.contraindications}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Section 3: Composition & Ingredients */}
                        <TabsContent value="composition">
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-liminara-charcoal mb-6">
                                    Composition & Ingredients
                                </h2>

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">Active Ingredients</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-3 px-4">Ingredient</th>
                                                    <th className="text-left py-3 px-4">Strength</th>
                                                    <th className="text-left py-3 px-4">Purpose</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productData.activeIngredients.map((ingredient, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className="py-3 px-4 font-medium">{ingredient.name}</td>
                                                        <td className="py-3 px-4">{ingredient.strength}</td>
                                                        <td className="py-3 px-4 text-muted-foreground">{ingredient.purpose}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">Excipients</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {productData.excipients.map((excipient, index) => (
                                            <Badge key={index} variant="secondary">
                                                {excipient}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-orange-900">Allergen Warnings</p>
                                            <p className="text-orange-800">{productData.allergenWarnings.join(", ")}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Section 4: How to Use */}
                        <TabsContent value="usage">
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-liminara-charcoal mb-6">
                                    How to Use / Application
                                </h2>
                                <div className="space-y-4">
                                    {productData.usage.map((item) => (
                                        <div key={item.step} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-[#F5D7B0] rounded-full flex items-center justify-center">
                                                <span className="font-bold text-[#4B3A2F]">{item.step}</span>
                                            </div>
                                            <div className="flex-1 pt-2">
                                                <p className="text-lg">{item.instruction}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Section 5: Quality & Certifications */}
                        <TabsContent value="quality">
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-liminara-charcoal mb-6">
                                    Quality & Certifications
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {productData.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                                            <div className="p-3 bg-green-100 rounded-full">
                                                <cert.icon className="h-6 w-6 text-green-600" />
                                            </div>
                                            <span className="font-semibold text-lg">{cert.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-blue-50 border-l-4 border-[#4B3A2F] p-6 rounded">
                                    <h3 className="font-semibold text-lg mb-2">Batch Information</h3>
                                    <p className="text-muted-foreground mb-4">{productData.batchInfo}</p>
                                    <Button className="bg-[#4B3A2F] hover:bg-[#3B2D25]">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download COA
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Section 6: Reviews, FAQ & Related Products */}
                        <TabsContent value="reviews">
                            <div className="space-y-8">
                                {/* Reviews */}
                                <Card className="p-8">
                                    <h2 className="text-2xl font-bold text-liminara-charcoal mb-6">
                                        Customer Reviews
                                    </h2>
                                    <div className="space-y-6">
                                        {productData.reviews.map((review) => (
                                            <div key={review.id} className="border-b pb-6 last:border-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold">{review.author}</span>
                                                            {review.verified && (
                                                                <Badge className="bg-green-100 text-green-700 text-xs">
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                    Verified Purchase
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < review.rating
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-muted-foreground">{review.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full mt-6">
                                        Load More Reviews
                                    </Button>
                                </Card>

                                {/* FAQ */}
                                <Card className="p-8">
                                    <h2 className="text-2xl font-bold text-liminara-charcoal mb-6">
                                        Frequently Asked Questions
                                    </h2>
                                    <Accordion type="single" collapsible className="w-full">
                                        {productData.faqs.map((faq, index) => (
                                            <AccordionItem key={index} value={`item-${index}`}>
                                                <AccordionTrigger className="text-left">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </Card>

                                {/* Related Products */}
                                <Card className="p-8">
                                    <h2 className="text-2xl font-bold text-liminara-charcoal mb-6">
                                        You May Also Like
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {productData.relatedProducts.map((product) => (
                                            <Link key={product.id} to={`/product/${product.id}`}>
                                                <Card className="p-4 hover-lift group cursor-pointer">
                                                    <div className="aspect-square bg-gradient-to-br from-[#FFF4E8] to-[#F5D7B0] rounded-lg mb-3 flex items-center justify-center">
                                                        <TestTube className="h-12 w-12 text-[#4B3A2F]" />
                                                    </div>
                                                    <h3 className="font-semibold mb-2 group-hover:text-[#4B3A2F] transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-lg font-bold text-[#4B3A2F]">₹{product.price}</p>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Sticky Buy Bar (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden z-50">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-2xl font-bold text-[#4B3A2F]">₹{productData.price}</p>
                    </div>
                    <Button className="flex-1 bg-[#4B3A2F] hover:bg-[#3B2D25]">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}
