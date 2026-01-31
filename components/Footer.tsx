
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-wine pt-20 pb-10 px-6 text-white">
      <div className="max-w-7xl mx-auto px-10 md:px-20 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-wine font-bold text-2xl">L</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight">MEU LUUK</span>
        </div>
        <div className="flex gap-6 mb-12">
          {["camera_alt", "play_circle", "mail"].map((icon, i) => (
            <a key={i} className="w-12 h-12 rounded-full bg-wine-light flex items-center justify-center hover:bg-primary hover:text-wine transition-colors" href="#">
              <span className="material-icons-outlined">{icon}</span>
            </a>
          ))}
        </div>
        <div className="w-full h-px bg-white/10 mb-8"></div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 text-sm text-gray-400">
          <p>© 2024 Meu Luuk. Todos os direitos reservados.</p>
          <p>Digital Fashion Solutions Ltda.</p>
          <div className="flex gap-6">
            <a className="hover:text-white transition-colors" href="#">Termos de Uso</a>
            <a className="hover:text-white transition-colors" href="#">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
