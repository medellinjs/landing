'use client';
import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from 'react-feather';

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
  'bg-indigo-600/10 dark:bg-indigo-600/30',
  'bg-emerald-600/10 dark:bg-emerald-600/30',
  'bg-red-600/10 dark:bg-red-600/30',
  'bg-sky-600/10 dark:bg-sky-600/30',
  'bg-indigo-600/10 dark:bg-indigo-600/30',
  'bg-emerald-600/10 dark:bg-emerald-600/30',
  'bg-red-600/10 dark:bg-red-600/30',
  'bg-sky-600/10 dark:bg-sky-600/30',
  'bg-indigo-600/10 dark:bg-indigo-600/30',
  'bg-emerald-600/10 dark:bg-emerald-600/30',
  'bg-red-600/10 dark:bg-red-600/30',
  'bg-sky-600/10 dark:bg-sky-600/30',
  'bg-indigo-600/10 dark:bg-indigo-600/30',
  'bg-emerald-600/10 dark:bg-emerald-600/30',
  'bg-red-600/10 dark:bg-red-600/30',
  'bg-sky-600/10 dark:bg-sky-600/30',
  'bg-indigo-600/10 dark:bg-indigo-600/30',
  'bg-emerald-600/10 dark:bg-emerald-600/30',
  'bg-red-600/10 dark:bg-red-600/30',
  'bg-sky-600/10 dark:bg-sky-600/30',
];

export const OrganizerCard: FC<Organizer> = ({
  name,
  description,
  image,
  title,
  socialNetworks = [],
  bgIndex,
}) => (
  <div className="md:col-span-6 lg:col-span-3">
    <div className="team relative rounded-md bg-white p-6 shadow-md dark:border-gray-700 dark:bg-slate-900 dark:shadow-gray-800">
      <div
        className={`absolute inset-0 -z-1 -ms-[10px] -mt-[10px] h-[98%] w-[98%] rounded-md bg-sky-600/10 dark:bg-sky-600/30 ${background[bgIndex]}`}
      ></div>
      <Image
        src={image}
        height={96}
        width={96}
        className="mx-auto size-24 rounded-full shadow-md dark:shadow-gray-800"
        alt="Profile Image"
      />

      <div className="content mt-4">
        <p className="block text-center text-lg font-medium hover:text-indigo-600 md:text-left">
          {name}
        </p>
        <span className="block text-center text-slate-400 md:text-left">
          {title}
        </span>

        <p className="mt-4 text-center text-slate-400 md:text-left">
          {description}
        </p>

        <ul className="mt-4 list-none space-x-1 text-center md:text-left">
          {socialNetworks.map((network, index) => (
            <li key={index} className="inline">
              <Link
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-md border border-gray-100 text-center align-middle text-base tracking-wide transition duration-500 ease-in-out hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-gray-800 dark:hover:border-indigo-600"
              >
                {network.name === 'linkedin' && (
                  <Icon.Linkedin className="size-4"></Icon.Linkedin>
                )}
                {network.name === 'twitter' && (
                  <Icon.Twitter className="size-4"></Icon.Twitter>
                )}
                {network.name === 'github' && (
                  <Icon.GitHub className="size-4"></Icon.GitHub>
                )}
                {network.name === 'instagram' && (
                  <Icon.Instagram className="size-4"></Icon.Instagram>
                )}
                {network.name === 'website' && (
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
