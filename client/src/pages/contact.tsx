import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Clock, Sparkles, Droplet, Heart } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: ""
  });

  const submitInquiryMutation = useMutation({
    mutationFn: async (data: typeof formData) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({ title:"Inquiry submitted!", description:"Our skin experts will contact you shortly." });
      setFormData({ firstName:"", lastName:"", email:"", phone:"", inquiryType:"", message:"" });
    },
    onError: () => toast({ title:"Failed to send", description:"Try again later.", variant:"destructive" })
  });

  const handleSubmit = (e:any)=>{
    e.preventDefault();
    if(!formData.firstName||!formData.lastName||!formData.email||!formData.inquiryType||!formData.message){
      return toast({title:"Fill all required fields",variant:"destructive"});
    }
    submitInquiryMutation.mutate(formData);
  };

  return(
    <div className="py-20 bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFEDE3] min-h-screen relative overflow-hidden">

      {/** ------------------ HERO ------------------ */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center bg-[#FFE5D1]/60 px-6 py-2 rounded-full shadow-md">
          <Sparkles className="text-[#3C2A22] mr-2 h-4 w-4 animate-pulse" />
          <span className="font-bold text-[#3C2A22] tracking-wide">Contact Liminara Cosmetics</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold mt-6 bg-gradient-to-r from-[#3C2A22] via-[#D4A573] to-[#3C2A22] bg-clip-text text-transparent">
          Get in Touch
        </h1>

        <p className="text-lg mt-4 text-[#5A4A42] max-w-2xl mx-auto leading-relaxed">
          Expert skin support — product guidance, personalized routine, ingredient insights, bulk partnerships.
        </p>
      </div>


      {/** ------------------ GRID ------------------ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-6">

        {/** CONTACT DETAILS CARD */}
        <Card className="bg-white/90 shadow-xl border-none rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#3C2A22] via-[#C19769] to-[#3C2A22] bg-clip-text text-transparent">
              Visit Our Skin Studio
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">

            {[
              { icon:MapPin, label:"Address", text:"Liminara Studio, Lower Parel, Mumbai 400013" },
              { icon:Phone, label:"Customer Support", text:"+91 70830 96332\nMon–Sat • 10AM - 7PM" },
              { icon:Mail, label:"Email", text:"support@liminara.in\ncare@liminaracosmetics.com" },
              { icon:Clock, label:"Working Hours", text:"Mon–Sat 10 AM - 7 PM\nClosed on National Holidays" }
            ].map((x,i)=>(
              <div key={i} className="flex gap-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#D3A276] to-[#B98A5A] rounded-full flex items-center justify-center shadow-md">
                  <x.icon className="text-white h-6 w-6"/>
                </div>
                <div>
                  <p className="text-[#3A2D25] font-bold text-lg">{x.label}</p>
                  <p className="text-[#665247] whitespace-pre-line">{x.text}</p>
                </div>
              </div>
            ))}


            <div className="rounded-2xl h-64 mt-10 bg-gradient-to-br from-[#FFF3E6] to-[#EFD4BB] shadow-inner flex items-center justify-center">
              <MapPin className="h-10 w-10 text-[#3A2C23] mb-2"/>
              <p className="text-sm text-[#3A2C23] mt-4">Click to open Google Maps</p>
            </div>

          </CardContent>
        </Card>


        {/** FORM */}
        <Card className="bg-white/95 shadow-xl border-none rounded-3xl p-6 sm:p-10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#3A2C23] via-[#C99A6E] to-[#3A2C23] bg-clip-text text-transparent">
              Send Us a Message
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input placeholder="First Name *" required
                  className="rounded-xl border-[#E1C7A4]"
                  value={formData.firstName} onChange={e=>setFormData({...formData,firstName:e.target.value})}/>

                <Input placeholder="Last Name *" required
                  className="rounded-xl border-[#E1C7A4]"
                  value={formData.lastName} onChange={e=>setFormData({...formData,lastName:e.target.value})}/>
              </div>

              <Input placeholder="Email Address *" required type="email"
                className="rounded-xl border-[#E1C7A4]"
                value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})}/>

              <Input placeholder="Phone Number"
                className="rounded-xl border-[#E1C7A4]"
                value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})}/>

              <Select value={formData.inquiryType} onValueChange={e=>setFormData({...formData,inquiryType:e})}>
                <SelectTrigger className="rounded-xl border-[#E1C7A4]">
                  <SelectValue placeholder="Select inquiry type *"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product Inquiry</SelectItem>
                  <SelectItem value="routine">Skin Routine Consultation</SelectItem>
                  <SelectItem value="ingredients">Ingredient Safety Query</SelectItem>
                  <SelectItem value="bulk">Bulk / Business Orders</SelectItem>
                  <SelectItem value="collab">Influencer / Collaboration</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                </SelectContent>
              </Select>

              <Textarea rows={5} required placeholder="Describe your concern or question..."
                className="rounded-xl border-[#E1C7A4]"
                value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})}/>

              <Button type="submit"
                disabled={submitInquiryMutation.isPending}
                className="rounded-2xl w-full text-lg font-semibold bg-gradient-to-r from-[#C79C6D] to-[#A2764B] hover:brightness-110">
                {submitInquiryMutation.isPending ? "Sending..." : "Submit Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>


      {/** WHY LIMINARA SECTION */}
      <div className="text-center mt-32">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#3A2C23] via-[#CF9A6D] to-[#3A2C23] bg-clip-text text-transparent">
          Why Liminara Cosmetics?
        </h2>
        <p className="text-[#5B4B42] mt-4 mb-14 text-lg max-w-xl mx-auto">
          Where skincare meets science — and beauty meets results.
        </p>

        <div className="grid md:grid-cols-3 gap-10 px-8">

          <div className="p-10 bg-white/90 rounded-3xl shadow-xl hover:scale-[1.03] transition">
            <Droplet className="h-12 w-12 text-[#C99A6E] mx-auto"/>
            <h3 className="font-bold text-xl mt-4 text-[#3A2C23]">Clinical-Grade Formulations</h3>
            <p className="mt-3 text-[#65564E]">Dermatologically tested ingredients designed for real results.</p>
          </div>

          <div className="p-10 bg-white/90 rounded-3xl shadow-xl hover:scale-[1.03] transition">
            <Heart className="h-12 w-12 text-[#C99A6E] mx-auto"/>
            <h3 className="font-bold text-xl mt-4 text-[#3A2C23]">100% Transparency</h3>
            <p className="mt-3 text-[#65564E]">No hidden chemicals. No damage-first formulas. Only skin-safe care.</p>
          </div>

          <div className="p-10 bg-white/90 rounded-3xl shadow-xl hover:scale-[1.03] transition">
            <Sparkles className="h-12 w-12 text-[#C99A6E] mx-auto"/>
            <h3 className="font-bold text-xl mt-4 text-[#3A2C23]">Result-Driven Routines</h3>
            <p className="mt-3 text-[#65564E]">We help you build a skincare plan tailored to your skin behavior.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
