import PostRecent from '@/components/organisms/postRecent'
import Pagination from '@/components/molecules/pagination'
import Sidebar from '@/components/organisms/sidebar'
import TitleMV from '@/components/organisms/titleMV'
import { defaultSettings } from '@/contants/defaultSettings'
import getData from '@/utils/getData'
import { ResolvingMetadata } from 'next'

type Props = {
  params: {
    slug: string
  },
  searchParams: {
    q?: string
  }
}

/** MetaData */
export async function generateMetadata({params, searchParams}: Props, parent: ResolvingMetadata) {
  const settingsEndpoint = 'settings/'
  const settingsData = await getData(settingsEndpoint)
  const parentData = await(parent)

  const title = `《${searchParams.q}》の検索結果 | ${settingsData.siteName}`
  const previousPreview = parentData.openGraph?.images || []
  const favicon = settingsData.favicon
  const faviconUrl = favicon ? favicon.url : '/images/favicon.ico'

  return {
    title: title,
    description: `《${searchParams.q}》の検索結果ページです。`,
    openGraph: {
      title: title,
      images: [...previousPreview],
      type: 'article',
    },
    icons: {
      icon: [
        {
          url: faviconUrl,
          href: faviconUrl,
        }
      ]
    }
  }
}

async function SearchPage({ params, searchParams }: Props) {

  /** Get data */
  const paramQuery = searchParams.q
  const settingsData = await getData('settings/')
  
  const fields = defaultSettings.queryFields
  const postLimit = settingsData.postLimit || defaultSettings.postLimit
  const limitOffset = `limit=${postLimit}&offset=${0}`
  const query = `q=${paramQuery}`
  const postsEndpoint = `blogs?${query}&${fields}&${limitOffset}`
  const postsData = await getData(postsEndpoint)
 
  return (
    <>
      <TitleMV title={'検索'} description={paramQuery} /> 
      <div className="main__wrapper page--search">
        <div className="main__container container">
          <div className="main__inner">
            <div className="main__content">
              <PostRecent articles={postsData.contents} />
              <Pagination totalCount={postsData.totalCount} basePath={'/search'} q={paramQuery} />
            </div>
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchPage
