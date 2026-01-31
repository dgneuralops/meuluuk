
import React from 'react';

const PainPoints: React.FC = () => {
  const points = [
    {
      icon: "psychology",
      title: "Falta de Autoconhecimento",
      desc: "Tem dificuldade em se vestir de forma prática e segura para qualquer ocasião."
    },
    {
      icon: "shopping_bag",
      title: "Compra em Excesso",
      desc: "Tem muitas roupas e acaba esquecendo o que tem no seu armário. Cansou de perder tempo e dinheiro."
    },
    {
      icon: "schedule",
      title: "Desorganização e Atraso",
      desc: "Não tem clareza de como organizar seu guarda-roupa e seus looks do dia a dia."
    },
    {
      icon: "autorenew",
      title: "Piloto Automático",
      desc: "Não quer mais aquela sensação de 'mesma cara' todos os dias. Você tem peças, mas não sabe usar."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-10 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((p, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-background-light dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 hover:border-wine transition-colors group">
              <span className="material-icons-outlined text-4xl text-wine dark:text-primary mb-4">{p.icon}</span>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{p.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
