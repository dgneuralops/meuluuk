
import React from 'react';

const WhatsAppCTA: React.FC = () => {
  return (
    <section className="py-24 bg-background-light dark:bg-background-dark px-6" id="contact">
      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 p-10 rounded-[40px] shadow-xl text-center border-2 border-primary/20">
        <h3 className="text-3xl font-bold text-wine dark:text-white mb-4">Ainda ficou com dúvida?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Aperte o botão para falar com a nossa equipe no WhatsApp.</p>
        <a
          className="flex items-center justify-center gap-4 bg-[#29AF1C] text-white font-black text-3xl py-6 px-8 rounded-2xl hover:brightness-105 transition-all shadow-lg shadow-green-500/20 w-full"
          href="https://wa.me/+5562993167132"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img alt="WhatsApp" className="w-12 h-12" src="/img/wppbranco-removebg-preview.png" />
          Falar com consultor
        </a>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
