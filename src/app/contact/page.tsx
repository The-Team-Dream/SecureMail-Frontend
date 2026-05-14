"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Shield,
  Lock,
  Globe,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import PublicNavbar from "@/_components/shared/PublicNavbar";
import { Input } from "@/_components/shared/Input";
import { Textarea } from "@/_components/shared/Textarea";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { Icons } from "@/constants/icons";
export const ContactSchema = z.object({
  fullName: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject must be at least 3 characters long"),
  message: z.string().min(1, "Message is required"),
});
export type IContact = z.infer<typeof ContactSchema>;
const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    setError,
    reset,
  } = useForm<IContact>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(ContactSchema),
  });
  const onSubmit = async (data: IContact) => {
    console.log(data);
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent successfully! We'll get back to you soon.");
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "support@securemail.com",
      link: "mailto:support@securemail.com",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+1 (555) 000-0000",
      link: "tel:+15550000000",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: "San Francisco, CA",
      link: "#",
    },
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, link: "#" },
    { icon: <Github className="w-5 h-5" />, link: "#" },
    { icon: <Linkedin className="w-5 h-5" />, link: "#" },
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Grid and Effects (Shared with NotFound style) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size:40px_40px" />
        <div className="absolute inset-0 bg-radial-gradient from-secondary-500/5 via-transparent to-transparent opacity-50" />
      </div>

      {/* Header */}
      <PublicNavbar backLink="/sign-in" backLabel="Back to Sign In" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 pt-28 md:pt-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-secondary-500/20 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <Text size="xs" font="bold" className="uppercase tracking-wider">
                Secure Support
              </Text>
            </div>

            <Text
              as="h1"
              font="black"
              size="5xl"
              className="mb-6 leading-tight"
            >
              Get in Touch
            </Text>

            <Text
              color="primary-400"
              size="lg"
              className="mb-12 max-w-lg leading-relaxed"
            >
              Have questions about our end-to-end encryption or need help with
              your account? Our team of security experts is here to assist you
              24/7.
            </Text>

            <div className="space-y-6 mb-12">
              {contactInfo.map((info, idx) => (
                <motion.a
                  key={idx}
                  href={info.link}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.3 }}
                  className="flex items-center gap-4 group p-4 rounded-2xl bg-primary-100/5 border border-primary-100/10 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all duration-300"
                >
                  <div className="p-3 rounded-xl bg-primary-100/10 group-hover:bg-primary-500/20 text-primary-400 group-hover:text-primary-500 transition-colors">
                    {info.icon}
                  </div>
                  <div>
                    <Text size="sm" color="primary-500" font="medium">
                      {info.label}
                    </Text>
                    <Text font="bold">{info.value}</Text>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Text
                size="sm"
                color="primary-500"
                font="bold"
                className="uppercase tracking-widest"
              >
                Follow Us
              </Text>
              <div className="flex gap-2">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    className="p-2 rounded-full bg-primary-100/10 hover:bg-primary-100 hover:text-black transition-all duration-300 border border-transparent hover:border-primary-500/50"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl -z-10" />

            <div className="p-8 md:p-10 rounded-[32px] bg-primary-100/5 border border-primary-100/10 backdrop-blur-xl shadow-2xl">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        {...register("fullName", {
                          onChange: () => clearErrors("fullName"),
                        })}
                        error={errors.fullName?.message}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email", {
                          onChange: () => clearErrors("email"),
                        })}
                        error={errors.email?.message}
                      />
                    </div>

                    <Input
                      label="Subject"
                      placeholder="How can we help?"
                      {...register("subject", {
                        onChange: () => clearErrors("subject"),
                      })}
                      error={errors.subject?.message}
                    />

                    <Textarea
                      label="Message"
                      placeholder="Tell us more about your inquiry..."
                      {...register("message", {
                        onChange: () => clearErrors("message"),
                      })}
                      error={errors.message?.message}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-black py-6 h-auto text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                          >
                            <Globe className="w-5 h-5" />
                          </motion.div>
                          Encrypting & Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Secure Message
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-primary-600">
                      <Lock className="w-3 h-3" />
                      <Text size="xs">
                        Your messages are end-to-end encrypted
                      </Text>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icons.Sent className="w-10 h-10 text-primary-500" />
                    </div>
                    <Text font="black" size="3xl" className="mb-4">
                      Message Sent!
                    </Text>
                    <Text color="primary-400" className="mb-8">
                      We&apos;ve received your request. One of our agents will
                      reach out to you within 24 hours.
                    </Text>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="rounded-xl border-primary-100/20 hover:bg-primary-500/10 hover:border-primary-500/30"
                    >
                      Send another message
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-primary-500/5 to-transparent -z-10 pointer-events-none" />

      {/* Footer Meta */}
      <footer className="py-12 border-t border-primary-100/10 text-center relative z-10">
        <Text color="primary-600" size="sm">
          &copy; 2026 SecureMail Systems Inc. Security is our priority.
        </Text>
      </footer>
    </main>
  );
};

export default Contact;
