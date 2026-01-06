"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { usePaymentSuccessErrorModal } from "@/hooks/use-payment-success-error-modal";

const AnimatedCheckmark = () => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated circle fill */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#10b981"
          className="animate-scale-in"
          style={{
            transformOrigin: "center",
            animation:
              "scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          }}
        />

        {/* Outer glow circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="3"
          fill="none"
          className="animate-pulse"
          opacity="0.6"
        />

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Checkmark with draw animation */}
        <path
          d="M 30 50 L 45 65 L 70 35"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: "60",
            strokeDashoffset: "60",
            animation: "drawCheckmark 0.6s ease-out forwards 0.4s",
          }}
        />
      </svg>
      <style>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes drawCheckmark {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

const PartyPoppers = () => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      delay: number;
      duration: number;
      color: string;
      size: number;
      rotation: number;
      type: "confetti" | "circle" | "star" | "streamer";
    }>
  >([]);

  useEffect(() => {
    const colors = [
      "#10b981",
      "#059669",
      "#fbbf24",
      "#f59e0b",
      "#ec4899",
      "#8b5cf6",
      "#3b82f6",
      "#ef4444",
    ];

    const types: Array<"confetti" | "circle" | "star" | "streamer"> = [
      "confetti",
      "circle",
      "star",
      "streamer",
    ];

    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10 - Math.random() * 20,
      delay: Math.random() * 0.4,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)],
    }));
    setParticles(newParticles);
  }, []);

  const renderParticle = (particle: (typeof particles)[0]) => {
    switch (particle.type) {
      case "star":
        return (
          <div
            className="absolute"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}px`,
              fontSize: `${particle.size}px`,
              color: particle.color,
              animation: `fall ${
                particle.duration
              }s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                particle.delay
              }s forwards, rotate ${particle.duration * 0.5}s linear ${
                particle.delay
              }s infinite`,
            }}
          >
            ⭐
          </div>
        );
      case "circle":
        return (
          <div
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animation: `fall ${particle.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${particle.delay}s forwards`,
              boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            }}
          />
        );
      case "streamer":
        return (
          <div
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}px`,
              width: `${particle.size * 0.3}px`,
              height: `${particle.size * 3}px`,
              backgroundColor: particle.color,
              animation: `fall ${
                particle.duration
              }s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                particle.delay
              }s forwards, rotate ${particle.duration * 0.3}s linear ${
                particle.delay
              }s infinite`,
            }}
          />
        );
      default: // confetti
        return (
          <div
            className="absolute"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animation: `fall ${
                particle.duration
              }s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                particle.delay
              }s forwards, wiggle ${particle.duration * 0.3}s ease-in-out ${
                particle.delay
              }s infinite`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div key={particle.id}>{renderParticle(particle)}</div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(${
              Math.random() > 0.5 ? "" : "-"
            }${20 + Math.random() * 30}px);
            opacity: 0;
          }
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(-10px) rotate(-15deg);
          }
          75% {
            transform: translateX(10px) rotate(15deg);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const Sparkles = () => {
  const [sparkles, setSparkles] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: 20 + Math.random() * 60,
      top: 20 + Math.random() * 60,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-yellow-400"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            fontSize: "20px",
            animation: `sparkle 1.5s ease-in-out ${sparkle.delay}s infinite`,
          }}
        >
          ✨
        </div>
      ))}
      <style>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export const SuccessModal = () => {
  const router = useRouter();
  const { onClose, open, modal } = usePaymentSuccessErrorModal();
  const [showEffects, setShowEffects] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openModal = useMemo(() => {
    return open === true && modal === "success";
  }, [open, modal]);

  useEffect(() => {
    if (openModal) {
      setShowEffects(true);
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Set new timeout
      const id = setTimeout(() => {
        onClose();
        router.push("/orders");
      }, 4000);
      timeoutRef.current = id;
    } else {
      // Clear timeout when closing
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    // Cleanup on unmount or deps change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [openModal, onClose, router]);

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowEffects(false);
      onClose();
    }
  };

  const handleViewOrders = () => {
    onOpenChange(false);
    router.push("/orders");
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
    // No navigation - stays on current page (checkout, now empty)
  };

  return (
    <>
      {showEffects && openModal && <PartyPoppers />}
      <Dialog open={openModal} onOpenChange={onOpenChange}>
        <DialogContent className="w-96 sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg border-0 shadow-2xl overflow-hidden">
          {/* Gradient background with shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-lg" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
            }}
          />

          {/* Sparkles effect */}
          <Sparkles />

          <div className="relative flex flex-col space-y-6 items-center justify-center py-12 px-6 animate-slide-up">
            {/* Animated checkmark with bounce */}
            <div
              className="relative"
              style={{
                animation:
                  "bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              }}
            >
              <AnimatedCheckmark />
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, #10b981 0%, transparent 70%)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            </div>

            {/* Success message */}
            <div className="text-center space-y-3 animate-fade-in">
              <p
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent"
                style={{
                  animation: "slideDown 0.6s ease-out 0.3s both",
                }}
              >
                Order Completed! 🎉
              </p>
              <p
                className="text-base md:text-lg text-gray-600 font-medium"
                style={{
                  animation: "slideDown 0.6s ease-out 0.4s both",
                }}
              >
                Thank you for your purchase
              </p>
            </div>

            {/* Info box with icon */}
            <div
              className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 text-center shadow-sm"
              style={{
                animation: "slideDown 0.6s ease-out 0.5s both",
              }}
            >
              <p className="text-sm md:text-base text-emerald-700 font-semibold flex items-center justify-center gap-2">
                <span className="text-xl">🎊</span>
                Your order has been successfully placed
              </p>
            </div>

            {/* Action buttons */}
            <div
              className="w-full flex flex-col gap-3"
              style={{
                animation: "slideDown 0.6s ease-out 0.6s both",
              }}
            >
              <Button
                className="w-full font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-base rounded-xl transform hover:scale-105"
                onClick={handleViewOrders}
              >
                <span className="flex items-center gap-2">
                  View Order Details
                  <span className="text-lg">→</span>
                </span>
              </Button>

              <button
                onClick={handleContinueShopping}
                className="text-sm text-gray-600 hover:text-emerald-600 font-medium transition-all duration-200 py-2 hover:scale-105"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          <style>{`
            @keyframes bounceIn {
              0% {
                transform: scale(0) rotate(-180deg);
                opacity: 0;
              }
              50% {
                transform: scale(1.15) rotate(10deg);
              }
              100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
              }
            }
            
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes slide-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-slide-up {
              animation: slide-up 0.6s ease-out forwards;
            }
            
            @keyframes fade-in {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            .animate-fade-in {
              animation: fade-in 0.8s ease-out forwards;
            }
          `}</style>
        </DialogContent>
      </Dialog>
    </>
  );
};