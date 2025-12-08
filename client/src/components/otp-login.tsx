import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowRight, CheckCircle, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OTPLogin() {
    const [step, setStep] = useState<'request' | 'verify'>('request');
    const [method, setMethod] = useState<'phone' | 'email'>('phone');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(''); // Optional for new users
    const { toast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier,
                    method,
                    name: name || undefined
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }

            toast({
                title: "OTP Sent!",
                description: `We sent a code to your ${method}.`,
            });
            setStep('verify');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier,
                    otp
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid OTP');
            }

            // Call login which will update auth state and dispatch events
            login(data.user, data.token);

            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            });

            // Small delay to let state update propagate
            setTimeout(() => {
                // Check for redirect targets
                const returnUrl = sessionStorage.getItem('returnUrl');
                const checkoutProductId = sessionStorage.getItem('checkoutProductId');
                const pendingAction = sessionStorage.getItem('pendingAction');

                console.log('🔄 Checking redirects:', { returnUrl, checkoutProductId, pendingAction });

                // Clear session storage
                sessionStorage.removeItem('returnUrl');
                sessionStorage.removeItem('checkoutProductId');
                sessionStorage.removeItem('pendingAction');
                sessionStorage.removeItem('pendingProductId');

                // Determine where to redirect
                if (returnUrl && returnUrl !== '/login' && returnUrl !== '/auth') {
                    console.log('↪️ Redirecting to return URL:', returnUrl);
                    window.location.href = returnUrl; // Force full page reload to ensure state refresh
                } else if (checkoutProductId) {
                    console.log('↪️ Redirecting to checkout product:', checkoutProductId);
                    window.location.href = `/product/${checkoutProductId}`;
                } else {
                    console.log('↪️ Redirecting to home');
                    window.location.href = '/';
                }
            }, 100);
        } catch (error: any) {
            toast({
                title: "Verification Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            {step === 'request' ? (
                <form onSubmit={handleRequestOTP} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setMethod('phone')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'phone'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMethod('email')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'email'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </div>
                        </button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="identifier">
                            {method === 'phone' ? 'Phone Number' : 'Email Address'}
                        </Label>
                        <Input
                            id="identifier"
                            type={method === 'phone' ? 'tel' : 'email'}
                            placeholder={method === 'phone' ? 'e.g., 9876543210' : 'name@example.com'}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>

                    {/* Optional Name field for new users - hidden for simplicity unless we want to capture it upfront */}
                    {/* <div className="space-y-2">
            <Label htmlFor="name">Full Name (Optional)</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div> */}

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg bg-gradient-to-r from-primary to-[#4B3A2F] hover:from-primary/90 hover:to-[#4B3A2F]/90 transition-all shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Send Code <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Enter Verification Code</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            We sent a 6-digit code to <span className="font-medium text-gray-900">{identifier}</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => setStep('request')}
                            className="text-xs text-primary hover:underline mt-2"
                        >
                            Change {method === 'phone' ? 'number' : 'email'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="otp" className="sr-only">OTP Code</Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="h-14 text-center text-2xl tracking-[0.5em] font-mono"
                            maxLength={6}
                            autoFocus
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg bg-gradient-to-r from-primary to-[#4B3A2F] hover:from-primary/90 hover:to-[#4B3A2F]/90 transition-all shadow-lg"
                        disabled={isLoading || otp.length < 6}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            "Verify & Login"
                        )}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleRequestOTP}
                            disabled={isLoading}
                            className="text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                            Resend Code
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
