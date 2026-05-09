"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import PublicNavbar from "@/_components/shared/PublicNavbar";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/constants/icons";
import Error from "@/_components/shared/Error";

const TermsPage = () => {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAgree = () => {
    if (!isAgreed) {
      setError("agreement is required");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      router.push("/sign-up");
    }, 1500);
  };
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <Icons.Report className="w-5 h-5 text-primary-600" />,
      content:
        "By accessing or using SecureMail, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
    },
    {
      title: "2. User Accounts & Security",
      icon: <Icons.Lock className="w-5 h-5 text-primary-600" />,
      content:
        "You are responsible for maintaining the confidentiality of your account and password. SecureMail employs AES-256 bit encryption to protect your data, but user-side security (like strong passwords and 2FA) remains your responsibility. Any unauthorized use of your account must be reported immediately.",
    },
    {
      title: "3. Privacy & Data Protection",
      icon: <Icons.Reports className="w-5 h-5 text-primary-600" />,
      content:
        "Your privacy is our priority. We do not sell your personal data. Our end-to-end encryption ensures that only you and your intended recipients can read your communications. For more details, please refer to our Privacy Policy.",
    },
    {
      title: "4. Prohibited Use",
      icon: <Scale className="w-5 h-5 text-primary-600" />,
      content:
        "You may not use SecureMail for any illegal purposes, including but not limited to: phishing, distribution of malware, harassment, or transmitting copyrighted material without permission. We reserve the right to terminate accounts that violate these terms.",
    },
    {
      title: "5. Service Availability",
      icon: <Icons.Report className="w-5 h-5 text-primary-600" />,
      content:
        "While we strive for 99.9% uptime, SecureMail is provided 'as is' without warranties of any kind. We may perform maintenance or updates that could briefly interrupt service.",
    },
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <PublicNavbar backLink="/sign-up" backLabel="Back to Sign Up" />

      {/* Hero Section */}
      <section className="relative py-20 pt-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-radial-gradient from-secondary-500/10 via-transparent to-transparent opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text
              font="black"
              size="4xl"
              className="mb-4 tracking-tight md:text-6xl"
            >
              Terms & Conditions
            </Text>
            <Text color="primary-400" size="lg" className="max-w-2xl mx-auto">
              Last Updated: May 3, 2026. Please read these terms carefully
              before using the SecureMail platform.
            </Text>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              className="group p-6 rounded-2xl bg-primary-100/5 border border-primary-100/10 hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary-800/10 group-hover:bg-primary-500/20 transition-colors">
                  {section.icon}
                </div>
                <Text font="bold" size="xl">
                  {section.title}
                </Text>
              </div>
              <Text color="primary-400" className="leading-relaxed">
                {section.content}
              </Text>
            </motion.div>
          ))}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="agree"
              className="flex items-center gap-2 accent-[#87BE00] cursor-pointer"
            >
              <input
                type="checkbox"
                id="agree"
                checked={isAgreed}
                onChange={(e) => {
                  setIsAgreed(e.target.checked);
                  if (e.target.checked) setError("");
                }}
              />
              I agree to the terms and conditions
            </label>
            <Error error={error} />
          </div>
          <Button
            onClick={handleAgree}
            disabled={isLoading}
            className="px-8 py-3 h-auto text-lg shadow-[0_0_20px_rgba(0,0,0,0.2)]"
          >
            {isLoading ? (
              <>
                <Spinner className="w-5 h-5" />
                <span>Processing...</span>
              </>
            ) : (
              "Agree & Continue"
            )}
          </Button>
          {/* Contact Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-16 p-8 rounded-3xl bg-linear-to-br from-primary-500/10 to-primary-500/5 border border-secondary-500/20 text-center"
          >
            <Text font="bold" size="2xl" className="mb-4">
              Questions about our terms?
            </Text>
            <Text color="primary-400" className="mb-8 max-w-lg mx-auto">
              Our legal and security teams are here to help you understand how
              we protect your data.
            </Text>
            <Link href="/contact">
              <Button className="font-bold px-8 py-3 h-auto text-lg shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                Contact Legal Support
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer Meta */}
      <footer className="mt-4 py-8 border-t border-primary-100/10 text-center">
        <Text color="primary-600" size="sm">
          &copy; 2026 SecureMail Systems Inc. All rights reserved. Encryption
          standard: AES-256.
        </Text>
      </footer>
    </main>
  );
};

export default TermsPage;
