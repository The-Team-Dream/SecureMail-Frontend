"use client";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useRef, useState } from "react";

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
    <div
      className="relative w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(89,104,79,.6) 60%,
            rgba(102,128,68,.7) 66%,
            rgba(0,0,0,.9) 90%
          ),
          url('/images/auth.jpg')
        `,
      }}
    >
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
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex min-h-full w-full flex-col justify-end pb-24 text-center text-white space-y-4">
              <h3 className="text-3xl font-semibold">{slide.title}</h3>
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
                active === index ? "w-24 bg-secondary" : "w-10 bg-bgGrey"
              }`}
            />
          ))}
        </div>
      </Swiper>
    </div>
  );
};
