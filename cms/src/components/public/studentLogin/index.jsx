import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin, clearLoginSession } from "../../../store/actions/login";
import { logo } from "../../../images";
import withLayout from "../layout";
import styled from "styled-components";
import { projectSettings } from "../../project/brand/project";
import { postData } from "../../../backend/api";
import { getDefaultMenuPath } from "../../../menuSections";

const StudentLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login);
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `Student Login - ${projectSettings.title}`;
  }, []);

  useEffect(() => {
    if (user.data?.token) {
      navigate(getDefaultMenuPath(user.data?.menu ?? []), { replace: true });
    }
    if (user.error !== null) {
      dispatch(clearLoginSession());
    }
  }, [user.data?.token, user.data?.menu, user.error, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!pin || pin.length !== 4) {
      setError("Please enter your 4-digit PIN.");
      return;
    }

    setLoading(true);
    try {
      const response = await postData({ mobile, pin }, "auth/student-login");
      if (response.status === 200) {
        if (response.data.success) {
          dispatch(fetchLogin({ mobile, pin }, response));
        } else {
          setError(response.data.message || "Login failed.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-white flex flex-col">
        <nav className="flex justify-between items-center p-6">
          <button onClick={() => navigate("/")} className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Admin Login
          </button>
        </nav>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px]">
            <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
              <div className="mb-6 border-b border-gray-200 pb-4 flex flex-col gap-3 items-center justify-center">
                <img src={logo} alt="logo" className="h-8" />
                <p className="text-xl font-semibold text-gray-800">Student Login</p>
                <p className="text-sm text-gray-500 text-center">Enter your mobile number and 4-digit PIN</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                  <div className="flex gap-2 justify-center">
                    {[0, 1, 2, 3].map((i) => (
                      <input
                        key={i}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={pin[i] || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const newPin = pin.split("");
                          newPin[i] = val;
                          setPin(newPin.join("").slice(0, 4));
                          if (val && i < 3) {
                            e.target.nextElementSibling?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !pin[i] && i > 0) {
                            e.target.previousElementSibling?.focus();
                          }
                        }}
                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 text-center">Default PIN: last 4 digits of your mobile</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </PageContainer>
  );
};

export default withLayout(StudentLogin);

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
`;
