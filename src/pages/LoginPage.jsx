import { useState } from "react";
import LogoHeader from "../components/LogoHeader";
import FormHeader from "../components/FormHeader";
import InputWithTogglePassword from "../components/InputWithTogglePassword";
import Divider from "../components/Divider";
import SocialLoginButtons from "../components/SocialLoginButtons";
import HeroPanel from "../components/HeroPanel";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            title="Hello, Welcome Back"
            subtitle="Enter your email address and password to log in."
          />

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="text-right">
              <a
                href="#"
                className="text-sm font-bold hover:text-green-600 underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              style={{ borderRadius: "12px" }}
              className="w-full bg-black text-white py-3  font-medium ">
              LOGIN
            </button>
            <Divider />
            <SocialLoginButtons />
            <div className="text-center text-sm mt-2">
              Don't have an account?
              <Link
                to="/register"
                className="font-bold hover:text-green-600 underline">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
      <HeroPanel />
    </div>
  );
}
