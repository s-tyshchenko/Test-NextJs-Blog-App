import type {NextApiRequest, NextApiResponse} from 'next'
import {posts as Posts, categories as Categories} from 'data/blog.json'
import {Post} from "@/types/blog.types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post>
) {

    const postIdx = Posts.findIndex((post) => post.slug == req.query.slug)

    if (postIdx == -1) {
        return res.status(404)
    }



    res.status(200).json({
        ...Posts[postIdx],
        categories: Categories.filter((category) => Posts[postIdx].categories.includes(category.id))
    })
}
