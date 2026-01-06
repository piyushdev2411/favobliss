"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, Eye, Clock, ArrowLeft, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import ResizableImageExtension from "@/components/BlogsEditor/ImageResizer";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import FontSize from "tiptap-extension-font-size";
import FontFamily from "@tiptap/extension-font-family";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { TextStyle } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import CodeBlock from "@tiptap/extension-code-block";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Typography from "@tiptap/extension-typography";
import { all, createLowlight } from "lowlight";
import sanitizeHtml from "sanitize-html";

const lowlight = createLowlight(all);

interface Blog {
  id: string;
  title: string;
  banner: string;
  slug: string;
  views: number;
  postedBy?: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

interface BlogDetailProps {
  blog: Blog;
}

export function BlogDetail({ blog }: BlogDetailProps) {
  const router = useRouter();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <button
            onClick={() => router.push("/blog")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#ef911f] transition-colors font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blogs</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      {blog.banner && (
        <div className="md:px-7 px-5">
          <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
            <img
              src={blog.banner}
              alt={blog.title}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
        </div>
      )}

      <article className="container mx-auto md:px-4 px-8 max-w-4xl">
        <div
          className={`${
            blog.banner ? "-mt-32" : "pt-12"
          } relative z-10 md:mb-4 mb-2`}
        >
          <div className={`${blog.banner ? "text-white" : "text-gray-900"}`}>
            <h1
              className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${
                blog.banner ? "drop-shadow-lg" : ""
              }`}
            >
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:mb-6">
              {blog.postedBy && (
                <div
                  className={`flex items-center gap-2 ${
                    blog.banner ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#ef911f] flex items-center justify-center text-white font-bold">
                    {blog.postedBy.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{blog.postedBy}</span>
                </div>
              )}

              <div
                className={`flex items-center gap-2 ${
                  blog.banner ? "text-white/90" : "text-gray-600"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* {blog.views !== undefined && (
                <div
                  className={`flex items-center gap-2 ${
                    blog.banner ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
              )} */}

              {blog.createdAt !== blog.updatedAt && (
                <div
                  className={`flex items-center gap-2 ${
                    blog.banner ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated{" "}
                    {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end w-full">
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg font-semibold transition-all hover:scale-105 ${
                  blog.banner
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-[#ef911f] text-white hover:bg-[#d97d0f]"
                }`}
              >
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pb-20">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm pt-1 md:pt-1 px-2">
            <div
              className="iceDriveEditor prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#ef911f] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-[#ef911f] prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-[#ef911f] prose-blockquote:text-gray-700 prose-img:rounded-xl prose-img:shadow-lg
              prose-ul:list-disc prose-ul:pl-6 prose-ul:marker:text-[#ef911f] 
  prose-ol:list-decimal prose-ol:pl-6 prose-ol:marker:text-[#ef911f]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
