'use client'
import { useState, FC, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { usePathname } from 'next/navigation'

export type NavbarProps = {
  navClass?: string
  navJustify?: string
  manu?: string
}

export const Navbar: FC<NavbarProps> = ({ navClass, navJustify }) => {
  const [isMenu, setisMenu] = useState(false)

  const [manu, setManu] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setManu(pathname)

    function windowScroll() {
      const navbar = document.getElementById('topnav')
      if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
        if (navbar !== null) {
          navbar?.classList.add('nav-sticky')
        }
      } else {
        if (navbar !== null) {
          navbar?.classList.remove('nav-sticky')
        }
      }
    }
    window.addEventListener('scroll', windowScroll)
    window.scrollTo(0, 0)
    return () => {
      window.removeEventListener('scroll', windowScroll)
    }
  }, [pathname, setManu])

  const toggleMenu = () => {
    setisMenu(!isMenu)
    const navigation = document.getElementById('navigation')
    if (navigation) {
      const anchorArray = Array.from(navigation.getElementsByTagName('a'))
      anchorArray.forEach((element) => {
        element.addEventListener('click', (elem) => {
          const target = (elem.target as HTMLAnchorElement).getAttribute('href')
          if (target) {
            if ((elem.target as HTMLElement).nextElementSibling) {
              const submenu = (elem.target as HTMLElement).nextElementSibling
                ?.nextElementSibling as HTMLElement
              submenu.classList.toggle('open')
            }
          }
        })
      })
    }
  }

  return (
    <nav
      id="topnav"
      className={`defaultscroll ${
        navClass === 'nav-light'
          ? ''
          : navClass === 'nav-sticky'
            ? 'bg-white dark:bg-slate-900'
            : ''
      }`}
    >
      <div className="container relative">
        {navClass === 'nav-light' ? (
          <Link className="logo" href="/">
            <span className="inline-block dark:hidden">
              <Image src="/logo-dark.png" className="l-dark" width={138} height={24} alt="" />
              <Image src="/logo-light.png" className="l-light" width={138} height={24} alt="" />
            </span>
            <Image
              src="/logo-light.png"
              width={138}
              height={24}
              className="hidden dark:inline-block"
              alt=""
            />
          </Link>
        ) : (
          <Link className="logo" href="/">
            <Image
              src="/logo-dark.png"
              width={138}
              height={24}
              className="inline-block dark:hidden"
              alt=""
            />
            <Image
              src="/logo-light.png"
              width={138}
              height={24}
              className="hidden dark:inline-block"
              alt=""
            />
          </Link>
        )}

        <div className="menu-extras">
          <div className="menu-item">
            <Link
              href="#"
              className={`navbar-toggle ${isMenu ? 'open' : ''}`}
              id="isToggle"
              onClick={() => toggleMenu()}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Link>
          </div>
        </div>

        <ul className="buy-button mb-0 hidden list-none space-x-1 sm:block">
          <li className="mb-0 inline ps-1">
            <Link href="/comparte">
              <div className="login-btn-primary">
                <span className="w-full rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700">
                  Inscribe tu charla
                </span>
              </div>
              <div className="login-btn-light">
                <span className="w-full rounded-md border bg-gray-50 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide duration-500 hover:border-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-slate-900 dark:hover:border-gray-700 dark:hover:bg-gray-700">
                  Inscribe tu charla
                </span>
              </div>
            </Link>
          </li>
        </ul>

        <div id="navigation" style={{ display: isMenu ? 'block' : 'none' }}>
          <ul className={`navigation-menu ${navClass} ${navJustify}`}>
            <li className={manu === '/' || '' ? 'active' : ''}>
              <Link href="/" className="sub-menu-item">
                Inicio
              </Link>
            </li>

            <li className={manu === '/sponsors' || '' ? 'active' : ''}>
              <Link href="/sponsors" className="sub-menu-item">
                Patrocina
              </Link>
            </li>

            <li className={manu === '/events' || '' ? 'active' : ''}>
              <Link href="/events" className="sub-menu-item">
                Eventos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
