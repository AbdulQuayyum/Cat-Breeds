import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import ReactReadMoreReadLess from "react-read-more-read-less";

export async function getStaticProps() {

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  )


  const { data } = await supabaseAdmin.from('cats').select('*').order('id')
  return {
    props: {
      cats: data,
    },
  }
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
type Cat = {
  id: number
  name: string
  wikipedia_url: string
  url: string
  description: string
}

export default function Index({ cats }: { cats: Cat[] }) {
  return (

    <div className="max-w-2xl px-4 py-2 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center text-gray-900 dark:text-white">Cats Breeds</h1>
      <p className="mb-6 text-lg font-normal text-center text-gray-500 dark:text-gray-400">Here are some of the breeds of cats that can be used as pets</p>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {cats.map((cat) => (
          <BlurImage key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  )
}

function BlurImage({ cat }: { cat: Cat }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="group">
      <a href={cat.wikipedia_url}>
        <div className="w-full overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
          <Image
            alt=""
            src={cat.url}
            layout="fill"
            objectFit="cover"
            className={cn(
              'duration-700 ease-in-out group-hover:opacity-75',
              isLoading
                ? 'scale-110 blur-2xl grayscale'
                : 'scale-100 blur-0 grayscale-0'
            )}
            onLoadingComplete={() => setLoading(false)}
          />
        </div>
      </a>
      <p className="mt-1 text-lg font-medium text-gray-600">{cat.name}</p>

      <div className="text-gray-500">
        <ReactReadMoreReadLess
          charLimit={50}
          readMoreText={"read more"}
          readLessText={"read less"}
          readMoreClassName="read-more-less--more"
          readLessClassName="read-more-less--less"
        >
          {cat.description}
        </ReactReadMoreReadLess>
      </div>
    </div>
  )
}