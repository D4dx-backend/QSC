import React from "react";
import { CheckCircle } from "lucide-react";

import { useNavigate } from "react-router-dom";

const PaymentSuccess = ({ showPaymentSuccess }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>

          <p className="text-gray-600 mb-8">Thank you for your purchase. You will receive a confirmation email shortly.</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="text-gray-900 font-medium">{showPaymentSuccess}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <span className="text-gray-600">Status</span>
                <div className="flex items-center mt-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-green-500 font-medium">Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => navigate("/")} className="w-full bg-primary-base text-white font-white rounded-lg px-4 py-3 font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
