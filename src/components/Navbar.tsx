"use client";
import { useState, FC, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { LuSettings } from "react-icons/lu";
import { BsCart3 } from "react-icons/bs";

export type NavbarProps = {
  navClass?: string;
  navJustify?: string;
  manu?: string;
};

export const Navbar: FC<NavbarProps> = ({ navClass, navJustify }) => {
  const [isMenu, setisMenu] = useState(false);

  const [manu, setManu] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setManu(pathname);

    function windowScroll() {
      const navbar = document.getElementById("topnav");
      if (
        document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50
      ) {
        if (navbar !== null) {
          navbar?.classList.add("nav-sticky");
        }
      } else {
        if (navbar !== null) {
          navbar?.classList.remove("nav-sticky");
        }
      }
    }
    window.addEventListener("scroll", windowScroll);
    window.scrollTo(0, 0);
    return () => {
      window.removeEventListener("scroll", windowScroll);
    };
  }, [pathname, setManu]);

  const toggleMenu = () => {
    setisMenu(!isMenu);
    const navigation = document.getElementById("navigation");
    if (navigation) {
      const anchorArray = Array.from(navigation.getElementsByTagName("a"));
      anchorArray.forEach((element) => {
        element.addEventListener("click", (elem) => {
          const target = (elem.target as HTMLAnchorElement).getAttribute(
            "href"
          );
          if (target) {
            if ((elem.target as HTMLElement).nextElementSibling) {
              const submenu = (elem.target as HTMLElement).nextElementSibling
                ?.nextElementSibling as HTMLElement;
              submenu.classList.toggle("open");
            }
          }
        });
      });
    }
  };

  return (
    <nav
      id="topnav"
      className={`defaultscroll ${
        navClass === "nav-light"
          ? ""
          : navClass === "nav-sticky"
          ? "bg-white dark:bg-slate-900"
          : ""
      }`}
    >
      <div className="container relative">
        {navClass === "nav-light" ? (
          <Link className="logo" href="/">
            <span className="inline-block dark:hidden">
              <Image
                src="/logo-dark.png"
                className="l-dark"
                width={138}
                height={24}
                alt=""
              />
              <Image
                src="/logo-light.png"
                className="l-light"
                width={138}
                height={24}
                alt=""
              />
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
          <Link className="logo" href="/index">
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
              className={`navbar-toggle ${isMenu ? "open" : ""}`}
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

        {navClass !== "nav-light" ? (
          <ul className={`buy-button list-none space-x-1 mb-0`}>
            <li className="inline mb-0">
              <Link
                href="#"
                className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-indigo-600/5 hover:bg-indigo-600 border border-indigo-600/10 hover:border-indigo-600 text-indigo-600 hover:text-white"
              >
                <LuSettings className="size-4" />
              </Link>
            </li>

            <li className="inline ps-1 mb-0">
              <Link
                href="https://1.envato.market/techwind-next"
                target="_blank"
                className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 text-white"
              >
                <BsCart3 className="size-4" />
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="buy-button list-none space-x-1 mb-0">
            <li className="inline ps-1 mb-0">
              <Link href="/comparte">
                <div className="login-btn-primary">
                  <span className="py-2 px-5  font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md w-full">
                    Inscribe tu charla
                  </span>
                </div>
                <div className="login-btn-light">
                  <span className="py-2 px-5  font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-gray-700 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-700 rounded-md w-full">
                    Inscribe tu charla
                  </span>
                </div>
              </Link>
            </li>
          </ul>
        )}

        <div id="navigation" style={{ display: isMenu ? "block" : "none" }}>
          <ul className={`navigation-menu ${navClass} ${navJustify}`}>
            <li className={manu === "/" || "" ? "active" : ""}>
              <Link href="/" className="sub-menu-item">
                Inicio
              </Link>
            </li>

            <li className={manu === "/sponsors" || "" ? "active" : ""}>
              <Link href="/sponsors" className="sub-menu-item">
                Patrocina
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
