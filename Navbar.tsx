import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { HamburgerMenuIcon, Cross1Icon, GlobeIcon } from "@radix-ui/react-icons";
import CourtHammer from "@/assets/icons/court-hammer.svg";
import { useTranslation } from "@/lib/i18n";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };
  
  const links = [
    { href: "/", label: t('home') },
    { href: "/trials", label: t('trials') },
    { href: "/hall-of-plain", label: t('hallOfPlain') },
    { href: "/leaderboard", label: t('leaderboard') },
    { href: "/profile", label: t('login') },
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-retro-purple border-b-4 border-black shadow-pixel">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-2 md:mb-0 w-full md:w-auto justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src={CourtHammer} alt="Logo" className="h-10 w-10 mr-2 animate-spin-slow" />
              <h1 className="font-pixel text-xl text-retro-yellow glitch-animation">{t('appName')}</h1>
            </div>
          </Link>
          
          <div className="flex items-center space-x-3">
            <button
              className="text-retro-light hover:text-retro-yellow flex items-center"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <GlobeIcon className="mr-1" />
              <span className="text-xs font-pixel">{t('languageSwitch')}</span>
            </button>
            
            <button 
              className="md:hidden text-retro-light hover:text-retro-yellow"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
            </button>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 text-retro-light">
          {links.map(link => (
            <Link key={link.href} href={link.href}>
              <div 
                className={`hover:text-retro-yellow transition-all duration-300 transform hover:scale-110 font-pixel text-sm cursor-pointer ${
                  location === link.href ? 'text-retro-yellow' : ''
                }`}
              >
                {link.label}
              </div>
            </Link>
          ))}
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden fixed inset-0 top-16 bg-retro-dark z-40 flex flex-col items-center pt-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="mb-8"
              >
                <button
                  className="text-retro-light hover:text-retro-yellow flex items-center"
                  onClick={toggleLanguage}
                  aria-label="Toggle language"
                >
                  <GlobeIcon className="mr-2" />
                  <span className="text-base font-pixel">{t('languageSwitch')}</span>
                </button>
              </motion.div>
              
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-6"
                >
                  <Link href={link.href}>
                    <div 
                      className={`hover:text-retro-yellow transition-all duration-300 font-pixel text-lg cursor-pointer ${
                        location === link.href ? 'text-retro-yellow' : 'text-retro-light'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
