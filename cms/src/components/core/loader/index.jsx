import React from "react";
import { mobLogo } from "../../../images";

const Loader = ({ message, list, position = "fixed" }) => {
  return (
    <div
      className={`
        ${position === "fixed" ? "fixed" : "absolute"}
        inset-0 flex justify-center items-center
        ${list ? "bg-white/80" : "bg-white/80"}
        backdrop-blur-sm z-[1001]
      `}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Container for logo and shadow animation */}
        <div className="relative">
          {/* Human-like shadow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 
                       bg-gradient-radial from-black/20 via-black/10 to-transparent 
                       rounded-[100%] animate-[human-shadow_2s_ease-in-out_infinite]"
          />

          {/* Logo with wave animation */}
          <img src={mobLogo} alt="Loading" className="w-16 h-16 object-contain animate-[wave_2s_ease-in-out_infinite]" />
        </div>

        {message && <div className="text-sm font-medium text-gray-700 animate-pulse mt-2">{message}</div>}
      </div>
    </div>
  );
};

// Add wave and human shadow animations
const style = document.createElement("style");
style.textContent = `
  @keyframes wave {
    0%, 100% { 
      transform: translateY(0) rotate(0deg); 
    }
    25% { 
      transform: translateY(-5px) rotate(2deg); 
    }
    50% { 
      transform: translateY(0) rotate(0deg); 
    }
    75% { 
      transform: translateY(-5px) rotate(-2deg); 
    }
  }

  @keyframes human-shadow {
    0%, 100% { 
      transform: translateX(-50%) scaleX(1);
      opacity: 0.2;
    }
    25% { 
      transform: translateX(-53%) scaleX(0.85);
      opacity: 0.15;
    }
    50% { 
      transform: translateX(-50%) scaleX(1);
      opacity: 0.2;
    }
    75% { 
      transform: translateX(-47%) scaleX(0.85);
      opacity: 0.15;
    }
  }
`;
document.head.appendChild(style);

export default Loader;
