
import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600",
      title: "Se vista rapidamente",
      desc: "Visualize todo seu armário em segundos. Com o Manual do armário digital você vai saber como cadastrar suas peças."
    },
    {
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
      title: "Organize e Visualize",
      desc: "Seu guarda-roupa do seu jeito. Veja tudo o que tem na sua mão. Pesquise, filtre, onde quer que esteja."
    },
    {
      img: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&q=80&w=600",
      title: "Digitalização e Combinações",
      desc: "Organize seu armário rapidamente. Tire fotos de suas roupas e digitalizamos combinando as peças."
    }
  ];

  return (
    <section className="bg-lilac py-24 px-6" id="how-it-works">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-24 lg:px-32">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-wine">Como funciona o Armário Digital</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] shadow-lg flex flex-col gap-6 transform hover:-translate-y-2 transition-transform">
              <img alt={s.title} className="w-full h-64 object-cover rounded-3xl" src={s.img}/>
              <div>
                <h3 className="text-2xl font-black text-wine mb-4">{s.title}</h3>
                <p className="text-gray-700 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
