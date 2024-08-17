"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import SocialSharing from "@/components/SocialSharing";

interface Category {
    id: string;
    name: string;
    slug: string;
    children: {
        nodes: Category[];
    };
}

const Header = ({ title, categories = [] }: { title: string; categories: Category[] }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // 用于保存 setTimeout 的引用

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMouseEnter = (categoryId: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // 如果已经设置了隐藏菜单的定时器，清除它
        }
        setActiveCategory(categoryId);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveCategory(null); // 如果超过2秒且鼠标不在二级菜单上，隐藏菜单
        }, 2000);
    };

    const handleSubmenuMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // 清除定时器，保持二级菜单显示
        }
    };

    const handleSubmenuMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveCategory(null); // 鼠标离开二级菜单后，2秒后隐藏菜单
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current); // 清理定时器
            }
        };
    }, []);

    return (
        <header className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                {/* 网站标题 */}
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold">
                        {title} {/* 动态展示从 GraphQL 获取的网站标题 */}
                    </Link>
                </div>

                {/* 桌面端导航栏 */}
                <nav className="hidden md:flex space-x-8 items-center">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative"
                            onMouseEnter={() => handleMouseEnter(category.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href={`/category/${category.id}`} className="hover:text-gray-700 transition-colors">
                                {category.name}
                            </Link>
                            {activeCategory === category.id && category.children.nodes.length > 0 && (
                                <div
                                    className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg z-10"
                                    onMouseEnter={handleSubmenuMouseEnter} // 鼠标进入二级菜单时保持显示
                                    onMouseLeave={handleSubmenuMouseLeave} // 鼠标离开二级菜单时启动2秒定时器
                                >
                                    {category.children.nodes.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={`/category/${child.id}`} // 跳转到指定页面并带上分类ID
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* 右侧分享按钮，在桌面端显示，在移动端隐藏 */}
                <div className="hidden md:flex items-center space-x-4">
                    <SocialSharing
                        links={[
                            {
                                href: "#",
                                ariaLabel: "Visit our Instagram page",
                                src: "/icons/ri_instagram-line.svg",
                                alt: "Instagram logo",
                            },
                            {
                                href: "#",
                                ariaLabel: "Visit our Twitter page",
                                src: "/icons/ri_twitter-fill.svg",
                                alt: "Twitter logo",
                            },
                            {
                                href: "#",
                                ariaLabel: "Visit our YouTube page",
                                src: "/icons/ri_youtube-fill.svg",
                                alt: "YouTube logo",
                            },
                            {
                                href: "#",
                                ariaLabel: "Visit our RSS feed",
                                src: "/icons/ri_rss-fill.svg",
                                alt: "RSS feed logo",
                            },
                        ]}
                    />
                </div>

                {/* 移动端汉堡菜单按钮 */}
                <button
                    className="md:hidden text-xl focus:outline-none"
                    onClick={toggleMobileMenu}
                >
                    &#9776; {/* 汉堡菜单图标 */}
                </button>
            </div>

            {/* 移动端菜单 */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-white shadow-md border-t">
                    {categories.map((category) => (
                        <div key={category.id} className="border-b">
                            <button
                                onClick={() => handleMouseEnter(category.id)}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                {category.name}
                            </button>
                            {activeCategory === category.id && category.children.nodes.length > 0 && (
                                <div className="pl-4">
                                    {category.children.nodes.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={`/category/${child.id}`} // 跳转到指定页面并带上分类ID
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default Header;
