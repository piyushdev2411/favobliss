"use client";

import { useMemo, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePaymentSuccessErrorModal } from "@/hooks/use-payment-success-error-modal";
import Link from "next/link";

const AnimatedErrorIcon = () => {
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
          fill="#ef4444"
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
          stroke="url(#errorGradient)"
          strokeWidth="3"
          fill="none"
          className="animate-pulse"
          opacity="0.6"
        />

        <defs>
          <linearGradient
            id="errorGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* X mark with draw animation */}
        <g
          style={{
            animation: "drawX 0.6s ease-out forwards 0.4s",
            opacity: 0,
          }}
        >
          <path
            d="M 35 35 L 65 65"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            style={{
              strokeDasharray: "42",
              strokeDashoffset: "42",
              animation: "drawLine 0.4s ease-out forwards 0.4s",
            }}
          />
          <path
            d="M 65 35 L 35 65"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            style={{
              strokeDasharray: "42",
              strokeDashoffset: "42",
              animation: "drawLine 0.4s ease-out forwards 0.6s",
            }}
          />
        </g>
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
        
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes drawX {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const ErrorParticles = () => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      delay: number;
      duration: number;
      angle: number;
    }>
  >([]);

  useEffect(() => {
    // Create particles emanating from center
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      delay: i * 0.05,
      duration: 0.8 + Math.random() * 0.4,
      angle: (i * 360) / 12,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-red-400"
          style={
            {
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `explode ${particle.duration}s ease-out ${particle.delay}s forwards`,
              "--angle": `${particle.angle}deg`,
            } as React.CSSProperties
          }
        />
      ))}
      <style>{`
        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(120px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const ShakeEffect = ({ children }: { children: React.ReactNode }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setShake(true);
    const timer = setTimeout(() => setShake(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={shake ? "animate-shake" : ""}
      style={{
        animation: shake
          ? "shake 0.6s cubic-bezier(.36,.07,.19,.97) both"
          : "none",
      }}
    >
      {children}
      <style>{`
        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0);
          }
          20%, 80% {
            transform: translate3d(2px, 0, 0);
          }
          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
          }
          40%, 60% {
            transform: translate3d(4px, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};

export const ErrorModal = () => {
  const { onClose, open, modal } = usePaymentSuccessErrorModal();
  const [showEffects, setShowEffects] = useState(false);

  const openModal = useMemo(() => {
    return open === true && modal === "error";
  }, [open, modal]);

  useEffect(() => {
    if (openModal) {
      setShowEffects(true);
    }
  }, [openModal]);

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowEffects(false);
      onClose();
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={onOpenChange}>
      <DialogContent className="w-96 sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg border-0 shadow-2xl overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-lg" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Error particles effect */}
        {showEffects && <ErrorParticles />}

        <div className="relative flex flex-col space-y-6 items-center justify-center py-12 px-6 animate-slide-up">
          {/* Animated error icon with shake */}
          <ShakeEffect>
            <div
              className="relative"
              style={{
                animation:
                  "bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              }}
            >
              <AnimatedErrorIcon />
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, #ef4444 0%, transparent 70%)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            </div>
          </ShakeEffect>

          {/* Error message */}
          <div className="text-center space-y-3 animate-fade-in">
            <p
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-500 bg-clip-text text-transparent"
              style={{
                animation: "slideDown 0.6s ease-out 0.3s both",
              }}
            >
              Payment Failed 😔
            </p>
            <p
              className="text-base md:text-lg text-gray-600 font-medium"
              style={{
                animation: "slideDown 0.6s ease-out 0.4s both",
              }}
            >
              Something went wrong with your payment
            </p>
          </div>

          {/* Info box with details */}
          <div
            className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 text-center shadow-sm"
            style={{
              animation: "slideDown 0.6s ease-out 0.5s both",
            }}
          >
            <p className="text-sm md:text-base text-red-700 font-semibold flex items-center justify-center gap-2">
              <span className="text-xl">⚠️</span>
              Please check your payment details and try again
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
              className="w-full font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-base rounded-xl transform hover:scale-105"
              onClick={() => {
                onOpenChange(false);
                // You can add retry logic here if needed
              }}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">↻</span>
                Try Again
              </span>
            </Button>

            <button
              onClick={() => onOpenChange(false)}
              className="text-sm text-gray-600 hover:text-red-600 font-medium transition-all duration-200 py-2 hover:scale-105"
            >
              Cancel
            </button>
          </div>

          {/* Help text */}
          <div
            className="text-center"
            style={{
              animation: "slideDown 0.6s ease-out 0.7s both",
            }}
          >
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <Link href="/contact-us" className="text-red-600 hover:text-red-700 font-semibold underline">
                Contact Support
              </Link>
            </p>
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
  );
};
