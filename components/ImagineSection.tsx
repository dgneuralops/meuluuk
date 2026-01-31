
import React from 'react';

const ImagineSection: React.FC = () => {
  return (
    <section className="bg-vibrant-orange py-24">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-24 lg:px-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <img 
            alt="Person choosing outfits" 
            className="w-full max-w-md mx-auto rounded-3xl shadow-2xl" 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
          />
        </div>
        <div className="text-white order-1 lg:order-2 space-y-6">
          <h2 className="text-wine text-5xl md:text-7xl font-extrabold">Agora imagina...</h2>
          <p className="text-xl md:text-2xl font-medium leading-relaxed text-wine/90">
            Ter o seu guarda-roupa na palma da sua mão, saber exatamente as roupas que você tem, ter sugestões de looks prontas, se arrumar rápido, gastar menos tempo, dinheiro e ter escolhas mais assertivas.
          </p>
          <div className="pt-6">
            <a 
              className="inline-block bg-primary text-wine font-black text-xl px-12 py-5 rounded-2xl hover:bg-white transition-all shadow-xl" 
              href="#pricing"
            >
              Viver essa liberdade agora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImagineSection;
