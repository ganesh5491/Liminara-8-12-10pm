
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Heart, ShoppingCart, User, Menu, X, LogIn, LogOut } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navigation({ onCartClick = () => {}, onWishlistClick = () => {} }) {
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const prevAuthRef = useRef(isAuthenticated);
  const location = useLocation();

  /* ---------------- CART + WISHLIST COUNTS ---------------- */
  const { data: apiCartItems = [] } = useQuery<any[]>({ queryKey: ["/api/cart"], retry: false, enabled: isAuthenticated });
  const { data: apiWishlistItems = [] } = useQuery<any[]>({ queryKey: ["/api/wishlist"], retry: false, enabled: isAuthenticated });

  const [localCartCount, setLocalCartCount] = useState(0);
  const [localWishlistCount, setLocalWishlistCount] = useState(0);

  useEffect(() => {
    if (prevAuthRef.current !== isAuthenticated) {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
        queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      } else {
        queryClient.removeQueries({ queryKey: ["/api/cart"] });
        queryClient.removeQueries({ queryKey: ["/api/wishlist"] });
      }
      prevAuthRef.current = isAuthenticated;
    }
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    const updateCounts = () => {
      const lc = JSON.parse(localStorage.getItem("localCart") || "[]");
      const lw = JSON.parse(localStorage.getItem("localWishlist") || "[]");
      setLocalCartCount(lc.reduce((s: number, i: any) => s + (i.quantity || 1), 0));
      setLocalWishlistCount(lw.length);
    };
    updateCounts();
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("localWishlistUpdate", updateCounts);
    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("localWishlistUpdate", updateCounts);
    };
  }, []);

  const cartCount = isAuthenticated ? apiCartItems.reduce((s: number, i: any) => s + (i.quantity || 1), 0) : localCartCount;
  const wishlistCount = isAuthenticated ? apiWishlistItems.length : localWishlistCount;

  /* ---------------- LOGOUT FUNCTION ---------------- */
  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    logout(); window.location.href = "/";
  };

  /* ---------------- NAV LINKS ---------------- */
  const navLinks = [
    { href: "/products", name: "Products" },
    { href: "/#cosmetics-section", name: "Cosmetics", isInternal: true },
    { href: "/#collection-section", name: "Collection", isInternal: true },
  ];

  const handleNavClick = (e:any,l:any)=>{
    if(l.isInternal && location.pathname==="/"){
      e.preventDefault();
      document.getElementById(l.href.replace("/#",""))?.scrollIntoView({behavior:"smooth"});
    }
  }

  /* ---------------- SCROLL STATE ---------------- */
  const [isScrolled,setIsScrolled]=useState(false);
  const [isMobileMenu,setIsMobileMenu]=useState(false);

  useEffect(()=>{
    const sc=()=>setIsScrolled(window.scrollY>50);
    window.addEventListener("scroll",sc);
    return ()=>window.removeEventListener("scroll",sc);
  },[]);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? "bg-white/80 backdrop-blur-lg shadow-md py-4" : "bg-transparent py-6"
    }`}>
      <nav className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">

        {/* -------- LOGO -------- */}
        <Link to="/" className="text-3xl sm:text-3xl font-display font-bold text-gradient">
          Liminara
        </Link>

        {/* -------- DESKTOP NAV -------- */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((l)=>
            <Link key={l.name} to={l.href}
              onClick={(e)=>handleNavClick(e,l)}
              className="text-sm font-medium text-gray-600 hover:text-black transition relative group"
            >
              {l.name}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-black group-hover:w-full transition-all duration-300"/>
            </Link>
          )}
        </div>

        {/* -------- ACTION BUTTONS -------- */}
        <div className="flex items-center gap-2">

          {/* Wishlist */}
          <Button variant="ghost" size="icon" onClick={onWishlistClick} className="relative">
            <Heart className="w-5"/>
            {wishlistCount>0 && <span className="badge-count">{wishlistCount}</span>}
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
            <ShoppingCart className="w-5"/>
            {cartCount>0 && <span className="badge-count">{cartCount}</span>}
          </Button>

          {/* -------- AUTH LOGIC -------- */}
          {!authLoading && (
            user ? (
              <>
                {/* PROFILE 👇 visible after login */}
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="w-5" />
                  </Button>
                </Link>

                {/* LOGOUT */}
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="text-red-600 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <LogIn className="w-5" />
                </Button>
              </Link>
            )
          )}

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={()=>setIsMobileMenu(!isMobileMenu)}>
            {isMobileMenu ? <X/>:<Menu/>}
          </Button>
        </div>
      </nav>

      {/* -------- MOBILE NAV -------- */}
      {isMobileMenu && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl shadow-xl p-6 space-y-5 animate-fade-in">
          {navLinks.map((l)=>
            <Link key={l.name} to={l.href} onClick={()=>setIsMobileMenu(false)}
              className="block text-lg font-medium hover:pl-2 transition"
            >{l.name}</Link>
          )}
        </div>
      )}
    </header>
  );
}
