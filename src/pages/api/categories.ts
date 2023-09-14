import type {NextApiRequest, NextApiResponse} from 'next'
import {categories as Categories} from 'data/blog.json'
import {Category} from "@/types/blog.types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Category>>
) {

    let data = Categories

    res.status(200).json(data)
}
