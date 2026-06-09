import React, { useState, useRef, useEffect } from "react";

const OtpBox = ({ value, onChange, onKeyDown, onPaste, inputRef, disabled }) => (
  <input
    ref={inputRef}
    type="text"
    maxLength={1}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onPaste={onPaste}
    disabled={disabled}
    className={`w-12 h-12 text-2xl font-semibold text-center border rounded-lg mx-1 
      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
      ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
  />
);

const OtpInput = ({ length = 6, onSubmit, onResend,data }) => {
  const [otpValues, setOtpValues] = useState(Array(length).fill(""));
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Fix: Create refs using useRef directly
  const inputRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = Array(length)
      .fill()
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }, [length]);

  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, e) => {
    if (isLocked) return;

    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.current?.focus();
    }

    setIsComplete(newOtp.every((val) => val !== ""));
  };

  const handleKeyDown = (index, e) => {
    if (isLocked) return;

    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newOtp = [...otpValues];
        newOtp[index - 1] = "";
        setOtpValues(newOtp);
        inputRefs.current[index - 1]?.current?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const handlePaste = (index, e) => {
    if (isLocked) return;

    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, length - index)
      .split("")
      .filter((char) => /^\d$/.test(char));

    const newOtp = [...otpValues];
    pastedData.forEach((digit, i) => {
      const targetIndex = index + i;
      if (targetIndex < length) {
        newOtp[targetIndex] = digit;
      }
    });

    setOtpValues(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val, i) => i >= index && !val);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < length) {
      inputRefs.current[nextEmptyIndex]?.current?.focus();
    } else if (index + pastedData.length < length) {
      inputRefs.current[index + pastedData.length]?.current?.focus();
    }

    setIsComplete(newOtp.every((val) => val !== ""));
  };

  const handleSubmit = () => {
    if (isComplete && attempts > 0 && !isLocked) {
      const otp = otpValues.join("");
      setAttempts((prev) => prev - 1);
      onSubmit(otp, attempts);
      setOtpValues(Array(length).fill(""));
      setIsComplete(false);

      if (attempts === 1) {
        setIsLocked(true);
      }
    }
  };

  const handleResend = () => {
    if (canResend && !isLocked) {
      setTimer(60);
      setCanResend(false);
      setOtpValues(Array(length).fill(""));
      setIsComplete(false);
      onResend();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Enter Verification Code</h2>
          <p className="text-sm text-gray-500 mt-2">{isLocked ? "Maximum attempts reached. Please try again later." : `You have ${attempts} attempts remaining`}</p>
        </div>

        <div className="flex justify-center items-center space-x-2">
          {otpValues.map((value, index) => (
            <OtpBox key={index} value={value} onChange={(e) => handleChange(index, e)} onKeyDown={(e) => handleKeyDown(index, e)} onPaste={(e) => handlePaste(index, e)} inputRef={inputRefs.current[index]} disabled={isLocked} />
          ))}
        </div>

        <div className="text-center text-sm">
          {!isLocked && (
            <button onClick={handleResend} disabled={!canResend} className={`text-blue-500 hover:text-blue-600 ${!canResend && "cursor-not-allowed text-gray-400"}`}>
              {canResend ? "Resend Code" : `A verification email sent to '${data?.email}, resend available in ${timer}s`}
            </button>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isComplete || isLocked}
          className={`w-full py-3 rounded-lg text-white font-medium transition-colors
            ${isComplete && !isLocked ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Verify Code
        </button>
      </div>
    </div>
  );
};

export default OtpInput;
