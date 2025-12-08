import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OTPLogin from '@/components/otp-login';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      // Check if we have a redirect target
      const redirectTarget = sessionStorage.getItem('redirectAfterLogin');
      if (redirectTarget && redirectTarget !== '/login') {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectTarget);
      } else {
        const checkoutProductId = sessionStorage.getItem('checkoutProductId');
        if (checkoutProductId) {
          navigate(`/product/${checkoutProductId}?checkout=true`);
        } else {
          navigate('/');
        }
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-warmWhite flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display text-darkBrown">
            Welcome to Liminara
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Sign in to continue your furniture shopping experience
          </p>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* OTP Login Component */}
          <OTPLogin />

          <div className="text-center mt-6">
            <Link to="/">
              <Button variant="ghost" className="text-gray-600 hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-500 text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>

          {/* Real Authentication Notice */}
          <div className="text-center mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-700 font-medium">Secure Passwordless Login</p>
            <p className="text-xs text-amber-600 mt-1">
              We'll send a verification code to your phone or email. No password needed!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}