'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { animateScroll as scroll } from 'react-scroll'

import { HiOutlineMoon, HiOutlineSun, HiArrowSmUp } from 'react-icons/hi'

export default function Switcher() {
  const [scrollToTops, setScrollToTops] = useState(false)
  useEffect(() => {
    function scrollHandler(): void {
      setScrollToTops(window.scrollY >= 500)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', scrollHandler)
    }
    window.scrollTo(0, 0)

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: true,
    })
  }

  const toggleTheme = (): void => {
    if (document.documentElement.className.includes('dark')) {
      document.documentElement.className = 'light'
    } else {
      document.documentElement.className = 'dark'
    }
  }

  const setLayout = (dir: 'ltr' | 'rtl'): void => {
    document.documentElement.dir = dir
  }
  return (
    <>
      <div className="fixed -right-3 top-1/4 z-50">
        <span className="relative inline-block rotate-90">
          <input
            type="checkbox"
            className="checkbox absolute opacity-0"
            id="chk"
            onChange={toggleTheme}
          />
          <label
            className="label flex h-8 w-14 cursor-pointer items-center justify-between rounded-full bg-slate-900 p-1 shadow dark:bg-white dark:shadow-gray-800"
            htmlFor="chk"
          >
            <HiOutlineMoon className="text-[20px] text-yellow-500" />
            <HiOutlineSun className="text-[20px] text-yellow-500" />
            <span className="ball absolute left-[2px] top-[2px] size-7 rounded-full bg-white dark:bg-slate-900"></span>
          </label>
        </span>
      </div>

      <div className="fixed -right-3 top-[40%] z-50">
        <Link href="#" id="switchRtl" className="cursor-pointer">
          <span
            className="relative inline-block -rotate-90 rounded-t-md bg-white px-3 py-1 font-semibold shadow-md dark:bg-slate-900 dark:shadow dark:shadow-gray-800 ltr:hidden rtl:block"
            onClick={() => setLayout('ltr')}
          >
            LTR
          </span>
          <span
            className="relative inline-block -rotate-90 rounded-t-md bg-white px-3 py-1 font-semibold shadow-md dark:bg-slate-900 dark:shadow dark:shadow-gray-800 ltr:block rtl:hidden"
            onClick={() => setLayout('rtl')}
          >
            RTL
          </span>
        </Link>
      </div>

      <Link
        href="#"
        onClick={scrollToTop}
        id="back-to-top"
        className={`${!scrollToTops ? 'hidden' : 'back-to-top fixed bottom-5 end-2 z-10 flex size-9 items-center justify-center rounded-full bg-indigo-600 text-center text-lg leading-9 text-white'}`}
      >
        <HiArrowSmUp />
      </Link>
    </>
  )
}
