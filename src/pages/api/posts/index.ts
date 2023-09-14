import type { NextApiRequest, NextApiResponse } from 'next'
import {posts as Posts, categories as Categories} from 'data/blog.json'
import {Collection, Post} from "@/types/blog.types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Collection<Post>>
) {

  let data = Posts

  const meta: Collection<Post>['meta'] = {
    currentPage: 1,
    lastPage: 1,
    from: 1,
    to: Posts.length,
    total: Posts.length,
    perPage: Posts.length,
  }


  const perPage = req.query?.per_page
  if (perPage && typeof perPage == "string") {
    meta.perPage = parseInt(perPage)
  }

  const category = req.query?.category
  if (category && typeof category == "string") {
    data = data.filter((post) => post.categories.includes(parseInt(category)))
  }

  const query = req.query?.query
  if (query && typeof query == "string") {
    data = data.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()))
  }

  const page = req.query?.page ?? "1"

  if (typeof page === "string") {
    meta.currentPage = parseInt(page)
  } else {
    meta.currentPage = 1
  }

  meta.total = data.length

  meta.from = (meta.currentPage - 1) * meta.perPage + 1
  meta.to = Math.min(meta.currentPage * meta.perPage, data.length)

  meta.lastPage = Math.ceil(data.length / meta.perPage)

  setTimeout(() => {
    res.status(200).json({
      data: data.slice(meta.from - 1, meta.to)
        .map((post) => ({
          ...post, categories: Categories.filter((category) => post.categories.includes(category.id))
        })),
      meta
    })
  }, 2000)
}
