"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useTransition } from "react";

interface Blog {
  id: string;
  title: string;
  banner: string;
  slug: string;
  views: number;
  postedBy?: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

interface Props {
  initialBlogs: Blog[];
  currentPage: number;
  totalBlogs: number;
  limit: number;
}

export default function BlogList({
  initialBlogs: blogs,
  currentPage,
  totalBlogs,
  limit,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const totalPages = Math.ceil(totalBlogs / limit);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      startTransition(() => {
        router.push(`/blog?page=${page}`);
      });
    }
  };

  const handlePrev = () => handlePageChange(currentPage - 1);
  const handleNext = () => handlePageChange(currentPage + 1);

  if (isPending) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-[#ef911f] to-[#d97d0f] text-white py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="h-12 bg-white/20 rounded-lg w-64 mx-auto animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded-lg w-96 mx-auto mt-4 animate-pulse"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[#ef911f] to-[#d97d0f] text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Our Blogs
          </h1>
          <p className="text-xl text-center text-white/90 max-w-2xl mx-auto">
            Insights, stories, and updates from our team
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No blogs yet
            </h3>
            <p className="text-gray-500">Check back soon for new content</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:border-[#ef911f] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                  onClick={() => router.push(`/blog/${blog.slug}`)}
                >
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {blog.banner ? (
                      <img
                        src={blog.banner}
                        alt={blog.title}
                        className="w-full h-full object-fill group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#ef911f] transition-colors">
                      {blog.title}
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {/* {blog.views !== undefined && (
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views}</span>
                        </div>
                      )} */}
                    </div>

                    {blog.postedBy && (
                      <p className="text-sm text-gray-600 mb-4">
                        By{" "}
                        <span className="font-medium text-gray-900">
                          {blog.postedBy}
                        </span>
                      </p>
                    )}

                    {/* Read More Button */}
                    <div className="flex items-center gap-2 text-[#ef911f] font-semibold group-hover:gap-3 transition-all">
                      <span>Read More</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-16 space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        page === currentPage
                          ? "bg-[#ef911f] text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
