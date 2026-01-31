
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="py-16 md:py-28 overflow-hidden bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-24 lg:px-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-wine dark:text-white leading-[1.1]">
            Se arrume em <span className="text-primary italic">5min.</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed">
            Tenha um guarda-roupa inteligente na palma da sua mão. Compre menos, veja como a roupa fica em você antes de comprar e acerte muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              className="bg-primary text-wine font-black text-lg px-10 py-5 rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all" 
              href="#pricing"
            >
              Começar Agora
              <span className="material-icons-outlined">arrow_forward</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://i.pravatar.cc/150?u=ml1"/>
              <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://i.pravatar.cc/150?u=ml2"/>
              <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://i.pravatar.cc/150?u=ml3"/>
            </div>
            <span>+5.000 pessoas já digitalizaram seu estilo</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-brand/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10 w-full max-w-[480px] mx-auto overflow-hidden rounded-[3rem] shadow-2xl border-[10px] border-white dark:border-zinc-800 bg-peach-light">
             <img 
                alt="Hand holding phone with Meu Luuk app" 
                className="w-full h-auto block" 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200"
              />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
