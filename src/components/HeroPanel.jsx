import { useState, useEffect } from "react";
import slider1 from "../assets/slider.png";
import slider2 from "../assets/slider.png";
import slider3 from "../assets/slider.png";

const slides = [
  {
    image: slider1,
    title: "Secure & Reliable",
    subtitle: "We handle your email as ours, Every piece is protected",
  },
  {
    image: slider2,
    title: "Easy Accessible",
    subtitle: "We trying to give You the best User Experience",
  },
  {
    image: slider3,
    title: "Always Available",
    subtitle: "Access your emails anywhere, anytime",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(89, 104, 79, 0.54) 0.24%, rgba(102, 128, 68, 0.596504) 32.51%, rgba(0, 0, 0, 0.81) 87.17%)",
            }}
          ></div>

          <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-xl text-white drop-shadow-md">{slide.subtitle}</p>

            <div className="flex justify-center gap-2 mt-8">
              {slides.map((_, i) => (
                <div
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-16 h-1 rounded cursor-pointer ${
                    i === current ? "bg-green-500" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
