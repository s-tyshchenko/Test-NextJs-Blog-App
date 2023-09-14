import {createContext, FC, useContext, useState} from "react";
import {Category, Collection, Post} from "@/types/blog.types";
import {GetStaticProps} from "next";
import api from "@/helpers/api";
import classNames from "@/helpers/classNames";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import {ArrowPathIcon} from "@heroicons/react/20/solid";

const pageSize = 6;

const SearchContext = createContext<{
    query: string
    setQuery: (q: string) => void
    category: number | undefined
    setCategory: (c: number | undefined) => void
    posts: Collection<Post>
    loading: boolean
}>({
    query: '',
    setQuery: (q) => {},
    category: undefined,
    setCategory: (c) => {},
    posts: {
        data: [],
        meta: {
            currentPage: 1,
            lastPage: 1,
            perPage: pageSize,
            from: 1,
            to: 1,
            total: 1
        }
    },
    loading: false
});

type handleSearch = (page: number) => void

const Search: FC<{ posts: Collection<Post>, categories: Category[] }> = (props) => {

    const [query, setQuery] = useState<string>('')
    const [category, setCategory] = useState<number | undefined>()

    const [loading, setLoading] = useState<boolean>(false)

    const [posts, setPosts] = useState<Collection<Post>>(props.posts)

    const search: handleSearch = (page) => {
        setLoading(true)

        api.get(`/posts?query=${query}&category=${category || ''}&page=${page}&per_page=${pageSize}`)
          .then((result) => {
              setPosts(result.data)
              setLoading(false)
          })
    }

    return (
      <>
          <SearchContext.Provider
            value={{
                query: query,
                setQuery: setQuery,
                category: category,
                setCategory: setCategory,
                loading: loading,
                posts: posts
            }}
          >
              <main>

                  <header className="flex flex-col items-center justify-center py-12 lg:py-24">

                      <h1 className="text-center text-2xl font-bold mb-2">Welcome to my blog!</h1>
                      <h2 className="text-center text-sm mb-5 text-gray-500">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, <br/>
                          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </h2>

                      <SearchForm
                        handleSubmit={search}
                        categories={props.categories}
                      />

                  </header>

                  <PostsContainer
                    handlePagination={search}
                    posts={posts}
                  />
              </main>
          </SearchContext.Provider>
      </>
    )
}

const SearchForm: FC<{ handleSubmit: handleSearch, categories: Category[] }> = ({handleSubmit, categories}) => {

    const {query, setQuery, category, setCategory, loading} = useContext(SearchContext)

    return (
      <>

          <div className="w-full flex justify-center space-x-3">

              <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Type something..."
                    disabled={loading}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
              </div>

              <div>
                  <select
                    className={classNames(
                      category ? 'text-gray-900' : 'text-gray-400',
                      'block w-full rounded-md border-0 py-1.5 pl-3 pr-10 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    )}
                    disabled={loading}
                    value={category}
                    onChange={(e) => setCategory(parseInt(e.target.value))}
                    defaultValue=""
                  >
                      <option>Category</option>
                      {
                          categories.map((category, idx) => (
                            <option key={idx} value={category.id}>{category.name}</option>
                          ))
                      }
                  </select>
              </div>

              <div>
                  <button
                    type="button"
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    disabled={loading}
                    onClick={() => handleSubmit(1)}
                  >
                      {
                          loading
                            ? <ArrowPathIcon className="pointer-events-none animate-spin h-5 w-5"/>
                            : <MagnifyingGlassIcon className="pointer-events-none h-5 w-5"/>
                      }
                  </button>
              </div>

          </div>
      </>
    )
}

const PostsContainer: FC<{
    handlePagination: handleSearch
    posts: Collection<Post>
}> = ({handlePagination, posts}) => {

    const {setCategory, loading} = useContext(SearchContext)

    return (
      <div className="py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {
                  posts.data.map((post, idx) => (
                    <div
                      key={idx}
                      className={classNames(
                        loading && 'animate-pulse',
                        'flex flex-col space-y-3 pb-3 rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1'
                      )}
                    >
                        <Link href={`/post/${post.slug}`}>
                            <img src={post.imageUrl} alt={post.title} loading="lazy"
                                 className="w-full rounded-t-lg object-cover aspect-square"/>
                        </Link>
                        <Link href={`/post/${post.slug}`}
                              className="px-3 font-semibold text-gray-900 hover:text-gray-500">
                            {post.title}
                        </Link>
                        <div className="px-3 grow">
                            <p className="text-sm text-gray-500">{post.excerpt}</p>
                        </div>
                        <div className="px-3">
                            <small className="inline-flex font-semibold space-x-1.5">
                                {
                                    post.categories.map((category, idx) => (
                                      <button
                                        key={idx}
                                        className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-100 ring-1 ring-inset ring-gray-200"
                                        onClick={() => {
                                            setCategory(category.id)
                                            handlePagination(1)
                                        }}
                                      >
                                          {category.name}
                                      </button>
                                    ))
                                }
                            </small>
                        </div>
                    </div>
                  ))
              }
          </div>
          <div className="mt-5 flex justify-center items-center">

              <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                      Showing <span
                    className="font-medium">{posts.meta.from || 0}</span> to <span
                    className="font-medium">{posts.meta.to || 0}</span> of{' '}
                      <span
                        className="font-medium">{posts.meta.total}</span> results
                  </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end space-x-3">
                  <button
                    disabled={posts.meta.currentPage == 1}
                    onClick={() => handlePagination(posts.meta.currentPage - 1)}
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:text-gray-300"
                  >
                      Previous
                  </button>
                  <button
                    disabled={posts.meta.currentPage == posts.meta.lastPage}
                    onClick={() => handlePagination(posts.meta.currentPage + 1)}
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:text-gray-300"
                  >
                      Next
                  </button>
              </div>

          </div>
      </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {

    const posts = await api.get(`/posts?per_page=${pageSize}`).then(({data}) => data)

    const categories = await api.get('/categories').then(({data}) => data)

    return {
        props: {posts, categories}
    }
}

export default Search
