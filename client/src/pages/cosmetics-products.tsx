
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import { Slider } from "@/components/ui/slider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Sparkles,
  Search,
  Heart,
  ShoppingCart,
  Eye,
  ArrowRight,
  Shield,
  Loader2,
  Filter,
  X,
  Droplets,
  Flower2,
  Beaker,
  Star,
} from "lucide-react";

// Local image imports
import c1 from '../../public/images/c1.jpg';
import c2 from '../../public/images/c2.jpg';
import c3 from '../../public/images/c3.jpg';
import c4 from '../../public/images/c4.jpg';
import c5 from '../../public/images/c5.jpg';
import c6 from '../../public/images/c6.jpg';

const cosmeticsProducts = [
  {
    id: 101,
    name: "Liminara Vita C Serum",
    skinType: ["dry", "normal"],
    concern: ["Dullness", "Pigmentation"],
    benefit: "Boosts radiance, reduces pigmentation",
    price: 799,
    category: "Serums",
    texture: "serum",
    activeIngredient: ["Niacinamide (Vitamin B3)", "Vitamin C"],
    dermatologyTested: true,
    collection: "Clinical",
    image: c1,
    rating: 4.8,
  },
  {
    id: 102,
    name: "Hydrating Face Cream",
    skinType: ["dry", "normal"],
    concern: ["Dryness"],
    benefit: "Deep hydration, 24-hour moisture lock",
    price: 649,
    category: "Face Care",
    texture: "cream",
    activeIngredient: ["Hyaluronic Acid"],
    dermatologyTested: true,
    collection: "Everyday",
    image: c2,
    rating: 4.6,
  },
  {
    id: 103,
    name: "Retinol Night Cream",
    skinType: ["dry", "normal", "combination"],
    concern: ["Fine Lines"],
    benefit: "Reduces wrinkles, firms skin overnight",
    price: 1299,
    category: "Face Care",
    texture: "cream",
    activeIngredient: ["Retinol", "Peptides"],
    dermatologyTested: true,
    collection: "Clinical",
    image: c3,
    rating: 4.9,
  },
  {
    id: 104,
    name: "Organic Aloe Gel",
    skinType: ["dry", "normal", "oily", "combination"],
    concern: ["Sensitivity", "Redness"],
    benefit: "Soothes irritation, natural healing",
    price: 399,
    category: "Face Care",
    texture: "gel",
    activeIngredient: [],
    dermatologyTested: true,
    collection: "Organic",
    image: c4,
    rating: 4.5,
  },
  {
    id: 105,
    name: "Hair Growth Serum",
    skinType: [],
    concern: [],
    benefit: "Stimulates growth, reduces hair fall",
    price: 899,
    category: "Hair Care",
    texture: "serum",
    activeIngredient: [],
    dermatologyTested: true,
    collection: "Clinical",
    image: c5,
    rating: 4.7,
  },
  {
    id: 106,
    name: "Nourishing Hair Oil",
    skinType: [],
    concern: ["Dryness"],
    benefit: "Deep conditioning, strengthens roots",
    price: 549,
    category: "Hair Care",
    texture: "oil",
    activeIngredient: [],
    dermatologyTested: true,
    collection: "Organic",
    image: c6,
    rating: 4.4,
  },
];

/* ------------------------------------
   Skin Finder Quiz
------------------------------------ */
function SkinFinderQuiz({ onComplete }: { onComplete: (filters: any) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      question: "What's your primary skin concern?",
      options: ["Dryness", "Oiliness", "Aging", "Pigmentation", "Sensitivity"],
      icon: Flower2,
    },
    {
      question: "How does your skin feel by midday?",
      options: ["Tight & Dry", "Oily T-zone", "Balanced", "Flaky patches"],
      icon: Droplets,
    },
    {
      question: "How often do you experience breakouts?",
      options: ["Rarely", "Occasionally", "Frequently", "Never"],
      icon: Beaker,
    },
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [`q${step}`]: answer };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const filters: any = { concerns: [], skinType: "", sensitive: false, ingredient: [] };
      const primary = newAnswers.q0;

      if (primary === "Dryness") {
        filters.concerns.push("Dryness");
        filters.ingredient.push("Hyaluronic Acid");
      } else if (primary === "Oiliness") {
        filters.skinType = "oily";
        filters.ingredient.push("Niacinamide (Vitamin B3)");
      } else if (primary === "Aging") {
        filters.concerns.push("Fine Lines");
        filters.ingredient.push("Retinol", "Peptides");
      } else if (primary === "Pigmentation") {
        filters.concerns.push("Pigmentation", "Dullness");
        filters.ingredient.push("Vitamin C", "Niacinamide (Vitamin B3)");
      } else if (primary === "Sensitivity") {
        filters.concerns.push("Sensitivity", "Redness");
        filters.sensitive = true;
      }

      const mid = newAnswers.q1;
      if (mid === "Tight & Dry") filters.skinType = "dry";
      if (mid === "Oily T-zone") filters.skinType = "combination";
      if (mid === "Balanced") filters.skinType = "normal";
      if (mid === "Flaky patches") filters.skinType = "dry";

      onComplete(filters);
    }
  };

  const Icon = questions[step]?.icon || Sparkles;

  return (
    <div className="space-y-6 w-full">
      <AnimatePresence mode="wait">
        {step < questions.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                {questions.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-gold" : "bg-border"
                      }`}
                    initial={i === step ? { scaleX: 0 } : {}}
                    animate={i === step ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Step {step + 1} of {questions.length}
              </p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-cream">
                <Icon className="h-6 w-6 text-espresso" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground">
                {questions[step].question}
              </h3>
            </div>

            <div className="grid gap-3">
              {questions[step].options.map((option, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4 px-5 border-2 border-border hover:border-gold hover:bg-cream/50 rounded-xl transition-all duration-300 group"
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 mr-3 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/20 transition-all duration-300">
                      <span className="w-2 h-2 rounded-full bg-transparent group-hover:bg-gold transition-all duration-300" />
                    </span>
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center"
            >
              <Sparkles className="h-10 w-10 text-espresso" />
            </motion.div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              Analyzing Your Profile
            </h3>
            <p className="text-muted-foreground">
              Finding the perfect products for your skin...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------
   Precision Sidebar
------------------------------------ */
function PrecisionSidebar({ onChange, onClose }: { onChange?: (filters: any) => void; onClose?: () => void }) {
  const concernsOptions = ["Dullness", "Fine Lines", "Dryness", "Pigmentation", "Sensitivity", "Redness"];
  const ingredients = ["Niacinamide (Vitamin B3)", "Vitamin C", "Hyaluronic Acid", "Retinol", "Peptides"];

  const textures = [
    { id: "serum", label: "Serum", icon: Droplets },
    { id: "cream", label: "Cream", icon: Flower2 },
    { id: "gel", label: "Gel", icon: Beaker },
    { id: "oil", label: "Oil", icon: Sparkles },
  ];

  const [selectedConcerns, setSelectedConcerns] = useState<Set<string>>(new Set());
  const [skinType, setSkinType] = useState("");
  const [sensitive, setSensitive] = useState(false);
  const [texture, setTexture] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<string[]>([]);
  const [skinTypeValue, setSkinTypeValue] = useState([50]);

  const filters = useMemo(
    () => ({
      concerns: Array.from(selectedConcerns),
      skinType,
      sensitive,
      texture,
      ingredient: selectedIngredient,
    }),
    [selectedConcerns, skinType, sensitive, texture, selectedIngredient]
  );

  React.useEffect(() => onChange && onChange(filters), [filters, onChange]);

  function skinTypeFromValue(v: number) {
    if (v <= 24) return "dry";
    if (v <= 49) return "normal";
    if (v <= 74) return "combination";
    return "oily";
  }

  const clearAll = () => {
    setSelectedConcerns(new Set());
    setSkinType("");
    setTexture("");
    setSensitive(false);
    setSelectedIngredient([]);
    setSkinTypeValue([50]);
  };

  return (
    <div className="w-full lg:w-80 lg:sticky lg:top-24">
      <div className="glass rounded-2xl p-6 shadow-medium">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gold-dark" />
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              Precision Filters
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
            {onClose && (
              <button onClick={onClose} className="lg:hidden p-1 hover:bg-muted rounded-md">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Concerns */}
        <section className="mb-6 pb-6 border-b border-border">
          <h4 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wide">
            Shop By Concern
          </h4>
          <div className="flex flex-wrap gap-2">
            {concernsOptions.map((c) => (
              <button
                key={c}
                onClick={() => {
                  const newSet = new Set(selectedConcerns);
                  newSet.has(c) ? newSet.delete(c) : newSet.add(c);
                  setSelectedConcerns(newSet);
                }}
                className={`text-xs px-3 py-2 rounded-full border transition-all duration-300 ${selectedConcerns.has(c)
                  ? "bg-espresso text-primary-foreground border-espresso"
                  : "bg-background text-foreground border-border hover:border-gold hover:bg-cream/50"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Skin Type Slider */}
        <section className="mb-6 pb-6 border-b border-border">
          <h4 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wide">
            Skin Type
          </h4>
          <Slider
            value={skinTypeValue}
            onValueChange={(v) => {
              setSkinTypeValue(v);
              setSkinType(skinTypeFromValue(v[0]));
            }}
            max={100}
            step={1}
            className="mb-4"
          />
          <div className="flex justify-between text-xs">
            {["Dry", "Normal", "Combo", "Oily"].map((type, i) => (
              <span
                key={type}
                className={`px-2 py-1 rounded-md transition-all duration-300 ${skinType === type.toLowerCase() || (type === "Combo" && skinType === "combination")
                  ? "bg-cream-dark text-espresso font-medium"
                  : "text-muted-foreground"
                  }`}
              >
                {type}
              </span>
            ))}
          </div>

          <label className="flex items-center justify-between mt-4 pt-4 border-t border-border cursor-pointer group">
            <span className="text-sm text-foreground">Sensitive Skin</span>
            <div
              onClick={() => setSensitive(!sensitive)}
              className={`w-10 h-6 rounded-full transition-all duration-300 flex items-center px-1 cursor-pointer ${sensitive ? "bg-gold" : "bg-muted"
                }`}
            >
              <motion.div
                animate={{ x: sensitive ? 16 : 0 }}
                className="w-4 h-4 bg-card rounded-full shadow-sm"
              />
            </div>
          </label>
        </section>

        {/* Texture */}
        <section className="mb-6 pb-6 border-b border-border">
          <h4 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wide">
            Texture Preference
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {textures.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTexture(texture === t.id ? "" : t.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-1 ${texture === t.id
                    ? "border-gold bg-cream text-espresso"
                    : "border-border bg-background text-muted-foreground hover:border-gold/50 hover:bg-cream/30"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Ingredients */}
        <section>
          <h4 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wide">
            Active Ingredients
          </h4>
          <div className="space-y-2">
            {ingredients.map((ing) => (
              <label
                key={ing}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-cream/50 transition-colors"
              >
                <div
                  onClick={() => {
                    const updated = new Set(selectedIngredient);
                    updated.has(ing) ? updated.delete(ing) : updated.add(ing);
                    setSelectedIngredient(Array.from(updated));
                  }}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${selectedIngredient.includes(ing)
                    ? "bg-espresso border-espresso"
                    : "border-border group-hover:border-gold"
                    }`}
                >
                  {selectedIngredient.includes(ing) && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <span className="text-sm text-foreground">{ing}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------
   Product Card
------------------------------------ */
function ProductCard({ product }: { product: any }) {
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [cartCooldown, setCartCooldown] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        await apiRequest("POST", "/api/cart", { productId: String(product.id), quantity: 1 });
        return { success: true, localStorage: false };
      }
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      const existingItemIndex = localCart.findIndex((item: any) => item.productId === String(product.id));
      if (existingItemIndex !== -1) {
        localCart[existingItemIndex].quantity = (localCart[existingItemIndex].quantity || 1) + 1;
      } else {
        localCart.push({
          id: `local-${product.id}-${Date.now()}`,
          productId: String(product.id),
          quantity: 1,
          product: {
            ...product,
            id: String(product.id),
            name: product.name, // Explicit name mapping
            description: product.benefit, // Map benefit to description for cart display
            price: String(product.price),
            imageUrl: product.image, // Map image to imageUrl for CartModal
            images: [product.image]
          }
        });
      }
      localStorage.setItem('localCart', JSON.stringify(localCart));
      return { success: true, localStorage: true };
    },
    onSuccess: (result) => {
      if (result && !result.localStorage) {
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      }
      window.dispatchEvent(new Event('cartUpdated'));
      setCartCooldown(true);
      setTimeout(() => setCartCooldown(false), 1000);
      toast({ title: "Added to cart", description: `${product.name} has been added to your cart.` });
    },
    onError: () => toast({ title: "Error", description: "Failed to add item to cart.", variant: "destructive" })
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        if (isLiked) await apiRequest("DELETE", `/api/wishlist/${product.id}`);
        else await apiRequest("POST", "/api/wishlist", { productId: String(product.id) });
        return;
      }
      const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      if (isLiked) {
        const updated = localWishlist.filter((item: any) => item.productId !== String(product.id));
        localStorage.setItem('localWishlist', JSON.stringify(updated));
      } else {
        localWishlist.push({
          productId: String(product.id),
          product: {
            ...product,
            id: String(product.id),
            name: product.name, // Explicit name mapping
            description: product.benefit, // Map benefit to description
            price: String(product.price),
            imageUrl: product.image, // Map image to imageUrl for WishlistModal
            images: [product.image]
          }
        });
        localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
      }
      window.dispatchEvent(new CustomEvent('localWishlistUpdate'));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      window.dispatchEvent(new CustomEvent('localWishlistUpdate'));
      setIsLiked(!isLiked);
      toast({ title: isLiked ? "Removed from wishlist" : "Added to wishlist", description: `${product.name} has been ${isLiked ? "removed from" : "added to"} your wishlist.` });
    }
  });

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('checkoutProductId', product.id.toString());
      navigate('/auth');
      return;
    }
    const item = {
      productId: String(product.id),
      quantity: 1,
      price: product.price,
      total: product.price,
      product: {
        ...product,
        id: String(product.id),
        name: product.name, // Explicit name mapping
        description: product.benefit, // Map benefit to description
        price: String(product.price),
        imageUrl: product.image, // Map image to imageUrl
        images: [product.image]
      }
    };
    sessionStorage.setItem('buyNowItem', JSON.stringify(item));
    localStorage.setItem('checkoutType', 'direct');
    localStorage.setItem('buyNowItem', JSON.stringify(item));
    navigate('/checkout');
  };

  return (
    <InteractiveCard
      InteractiveColor="hsl(38 55% 70%)"
      tailwindBgClass="bg-card"
      className="h-full"
      borderRadius="16px"
      rotationFactor={0.2}
    >
      <Card className="h-full p-0 overflow-hidden border-0 bg-transparent max-w-sm">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-cream to-cream-dark">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToWishlistMutation.mutate()}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <Heart
              className={`h-5 w-5 transition-colors duration-300 ${isLiked ? "fill-rose-dark text-rose-dark" : "text-espresso"
                }`}
            />
          </motion.button>

          {/* Collection Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-card/90 backdrop-blur-sm text-espresso border-0 text-xs font-medium px-3 py-1 shadow-soft">
              {product.collection}
            </Badge>
          </div>

          {/* Quick View */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Button variant="secondary" size="sm" className="glass shadow-medium">
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Derma Badge & Rating */}
          <div className="flex items-center justify-between mb-3">
            {product.dermatologyTested && (
              <Badge variant="outline" className="border-gold/50 text-espresso-light bg-cream/50 text-[10px] font-medium">
                <Shield className="h-3 w-3 mr-1" />
                Derma Tested
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="text-xs font-medium text-foreground">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display text-base font-semibold text-foreground mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Benefit */}
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {product.benefit}
          </p>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xl font-display font-bold text-foreground">
              ₹{product.price}
            </span>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-espresso hover:bg-espresso-light text-primary-foreground shadow-soft hover:shadow-medium transition-all duration-300"
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending || cartCooldown}
              >
                {addToCartMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {cartCooldown ? "Added" : "Add"}
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#4B3A2F] to-[#3B2D25] text-white hover:opacity-90 transition-opacity shadow-soft hover:shadow-medium"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </InteractiveCard>
  );
}

/* ------------------------------------
   MAIN PAGE
------------------------------------ */
function CosmeticsProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { toast } = useToast();

  const filteredProducts = cosmeticsProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConcerns =
      !filters.concerns?.length || filters.concerns.some((c: string) => product.concern.includes(c));
    const matchesSkinType = !filters.skinType || product.skinType.includes(filters.skinType);
    const matchesTexture = !filters.texture || product.texture === filters.texture;
    const matchesIngredient =
      !filters.ingredient?.length || filters.ingredient.some((ing: string) => product.activeIngredient.includes(ing));

    return matchesSearch && matchesConcerns && matchesSkinType && matchesTexture && matchesIngredient;
  });

  const handleAddToCart = async (product: any) => {
    setAddingToCart(product.id);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });

    setAddingToCart(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-gold/10 to-cream/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-rose/10 to-cream/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-40 left-1/4 w-56 h-56 bg-gradient-to-br from-cream/30 to-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 sm:p-10 shadow-large relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-cream to-cream-dark shadow-soft"
                >
                  <Sparkles className="h-10 w-10 text-espresso" />
                </motion.div>
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center bg-cream rounded-full px-4 py-1.5 mb-3 shadow-soft"
                  >
                    <div className="w-2 h-2 bg-gold rounded-full mr-2 animate-pulse" />
                    <span className="text-espresso font-medium text-xs uppercase tracking-wide">
                      Clinical Precision
                    </span>
                  </motion.div>
                  <h1 className="text-4xl sm:text-5xl font-display font-bold text-gradient">
                    Skin-Smart Cosmetics
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    {filteredProducts.length} curated products for your unique skin
                  </p>
                </div>
              </div>

              <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-espresso text-primary-foreground shadow-medium hover:shadow-large transition-all duration-300 font-medium"
                  >
                    <Beaker className="mr-2 h-5 w-5" />
                    Skin Finder Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-display">Discover Your Perfect Match</DialogTitle>
                    <DialogDescription>
                      Answer a few questions to find products tailored to your skin
                    </DialogDescription>
                  </DialogHeader>
                  <SkinFinderQuiz
                    onComplete={(f) => {
                      setFilters(f);
                      setTimeout(() => setIsQuizOpen(false), 300);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-2 border-border hover:border-gold hover:bg-cream/50">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {Object.values(filters).some((v: any) => v?.length > 0 || v === true || (typeof v === 'string' && v)) && (
                  <Badge className="ml-2 bg-gold text-espresso">Active</Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">Precision Filters</DialogTitle>
              </DialogHeader>
              <PrecisionSidebar onChange={setFilters} onClose={() => setIsFiltersOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <PrecisionSidebar onChange={setFilters} />
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-espresso transition-colors" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-base border-2 border-border focus:border-gold rounded-xl bg-card/50 backdrop-blur-sm shadow-soft focus:shadow-medium transition-all"
                />
              </div>
            </motion.div>

            {/* Product Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <ProductCard
                      product={product}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="glass rounded-3xl p-12 max-w-md mx-auto shadow-medium">
                  <div className="w-20 h-20 bg-gradient-to-br from-cream to-cream-dark rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Search className="h-10 w-10 text-espresso" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                    No products found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query to discover more products.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 border-gold hover:bg-cream"
                    onClick={() => {
                      setFilters({});
                      setSearchQuery("");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CosmeticsProducts;
