"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 定义文章数据类型
type ArticleData = {
  id: string;
  title: string;
  slug: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories: {
    nodes: { name: string }[];
  };
};

// 定义作者数据类型
type AuthorData = {
  id: string;
  name: string;
  slug: string;
  avatar: {
    url: string;
  };
  description: string | null;
  posts: {
    nodes: ArticleData[];
  };
};

// 获取作者数据的函数
async function fetchAuthorDetails(id: string): Promise<AuthorData | null> {
  const response = await fetch("http://8.138.8.7:3001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
    },
    body: JSON.stringify({
      query: `
        query  {
          user(id: "${id}") {
            id
            name
            slug
            avatar {
              url
            }
            description
            posts {
              nodes {
              id
                title
                slug
                date
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
                categories {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        }
      `,
    }),
  });

  const { data } = await response.json();
  return data.user || null;
}

export default async function AuthorDetailsPage({ params }: { params: { author: string } }) {
  const router = useRouter();
  const authorId = params.author; // 获取 URL 中的 author ID 参数

  const authorData = await fetchAuthorDetails(authorId);

  if (!authorData) {
    return <p>未找到该作者信息。</p>;
  }

  const articles = authorData.posts?.nodes || [];

  return (
      <main className="max-w-[95rem] w-full mx-auto px-4 sm:pt-4 xs:pt-2 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-8">
          <button
              onClick={() => router.back()}
              className="flex items-center gap-2 uppercase font-semibold"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            返回上一页
          </button>
          <h1 className="uppercase font-semibold text-lg md:text-[2rem]">作者</h1>
        </div>

        {/* 作者信息部分 - 居中布局 */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-16">
            {/* 左侧 - 头像和社交媒体链接 */}
            <div className="flex flex-col items-center">
              <Image
                  src={authorData.avatar.url}
                  alt={authorData.name}
                  width={150}
                  height={150}
                  className="rounded-full"
              />
              <div className="mt-6 flex flex-col items-center space-y-4">
                <p className="uppercase font-semibold">Follow</p>
                <div className="flex space-x-4">
                  <Link href="#">
                    <img src="/icons/ri_twitter-fill.svg" alt="Twitter" className="w-6 h-6" />
                  </Link>
                  <Link href="#">
                    <img src="/icons/ri_instagram-line.svg" alt="Instagram" className="w-6 h-6" />
                  </Link>
                  <Link href="#">
                    <img src="/icons/ri_youtube-fill.svg" alt="YouTube" className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 中间 - 作者名字和简介 */}
            <div className="text-center">
              <h1 className="text-4xl font-bold">{authorData.name}</h1>
              <p className="text-lg text-gray-600 mt-4">
                {authorData.description ? authorData.description : "没有提供描述。"}
              </p>
            </div>
          </div>
        </div>

        {/* 文章列表部分 */}
        {/* 文章列表部分 */}
        <div className="mt-12">
          <h2 className="text-blog-subheading mt-[9.5rem] pt-12 pb-12 md:pb-24">作者的文章</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"> {/* 两列布局 */}
            {articles.map((article, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm grid grid-cols-[150px_1fr] gap-6"> {/* 使用 grid 布局 */}
                  {article.featuredImage?.node?.sourceUrl ? (
                      <Image
                          src={article.featuredImage.node.sourceUrl}
                          alt={article.title}
                          width={150}
                          height={150}
                          className="object-cover mb-4"
                      />
                  ) : (
                      <div className="w-[150px] h-[150px] bg-gray-200 mb-4 flex items-center justify-center">
                        无图片
                      </div>
                  )}
                  <div className="flex flex-col justify-between">
                    <h3 className="text-2xl font-bold mb-2">
                      <Link href={`/magazine/${article.id}`}>{article.title}</Link>
                    </h3>
                    <div className="flex flex-col gap-2 text-gray-600">
                      <p className="font-semibold">Date: {new Date(article.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

      </main>
  );
}
