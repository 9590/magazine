import Container from "@/components/ui/container";
import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PodcastContextProvider from "@/context/PodcastContext";
import ArticleContextProvider from "@/context/ArticleContext";

// 定义分类接口
interface Category {
    id: string;
    name: string;
    slug: string;
    children: {
        nodes: Category[];
    };
}

// 定义站点信息接口
interface SiteInfo {
    title: string;
    description: string;
}

// 获取分类数据和网站信息
async function fetchSiteData(): Promise<{ categories: Category[], siteInfo: SiteInfo }> {
    const response = await fetch("http://8.138.8.7:3001/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
        },
        body: JSON.stringify({
            query: `
        query {
          categories(where: { parent: null }) {
            nodes {
              id
              name
              slug
              children {
                nodes {
                  id
                  name
                  slug
                }
              }
            }
          }
          generalSettings {
            title
            description
          }
        }
      `,
        }),
    });

    const { data } = await response.json();
    const categories = data.categories.nodes;
    const siteInfo = {
        title: data.generalSettings.title,
        description: data.generalSettings.description,
    };

    return { categories, siteInfo };
}

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const { categories, siteInfo } = await fetchSiteData(); // 获取分类数据和站点信息

    return (
        <html lang="en" className="scroll-smooth">
        <head>
            <link
                rel="icon"
                href="/logos/FyrreMagazineFavicon.svg"
                type="image/x-icon"
            />
            <title>{siteInfo.title}</title> {/* 动态传入网站标题 */}
        </head>
        <body>
        <ArticleContextProvider>
            <PodcastContextProvider>
                <Container>
                    <Header title={siteInfo.title} categories={categories} /> {/* 将分类数据传递给 Header */}
                    {children}
                    <Footer title={siteInfo.title} categories={categories} /> {/* 将网站标题和分类数据传递给 Footer */}
                </Container>
            </PodcastContextProvider>
        </ArticleContextProvider>
        </body>
        </html>
    );
}
