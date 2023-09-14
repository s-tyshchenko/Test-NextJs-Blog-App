export type Post = {
  id: number
  slug: string
  title: string
  excerpt: string
  imageUrl: string
  categories: Category[]
}

export type Collection<T> = {
  data: T[]
  meta: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
}

export type Category = {
  id: number
  name: string
  slug: string
}
