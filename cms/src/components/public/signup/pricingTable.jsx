import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../core/elements";
import { getData } from "../../../backend/api";
const ShimmerCard = () => (
  <div className="bg-white rounded-lg w-[30%] p-5 text-center border border-gray-200 overflow-hidden md:w-[90%] md:max-w-[400px] md:mb-5">
    {/* Title and badge area */}
    <div className="border-b border-[#E2E4E9] p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      </div>
    </div>

    {/* Price area */}
    <div className="border-b border-[#E2E4E9] p-3">
      <div className="h-8 bg-gray-200 rounded w-24 animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
    </div>

    {/* Features list */}
    <div className="my-5 space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      ))}
    </div>

    {/* Button */}
    <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
  </div>
);
const PricingTable = ({ onSelect = () => {}, setCurrentStage }) => {
  const {
    data: plansData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      try {
        const response = await getData({}, "active-subscription-plan"); // Removed leading slash
        console.log("API Response:", response); // Debug log

        if (response?.status === 200 && response?.data?.data) {
          return response.data.data;
        } else {
          throw new Error(response?.message || "Failed to fetch plans data");
        }
      } catch (err) {
        console.error("API Error:", err); // Debug log
        throw new Error(err?.message || "Failed to fetch subscription plans");
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 1, // Only retry once
    onError: (err) => {
      console.error("Query Error:", err); // Debug log
    },
  });

  // Helper function to parse features HTML string into array
  const parseFeatures = (featuresHtml) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(featuresHtml, "text/html");
      return Array.from(doc.querySelectorAll("p")).map((p) => ({
        text: p.textContent.replace("✅ ", "").replace("❌ ", ""),
        included: p.textContent.includes("✅"),
      }));
    } catch (err) {
      console.error("Feature parsing error:", err);
      return [];
    }
  };

  // Calculate discount percentage
  const calculateDiscount = (price, offerPrice) => {
    if (!offerPrice || offerPrice >= price) return null;
    const discount = ((price - offerPrice) / price) * 100;
    return Math.round(discount) + "% Off";
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="w-full flex justify-center p-5 items-center flex-col">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex justify-center gap-5 px-10 py-4 md:flex-col md:items-center">
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex justify-center p-5 items-center flex-col">
        <div className="text-2xl font-semibold text-red-600">Error loading plans</div>
        <div className="text-base text-gray-600 mt-2">{error?.message || "Something went wrong. Please try again later."}</div>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  // Add check for empty or invalid data
  if (!plansData || !Array.isArray(plansData) || plansData.length === 0) {
    return (
      <div className="w-full flex justify-center p-5 items-center flex-col">
        <div className="text-2xl font-semibold">No plans available</div>
        <div className="text-base text-gray-600 mt-2">Please try again later.</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex justify-center p-5 items-center flex-col">
        <div className="text-2xl font-semibold">Choose from the plans below</div>
        <div className="text-base text-[#525866]">Review your account info and enter your billing info.</div>
      </div>

      <div className="flex justify-center gap-5 px-10 py-4  md:items-center">
        {plansData.map((plan, index) => {
          const features = parseFeatures(plan.features);
          const discount = calculateDiscount(plan.defaultPricing.price, 0);
          const isHighlighted = index === 1;

          return (
            <div
              key={plan._id}
              className={`
                bg-white rounded-lg w-[30%] p-5 text-center transition-all duration-300
                border border-gray-200
                ${isHighlighted ? "bg-blue-50 border-blue-500 shadow-lg scale-105" : ""}
                hover:border-blue-700 hover:bg-blue-50 hover:scale-105 hover:shadow-lg
                md:w-[90%] md:max-w-[400px] md:scale-100 md:mb-5
              `}
            >
              {/* Plan content remains the same */}
              <div className="border-b border-[#E2E4E9] p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 text-sm rounded bg-gray-100">{plan.title}</div>
                  {discount && <div className="p-1.5 text-xs rounded-lg bg-[#cbf5e5] text-[#2d9f75]">{discount}</div>}
                </div>
                <p className="leading-6 text-left text-black text-sm">{plan.description}</p>
              </div>

              <div className="border-b border-[#E2E4E9] flex flex-col items-start p-3">
                <div className="text-3xl text-gray-800 m-0">{plan.defaultPricing.currency.symbol+""+plan.defaultPricing.price}</div>
                <div className="text-gray-600">Per Month</div>
              </div>

              <ul className="list-none p-0 my-5 text-left text-sm">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center my-2">
                    <span className={feature.included ? "text-green-600" : "text-red-500"}>{feature.included ? "✅" : "❌"}</span>
                    <span className="ml-2">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Button value="Choose Plan" ClickEvent={() => onSelect(plan._id)} align="signup" />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PricingTable;
