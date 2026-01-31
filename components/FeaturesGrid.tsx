
import React from 'react';

const FeaturesGrid: React.FC = () => {
  const features = [
    { icon: "smartphone", label: "Roupas na palma da mão" },
    { icon: "auto_awesome_motion", label: "Combine suas peças" },
    { icon: "backspace", label: "Remova o fundo automaticamente" },
    { icon: "luggage", label: "Lista de mala para viagem" },
    { icon: "dashboard", label: "Montagem de looks e inspirações" },
    { icon: "calendar_month", label: "Planeje seu look" }
  ];

  return (
    <section className="py-24 bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
              <span className="material-icons-outlined text-purple-brand">{f.icon}</span>
              <span className="font-bold dark:text-white">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
