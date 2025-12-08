import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/checkout');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to checkout...</p>
    </div>
  );
}