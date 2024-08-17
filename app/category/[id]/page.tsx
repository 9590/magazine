import PageTitle from "@/components/PageTitle";
import Loading from "@/components/PodcastsList/loading"; // 如果有加载组件，可以复用
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

// 定义文章接口
interface Post {
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
        nodes: {id:string; name: string }[];
    };
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const response = await fetch('http://8.138.8.7:3001/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
        },
        body: JSON.stringify({
            query: `
        query GetCategory($id: ID!) {
          category(id: $id) {
            name
          }
        }
      `,
            variables: { id: params.id },
        }),
    });

    const { data } = await response.json();
    const categoryName = data.category?.name || "分类";

    return {
        title: `${categoryName} | Fyrre Magazine`,
        description: `查看 ${categoryName} 分类的文章列表`,
    };
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
    const response = await fetch('http://8.138.8.7:3001/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
        },
        body: JSON.stringify({
            query: `
        query GetCategoryPosts($id: ID!) {
          category(id: $id) {
            name
            posts {
              nodes {
                id
                title
                slug
                date
                excerpt
                featuredImage {
                  node {
                    sourceUrl
                    altText
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
          }
        }
      `,
            variables: { id: params.id },
        }),
    });

    const { data } = await response.json();
    const category = data.category;

    if (!category) {
        return <p>分类未找到。</p>;
    }

    return (
        <main className="flex flex-col min-h-screen max-w-[95rem] w-full mx-auto px-4 lg:pt-0 sm:pt-4 xs:pt-2 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
            <div className="h-16"></div>
            <Suspense fallback={<Loading />}>
                {/* 渲染文章列表，宽度调整为占满页面 */}
                <div className="w-full">
                    {category.posts.nodes.map((post: Post, index: number) => (
                        <div key={post.id}>
                            <article className="grid lg:grid-cols-[0fr_2fr] gap-6 sm:gap-12">
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
                                            src="/images/homepage/magazine-cover.jpg"
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
                            <div
                                data-orientation="horizontal"
                                role="separator"
                                className="border border-black my-6"
                            ></div>
                        </div>
                    ))}
                </div>
            </Suspense>
        </main>
    );
}
