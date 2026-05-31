"use client";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useRef, useState } from "react";
import Image from "next/image";
import { Text } from "@/_components/shared/Text";
import authImg from "../../../public/images/auth.jpg";

const slides = [
  {
    title: "Secure & Reliable",
    desc: "We handle your email as ours. Every piece is protected.",
  },
  {
    title: "Fast & Optimized",
    desc: "We trying to give You the best User Experience",
  },
  {
    title: "Simple & Powerful",
    desc: "No longer bothered by spam emails, life is more comfortable and calm.",
  },
];

export const AuthSlides = () => {
  const swiperRef = useRef<SwiperRef>(null);
  const [active, setActive] = useState(0);

  return (
    <div className="relative w-full h-full">
      <Image
        src={authImg}
        alt="Auth Image"
        fill
        priority
        className="object-cover object-center"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[rgba(89,104,79,0.6)] via-[rgba(102,128,68,0.7)] to-[rgba(0,0,0,0.9)]" />
      {/* Slides */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        onSwiper={(swiper) => {
          if (swiperRef.current) {
            swiperRef.current.swiper = swiper;
          }
        }}
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        className="relative z-10 h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col h-full justify-end pb-24 text-center text-white space-y-4">
              <Text
                as={"h3"}
                font={"semiBold"}
                size={"3xl"}
                className="text-white"
              >
                {slide.title}
              </Text>
              <p className="mt-2 text-xl text-white/80 max-w-sm mx-auto">
                {slide.desc}
              </p>
            </div>
          </SwiperSlide>
        ))}

        {/* Bullets */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex justify-center gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.swiper?.slideToLoop(index)}
              className={`h-1 transition-all duration-300 ${
                active === index ? "w-24 bg-primary" : "w-10 bg-bgGrey"
              }`}
            />
          ))}
        </div>
      </Swiper>
    </div>
  );
};
