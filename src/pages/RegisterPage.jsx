import { useState } from "react";
import LogoHeader from "../components/LogoHeader";
import FormHeader from "../components/FormHeader";
import InputWithTogglePassword from "../components/InputWithTogglePassword";
import HeroPanel from "../components/HeroPanel";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LogoHeader title="SecureMail" />
          <FormHeader
            title="Create your account"
            subtitle="Please fill the bellow data to create an account"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              style={{ borderRadius: "12px" }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              style={{ borderRadius: "12px" }}
            />
            <InputWithTogglePassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <InputWithTogglePassword
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 accent-green-600 text-green-600 bg-white border-gray-300 rounded checked:bg-green-600 checked:border-green-600 focus:outline-none focus:ring-0"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to{" "}
                <a
                  href="/terms"
                  className="font-bold text-green-600 underline"
                  target="_blank">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              ttype="submit"
              style={{ borderRadius: "12px" }}
              className="w-full bg-black text-white py-3  font-medium ">
              <Link to="/otp"> Register Now</Link>
            </button>
            <div className="text-center text-sm mt-2">
              Already have an account?{" "}
              <Link to="/" className="font-bold hover:text-green-600 underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
      <HeroPanel />
    </div>
  );
}
