
import React from 'react';

const Pricing: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-zinc-900 overflow-hidden relative" id="pricing">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative bg-white dark:bg-zinc-800 rounded-[3rem] border-8 border-purple-brand p-12 md:p-16 shadow-2xl text-center">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-wine text-white px-8 py-2 rounded-full font-bold uppercase tracking-widest text-sm">
            Oferta Especial
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-4">DE: <span className="line-through">R$ 147,00</span></p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-8">
            <span className="text-2xl font-bold dark:text-white">POR APENAS:</span>
            <span className="text-6xl md:text-8xl font-black text-wine dark:text-white">R$ 37,50</span>
          </div>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-10">OU <span className="text-purple-brand">5X DE R$ 7,50</span></p>
          <div className="text-left max-w-md mx-auto space-y-4 mb-12">
            {[
              "Acesso completo ao Meu Luuk",
              "Experimente Antes de Comprar (IA)",
              "Armário Digital dentro do app",
              "Guia: Domine seu estilo em 7 dias"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="material-icons-outlined text-primary bg-primary/10 rounded-full p-1">check</span>
                <span className="dark:text-gray-200">{item}</span>
              </div>
            ))}
          </div>
          <a className="block w-full bg-primary text-wine font-black text-2xl py-6 rounded-2xl hover:scale-105 transition-transform shadow-xl mb-6" href="#">
            QUERO DESCOBRIR MEU ESTILO AGORA
          </a>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium">
            <span className="material-icons-outlined text-lg">verified_user</span>
            <span>Garantia Total de 7 Dias. Sem burocracia.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
