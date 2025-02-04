"use client";
import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "react-feather";

export type SocialNetwork = {
  name: string;
  url: string;
};

export type Organizer = {
  name: string;
  description?: string;
  image: string;
  title: string;
  socialNetworks?: SocialNetwork[];
  bgIndex: number;
};

const background = [
  "bg-indigo-600/10 dark:bg-indigo-600/30",
  "bg-emerald-600/10 dark:bg-emerald-600/30",
  "bg-red-600/10 dark:bg-red-600/30",
  "bg-sky-600/10 dark:bg-sky-600/30",
  "bg-indigo-600/10 dark:bg-indigo-600/30",
  "bg-emerald-600/10 dark:bg-emerald-600/30",
  "bg-red-600/10 dark:bg-red-600/30",
  "bg-sky-600/10 dark:bg-sky-600/30",
  "bg-indigo-600/10 dark:bg-indigo-600/30",
  "bg-emerald-600/10 dark:bg-emerald-600/30",
  "bg-red-600/10 dark:bg-red-600/30",
  "bg-sky-600/10 dark:bg-sky-600/30",
  "bg-indigo-600/10 dark:bg-indigo-600/30",
  "bg-emerald-600/10 dark:bg-emerald-600/30",
  "bg-red-600/10 dark:bg-red-600/30",
  "bg-sky-600/10 dark:bg-sky-600/30",
  "bg-indigo-600/10 dark:bg-indigo-600/30",
  "bg-emerald-600/10 dark:bg-emerald-600/30",
  "bg-red-600/10 dark:bg-red-600/30",
  "bg-sky-600/10 dark:bg-sky-600/30",
];

export const OrganizerCard: FC<Organizer> = ({
  name,
  description,
  image,
  title,
  socialNetworks = [],
  bgIndex,
}) => (
  <div className="lg:col-span-3 md:col-span-6">
    <div className="team p-6 rounded-md shadow-md dark:shadow-gray-800 dark:border-gray-700 bg-white dark:bg-slate-900 relative">
      <div
        className={`absolute inset-0 rounded-md -mt-[10px] -ms-[10px] h-[98%] w-[98%] -z-1 bg-sky-600/10 dark:bg-sky-600/30 ${background[bgIndex]}`}
      ></div>
      <Image
        src={image}
        height={96}
        width={96}
        className="size-24 rounded-full shadow-md dark:shadow-gray-800 mx-auto"
        alt="Profile Image"
      />

      <div className="content mt-4">
        <p className="text-center md:text-left text-lg font-medium hover:text-indigo-600 block">
          {name}
        </p>
        <span className="text-center md:text-left text-slate-400 block">
          {title}
        </span>

        <p className="text-center md:text-left text-slate-400 mt-4">
          {description}
        </p>

        <ul className="list-none mt-4 space-x-1 text-center md:text-left ">
          {socialNetworks.map((network, index) => (
            <li key={index} className="inline">
              <Link
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 inline-flex items-center justify-center tracking-wide align-middle transition duration-500 ease-in-out text-base text-center border border-gray-100 dark:border-gray-800 rounded-md hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
              >
                {network.name === "linkedin" && (
                  <Icon.Linkedin className="size-4"></Icon.Linkedin>
                )}
                {network.name === "twitter" && (
                  <Icon.Twitter className="size-4"></Icon.Twitter>
                )}
                {network.name === "github" && (
                  <Icon.GitHub className="size-4"></Icon.GitHub>
                )}
                {network.name === "instagram" && (
                  <Icon.Instagram className="size-4"></Icon.Instagram>
                )}
                {network.name === "website" && (
                  <Icon.Globe className="size-4"></Icon.Globe>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default OrganizerCard;
