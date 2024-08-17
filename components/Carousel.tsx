"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// 定义文章接口
interface Post {
    id: string;
    featuredImage: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    } | null; // 允许 featuredImage 为空
    title: string;
    excerpt: string;
    date: string;
    tags: {
        nodes: [
            {
                name: string;
            }
        ]
    }
}

const Carousel = ({ posts }: { posts: Post[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % posts.length);
        }, 3000); // 每3秒切换一次

        return () => clearInterval(interval);
    }, [posts.length]);

    // 函数：清理文本中的 HTML 标签和多余的符号
    const cleanText = (text: string) => {
        return text
            .replace(/<[^>]+>/g, '') // 去掉 HTML 标签
            .replace(/&#46;/g, '.') // 将 &#46; 替换为 "."
            .replace(/\.{3,}$/, ''); // 去掉省略号
    };

    return (
        <div className="relative w-full h-[500px] overflow-hidden">
            {posts.map((post, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {/* 检查是否有有效的 featuredImage，如果没有则使用占位图 */}
                    <Image
                        src={post.featuredImage?.node?.sourceUrl || '/images/homepage/magazine-cover.jpg'}
                        alt={post.featuredImage?.node?.altText || post.title || 'Placeholder Image'}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 p-4 text-white">
                        <p className="text-sm">{new Date(post.date).toLocaleDateString()}</p>
                        <h3 className="text-2xl font-bold">{post.title}</h3>
                        <p>{cleanText(post.excerpt)}</p> {/* 清理后的简介 */}
                        {/* 使用 Link 组件传递文章 ID */}
                        <Link href={`/magazine/${posts[currentSlide].id}`} className="text-white underline mt-2 inline-block">
                            READ MORE
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Carousel;
