
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-10 md:px-20 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-wine rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-wine dark:text-white">MEU LUUK</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="font-medium hover:text-wine dark:hover:text-primary transition-colors" href="#how-it-works">Como funciona</a>
          <a className="font-medium hover:text-wine dark:hover:text-primary transition-colors" href="#pricing">Preços</a>
          <a className="bg-primary text-wine font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform" href="#pricing">Baixar Agora</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
