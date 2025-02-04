"use client";
import React, { useState } from "react";

import { BsCheckCircle } from "react-icons/bs";
import { sponsorPackages } from "@/assets/data";

export const SponsorPlan = () => {
  const [isOpenTab, setisOpenTab] = useState(0);

  const handleTabClick = (index: number) => {
    setisOpenTab(index);
  };

  return (
    <div className="grid grid-cols-1">
      <ul className="inline-block w-fit mx-auto flex-wrap justify-center text-center p-2 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-full">
        <li role="presentation" className="inline-block">
          <button
            onClick={() => handleTabClick(0)}
            className={`${
              isOpenTab === 0 ? "text-white bg-indigo-600 hover:text-white" : ""
            } px-4 py-1 text-sm font-semibold rounded-full w-full hover:text-indigo-600 transition-all duration-500 ease-in-out`}
          >
            Mensual
          </button>
        </li>
        <li role="presentation" className="inline-block">
          <button
            onClick={() => handleTabClick(1)}
            className={`${
              isOpenTab === 1 ? "text-white bg-indigo-600 hover:text-white" : ""
            } px-4 py-1 text-sm font-semibold rounded-full w-full transition-all duration-500 ease-in-out`}
          >
            Anual{" "}
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full h-5 ms-1">
              Ahorra 25%
            </span>
          </button>
        </li>
      </ul>

      <div id="StarterContent" className="mt-6">
        <div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 mt-8 gap-[30px]">
            {sponsorPackages.map((plan, index) => (
              <div
                key={plan.id}
                className={`${
                  plan.tag ? "bg-white" : "bg-gray-50"
                } group border-b-[3px] dark:border-gray-700 p-6 py-8 hover:border-indigo-600 dark:hover:border-indigo-600 transition-all duration-500 ease-in-out hover:scale-105 relative overflow-hidden shadow dark:shadow-gray-800 rounded-md  dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-900 h-fit`}
              >
                {plan.tag ? (
                  <span className="absolute -end-11 -top-[10px] ltr:rotate-[45deg] rtl:-rotate-[45deg] w-32 h-16 pt-4 px-2 pb-0 flex items-center justify-center text-white bg-amber-500 font-semibold text-lg">
                    Best
                  </span>
                ) : null}
                <h6 className="font-bold uppercase mb-5 text-indigo-600">
                  {plan.name}
                </h6>

                <div className="flex mb-5">
                  <span className="text-xl ">$</span>
                  <span className="price text-2xl font-semibold mb-0">
                    {isOpenTab === 0
                      ? Math.round(plan.priceMonthly).toLocaleString()
                      : plan.priceYearly.toLocaleString()}{" "}
                  </span>
                  <span
                    className={`text-sm  self-end mb-1 ${
                      sponsorPackages.length === index + 1 ? "hidden" : ""
                    }`}
                  >
                    /{isOpenTab === 0 ? "men" : "anu"}
                  </span>
                </div>

                <ul className="list-none text-slate-400">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="mb-1 flex items-center">
                      <BsCheckCircle className="text-indigo-600 text-base me-2" />
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
