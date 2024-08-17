import Authors from "@/components/Authors/Authors";
import LatestArticles from "@/components/LatestArticles/LatestArticles";
import NewsLoading from "@/components/NewsTicker/loading";
import LatestPodcasts from "@/components/LatestPodcasts/LatestPodcasts";
import LatestPodcastsLoading from "@/components/LatestPodcasts/loading";
import AuthorsLoading from "@/components/Authors/loading";
import NewsTicker from "@/components/NewsTicker/NewsTicker";
import PageTitle from "@/components/PageTitle";
import Subheading from "@/components/Subheading";
import Carousel from "@/components/Carousel"; // 引入轮播图组件
import { Suspense } from "react";

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
}

// 定义菜单项接口
interface MenuItem {
    id: string;
    label: string;
    url: string;
    childItems: {
        nodes: MenuItem[];
    };
}

export const metadata = {
    title: "Fyrre Magazine | Art & Life | Home",
    description: "Articles, podcasts and news from the Berlin cultural scene",
};

// 获取导航数据
async function fetchMenuItems(): Promise<MenuItem[]> {
    const response = await fetch("http://8.138.8.7:3001/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
        },
        body: JSON.stringify({
            query: `
        query GetMenuItems {
          menu(id: "primary", idType: NAME) {
            menuItems {
              nodes {
                id
                label
                url
                childItems {
                  nodes {
                    id
                    label
                    url
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
    return data?.menu?.menuItems?.nodes || []; // 处理返回值为空的情况
}

// 获取文章数据
async function fetchPosts(): Promise<Post[]> {
    const response = await fetch("http://8.138.8.7:3001/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
        },
        body: JSON.stringify({
            query: `
        query {
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
      `,
        }),
    });

    const { data } = await response.json();
    return data.posts.nodes;
}

export default async function Home() {
    const posts = await fetchPosts();
    const latestPosts = posts.slice(0, 3);
    const menuItems = await fetchMenuItems();

    return (
        <main className="flex flex-col min-h-screen max-w-[95rem] w-full mx-auto px-4 lg:pt-0 sm:pt-4 xs:pt-2 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
            {/* 检查导航栏是否有数据 */}
            {menuItems.length > 0 ? (
                <NewsTicker menuItems={menuItems} />
            ) : (
                <p className="text-center text-gray-500"></p> // 默认提示或隐藏此部分
            )}

            {/* 传递最新文章给 Carousel */}
            <Carousel posts={latestPosts} />

            <div className="h-16"></div>

            <LatestArticles posts={posts} />

            <Subheading className="text-subheading" url="/podcasts" linkText="All episodes">
                Podcast
            </Subheading>

            <Suspense fallback={<LatestPodcastsLoading />}>
                <LatestPodcasts />
            </Suspense>

            <Subheading className="text-subheading" url="/authors" linkText="全部作者">
                作者
            </Subheading>

            <Suspense fallback={<AuthorsLoading />}>
                <Authors />
            </Suspense>
        </main>
    );
}
