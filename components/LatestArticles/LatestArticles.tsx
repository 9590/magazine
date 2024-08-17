'use client';

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";

// 定义文章接口
interface Article {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    featuredImage: {
        node: {
            sourceUrl: string;
            altText: string;
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
    author: {
        node: {
            name: string;
        };
    };
}

interface LatestArticlesProps {
    posts: Article[];
}

export default function LatestArticles({ posts }: LatestArticlesProps) {
    const [popularArticles, setPopularArticles] = useState<Article[]>([]);

    useEffect(() => {
        // 获取最受欢迎的文章
        const fetchPopularPosts = async () => {
            const response = await fetch('http://8.138.8.7:3001/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
                },
                body: JSON.stringify({
                    query: `
                        query GetPopularPosts {
                            posts(where: { orderby: { field: COMMENT_COUNT, order: DESC } }, first: 3) {
                                nodes {
                                    id
                                    title
                                    slug
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
                                }
                            }
                        }
                    `,
                }),
            });

            const { data } = await response.json();
            setPopularArticles(data.posts.nodes);
        };

        fetchPopularPosts();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-24">
            {/* 渲染文章列表 */}
            <div className="lg:w-3/4">
                {posts.map((post, index) => (
                    <div key={post.id}>
                        <article className="grid md:grid-cols-[0fr_1fr] gap-6 sm:gap-12">
                            {post.featuredImage?.node ? (
                                <Link href={`/magazine/${post.id}`} className="h-60 w-60">
                                    <Image
                                        src={post.featuredImage.node.sourceUrl}
                                        alt={post.featuredImage.node.altText || post.title}
                                        width={240}
                                        height={240}
                                        className="w-full h-full object-cover hover:scale-105 transition"
                                    />
                                </Link>
                            ) : (
                                <Link href={`/magazine/${post.id}`} className="h-60 w-60">
                                    <Image
                                        src="/images/homepage/magazine-cover.jpg" // 使用本地的占位图片
                                        alt="占位图"
                                        width={240}
                                        height={240}
                                        className="w-full h-full object-cover hover:scale-105 transition"
                                    />
                                </Link>
                            )}
                            <div className="flex flex-col justify-between">
                                <h3 className="heading3-title mb-3">
                                    <Link href={`/magazine/${post.id}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                                    {post.excerpt
                                        .replace(/<[^>]+>/g, '') // 去掉标签
                                        .replace(/&#46;/g, '.') // 将 &#46; 替换为 "."
                                        .replace(/\.{3,}$/, '')} {/* 处理多余的省略号 */}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                                    <div className="text-sm text-gray-500">
                                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                                    </div>
                                    <div className="flex gap-2">
                                        {post.tags.nodes.slice(0, 3).map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-3 py-2 border border-black rounded-full w-fit text-sm"
                                            >
                                                 <Link href={`/biaoqian/${tag.id}`}>
                                       {tag.name}
                                    </Link>

                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </article>
                        <div data-orientation="horizontal" role="separator" className="border border-black my-6"></div>
                    </div>
                ))}
            </div>

            {/* 保留右侧的 Printmagazine 和其他信息 */}
            <div className="lg:w-1/4">
                <div className="sticky top-0 space-y-8">
                    {/* 调整后的 Printmagazine 部分 */}
                    <div className="space-y-4"> {/* 调整间距 */}
                        <h3 className="uppercase font-semibold mb-2">杂志版</h3>
                        <p className="text-5xl font-semibold">03/2022</p>
                        <div className="relative w-[369px] h-[462px] mb-4"> {/* 添加底部间距 */}
                            <Image
                                src="/images/homepage/magazine-cover.jpg" // 使用本地图片路径
                                alt="显示一个人的雕像的赤褐色杂志封面，左上角写有 'FYRRE MAGAZINE'，右下角写有 '03/2022'，上方有一个金色徽章，印有 '独家采访雅各布·格伦伯格' 字样，右下角有一个箭头"
                                layout="fill"
                                objectFit="cover"
                                className="rounded"
                            />
                        </div>
                        <button
                            className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                            订购
                        </button>
                    </div>

                    {/* 最受欢迎的文章 */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg uppercase">最受欢迎</h3>
                        <div className="space-y-6">
                            {popularArticles.map((article, index) => (
                                <div>
                                    <div key={article.id} className="grid grid-cols-[0fr_1fr] gap-8">
                                        <p className="text-2xl font-semibold">{`0${index + 1}`}</p>
                                        <div className="flex flex-col gap-4">
                                            <h3 className="text-2xl font-semibold">
                                                <Link href={`/magazine/${article.id}`}>{article.title}</Link>
                                            </h3>
                                            <span className="flex gap-2">
                                                <p className="font-semibold">作者</p>
                                                <p>{article.author.node.name}</p>
                                            </span>
                                        </div>


                                    </div>
                                    {index < popularArticles.length - 1 && (
                                            <div data-orientation="horizontal" role="separator"
                                            className="border border-black my-6"></div>)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 新闻通讯 */}
                    <div className="bg-[#f8f8f8] p-[1.88rem] mt-16">
                        <h3 className="uppercase font-semibold mb-2">新闻通讯</h3>
                        <p className="heading3-title mb-4">将设计新闻发送到您的收件箱</p>
                        <form className="undefined">
                            <div className="undefined">
                                <input
                                    className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-2 undefined"
                                    placeholder="电子邮件地址" type="text" name="email"/>
                                <button
                                    className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:cursor-none undefined"
                                    type="submit">注册
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
