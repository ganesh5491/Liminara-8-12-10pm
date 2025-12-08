import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#FFF4E8] via-[#FFFAF5] to-white border-t-2 border-[#E3C7A0]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#F5D7B0]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#E3C7A0]/10 to-transparent rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-4 group hover:scale-105 transition-all duration-500">
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#E3C7A0]/30 group-hover:ring-[#E3C7A0]/70 transition-all duration-500 shadow-lg group-hover:shadow-[#E3C7A0]/30 group-hover:shadow-xl flex-shrink-0">
                                <img
                                    src="/indosaga-logo.jpg"
                                    alt="Liminara Beauty Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center leading-tight">
                                <div className="text-xl font-display font-bold text-[#3B2D25] whitespace-nowrap">
                                    Liminara
                                </div>
                                <div className="text-xl font-display font-bold text-[#3B2D25] whitespace-nowrap">
                                    Beauty
                                </div>
                            </div>
                        </div>
                        <p className="text-[#4A4A4A] mb-4 text-sm leading-relaxed">
                            Premium pharmaceutical-grade beauty products formulated for radiant skin.
                        </p>

                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5D7B0]/20 to-[#E3C7A0]/20 flex items-center justify-center hover:from-[#4B3A2F] hover:to-[#5C4A3A] hover:text-white transition-all duration-300 group">
                                <Facebook className="h-4 w-4 text-[#4B3A2F] group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5D7B0]/20 to-[#E3C7A0]/20 flex items-center justify-center hover:from-[#4B3A2F] hover:to-[#5C4A3A] hover:text-white transition-all duration-300 group">
                                <Twitter className="h-4 w-4 text-[#4B3A2F] group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5D7B0]/20 to-[#E3C7A0]/20 flex items-center justify-center hover:from-[#4B3A2F] hover:to-[#5C4A3A] hover:text-white transition-all duration-300 group">
                                <Instagram className="h-4 w-4 text-[#4B3A2F] group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5D7B0]/20 to-[#E3C7A0]/20 flex items-center justify-center hover:from-[#4B3A2F] hover:to-[#5C4A3A] hover:text-white transition-all duration-300 group">
                                <Linkedin className="h-4 w-4 text-[#4B3A2F] group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold font-display mb-4 text-[#3B2D25]">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link to="/about" className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold font-display mb-4 text-[#3B2D25]">Categories</h4>
                        <ul className="space-y-2">
                            <li>
                                <span className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">Serums</span>
                            </li>
                            <li>
                                <span className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">Moisturizers</span>
                            </li>
                            <li>
                                <span className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">Cleansers</span>
                            </li>
                            <li>
                                <span className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">Sunscreens</span>
                            </li>
                            <li>
                                <span className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer text-sm">Masks</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold font-display mb-4 text-[#3B2D25]">Contact Info</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3 text-[#4A4A4A]">
                                <MapPin className="h-4 w-4 text-[#4B3A2F] mt-0.5 flex-shrink-0" />
                                <span>123 Beauty Boulevard, Mumbai</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#4A4A4A]">
                                <Phone className="h-4 w-4 text-[#4B3A2F] flex-shrink-0" />
                                <span>+91 70830 96332</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#4A4A4A]">
                                <Mail className="h-4 w-4 text-[#4B3A2F] flex-shrink-0" />
                                <span>info@liminara.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#E3C7A0]/30 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[#4A4A4A] text-sm">
                            &copy; 2024 Liminara Beauty. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link to="/privacy-policy" className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-conditions" className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer">
                                Terms & Conditions
                            </Link>
                            <Link to="/product-safety" className="text-[#4A4A4A] hover:text-[#4B3A2F] transition-colors cursor-pointer">
                                Product Safety
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
