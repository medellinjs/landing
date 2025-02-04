import { Inter } from 'next/font/google';
import type React from 'react'; // Import React

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`font-nunito text-base text-black dark:bg-slate-900 dark:text-white ${inter.className}`}
    >
      {children}
    </div>
  );
}
