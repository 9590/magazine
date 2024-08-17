"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

// 定义文章接口
interface Article {
    title: string;
    date: string;
    content: string;
    excerpt: string;
    featuredImage: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    };
    author: {
        node: {
            name: string;
        };
    } | null;
    tags: {
        nodes: [
            {
                id: string;
                name: string;
            }
        ]
    };
    categories: {
        nodes: [{
            id: string;
            name: string;
            slug: string
        }
        ];
    };
}

// 获取文章数据
async function fetchArticle(id: string) {
    const response = await fetch("http://8.138.8.7:3001/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
        },
        body: JSON.stringify({
            query: `
         query {
          post(id: "${id}") {
            title
            date
            content
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
              }
            }
            categories {
              nodes {
                id
                name
                slug
              }
            }
            tags {
                nodes {
                id
                  name
                }
              }
          }
        }
      `,
        }),
    });

    const { data } = await response.json();
    return data.post;
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const article: Article | null = await fetchArticle(params.id);

    if (!article) {
        notFound(); // 如果文章未找到，使用 Next.js 的 notFound 方法返回 404 页面
    }


    const category = article.categories.nodes[article.categories.nodes.length - 1];


    return (
        <main className="max-w-[95rem] w-full mx-auto px-4 lg:pt-8 sm:pt-4 xs:pt-2 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
            {/* 返回和导航部分 */}
            <div className="flex items-center space-x-4 mb-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 uppercase font-semibold w-full"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 mr-2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    返回上一页
                </button>
                <Link
                    href={`/category/${category.id}`}
                    className="uppercase font-semibold text-sm md:text-xl truncate min-w-[17%] whitespace-nowrap text-right"
                >
                    {category.name}
                </Link>


            </div>

            <hr className="border-black border-t-0 mb-6" />

            <article className="max-w-[95rem] mx-auto pb-6 md:pb-24">
                {/* 标题部分 */}
                <h2 className="text-5xl font-bold mb-4">{article.title}</h2>

                {/* 作者和发布日期部分 */}
                <div className="text-gray-500 text-sm flex flex-col md:flex-row justify-between mb-4">
                    <div>
                        发布日期: <time dateTime={article.date}>{new Date(article.date).toLocaleDateString()}</time>
                        {article.author?.node && (
                            <div className="font-semibold">作者: {article.author.node.name}</div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {article.tags.nodes.slice(0, 3).map((tag, tagIndex) => (
                            <span
                                key={tagIndex}
                                className="px-3 py-2 border border-black rounded-full w-fit text-sm"
                            >
                                <Link
                                    href={`/biaoqian/${tag.id}`}
                                    className="uppercase font-semibold text-sm md:text-xl truncate min-w-[17%] whitespace-nowrap text-right"
                                >
                     {tag.name}
                </Link>

                                            </span>
                        ))}
                    </div>
                </div>

                {/* 图片部分，宽度更大 */}


                {article.featuredImage?.node ? (
                    <Image
                        src={article.featuredImage.node.sourceUrl}
                        alt={article.featuredImage.node.altText}
                        width={1400}  // 增加宽度
                        height={800}
                        className="w-full h-auto mb-8"
                    />
                ) : (
                    <Image
                        src="/images/homepage/magazine-cover.jpg"
                        alt="占位图"
                        width={1400}  // 增加宽度
                        height={400}
                        className="w-full h-auto mb-8"
                    />

                )}

                {/* 文章内容部分，宽度调整得更窄 */}
                <div className="prose max-w-[80%] mx-auto leading-relaxed text-lg">
                    <div
                        dangerouslySetInnerHTML={{ __html: article.content }} // 直接输出 HTML 内容
                    />
                </div>
            </article>
        </main>
    );
}
