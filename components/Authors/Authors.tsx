import Image from "next/image";
import Link from "next/link";

// 定义作者接口
interface Author {
  id: string;
  name: string;
  avatar: {
    url: string;
  };
  description: string;
  slug: string;
}

// 获取作者数据
async function getAuthors(): Promise<Author[]> {
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
              avatar {
                url
              }
              description
              slug
            }
          }
        }
      `,
    }),
  });

  const { data } = await response.json();
  return data.users.nodes;
}

export default async function Authors() {
  const data: Author[] = await getAuthors();

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-48 max-w-[95rem] w-full mx-auto border border-black border-collapse">
        {data.map((author) => (
            <article
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 md:gap-12 p-4 md:p-8 border border-black"
                key={author.id}
            >
              <Link href={`authors/${author.id}`}>
                <Image
                    className="w-[9.375rem] h-[9.375rem] object-cover rounded-full hover:scale-105 transition"
                    src={author.avatar?.url || "/images/placeholder-avatar.jpg"}
                    alt={author.name}
                    width={150}
                    height={150}
                />
              </Link>
              <article>
                <p className="heading3-title mb-4">
                  <Link href={`/authors/${author.id}`}>{author.name}</Link>
                </p>
                <p className="text-gray-600">{author.description}</p>
              </article>
            </article>
        ))}
      </div>
  );
}
