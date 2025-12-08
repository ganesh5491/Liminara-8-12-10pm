import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingChat = () => {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const whatsappNumber = "+91 7083096332";
  const welcomeMessage = "Hi there!\nWelcome to Liminara - Your trusted partner in pharmaceutical and cosmetic excellence. How may we assist you today?";


  const handleWhatsAppClick = () => {
    if (isWhatsAppOpen) {
      setIsWhatsAppOpen(false);
    } else {
      setIsWhatsAppOpen(true);
      setTimeout(() => {
        setIsWhatsAppOpen(false);
        const encodedMessage = encodeURIComponent(welcomeMessage);
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
      }, 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 md:right-8 z-50">
      {isWhatsAppOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-[#E3C7A0] w-80 h-auto mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-[#4B3A2F] to-[#5C4A3A] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <FaWhatsapp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-sm">Liminara</div>
                <div className="text-xs text-[#F5D7B0]">Connect via WhatsApp</div>
              </div>
            </div>
            <button
              onClick={() => setIsWhatsAppOpen(false)}
              className="hover:bg-white/20 p-1 rounded"
              data-testid="button-close-whatsapp-preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="bg-[#FFF4E8] rounded-xl p-3 border-l-4 border-[#E3C7A0]">
              <p className="text-sm text-gray-800 mb-2">
                <strong>Welcome Message Preview:</strong>
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {welcomeMessage}
              </p>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Opening WhatsApp in a moment...
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleWhatsAppClick}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-12 h-12 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 relative group flex items-center justify-center"
        data-testid="button-whatsapp-chat"
        title="Chat with us on WhatsApp"
      >
        {isWhatsAppOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <FaWhatsapp className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Chat on WhatsApp
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
