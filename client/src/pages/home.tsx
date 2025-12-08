import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Users, Award, Truck, ShieldCheck, CheckCircle, Sparkles, Droplets, Palette, FlaskConical, Leaf, Headphones, Video, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import c1 from '../../public/images/c1.jpg';
import c2 from '../../public/images/c2.jpg';
import c3 from '../../public/images/c3.jpg';
import c4 from '../../public/images/c4.jpg';
import c5 from '../../public/images/c5.jpg';
import c6 from '../../public/images/c6.jpg';
import c7 from '../../public/images/c7.jpg';
import c8 from '../../public/images/c8.jpg';
import c9 from '../../public/images/c9.jpg';
import cosmeticProductsData from '@/data/cosmetic-products.json';
import categoriesData from '@/data/categories.json';
import CosmeticsProducts from "./cosmetics-products";
import Hero from "./hero";

// register ScrollTrigger
try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* noop in SSR */ }
import type { Product, Category } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/contexts/AuthContext";

// New cosmetic-first palettes (soft pastels + gold accents)
const pastelPink = "#FDE8EE";
const pastelMint = "#E8F7F3";
const softCream = "#FFF8F2";
const roseGold = "linear-gradient(90deg,#F6D7D9, #F7E7D4)";
const goldAccent = "#D7A86E";

export default function Home() {
  // Map imported images to products
  const imageMap: Record<string, string> = {
    '/images/c1.jpg': c1,
    '/images/c2.jpg': c2,
    '/images/c3.jpg': c3,
    '/images/c4.jpg': c4,
    '/images/c5.jpg': c5,
    '/images/c6.jpg': c6,
    '/images/c7.jpg': c7,
    '/images/c8.jpg': c8,
    '/images/c9.jpg': c9,
  };

  // Load cosmetic products from JSON and map images
  const cosmeticSamples = cosmeticProductsData.map(product => ({
    ...product,
    images: product.images.map(img => imageMap[img] || img)
  }));

  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const [showAppointmentSuccess, setShowAppointmentSuccess] = useState(false);
  const [appointmentSuccessData, setAppointmentSuccessData] = useState<any>(null);
  const [showTicketSuccess, setShowTicketSuccess] = useState(false);
  const [ticketSuccessData, setTicketSuccessData] = useState<any>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (product: any) => {
    setAddingToCart(product.id);
    
    try {
      // For authenticated users, use API only
      if (isAuthenticated && token) {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image
          })
        });

        if (response.ok) {
          window.dispatchEvent(new Event('cartUpdated'));
          toast({
            title: "Added to Cart",
            description: `${product.name} has been added to your cart.`,
          });
          return;
        }
        
        throw new Error('Failed to add to cart');
      }
      
      // For guest users only, use localStorage
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      const existingItemIndex = localCart.findIndex((item: any) => 
        item.productId === product.id || item.id === product.id
      );
      
      if (existingItemIndex !== -1) {
        localCart[existingItemIndex].quantity = (localCart[existingItemIndex].quantity || 1) + 1;
      } else {
        localCart.push({
          id: `local-${product.id}-${Date.now()}`,
          productId: product.id,
          quantity: 1,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            images: product.images
          }
        });
      }
      
      localStorage.setItem('localCart', JSON.stringify(localCart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart.",
        variant: "destructive"
      });
    } finally {
      setAddingToCart(null);
    }
  };

  // Load categories from JSON
  const categories = categoriesData;

  useEffect(() => {
    const appointmentSuccess = sessionStorage.getItem('appointmentSuccess');
    if (appointmentSuccess) {
      try {
        const successData = JSON.parse(appointmentSuccess);
        setAppointmentSuccessData(successData);
        setShowAppointmentSuccess(true);
        sessionStorage.removeItem('appointmentSuccess');
      } catch (error) {
        console.error('Error parsing appointment success data:', error);
      }
    }

    const ticketSuccess = sessionStorage.getItem('ticketSuccess');
    if (ticketSuccess) {
      try {
        const successData = JSON.parse(ticketSuccess);
        setTicketSuccessData(successData);
        setShowTicketSuccess(true);
        sessionStorage.removeItem('ticketSuccess');
      } catch (error) {
        console.error('Error parsing ticket success data:', error);
      }
    }
  }, []);

  // soft hero backgrounds tailored for cosmetics
  const heroBackgrounds = [
    `linear-gradient(135deg, ${pastelPink} 0%, ${softCream} 100%)`,
    `linear-gradient(135deg, ${pastelMint} 0%, ${softCream} 100%)`,
    `linear-gradient(135deg, ${softCream} 0%, ${pastelPink} 100%)`,
  ];

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [heroBackgroundIndex, setHeroBackgroundIndex] = useState(0);

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'Sparkles': Sparkles,
      'Droplets': Droplets,
      'Palette': Palette,
      'FlaskConical': FlaskConical,
      'Leaf': Leaf,
      'ShieldCheck': ShieldCheck,
    };
    return iconMap[iconName] || Sparkles;
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/products?category=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`);
  };

  const testimonials = [
    { name: "Rajesh Kumar", location: "Mumbai", initials: "RK", rating: 5, review: "The Cellular Revive Serum is absolutely amazing!" },
    { name: "Priya Sharma", location: "Delhi", initials: "PS", rating: 5, review: "Got the complete anti-aging skincare set. Luxurious formulations." },
    { name: "Amit Mehta", location: "Bangalore", initials: "AM", rating: 5, review: "Hydrating Facial Cream — texture is divine." },
    { name: "Sneha Patel", location: "Ahmedabad", initials: "SP", rating: 5, review: "Vitamin C Brightening Serum is magnificent!" },
    { name: "Vikram Singh", location: "Pune", initials: "VS", rating: 5, review: "Quality exceeded expectations — pharmaceutical-grade." },
    { name: "Kavita Reddy", location: "Hyderabad", initials: "KR", rating: 5, review: "SPF moisturizer and night cream are gorgeous." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroBackgroundIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBackgrounds.length]);

  // Featured gallery autoplay (product carousel)
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % cosmeticSamples.length);
    }, 4500);
    return () => clearInterval(carouselInterval);
  }, [cosmeticSamples.length]);



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToProducts = () => {
    document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-[--page-bg]" style={{ ['--page-bg' as any]: softCream }}>
      {/* HERO */}

      <Hero />
      {/* <section className="relative h-screen flex items-center overflow-hidden">
        {heroBackgrounds.map((gradient, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === heroBackgroundIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: gradient }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />

        <div className="relative z-10 max-w-4xl px-8 md:px-16 text-left">
          <div className="inline-flex items-center rounded-full px-4 py-2 mb-6 border border-transparent bg-white/60 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-[#FFF4E8]0 mr-2" />
            <span className="text-sm font-medium text-gray-800">Pharmaceutical + Cosmetic Fusion</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-6 leading-tight text-gray-900">
            Liminara
            <span className="block text-4xl md:text-5xl text-[#4B3A2F] tracking-tight">Luxury Skincare</span>
          </h1>

          <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl">
            Clinical formulations, indulgent textures — results you can see. Clean ingredients, responsibly manufactured.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={scrollToProducts}
              className="rounded-full px-8 py-3 font-semibold shadow-lg transform transition hover:scale-[1.02]"
              style={{ background: 'linear-gradient(90deg,#FBE2E8,#FDEDED)', color: '#6B1F2C' }}
              data-testid="button-explore-collection"
            >

              Shop the Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button></div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 border border-[#FFF4E8]">
              <ShieldCheck className="h-4 w-4 mr-2 text-[#FFF4E8]0" />
              <span className="text-gray-800">Dermatologist-Tested</span>
            </div>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 border border-[#FFF4E8]">
              <Star className="h-4 w-4 mr-2 text-amber-400" />
              <span className="text-gray-800">4.9★ Rating</span>
            </div>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 border border-[#FFF4E8]">
              <Truck className="h-4 w-4 mr-2 text-[#FFF4E8]0" />
              <span className="text-gray-800">Fast Delivery</span>
            </div>
          </div>
        </div>
      </section> */}

      {/* CATEGORIES */}
      {/* <section className="py-16 bg-gradient-to-b from-[#FFF4E8]/30 via-white to-[#F5D7B0]/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, #ec4899 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Sparkles className="h-8 w-8 text-[#C4A580]/100" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">Explore Our Range</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">Curated categories to match your skincare goals.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {categories.map((category: any, index) => {
              const IconComponent = getCategoryIcon(category.icon);
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id, category.name)}
                  className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                >
                  <div className="relative h-28 w-full rounded-2xl shadow-md overflow-hidden" style={{ background: 'white' }}>
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="w-12 h-12 mb-3 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(90deg,#FFEFF2,#FFF7ED)' }}>
                        <IconComponent className="h-6 w-6 text-[#4B3A2F]" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button className="rounded-full px-8 py-3 font-semibold shadow-lg bg-gradient-to-r from-[#FFF4E8]0 to-[#4B3A2F] hover:from-[#4B3A2F] hover:to-[#3B2D25] text-white">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      <div id="cosmetics-section">
        <CosmeticsProducts />
      </div>

      {/* FEATURED */}
      <section id="collection-section" className="py-24 relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${pastelPink} 0%, #fff 70%)` }}>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header + controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B2D25]">Featured Collection</h2>
              <p className="text-sm text-[#4B3A2F] mt-2">Curated favourites — cinematic parallax storytelling.</p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <Button onClick={() => navigate('/products?sort=popular')} className="rounded-full px-4 py-2 bg-[#4B3A2F] text-white shadow-sm">Popular</Button>
              <Button onClick={() => navigate('/products?sort=new')} variant="outline" className="rounded-full px-4 py-2 border-[#E3C7A0] text-[#4B3A2F]">New</Button>
            </div>
          </div>

          {/* Slider container: left visual stage, right sticky info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white" id="featured-slider" ref={(el) => {
                /* placeholder for possible ref usage */
              }}>
                {/* visual stage: will show active slide composition — each slide can contain multiple layers */}
                <div className="slider-stage w-full h-96 relative flex items-center justify-center bg-[#FFF4E8]">
                  {cosmeticSamples.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentProductIndex ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
                      aria-hidden={idx === currentProductIndex ? 'false' : 'true'}
                    >
                      {/* layered composition: background overlay, mid layer (product shadow), foreground product */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

                      <motion.div className="absolute inset-0 layer-foreground flex items-center justify-center" initial={{ opacity: 0 }} animate={idx === currentProductIndex ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.6 }}>
                        {/* subtle mid-shadow behind product for depth */}
                        <div className="absolute w-72 h-40 rounded-xl bg-gradient-to-r from-[#F5D7B0] to-transparent blur-3xl opacity-40" style={{ filter: 'blur(24px)', transform: 'translateY(18px)' }} />

                        <motion.img
                          src={slide.images?.[0]}
                          alt={slide.name}
                          className="mx-auto max-h-[84%] object-contain rounded relative z-10"
                          initial={{ opacity: 0, y: 20, scale: 0.98 }}
                          animate={idx === currentProductIndex ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />

                        {/* decorative SVG glint (animates in) */}
                        <svg className="slide-glint absolute right-20 top-12 w-20 h-20 pointer-events-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id={`g-${idx}`} x1="0" x2="1">
                              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#FDE8EE" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M50 2 L61 38 L98 38 L67 59 L78 96 L50 74 L22 96 L33 59 L2 38 L39 38 Z" fill={`url(#g-${idx})`} opacity="0.9" />
                        </svg>
                      </motion.div>

                      {/* text layer */}
                      <motion.div
                        className="absolute left-8 bottom-8 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md slide-text"
                        initial={{ x: -20, opacity: 0 }}
                        animate={idx === currentProductIndex ? { x: 0, opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                      >
                        <div className="text-xs text-[#FFF4E8]0 uppercase">Featured</div>
                        <div className="font-semibold text-[#3B2D25]">{slide.name}</div>
                        <div className="text-sm text-[#4B3A2F]">₹{slide.price}</div>
                      </motion.div>

                      {/* small particle layer using simple divs for lightweight sparkle */}
                      <div className="absolute left-6 top-6 pointer-events-none">
                        <div className="particle w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                        <div className="particle w-1.5 h-1.5 bg-white rounded-full opacity-60 ml-6 mt-3" />
                      </div>
                    </div>
                  ))}
                </div>


                {/* thumbnails / progress rail */}
                <div className="p-4 flex items-center gap-3 overflow-x-auto">
                  {cosmeticSamples.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setCurrentProductIndex(idx)}
                      className={`flex-none w-20 h-20 rounded-lg overflow-hidden border-2 transition ${idx === currentProductIndex ? 'border-[#4B3A2F] scale-105' : 'border-transparent hover:border-[#E3C7A0]'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>

                {/* slider arrows */}
                <button
                  aria-label="Previous"
                  onClick={() => setCurrentProductIndex((prev) => (prev - 1 + cosmeticSamples.length) % cosmeticSamples.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow flex items-center justify-center"
                >
                  ◀
                </button>
                <button
                  aria-label="Next"
                  onClick={() => setCurrentProductIndex((prev) => (prev + 1) % cosmeticSamples.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow flex items-center justify-center"
                >
                  ▶
                </button>
              </div>

            </div>

            {/* RIGHT: sticky product detail card */}
            <aside className="sticky top-24 self-start">
              <motion.div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg border border-[#FFF4E8]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} key={currentProductIndex}>
                {cosmeticSamples[currentProductIndex] ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-[#FFF4E8] overflow-hidden flex items-center justify-center">
                        <img src={cosmeticSamples[currentProductIndex].images?.[0]} alt={cosmeticSamples[currentProductIndex].name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs text-[#FFF4E8]0 uppercase">Editor's Pick</div>
                        <h3 className="text-lg font-semibold text-[#3B2D25]">{cosmeticSamples[currentProductIndex].name}</h3>
                        <div className="text-sm text-[#4B3A2F]">₹{cosmeticSamples[currentProductIndex].price}</div>
                      </div>
                    </div>

                    <p className="text-sm text-[#4B3A2F] mb-4">{(cosmeticSamples[currentProductIndex] as any).shortDescription || (cosmeticSamples[currentProductIndex] as any).description?.slice(0, 140)}</p>

                    <div className="flex flex-col gap-3">
                      <Button onClick={() => navigate(`/product/${cosmeticSamples[currentProductIndex].id}`)} className="rounded-full px-4 py-2 bg-[#4B3A2F] text-white">Buy Now</Button>
                      <Button
                        variant="outline"
                        className="rounded-full px-4 py-2 border-[#E3C7A0] text-[#4B3A2F]"
                        onClick={() => handleAddToCart(cosmeticSamples[currentProductIndex])}
                        disabled={addingToCart === cosmeticSamples[currentProductIndex].id}
                      >
                        {addingToCart === cosmeticSamples[currentProductIndex].id ? "Adding..." : "Add to Cart"}
                      </Button>
                      <Button variant="ghost" className="rounded-full px-4 py-2 text-[#4B3A2F]">Save for Later</Button>
                    </div>

                    <div className="mt-4 text-xs text-[#FFF4E8]0">Fast delivery • 30-day returns • Dermatologist tested</div>
                  </>
                ) : (
                  <div className="text-[#FFF4E8]0">No featured product available</div>
                )}
              </motion.div>

              <div className="mt-6 text-center">
                <Link to="/products">
                  <Button className="rounded-full px-6 py-2" style={{ background: 'linear-gradient(90deg,#F9D7DE,#FDE9EE)', color: '#7A1530' }}>View All Products</Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* autoplay logic (framer + interval) handled via useEffect below */}
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-[--why-bg]" style={{ ['--why-bg' as any]: softCream }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Why Liminara</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">Clinical rigor with luxurious experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <ShieldCheck className="h-8 w-8 mx-auto text-[#4B3A2F] mb-4" />
              <h3 className="font-semibold mb-2">Dermatologist Approved</h3>
              <p className="text-sm text-gray-600">Tested for safety and efficacy on diverse skin types.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <FlaskConical className="h-8 w-8 mx-auto text-[#4B3A2F] mb-4" />
              <h3 className="font-semibold mb-2">Clinically Proven</h3>
              <p className="text-sm text-gray-600">Active ingredients backed by clinical studies.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <Truck className="h-8 w-8 mx-auto text-[#4B3A2F] mb-4" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Express options available in metro cities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 md:py-20" style={{ background: `linear-gradient(180deg, ${pastelPink} 0%, #fff 50%)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3B2D25] mb-2">What Our Customers Say</h2>
            <p className="text-[#4B3A2F]">Real skin journeys — shared with love.</p>
          </div>

          {/* Mobile: Simple Slideshow */}
          <div className="md:hidden">
            <div className="relative max-w-sm mx-auto">
              {/* Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C4A580] to-[#4B3A2F] flex items-center justify-center text-white font-bold text-lg mr-3">
                    {testimonials[currentTestimonialIndex]?.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[#3B2D25] text-lg">{testimonials[currentTestimonialIndex]?.name}</div>
                    <div className="text-sm text-[#FFF4E8]0">{testimonials[currentTestimonialIndex]?.location}</div>
                  </div>
                </div>

                <p className="text-[#3B2D25] mb-4">"{testimonials[currentTestimonialIndex]?.review}"</p>

                <div className="flex items-center">
                  {[...Array(testimonials[currentTestimonialIndex]?.rating || 5)].map((_, r) => (
                    <Star key={r} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#4B3A2F] hover:bg-[#FFF4E8]"
              >
                ◀
              </button>
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#4B3A2F] hover:bg-[#FFF4E8]"
              >
                ▶
              </button>

              {/* Dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonialIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentTestimonialIndex ? 'bg-[#4B3A2F] w-6' : 'bg-[#E3C7A0]'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Polaroid Stack Animation */}
          <div className="hidden md:block">
            <div className="relative flex items-center justify-center" style={{ minHeight: '320px' }}>
              {/* Background soft circle */}
              <div className="absolute w-[680px] h-[680px] rounded-full bg-gradient-to-r from-[#FFF4E8] to-[#F5D7B0] opacity-60 -z-10" />

              {/* Polaroid stack */}
              <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
                {testimonials.map((t, i) => {
                  const rotate = (i - currentTestimonialIndex) * 6 + (i % 2 === 0 ? -8 : 8);
                  const offset = (i - currentTestimonialIndex) * 40;
                  const zIndex = 20 - Math.abs(i - currentTestimonialIndex);
                  return (
                    <div
                      key={i}
                      onClick={() => setCurrentTestimonialIndex(i)}
                      className="cursor-pointer absolute w-64 bg-white rounded-xl shadow-2xl p-4 transition-all duration-500"
                      style={{
                        transform: `translateX(${offset}px) rotate(${rotate}deg)`,
                        left: '50%',
                        top: '50%',
                        marginLeft: '-160px',
                        marginTop: '-140px',
                        zIndex
                      }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C4A580] to-[#4B3A2F] flex items-center justify-center text-white font-bold mr-3">{t.initials}</div>
                        <div>
                          <div className="font-semibold text-[#3B2D25]">{t.name}</div>
                          <div className="text-xs text-[#FFF4E8]0">{t.location}</div>
                        </div>
                      </div>
                      <p className="text-sm text-[#4B3A2F]">"{t.review}"</p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          {[...Array(t.rating)].map((_, r) => (
                            <Star key={r} className="h-4 w-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <div className="text-xs text-[#C4A580]">Click to view</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Success Modal */}
      {showAppointmentSuccess && appointmentSuccessData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold">Appointment booked</h3>
                </div>
                <Button variant="ghost" onClick={() => setShowAppointmentSuccess(false)}><X /></Button>
              </div>
            </div>

            <div className="p-6">
              <p className="mb-4">Your meeting has been scheduled. A confirmation email was sent to {appointmentSuccessData.email}.</p>
              <div className="flex justify-end"><Button onClick={() => setShowAppointmentSuccess(false)}>Close</Button></div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Success Modal */}
      {showTicketSuccess && ticketSuccessData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Headphones className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">Support ticket created</h3>
                </div>
                <Button variant="ghost" onClick={() => setShowTicketSuccess(false)}><X /></Button>
              </div>
            </div>

            <div className="p-6">
              <p className="mb-4">We've received your request. Ticket ID: <strong>{ticketSuccessData.ticketId}</strong></p>
              <div className="flex justify-end"><Button onClick={() => setShowTicketSuccess(false)}>Close</Button></div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import ProductCard from "@/components/product-card";
// import { Link } from "wouter";
// import { ArrowRight, Star, Users, Award, Truck, ShieldCheck, CheckCircle, Sparkles, Droplets, Palette, FlaskConical, Leaf, Headphones, Video, X } from "lucide-react";
// import { useState, useEffect } from "react";
// import type { Product, Category } from "@shared/schema";
// import { useLocation } from "wouter";
// import { useToast } from "@/hooks/use-toast";

// // New cosmetic-first palettes (soft pastels + gold accents)
// const pastelPink = "#FDE8EE";
// const pastelMint = "#E8F7F3";
// const softCream = "#FFF8F2";
// const roseGold = "linear-gradient(90deg,#F6D7D9, #F7E7D4)";
// const goldAccent = "#D7A86E";

// export default function Home() {
//   const [, navigate] = useLocation();
//   const { toast } = useToast();
//   const [showAppointmentSuccess, setShowAppointmentSuccess] = useState(false);
//   const [appointmentSuccessData, setAppointmentSuccessData] = useState<any>(null);
//   const [showTicketSuccess, setShowTicketSuccess] = useState(false);
//   const [ticketSuccessData, setTicketSuccessData] = useState<any>(null);

//   const { data: featuredProducts = [], isLoading } = useQuery<Product[]>({
//     queryKey: ["/api/products/featured"],
//     queryFn: async () => {
//       const response = await fetch('/api/products/featured');
//       if (!response.ok) {
//         throw new Error('Failed to fetch featured products');
//       }
//       const data = await response.json();
//       return Array.isArray(data) ? data : [];
//     },
//   });

//   const { data: categories = [] } = useQuery<Category[]>({
//     queryKey: ["/api/categories"],
//     queryFn: async () => {
//       const response = await fetch('/api/categories');
//       if (!response.ok) {
//         throw new Error('Failed to fetch categories');
//       }
//       const data = await response.json();
//       return Array.isArray(data) ? data : [];
//     },
//   });

//   useEffect(() => {
//     const appointmentSuccess = sessionStorage.getItem('appointmentSuccess');
//     if (appointmentSuccess) {
//       try {
//         const successData = JSON.parse(appointmentSuccess);
//         setAppointmentSuccessData(successData);
//         setShowAppointmentSuccess(true);
//         sessionStorage.removeItem('appointmentSuccess');
//       } catch (error) {
//         console.error('Error parsing appointment success data:', error);
//       }
//     }

//     const ticketSuccess = sessionStorage.getItem('ticketSuccess');
//     if (ticketSuccess) {
//       try {
//         const successData = JSON.parse(ticketSuccess);
//         setTicketSuccessData(successData);
//         setShowTicketSuccess(true);
//         sessionStorage.removeItem('ticketSuccess');
//       } catch (error) {
//         console.error('Error parsing ticket success data:', error);
//       }
//     }
//   }, []);

//   // soft hero backgrounds tailored for cosmetics
//   const heroBackgrounds = [
//     `linear-gradient(135deg, ${pastelPink} 0%, ${softCream} 100%)`,
//     `linear-gradient(135deg, ${pastelMint} 0%, ${softCream} 100%)`,
//     `linear-gradient(135deg, ${softCream} 0%, ${pastelPink} 100%)`,
//   ];

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

//   const getCategoryIcon = (categoryName: string) => {
//     const name = categoryName.toLowerCase();
//     if (name.includes('serum') || name.includes('treatment')) return Sparkles;
//     if (name.includes('hydrat') || name.includes('moistur') || name.includes('cream')) return Droplets;
//     if (name.includes('makeup') || name.includes('cosmetic')) return Palette;
//     if (name.includes('clinical') || name.includes('active')) return FlaskConical;
//     if (name.includes('botanical') || name.includes('natural') || name.includes('organic')) return Leaf;
//     return Sparkles;
//   };

//   const handleCategoryClick = (categoryId: string, categoryName: string) => {
//     navigate(`/products?category=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`);
//   };

//   const testimonials = [
//     { name: "Rajesh Kumar", location: "Mumbai", initials: "RK", rating: 5, review: "The Cellular Revive Serum is absolutely amazing!" },
//     { name: "Priya Sharma", location: "Delhi", initials: "PS", rating: 5, review: "Got the complete anti-aging skincare set. Luxurious formulations." },
//     { name: "Amit Mehta", location: "Bangalore", initials: "AM", rating: 5, review: "Hydrating Facial Cream — texture is divine." },
//     { name: "Sneha Patel", location: "Ahmedabad", initials: "SP", rating: 5, review: "Vitamin C Brightening Serum is magnificent!" },
//     { name: "Vikram Singh", location: "Pune", initials: "VS", rating: 5, review: "Quality exceeded expectations — pharmaceutical-grade." },
//     { name: "Kavita Reddy", location: "Hyderabad", initials: "KR", rating: 5, review: "SPF moisturizer and night cream are gorgeous." },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % heroBackgrounds.length);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, [heroBackgrounds.length]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
//     }, 4500);
//     return () => clearInterval(interval);
//   }, [testimonials.length]);

//   const scrollToProducts = () => {
//     document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <main className="bg-[--page-bg]" style={{ ['--page-bg' as any]: softCream }}>
//       {/* HERO */}
//       <section className="relative h-screen flex items-center overflow-hidden">
//         {heroBackgrounds.map((gradient, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
//             style={{ background: gradient }}
//           />
//         ))}

//         <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />

//         <div className="relative z-10 max-w-4xl px-8 md:px-16 text-left">
//           <div className="inline-flex items-center rounded-full px-4 py-2 mb-6 border border-transparent bg-white/60 backdrop-blur-sm">
//             <Sparkles className="h-4 w-4 text-[#FFF4E8]0 mr-2" />
//             <span className="text-sm font-medium text-gray-800">Pharmaceutical + Cosmetic Fusion</span>
//           </div>

//           <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-6 leading-tight text-gray-900">
//             Liminara
//             <span className="block text-4xl md:text-5xl text-[#4B3A2F] tracking-tight">Luxury Skincare</span>
//           </h1>

//           <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl">
//             Clinical formulations, indulgent textures — results you can see. Clean ingredients, responsibly manufactured.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 mb-8">
//             <Button
//               onClick={scrollToProducts}
//               className="rounded-full px-8 py-3 font-semibold shadow-lg transform transition hover:scale-[1.02]"
//               style={{ background: 'linear-gradient(90deg,#FBE2E8,#FDEDED)', color: '#6B1F2C' }}
//               data-testid="button-explore-collection"
//             >
//               Shop the Collection
//               <ArrowRight className="ml-2 h-4 w-4" />
//             </Button>

//             <Button
//               onClick={() => navigate('/consultation')}
//               variant="outline"
//               className="rounded-full px-6 py-3 border-2 border-[#E3C7A0] text-[#3B2D25] font-medium"
//             >
//               Book a Consultation
//             </Button>
//           </div>

//           <div className="flex flex-wrap gap-4 text-sm">
//             <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 border border-[#FFF4E8]">
//               <ShieldCheck className="h-4 w-4 mr-2 text-[#FFF4E8]0" />
//               <span className="text-gray-800">Dermatologist-Tested</span>
//             </div>
//             <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 border border-[#FFF4E8]">
//               <Star className="h-4 w-4 mr-2 text-amber-400" />
//               <span className="text-gray-800">4.9★ Rating</span>
//             </div>
//             <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 border border-[#FFF4E8]">
//               <Truck className="h-4 w-4 mr-2 text-[#FFF4E8]0" />
//               <span className="text-gray-800">Fast Delivery</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CATEGORIES */}
//       <section className="py-16 bg-[--section-bg]" style={{ ['--section-bg' as any]: pastelMint }}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">Explore Our Range</h2>
//             <p className="text-lg text-gray-700 max-w-2xl mx-auto">Curated categories to match your skincare goals.</p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
//             {categories.map((category, index) => {
//               const IconComponent = getCategoryIcon(category.name);
//               return (
//                 <div
//                   key={category.id}
//                   onClick={() => handleCategoryClick(category.id, category.name)}
//                   className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
//                 >
//                   <div className="relative h-28 w-full rounded-2xl shadow-md overflow-hidden" style={{ background: 'white' }}>
//                     <div className="flex flex-col items-center justify-center h-full p-4">
//                       <div className="w-12 h-12 mb-3 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(90deg,#FFEFF2,#FFF7ED)' }}>
//                         <IconComponent className="h-6 w-6 text-[#4B3A2F]" />
//                       </div>
//                       <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="text-center">
//             <Link to="/products">
//               <Button className="rounded-full px-8 py-3 font-semibold shadow-lg" style={{ background: goldAccent, color: 'white' }}>
//                 View All Products
{/* <ArrowRight className="ml-2 h-4 w-4" />
              </Button > */}
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* FEATURED */}
//       <section id="featured-products" className="py-24" style={{ background: `linear-gradient(180deg, ${pastelPink} 0%, #fff 70%)` }}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
//             <div>
//               <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B2D25]">Featured Collection</h2>
//               <p className="text-sm text-[#4B3A2F] mt-2">Curated favourites — clinically effective, sensorially luxurious.</p>
//             </div>

//             <div className="mt-4 md:mt-0 flex items-center gap-3">
//               <Button onClick={() => navigate('/products?sort=popular')} className="rounded-full px-4 py-2 bg-[#4B3A2F] text-white shadow-sm">Popular</Button>
//               <Button onClick={() => navigate('/products?sort=new')} variant="outline" className="rounded-full px-4 py-2 border-[#E3C7A0] text-[#4B3A2F]">New</Button>
//             </div>
//           </div>

//           {/* New layout: left gallery (carousel-like) + right sticky product detail */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//             {/* LEFT: image gallery + thumbnails (span 2 cols on large screens) */}
//             <div className="lg:col-span-2">
//               <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white">
//                 {/* Main image area */}
//                 <div className="w-full h-96 flex items-center justify-center bg-[#FFF4E8]">
//                   {featuredProducts[0] ? (
//                     <img src={featuredProducts[0].images?.[0]} alt={featuredProducts[0].name} className="max-h-[88%] object-contain" />
//                   ) : (
//                     <div className="text-[#C4A580]">No Image</div>
//                   )}
//                 </div>

//                 {/* Thumbnails */}
//                 <div className="p-4 flex items-center gap-3 overflow-x-auto">
//                   {featuredProducts.slice(0, 6).map((p, idx) => (
//                     <button key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="flex-none w-24 h-24 rounded-xl overflow-hidden border-2 border-transparent hover:border-[#E3C7A0] transition">
//                       <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
//                     </button>
//                   ))}
//                 </div>

//                 {/* soft overlay badge */}
//                 <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-[#3B2D25] border border-[#F5D7B0]">Limited Edit</div>
//               </div>

//               {/* Secondary row: horizontal product cards */}
//               <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {featuredProducts.slice(1, 9).map((product) => (
//                   <div key={product.id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition transform hover:-translate-y-1">
//                     <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-[#FFF4E8] flex items-center justify-center">
//                       <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
//                     </div>
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h4 className="text-sm font-semibold text-[#3B2D25]">{product.name}</h4>
//                         <p className="text-xs text-[#FFF4E8]0 mt-1">{product.shortDescription || product.description?.slice(0, 60)}</p>
//                       </div>
//                       <div className="text-sm font-bold text-[#3B2D25]">₹{product.price}</div>
//                     </div>
//                     <div className="mt-3 flex items-center gap-2">
//                       <Button onClick={() => navigate(`/product/${product.id}`)} className="rounded-full px-3 py-1 bg-[#4B3A2F] text-white text-sm">View</Button>
//                       <Button variant="ghost" className="text-[#4B3A2F] text-sm">Wishlist</Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT: sticky product detail card */}
//             <aside className="sticky top-24 self-start">
//               <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg border border-[#FFF4E8]">
//                 {featuredProducts[0] ? (
//                   <>
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="w-16 h-16 rounded-xl bg-[#FFF4E8] overflow-hidden flex items-center justify-center">
//                         <img src={featuredProducts[0].images?.[0]} alt={featuredProducts[0].name} className="w-full h-full object-cover" />
//                       </div>
//                       <div>
//                         <div className="text-xs text-[#FFF4E8]0 uppercase">Editor’s Pick</div>
//                         <h3 className="text-lg font-semibold text-[#3B2D25]">{featuredProducts[0].name}</h3>
//                         <div className="text-sm text-[#4B3A2F]">₹{featuredProducts[0].price}</div>
//                       </div>
//                     </div>

//                     <p className="text-sm text-[#4B3A2F] mb-4">{featuredProducts[0].shortDescription || featuredProducts[0].description?.slice(0, 140)}</p>

//                     <div className="flex flex-col gap-3">
//                       <Button onClick={() => navigate(`/product/${featuredProducts[0].id}`)} className="rounded-full px-4 py-2 bg-[#4B3A2F] text-white">Buy Now</Button>
//                       <Button variant="outline" className="rounded-full px-4 py-2 border-[#E3C7A0] text-[#4B3A2F]">Add to Cart</Button>
//                       <Button variant="ghost" className="rounded-full px-4 py-2 text-[#4B3A2F]">Save for Later</Button>
//                     </div>

//                     <div className="mt-4 text-xs text-[#FFF4E8]0">Fast delivery • 30-day returns • Dermatologist tested</div>
//                   </>
//                 ) : (
//                   <div className="text-[#FFF4E8]0">No featured product available</div>
//                 )}
//               </div>

//               <div className="mt-6 text-center">
//                 <Link to="/products">
//                   <Button className="rounded-full px-6 py-2" style={{ background: 'linear-gradient(90deg,#F9D7DE,#FDE9EE)', color: '#7A1530' }}>View All Products</Button>
//                 </Link>
//               </div>
//             </aside>
//           </div>
//         </div>
//       </section>

//       {/* WHY CHOOSE US */}
//       <section className="py-20 bg-[--why-bg]" style={{ ['--why-bg' as any]: softCream }}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Why Liminara</h2>
//             <p className="text-lg text-gray-700 max-w-2xl mx-auto">Clinical rigor with luxurious experience.</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
//               <ShieldCheck className="h-8 w-8 mx-auto text-[#4B3A2F] mb-4" />
//               <h3 className="font-semibold mb-2">Dermatologist Approved</h3>
//               <p className="text-sm text-gray-600">Tested for safety and efficacy on diverse skin types.</p>
//             </div>
//             <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
//               <FlaskConical className="h-8 w-8 mx-auto text-[#4B3A2F] mb-4" />
//               <h3 className="font-semibold mb-2">Clinically Proven</h3>
//               <p className="text-sm text-gray-600">Active ingredients backed by clinical studies.</p>
//             </div>
//             <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
//               <Truck className="h-8 w-8 mx-auto text-[#4B3A2F] mb-4" />
//               <h3 className="font-semibold mb-2">Fast Delivery</h3>
//               <p className="text-sm text-gray-600">Express options available in metro cities.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="py-28" style={{ background: `linear-gradient(180deg, ${pastelPink} 0%, #fff 50%)` }}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-serif font-bold text-[#3B2D25] mb-2">What Our Customers Say</h2>
//             <p className="text-[#4B3A2F]">Real skin journeys — shared with love.</p>
//           </div>

//           {/* Unique polaroid carousel layout */}
//           <div className="relative flex items-center justify-center" style={{ minHeight: '420px' }}>
//             {/* Background soft circle */}
//             <div className="absolute w-[680px] h-[680px] rounded-full bg-gradient-to-r from-[#FFF4E8] to-[#F5D7B0] opacity-60 -z-10" />

//             {/* Polaroid stack */}
//             <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
//               {testimonials.map((t, i) => {
//                 const rotate = (i - currentTestimonialIndex) * 6 + (i % 2 === 0 ? -8 : 8);
//                 const offset = (i - currentTestimonialIndex) * 40;
//                 const zIndex = 20 - Math.abs(i - currentTestimonialIndex);
//                 return (
//                   <div
//                     key={i}
//                     onClick={() => setCurrentTestimonialIndex(i)}
//                     className="cursor-pointer absolute w-64 bg-white rounded-xl shadow-2xl p-4 transition-all duration-500"
//                     style={{
//                       transform: `translateX(${offset}px) rotate(${rotate}deg)`,
//                       left: '50%',
//                       top: '50%',
//                       marginLeft: '-160px',
//                       marginTop: '-140px',
//                       zIndex
//                     }}
//                   >
//                     <div className="flex items-center mb-3">
//                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C4A580] to-[#4B3A2F] flex items-center justify-center text-white font-bold mr-3">{t.initials}</div>
//                       <div>
//                         <div className="font-semibold text-[#3B2D25]">{t.name}</div>
//                         <div className="text-xs text-[#FFF4E8]0">{t.location}</div>
//                       </div>
//                     </div>
//                     <p className="text-sm text-[#4B3A2F]">"{t.review}"</p>

//                     <div className="mt-3 flex items-center justify-between">
//                       <div className="flex items-center">
//                         {[...Array(t.rating)].map((_, r) => (
//                           <Star key={r} className="h-4 w-4 text-amber-400" />
//                         ))}
//                       </div>
//                       <div className="text-xs text-[#C4A580]">Click to view</div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Detailed panel beneath */}
//           <div className="mt-12 flex flex-col md:flex-row items-center md:items-start gap-6">
//             <div className="bg-white rounded-3xl p-6 shadow-md flex-1">
//               <div className="flex items-start gap-4">
//                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFF4E8]0 to-[#3B2D25] flex items-center justify-center text-white font-bold text-xl">{testimonials[currentTestimonialIndex]?.initials}</div>
//                 <div>
//                   <div className="font-semibold text-[#3B2D25] text-lg">{testimonials[currentTestimonialIndex]?.name}</div>
//                   <div className="text-sm text-[#FFF4E8]0">{testimonials[currentTestimonialIndex]?.location} • {testimonials[currentTestimonialIndex]?.rating}★</div>
//                 </div>
//               </div>

//               <div className="mt-4 text-[#3B2D25]">"{testimonials[currentTestimonialIndex]?.review}"</div>

//               <div className="mt-6 flex items-center gap-3">
//                 <Button onClick={() => toast({ title: 'Thanks for the love!', description: 'We appreciate your feedback.' })} className="rounded-full px-4 py-2 bg-[#4B3A2F] text-white">Leave a Review</Button>
//                 <Button variant="ghost" onClick={() => navigate('/reviews')} className="text-[#4B3A2F]">See all reviews</Button>
//               </div>
//             </div>

//             {/* Video testimonial card */}
//             <div className="w-full md:w-1/3 bg-[#FFF4E8] rounded-2xl p-4 border border-[#F5D7B0] shadow-sm">
//               <div className="w-full h-44 bg-black/5 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
//                 <div className="text-[#4B3A2F] font-semibold">▶ Video Testimonial</div>
//               </div>
//               <div className="text-sm text-[#4B3A2F]">Watch customers share their skin journeys and see real before/after results.</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Appointment Success Modal */}
//       {showAppointmentSuccess && appointmentSuccessData && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg overflow-y-auto">
//             <div className="p-6 border-b">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                   <CheckCircle className="w-6 h-6 text-green-600" />
//                   <h3 className="font-semibold">Appointment booked</h3>
//                 </div>
//                 <Button variant="ghost" onClick={() => setShowAppointmentSuccess(false)}><X /></Button>
//               </div>
//             </div>

//             <div className="p-6">
//               <p className="mb-4">Your meeting has been scheduled. A confirmation email was sent to {appointmentSuccessData.email}.</p>
//               <div className="flex justify-end"><Button onClick={() => setShowAppointmentSuccess(false)}>Close</Button></div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Ticket Success Modal */}
//       {showTicketSuccess && ticketSuccessData && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg overflow-y-auto">
//             <div className="p-6 border-b">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                   <Headphones className="w-6 h-6 text-primary" />
//                   <h3 className="font-semibold">Support ticket created</h3>
//                 </div>
//                 <Button variant="ghost" onClick={() => setShowTicketSuccess(false)}><X /></Button>
//               </div>
//             </div>

//             <div className="p-6">
//               <p className="mb-4">We've received your request. Ticket ID: <strong>{ticketSuccessData.ticketId}</strong></p>
//               <div className="flex justify-end"><Button onClick={() => setShowTicketSuccess(false)}>Close</Button></div>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
