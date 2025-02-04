"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { href: "/#about", text: "Sobre Nosotros" },
    { href: "/#events", text: "Eventos" },
    { href: "/#resources", text: "Recursos" },
    { href: "/#community", text: "Comunidad" },
    { href: "/team", text: "Equipo" }, // Added team item
    { href: "/#sponsors", text: "Sponsors" },
    { href: "/sponsors", text: "Patrocina" },
    { href: "/submit-talk", text: "Propón una Charla" },
    { href: "/team", text: "Equipo" },
    { href: "/#newsletter", text: "Newsletter" },
    { href: "/#jobs", text: "Ofertas Laborales" },
    { href: "/#contact", text: "Contacto" },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 transition-colors duration-300 hover:text-blue-800"
        >
          MedellínJS
        </Link>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 bg-white md:bg-transparent z-20 md:z-auto shadow-md md:shadow-none"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.text}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
        <div className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" className="hidden md:inline-flex">
              Únete
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/sponsors">
              <Button variant="outline" className="hidden md:inline-flex">
                Patrocina
              </Button>
            </Link>
          </motion.div>
          <motion.button
            onClick={toggleMenu}
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
