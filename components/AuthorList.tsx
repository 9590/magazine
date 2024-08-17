import formatString from "@/app/functions/formatString";
import Link from "next/link";
import Image from "next/image";

// 定义作者类型
interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: {
    url: string;
  };
  description: string;
}

export default async function AuthorsList() {
  // 获取作者数据
  const response = await fetch("http://8.138.8.7:3001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUSTWP_SECRET_KEY}`,
    },
    body: JSON.stringify({
      query: `
        query GetAllAuthors {
          users {
            nodes {
              id
              name
              slug
              avatar {
                url
              }
              description
            }
          }
        }
      `,
    }),
  });

  const { data } = await response.json();
  const authors: Author[] = data.users.nodes;

  return (
      <div className="max-w-[95rem] w-full mx-auto py-8 lg:pt-24 lg:pb-48">
        {authors.map((author, index) => (
            <div key={author.id} className="border-t border-black py-8">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <Link href={`/authors/${author.slug}`} className="shrink-0">
                  <Image
                      className="w-[9.375rem] h-[9.375rem] object-cover rounded-full"
                      src={author.avatar.url}
                      alt={author.name}
                      width={150}
                      height={150}
                  />
                </Link>
                <div className="flex flex-1 flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                  <h2 className="heading3-title">{author.name}</h2>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <span className="text-sm text-gray-600">{author.description}</span>
                  </div>
                  <Link
                      className="flex gap-2 items-center uppercase font-semibold"
                      href={`/authors/${formatString(author.id)}`}
                  >
                    <span>About</span>
                    <img
                        src="/icons/ri_arrow-right-line.svg"
                        alt="An arrow pointing right"
                        className="w-4 h-4"
                    />
                  </Link>
                </div>
              </div>
            </div>
        ))}
      </div>
  );
}
