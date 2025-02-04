'use client';
import React, { useState } from 'react';

import { BsCheckCircle } from 'react-icons/bs';
import { sponsorPackages } from '@/assets/data';

export const SponsorPlan = () => {
  const [isOpenTab, setisOpenTab] = useState(0);

  const handleTabClick = (index: number) => {
    setisOpenTab(index);
  };

  return (
    <div className="grid grid-cols-1">
      <ul className="mx-auto inline-block w-fit flex-wrap justify-center rounded-full bg-white p-2 text-center shadow dark:bg-slate-900 dark:shadow-gray-800">
        <li role="presentation" className="inline-block">
          <button
            onClick={() => handleTabClick(0)}
            className={`${
              isOpenTab === 0 ? 'bg-indigo-600 text-white hover:text-white' : ''
            } w-full rounded-full px-4 py-1 text-sm font-semibold transition-all duration-500 ease-in-out hover:text-indigo-600`}
          >
            Mensual
          </button>
        </li>
        <li role="presentation" className="inline-block">
          <button
            onClick={() => handleTabClick(1)}
            className={`${
              isOpenTab === 1 ? 'bg-indigo-600 text-white hover:text-white' : ''
            } w-full rounded-full px-4 py-1 text-sm font-semibold transition-all duration-500 ease-in-out`}
          >
            Anual{' '}
            <span className="ms-1 h-5 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
              Ahorra 25%
            </span>
          </button>
        </li>
      </ul>

      <div id="StarterContent" className="mt-6">
        <div>
          <div className="mt-8 grid gap-[30px] md:grid-cols-2 lg:grid-cols-4">
            {sponsorPackages.map((plan, index) => (
              <div
                key={plan.id}
                className={`${
                  plan.tag ? 'bg-white' : 'bg-gray-50'
                } group relative h-fit overflow-hidden rounded-md border-b-[3px] p-6 py-8 shadow transition-all duration-500 ease-in-out hover:scale-105 hover:border-indigo-600 hover:bg-white dark:border-gray-700 dark:bg-slate-800 dark:shadow-gray-800 dark:hover:border-indigo-600 dark:hover:bg-slate-900`}
              >
                {plan.tag ? (
                  <span className="absolute -end-11 -top-[10px] flex h-16 w-32 items-center justify-center bg-amber-500 px-2 pb-0 pt-4 text-lg font-semibold text-white ltr:rotate-[45deg] rtl:-rotate-[45deg]">
                    Best
                  </span>
                ) : null}
                <h6 className="mb-5 font-bold uppercase text-indigo-600">
                  {plan.name}
                </h6>

                <div className="mb-5 flex">
                  <span className="text-xl">$</span>
                  <span className="price mb-0 text-2xl font-semibold">
                    {isOpenTab === 0
                      ? Math.round(plan.priceMonthly).toLocaleString()
                      : plan.priceYearly.toLocaleString()}{' '}
                  </span>
                  <span
                    className={`mb-1 self-end text-sm ${
                      sponsorPackages.length === index + 1 ? 'hidden' : ''
                    }`}
                  >
                    /{isOpenTab === 0 ? 'men' : 'anu'}
                  </span>
                </div>

                <ul className="list-none text-slate-400">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="mb-1 flex items-center">
                      <BsCheckCircle className="me-2 text-base text-indigo-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorPlan;
