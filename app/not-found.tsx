"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold mb-4" style={{ color: "#ef9220" }}>
            404
          </h1>
          <h2 className="text-4xl font-bold text-black mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <div
            className="w-24 h-1 rounded-full"
            style={{ backgroundColor: "#ef9220" }}
          />
        </div>

        <p className="text-gray-600 mb-12 text-base leading-relaxed">
          It looks like you&apos;ve ventured into uncharted territory. Let&apos;s get you
          back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-white bg-[#ef9220] hover:bg-[#d97e1a]"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#d97e1a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ef9220")
            }
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
