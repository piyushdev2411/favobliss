import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  variant?: "default" | "compact" | "premium";
  className?: string;
}

export function VerifiedBadge({
  variant = "default",
  className,
}: VerifiedBadgeProps) {
  const variants = {
    default: "px-1.5 py-0.5 text-xs",
    compact: "px-1 py-0.5 text-xs",
    premium: "px-1.5 py-0.5 text-xs",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-white rounded-full font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 group flex-shrink-0 max-w-fit",
        variants[variant],
        className
      )}
      style={{ backgroundColor: "#ee8c1d" }}
    >
      {/* Enhanced Checkmark Icon */}
      <div className="relative flex-shrink-0">
        <svg
          className="w-2.5 h-2.5 fill-current drop-shadow-sm group-hover:scale-110 transition-transform duration-200"
          viewBox="0 0 24 24"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      <span className="font-semibold tracking-tight text-xs whitespace-nowrap">
        Verified
      </span>
    </div>
  );
}

// Alternative premium version with shield icon
export function VerifiedBadgePremium({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md border border-orange-400/30 flex-shrink-0 max-w-fit",
        className
      )}
      style={{ backgroundColor: "#ee8c1d" }}
    >
      {/* Shield with checkmark */}
      <svg
        className="w-2.5 h-2.5 fill-current drop-shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
        viewBox="0 0 24 24"
      >
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
      </svg>
      {/* <span className="tracking-tight text-xs whitespace-nowrap">VERIFIED</span> */}
    </div>
  );
}

// Minimal version for compact spaces
export function VerifiedBadgeMinimal({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center w-4 h-4 text-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 group flex-shrink-0",
        className
      )}
      style={{ backgroundColor: "#ee8c1d" }}
      title="Verified User"
    >
      <svg
        className="w-2 h-2 fill-current group-hover:scale-110 transition-transform duration-200"
        viewBox="0 0 24 24"
      >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </div>
  );
}
