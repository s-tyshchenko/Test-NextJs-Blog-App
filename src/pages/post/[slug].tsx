import {FC} from "react";
import {Collection, Post} from "@/types/blog.types";
import api from "@/helpers/api";
import {GetStaticProps} from "next";
import Link from "next/link";
import {ChevronRightIcon, HomeIcon} from "@heroicons/react/20/solid";

const Search: FC<{ post: Post }> = ({post}) => {

    return (
      <>

          <main>

              <div className="flex items-center space-x-2 py-5">
                  <li className="flex items-center">
                      <Link href="/"
                            className="inline-flex justify-center items-center space-x-3 text-gray-500 hover:text-gray-900">
                          <HomeIcon className="h-5 w-5"/>
                          <span>Home</span>
                      </Link>
                  </li>

                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400"/>

                  <span className="text-gray-500">Posts</span>

                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400"/>

                  <Link href={`/posts/${post.slug}`}
                        className="truncate text-gray-800 hover:text-gray-900">
                      {post.title}
                  </Link>
              </div>

              <div className="flex flex-col space-y-5">

                  <img src={post.imageUrl} alt={post.title} loading="lazy" className="w-full rounded-xl aspect-video object-cover"/>

                  <h1 className="text-3xl font-semibold">{post.title}</h1>

                  <p className="">{post.excerpt}</p>

                  <div className="flex items-center space-x-2">
                      {
                          post.categories.map((category, idx) => (
                            <div
                              key={idx}
                              className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-300"
                            >
                                {category.name}
                            </div>
                          ))
                      }
                  </div>

              </div>


          </main>
      </>
    )
}


export const getStaticProps: GetStaticProps = async ({params}) => {

    let post: Post | undefined;

    if (params?.slug) {
        post = await api.get(`/posts/${params.slug}`)
          .then((res) => res.data)
    }

    return {
        props: {post}
    }
}

export async function getStaticPaths() {
    const posts: Collection<Post> = await api.get(`/posts`).then((res) => res.data)

    const paths = posts.data.map((post) => ({
        params: {slug: post.slug},
    }))

    return {paths, fallback: false}
}

export default Search
