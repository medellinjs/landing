"use client";
import React, { useState } from "react";

import { sponsorFaqs } from "@/assets/data";

export function ServiceFaq() {
  const [activeIndex, setActiveIndex] = useState(1);

  const toggleAccordion = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div
      id="accordion-collapse"
      data-accordion="collapse"
      className="grid grid-cols-1 mt-8 gap-8"
    >
      <div>
        {sponsorFaqs.map((item, index) => (
          <div
            key={index}
            className="relative shadow dark:shadow-gray-800 rounded-md overflow-hidden mt-4"
          >
            <h2
              className="text-base font-semibold"
              id="accordion-collapse-heading-1"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(item.id)}
                className={`flex justify-between items-center p-5 w-full font-medium text-start ${
                  activeIndex === item.id
                    ? "bg-gray-50 dark:bg-slate-800 text-indigo-600"
                    : ""
                }`}
                data-accordion-target="#accordion-collapse-body-1"
                aria-expanded="true"
                aria-controls="accordion-collapse-body-1"
              >
                <span>{item.question}</span>
                <svg
                  data-accordion-icon
                  className={`${
                    activeIndex === item.id ? "rotate-180" : "rotate-270"
                  } size-4 shrink-01`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </h2>
            {activeIndex === item.id && (
              <div>
                <div className="p-5">
                  <p className="text-slate-400 dark:text-gray-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceFaq;
