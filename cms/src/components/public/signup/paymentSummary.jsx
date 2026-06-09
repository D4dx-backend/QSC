import { ApplyButton, CouponInput, InputGroup, PaymentContainer, PlanDetails, PlanTitle, PriceBreakdown, SecureText, Subtitle, Title, Coupon } from "./style";
import { useState, useMemo } from "react";
import { Lock } from "lucide-react";
import { postData } from "../../../backend/api";
import { useNavigate } from "react-router-dom";

const ShimmerPaymentSummary = ({ openPricingPlan }) => (
  <PaymentContainer>
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Plan Selected</h3>
        <p className="text-gray-500 text-center mb-4">Choose a subscription plan to continue with your purchase!</p>
        <button onClick={openPricingPlan} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Choose a Plan
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />

      <div className="flex justify-center">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </PaymentContainer>
);

const PaymentSummary = ({ openPricingPlan, selectedPlanDetails, readyToPay = false, setMessage, onPaymentSuccess=()=>{} }) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isValidCoupon, setIsValidCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const { title = "Basic Plan", defaultPricing = {}, duration = 12 } = selectedPlanDetails || {};

  const monthlyPrice = defaultPricing?.price || 0;
  const currencySymbol = defaultPricing?.currency?.symbol || "$";
  // const currencyCode = defaultPricing?.currency?.shortName || "USD";

  const yearlyPrice = monthlyPrice * duration;
  const monthlyDiscountAmount = appliedDiscount / 12;
  const monthlyAfterDiscount = monthlyPrice - monthlyDiscountAmount;
  const yearlyAfterDiscount = monthlyAfterDiscount * 12;
  const savings = appliedDiscount > 0 ? appliedDiscount : duration === 12 ? yearlyPrice * 0.1 : 0;

  const isPaymentValid = useMemo(() => {
    return monthlyAfterDiscount > 0 && selectedPlanDetails && !isProcessing;
  }, [monthlyAfterDiscount, selectedPlanDetails, isProcessing]);

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "discount10") {
      setAppliedDiscount(yearlyPrice * 0.1); // 10% of yearly price
      setIsValidCoupon(true);
    } else {
      setAppliedDiscount(0);
      setIsValidCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!isPaymentValid) return;
    setIsProcessing(true);

    try {
      const response = await postData(
        {
          planId: selectedPlanDetails._id,
          couponCode: isValidCoupon ? couponCode : null,
        },
        "payments/create-order"
      );

      if (response.data?.data?.subscriptionId) {
        const user = response.data?.data?.user;
        const email = response.data?.data?.email;
        const options = {
          key: response.data?.data?.key,
          subscription_id: response.data.data.subscriptionId,
          name: user.companyName,
          description: `Annual Subscription - ${title} (Billed Monthly)`,
          handler: async (response) => {
            const verifyResponse = await postData(
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              },
              "payments/validate"
            );

            if (verifyResponse.status === 200) {
              onPaymentSuccess(response.razorpay_payment_id)
              setMessage({
                type: 1,
                content: "Subscription activated successfully!",
                icon: "success",
                onProceed: () => {
                  console.log("button triggered");
                  navigate("/");
                },
              });
            }
          },
          prefill: {
            name: `${user?.firstName} ${user?.lastName}`,
            email: email,
            contact: user?.contactPersonphone?.number,
          },
          notes: {
            planId: selectedPlanDetails._id,
            planName: title,
            duration: duration,
            billingFrequency: "monthly",
          },
          theme: {
            color: "#2563eb",
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Could not create subscription");
      }
    } catch (error) {
      console.error("Subscription creation failed:", error);
      setMessage({
        type: 1,
        content: error.message || "Subscription creation failed",
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlanDetails) {
    return <ShimmerPaymentSummary openPricingPlan={openPricingPlan} />;
  }

  return (
    <PaymentContainer>
      <Title>Complete Your Order</Title>
      <Subtitle>You're just one step away from accessing all features</Subtitle>

      <PlanDetails>
        <PlanTitle>
          <div style={{ justifyContent: "space-between", display: "flex", alignItems: "center" }}>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{title}</span>
              <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">Annual Plan</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
            <div>
              <p style={{ color: "rgba(82, 88, 102, 1)", fontSize: "14px" }}>Annual Plan (billed monthly)</p>
              <p className="text-xs text-gray-500 mt-1">
                {currencySymbol}
                {monthlyPrice.toFixed(2)}/month for 12 months
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">
                {currencySymbol}
                {monthlyPrice.toFixed(2)}/mo
              </span>
              {savings > 0 && (
                <p className="text-green-600 text-xs mt-1">
                  Save {currencySymbol}
                  {savings.toFixed(2)} annually
                </p>
              )}
            </div>
          </div>
        </PlanTitle>
      </PlanDetails>

      <div className="mb-6">
        <Coupon>Have a coupon code?</Coupon>
        <InputGroup>
          <CouponInput placeholder="Enter your coupon code" value={couponCode} onChange={handleCouponChange} />
          <ApplyButton onClick={handleApplyCoupon} disabled={!couponCode}>
            Apply
          </ApplyButton>
        </InputGroup>
        {isValidCoupon && <p className="text-green-600 text-sm mt-2">Coupon applied successfully!</p>}
      </div>

      <PriceBreakdown>
        <div>
          <span>Monthly Payment</span>
          <strong>
            {currencySymbol}
            {monthlyPrice.toFixed(2)}
          </strong>
        </div>
        <div style={{ borderBottom: "1px solid rgba(226, 228, 233, 1)", paddingBottom: "8px" }}>
          <span>Monthly Discount</span>
          <p style={{ color: "#38C793" }}>{monthlyDiscountAmount > 0 ? `-${currencySymbol}${monthlyDiscountAmount.toFixed(2)}` : `${currencySymbol}0.00`}</p>
        </div>
        <div className="total mt-2">
          <span>Due Monthly</span>
          <strong>
            {currencySymbol}
            {monthlyAfterDiscount.toFixed(2)}
          </strong>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Total annual value: {currencySymbol}
          {yearlyAfterDiscount.toFixed(2)}
        </div>
      </PriceBreakdown>

      <button
        onClick={handlePayment}
        disabled={!isPaymentValid || !readyToPay}
        className={`
          w-full py-3 px-4 rounded-lg text-base font-semibold
          transition-all duration-300 mt-4
          disabled:bg-text-disabled
          ${isPaymentValid ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
          ${isProcessing ? "opacity-75" : "opacity-100"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        `}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          "Complete Purchase"
        )}
      </button>

      <div className="flex justify-center mt-4">
        <SecureText>
          <Lock size={16} className="text-green-600" />
          <span className="ml-1">Secure SSL encrypted payment</span>
        </SecureText>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        By completing your purchase you agree to our <span className="text-blue-600 hover:underline">Terms of Service</span>
      </p>
    </PaymentContainer>
  );
};

export default PaymentSummary;
