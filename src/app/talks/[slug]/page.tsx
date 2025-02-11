import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Footer from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
// import Switcher from '../componets/switcher'
// import CookieModal from '../componets/cookieModal'
// import CompanyLogo from '../componets/companyLogo'
// import ClientsOne from '../componets/clientsOne'
// import VideoModal from '../componets/videoModal/videoModal'
// import Cta from '../componets/digital-agency/cta'
// import VideoModalThree from '../componets/videoModal/videoModalThree'

import { MdKeyboardArrowRight } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';
import { FaArrowRight } from 'react-icons/fa';

// import { digitalServices,digitalProduct } from '../Data/data'

export default function Page() {
  return (
    <>
      <Navbar />
      <section className="relative table w-full pt-20 lg:pt-28">
        <div className="container relative">
          <div className="mt-10 grid grid-cols-1 text-center">
            <h1 className="mb-5 text-4xl font-bold leading-normal lg:text-5xl lg:leading-normal">
              LLM apps 101 para <br /> Javascript Developers
            </h1>
          </div>
        </div>
      </section>

      <section className="relative py-16 pt-0 md:py-24 md:pt-0">
        <div className="container relative">
          <div className="grid grid-cols-1 justify-center">
            <div className="relative z-1">
              <div className="grid grid-cols-1 justify-center text-center md:text-start lg:grid-cols-12">
                <div className="lg:col-span-10 lg:col-start-2">
                  <div className="relative">
                    <Image
                      src="/event-1.webp"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: 'auto' }}
                      className="rounded-md shadow-lg"
                      alt=""
                    />
                    {/* <VideoModal /> */}
                  </div>
                </div>
              </div>
              <div className="content md:mt-8">
                <div className="grid grid-cols-1 justify-center text-center md:text-start lg:grid-cols-12">
                  <div className="lg:col-span-10 lg:col-start-2">
                    <div className="grid grid-cols-1 items-center md:grid-cols-2">
                      <div className="mt-8">
                        <div className="section-title text-md-start">
                          <h6 className="text-lg font-semibold text-white/50">
                            Techwind Agency
                          </h6>
                          <h3 className="mt-2 text-2xl font-semibold leading-normal text-white md:text-3xl md:leading-normal">
                            {' '}
                            We are a full-service <br /> digital company
                          </h3>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="section-title text-md-start">
                          <p className="mx-auto mb-2 max-w-xl text-white/50">
                            Start working with Techwind that can provide
                            everything you need to generate awareness, drive
                            traffic, connect.
                          </p>
                          <Link
                            href="#"
                            className="inline-flex items-center space-x-1 text-white"
                          >
                            Read More{' '}
                            <MdKeyboardArrowRight className="ms-1 text-xl" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 end-0 start-0 h-4/5 bg-gradient-to-b from-indigo-500 to-indigo-600 sm:h-2/3"></div>
      </section>

      <section className="relative py-16 md:py-24" id="about">
        <div className="container relative">
          <div className="grid grid-cols-1 items-center gap-[30px] md:grid-cols-12">
            <div className="md:col-span-6 lg:col-span-5">
              <div className="relative">
                <Image
                  src="/speakers/01.jpg"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  className="rounded-full"
                  alt=""
                />
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-7">
              <div className="lg:ms-5">
                <h6 className="mb-2 text-sm font-bold uppercase text-indigo-600">
                  About us
                </h6>
                <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
                  Better Design <br /> Better Experience
                </h3>

                <p className="max-w-xl text-slate-400">
                  Obviously I am a Web Designer. Experienced with all stages of
                  the development cycle for dynamic web projects.
                </p>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-slate-400">WordPress</span>
                    <span className="text-slate-400">84%</span>
                  </div>
                  <div className="h-[6px] w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-[6px] rounded-full bg-indigo-600"
                      style={{ width: '84%' }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-slate-400">JavaScript</span>
                    <span className="text-slate-400">79%</span>
                  </div>
                  <div className="h-[6px] w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-[6px] rounded-full bg-indigo-600"
                      style={{ width: '79%' }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-slate-400">HTML</span>
                    <span className="text-slate-400">95%</span>
                  </div>
                  <div className="h-[6px] w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-[6px] rounded-full bg-indigo-600"
                      style={{ width: '95%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container relative mt-16 md:mt-24">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h6 className="mb-2 text-sm font-bold uppercase text-indigo-600">
              Services
            </h6>
            <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
              What do i offer ?
            </h3>

            <p className="mx-auto max-w-xl text-slate-400">
              Obviously I am a Web Designer. Experienced with all stages of the
              development cycle for dynamic web projects.
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        {/* <ClientsOne /> */}
        <div className="container relative mt-16 md:mt-24">
          <div className="grid grid-cols-1 items-end pb-8 md:grid-cols-12">
            <div className="text-center md:col-span-6 md:text-start lg:col-span-8">
              <h6 className="mb-2 font-semibold text-indigo-600">Portfolio</h6>
              <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
                Our Digital Product
              </h3>
              <p className="max-w-xl text-slate-400">
                Start working with Techwind that can provide everything you need
                to generate awareness, drive traffic, connect.
              </p>
            </div>

            <div className="hidden md:col-span-6 md:block md:text-end lg:col-span-4">
              <Link
                href="#"
                className="relative inline-flex items-center border-none text-center align-middle text-base font-semibold tracking-wide text-indigo-600 duration-500 after:absolute after:bottom-0 after:end-0 after:start-0 after:h-px after:w-0 after:bg-indigo-600 after:duration-500 after:content-[''] hover:text-indigo-600 hover:after:end-auto hover:after:w-full"
              >
                See More <FaArrowRight className="ms-2 text-[10px]" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:hidden md:grid-cols-12">
            <div className="text-center md:col-span-12">
              <Link
                href="#"
                className="relative inline-flex items-center border-none text-center align-middle text-base font-semibold tracking-wide text-indigo-600 duration-500 after:absolute after:bottom-0 after:end-0 after:start-0 after:h-px after:w-0 after:bg-indigo-600 after:duration-500 after:content-[''] hover:text-indigo-600 hover:after:end-auto hover:after:w-full"
              >
                See More <FaArrowRight className="ms-2 text-[10px]" />
              </Link>
            </div>
          </div>
        </div>

        <div className="container relative mt-16 md:mt-24">
          <div className="grid grid-cols-1 text-center">
            <h6 className="mb-2 text-sm font-bold text-indigo-600">
              Available for freelance projects
            </h6>
            <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
              Do you have digital project? <br /> Lets talk.
            </h3>

            <p className="mx-auto max-w-xl text-slate-400">
              Start working with Techwind that can provide everything you need
              to generate awareness, drive traffic, connect.
            </p>

            <div className="mt-6">
              <Link
                href="/contact-one"
                className="mt-4 inline-flex items-center rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
              >
                <FiPhone className="me-1 text-lg" /> Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {/* <Switcher />
      <CookieModal /> */}
    </>
  );
}
