
import React, { useState, useEffect } from 'react';
import FAQ from './components/FAQ';
// Components are temporarily bypassed to use the monolithic layout provided by the user.
// import Navbar from './components/Navbar';
// import Hero from './components/Hero';
// ...

const App: React.FC = () => {
  const sliderImages = [
    '/img/2.png',
    '/img/3.png',
    '/img/4.png',
    '/img/5.png',
    '/img/6.png',
    '/img/7.png'
  ];
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-center md:justify-between">
          <div className="flex items-center justify-center">
            <img alt="Meu Luuk" className="h-14 md:h-[80px]" src="/img/Grey Neutral Centric Italy Travel Video.png" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-medium hover:text-wine dark:hover:text-primary transition-colors" href="#how-it-works">Como funciona</a>
            <a className="font-medium hover:text-wine dark:hover:text-primary transition-colors" href="#pricing">Preço</a>
            <a className="bg-primary text-wine font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform" href="https://pay.kiwify.com.br/oCcX4pQ" target="_blank" rel="noopener noreferrer">Começar agora</a>
          </div>
        </div>
      </nav>

      <section className="py-16 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-wine dark:text-white leading-[1.1]">
              Se arrume em <span className="text-primary italic">5min.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-700 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Tenha um guarda-roupa inteligente na palma da sua mão. Compre menos, veja como a roupa fica em você antes de comprar e acerte muito mais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a className="bg-primary text-wine font-black text-lg md:text-2xl px-8 md:px-10 py-4 md:py-5 rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all" href="https://pay.kiwify.com.br/oCcX4pQ" target="_blank" rel="noopener noreferrer">
                Começar Agora
                <span className="material-icons-outlined">arrow_forward</span>
              </a>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz2b5mTIb0I3xu7BjrmwNmEqx-fB6NZbM5cHcVpTRDslvD5BcJPM7kpi_yjG2zV6zEMlZs22fE9EL3HeOQczH1eoyZH3NHEw2KPI2QkGzCZPebqaMMSlaGLVHFKv-F5zs0e-nvbRSZ3AV6ccmqieuKN0KyHWhhRTM9Q7NkmHwpDbyh154qs_3jN4H6gZJ8d2729vZSKJQZsdeojpwqXfGdNLrzvVELla6CXZkbHnIseRSriHytaFH9sTg5KLX075bVWSJFnqhdZqE" />
                <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMezAZ9ViPNRaGWraOMq2lDGllPb05uwqakCyYO5Di1pZ4f7wGn1r6nbLGAihPI-p3EP-L55tnK4PvJc5H_rKCCE6kY43ii3QHvkJB3gNGDAsZ_f_Yxsg1sGq1j4OuErvSGMr6ukFtD-BA6b1oCdcWLCa4gckmamHySAhBouGDGYZMOOmf-dBqqLCLn_l8j02f414Jh72e6ETV4evtmcnmLxQI0GsMwuY7LQG_oKmDqHMK61O-RyAMf1D1QF5jZ4V3WSYwjDwx4Ds" />
                <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA41GAA3PAWQceZT72t2Ui7uT_sIMoPYFnMDw2Xtll3R9ZHMnablVq0uKcL4DAjDHCjfZcYUtwumG0532cO_7GdJGinn1pWyX5YO3i1vfKwZeKhHJ0eUAp0fdOawjeHavGTG90sGN-s3fE_pmEn_fkP_8Tap6bPmkvBVXaUPVi1U_1sG8owMaOwbKJynZuAXPpJrfy3PSawzGS8iu2vpFVqlIMFipIp0p56EbbAjV9EgteRdKt7Fv97w7wCj4UWddNGIjeC-LjCZsI" />
              </div>
              <span>+5.000 pessoas já digitalizaram seu estilo</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-brand/10 blur-[100px] rounded-full"></div>
            <img alt="App Mockup showing wardrobe items" className="w-full max-w-[500px] mx-auto drop-shadow-2xl rounded-[3rem] border-[12px] border-white dark:border-gray-800" src="/img/FOTO1.png" />
          </div>
        </div>
      </section>

      <section className="bg-wine py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg md:text-2xl lg:text-4xl font-bold text-peach-light leading-snug">
            Você sente que está vestindo as mesmas roupas, ou está gastando muito dinheiro comprando peças que não combinam com as outras que você já tem? Perde muito tempo se arrumando?
          </h2>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-background-light dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 hover:border-wine transition-colors group">
              <span className="material-icons-outlined text-4xl text-wine dark:text-primary mb-4">psychology</span>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Falta de Autoconhecimento</h3>
              <p className="text-gray-600 dark:text-gray-400">Tem dificuldade em se vestir de forma prática e segura para qualquer ocasião.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-gray-100 dark:border-zinc-700 hover:border-vibrant-orange hover:bg-vibrant-orange/5 hover:shadow-xl hover:shadow-vibrant-orange/10 transition-all duration-300 group">
              <span className="material-icons-outlined text-4xl text-wine dark:text-primary mb-4">shopping_bag</span>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Compra em Excesso</h3>
              <p className="text-gray-600 dark:text-gray-400">Tem muitas roupas e acaba esquecendo o que tem no seu armário. Cansou de perder tempo e dinheiro.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-gray-100 dark:border-zinc-700 hover:border-vibrant-orange hover:bg-vibrant-orange/5 hover:shadow-xl hover:shadow-vibrant-orange/10 transition-all duration-300 group">
              <span className="material-icons-outlined text-4xl text-wine dark:text-primary mb-4">schedule</span>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Desorganização e Atraso</h3>
              <p className="text-gray-600 dark:text-gray-400">Não tem clareza de como organizar seu guarda-roupa e seus looks do dia a dia. Parece que está sempre atrasada escolhendo o que vestir.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-gray-100 dark:border-zinc-700 hover:border-vibrant-orange hover:bg-vibrant-orange/5 hover:shadow-xl hover:shadow-vibrant-orange/10 transition-all duration-300 group">
              <span className="material-icons-outlined text-4xl text-wine dark:text-primary mb-4">autorenew</span>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Piloto Automático</h3>
              <p className="text-gray-600 dark:text-gray-400">Não quer mais aquela sensação de "mesma cara" todos os dias. Você tem várias peças, mas sempre sente que não tem o que usar.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-vibrant-orange py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="relative w-full h-[600px] flex justify-center items-center">
              {sliderImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className={`absolute max-h-full w-auto object-contain drop-shadow-2xl rounded-[2.5rem] transition-opacity duration-1000 ${index === currentSliderIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              ))}
            </div>
          </div>
          <div className="text-white order-1 lg:order-2 space-y-6">
            <h2 className="text-wine text-7xl md:text-9xl font-extrabold">Agora imagina...</h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-wine/90">
              Ter o seu guarda-roupa na palma da sua mão, saber exatamente as roupas que você tem, ter sugestões de looks prontas, se arrumar rápido, gastar menos tempo, dinheiro e ter escolhas mais assertivas.
            </p>
            <div className="pt-6">
              <a className="inline-block bg-primary text-wine font-black text-2xl px-12 py-5 rounded-2xl hover:bg-white transition-all shadow-xl text-center" href="https://pay.kiwify.com.br/oCcX4pQ" target="_blank" rel="noopener noreferrer">
                Viver essa liberdade agora
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
              <span className="material-icons-outlined text-purple-brand">smartphone</span>
              <span className="font-bold dark:text-white">Roupas na palma da mão</span>
            </div>
            <div className="flex items-center gap-3 p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
              <span className="material-icons-outlined text-purple-brand">auto_awesome_motion</span>
              <span className="font-bold dark:text-white">Combine suas peças</span>
            </div>
            <div className="flex items-center gap-3 p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
              <span className="material-icons-outlined text-purple-brand">backspace</span>
              <span className="font-bold dark:text-white">Remova o fundo automaticamente</span>
            </div>
            <div className="flex items-center gap-3 p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
              <span className="material-icons-outlined text-purple-brand">luggage</span>
              <span className="font-bold dark:text-white">Lista de mala para viagem</span>
            </div>
            <div className="flex items-center gap-3 p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
              <span className="material-icons-outlined text-purple-brand">dashboard</span>
              <span className="font-bold dark:text-white">Montagem de looks e inspirações</span>
            </div>
            <div className="flex items-center gap-3 p-5 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
              <span className="material-icons-outlined text-purple-brand">calendar_month</span>
              <span className="font-bold dark:text-white">Planeje seu look</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-lilac py-12 md:py-24 px-4 md:px-6" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-16 text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-wine">Como funciona o Armário Digital</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[40px] shadow-lg flex flex-col gap-4 md:gap-6 transform hover:-translate-y-2 transition-transform">
              <img alt="App screen" className="w-full h-[300px] md:h-auto md:aspect-square object-cover rounded-2xl md:rounded-3xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-B8VqjjEoitPDiZ2cc192z0EfgLRycoofgU7GijWVYM-6AfoRIYXhycjae-A2OaeZzGQYPkwq9fLJSMRHD4ncKoYModRX05gK_hZsJZzyOBdl0xmeVNNxW1RwDFdKRDfRqrpGDvPh2KwNcFB4lRNHKAhpy_uMgV2k5sVAWiPmN03xQQKW3FEwTiLQ1ORt85z7jJ0aNlBvsTMbZsvCHmfFBDNNY9oyFAypWZ3dv_ZGFKccYtU0Uv00tVeYKWsD6t3tbJoJKyzYrxo" />
              <div>
                <h3 className="text-xl md:text-2xl font-black text-wine mb-2 md:mb-4">Se vista rapidamente</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">Visualize todo seu armário em segundos. Com o Manual do armário digital você vai saber como cadastrar suas peças, tirar fotos, montar looks, etc.</p>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[40px] shadow-lg flex flex-col gap-4 md:gap-6 transform hover:-translate-y-2 transition-transform">
              <img alt="App screen" className="w-full h-[300px] md:h-auto md:aspect-square object-cover rounded-2xl md:rounded-3xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvm7-tQUxVLYxKPLmmNcJYB8rjRSF7s__-bFFETDc6_mfdO5FPXx-Dg063PzMnkdA7IU4yhSHTlCv5oRXs-BHxU2QcfbCdZenyGmslGnuK-7kpXDFbL4LNivOHvq5RCrqF90IqxJr59iEdgDXA4w6X9wwzAonS7I5_Wx-zF07MCHYMKAbDcWu7F14PJKuZYyvn2ZWUTWPeFuJwZum8-ziMuE3G1njpsIxlDeMmon1co-RM0TNjZNnR8uyWAcqb3JJIilDxUdTtNos" />
              <div>
                <h3 className="text-xl md:text-2xl font-black text-wine mb-2 md:mb-4">Organize e Visualize</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">Seu guarda-roupa do seu jeito. Veja tudo o que tem na sua mão. Pesquise, filtre, como quiser, onde quer que esteja. Planeje looks sem bagunçar nada.</p>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[40px] shadow-lg flex flex-col gap-4 md:gap-6 transform hover:-translate-y-2 transition-transform">
              <div className="w-full h-[300px] md:h-auto md:aspect-square bg-[#E5E5E5] rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center">
                <img alt="App screen" className="w-full h-full object-contain" src="/img/7.png" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-wine mb-2 md:mb-4">Digitalização e Combinações</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">Organize seu armário rapidamente. Tire fotos de suas roupas, digitalizamos o seu armário combinando as peças, gerando diversas combinações. Saiba exatamente o que já tem antes de comprar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-16 md:py-28 bg-gradient-to-br from-wine via-wine to-wine/90 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-vibrant-orange rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Image Column - 3/5 of the space */}
            <div className="order-2 lg:order-1 lg:col-span-3 flex justify-center">
              <div className="relative group w-full">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-vibrant-orange/30 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <img
                  alt="Gerador de Looks - Provador Digital"
                  className="relative w-full rounded-[2rem] shadow-2xl shadow-black/30 transform group-hover:scale-[1.01] transition-transform duration-500"
                  src="/img/BONUS MEU LUUK.png"
                />
              </div>
            </div>

            {/* Text Column - 2/5 of the space */}
            <div className="order-1 lg:order-2 lg:col-span-2 space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
                <span className="material-icons-outlined text-lg">auto_awesome</span>
                Bônus Exclusivo
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Experimente antes de vestir
              </h2>

              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                Mas não adianta ter uma ferramenta eficiente se você continua acumulando roupas que não refletem seu estilo ou atendem às suas necessidades.
              </p>

              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                É por isso que dentro do <span className="text-primary font-bold">Meu Luuk</span> você terá acesso ao <span className="text-primary font-bold">Gerador de Looks</span>, que é um provador digital onde você:
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-icons-outlined text-primary text-lg">visibility</span>
                  </span>
                  <span className="text-white text-base md:text-lg font-medium group-hover:text-primary transition-colors">Visualiza como cada look fica antes de vestir</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-icons-outlined text-primary text-lg">shuffle</span>
                  </span>
                  <span className="text-white text-base md:text-lg font-medium group-hover:text-primary transition-colors">Testa infinitas combinações sem sair do sofá</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-icons-outlined text-primary text-lg">schedule</span>
                  </span>
                  <span className="text-white text-base md:text-lg font-medium group-hover:text-primary transition-colors">Economiza tempo toda manhã</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-icons-outlined text-primary text-lg">star</span>
                  </span>
                  <span className="text-white text-base md:text-lg font-medium group-hover:text-primary transition-colors">Descobre o que realmente valoriza seu estilo</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-icons-outlined text-primary text-lg">savings</span>
                  </span>
                  <span className="text-white text-base md:text-lg font-medium group-hover:text-primary transition-colors">Para de comprar o que não vai usar</span>
                </div>
              </div>

              <div className="pt-4 md:pt-6">
                <p className="text-xl md:text-2xl font-bold text-primary italic">
                  É o fim da crise de "não tenho o que vestir"! E o começo de um estilo com intenção.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-white dark:bg-zinc-900 overflow-hidden relative" id="pricing">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="relative bg-white dark:bg-zinc-800 rounded-[2rem] md:rounded-[3rem] border-4 md:border-8 border-purple-brand p-6 md:p-12 lg:p-16 shadow-2xl text-center">
            <div className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 bg-wine text-white px-4 md:px-8 py-2 rounded-full font-bold uppercase tracking-wider md:tracking-widest text-xs md:text-sm whitespace-nowrap">
              Oferta Especial
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold mb-2 md:mb-4 mt-4 md:mt-0">DE: <span className="line-through">R$ 147,00</span></p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 mb-4 md:mb-8">
              <span className="text-lg md:text-2xl font-bold dark:text-white">POR:</span>
              <span className="text-5xl md:text-6xl lg:text-8xl font-black text-wine dark:text-white">R$ 67,20</span>
            </div>
            <p className="text-base md:text-xl font-bold text-gray-700 dark:text-gray-300 mb-6 md:mb-10">OU <span className="text-purple-brand">10X DE R$ 8,08</span></p>
            <div className="text-left max-w-md mx-auto space-y-3 md:space-y-4 mb-8 md:mb-12">
              <div className="flex items-start gap-3">
                <span className="material-icons-outlined text-primary bg-primary/10 rounded-full p-1 flex-shrink-0">check</span>
                <span className="dark:text-gray-200 text-sm md:text-base">Acesso completo ao Meu Luuk</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-icons-outlined text-primary bg-primary/10 rounded-full p-1 flex-shrink-0">check</span>
                <span className="dark:text-gray-200 text-sm md:text-base">Experimente Antes de Comprar (IA)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-icons-outlined text-primary bg-primary/10 rounded-full p-1 flex-shrink-0">check</span>
                <span className="dark:text-gray-200 text-sm md:text-base">Armário Digital dentro do app Wardrobe</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-icons-outlined text-primary bg-primary/10 rounded-full p-1 flex-shrink-0">check</span>
                <span className="dark:text-gray-200 text-sm md:text-base">Guia: Domine seu estilo em 7 dias</span>
              </div>
            </div>
            <a className="block w-full bg-primary text-wine font-black text-base md:text-xl lg:text-2xl py-4 md:py-6 rounded-2xl hover:scale-105 transition-transform shadow-xl mb-4 md:mb-6 px-4" href="https://pay.kiwify.com.br/oCcX4pQ">
              QUERO DESCOBRIR MEU ESTILO AGORA
            </a>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium">
              <span className="material-icons-outlined text-lg">verified_user</span>
              <span>Garantia Total de 7 Dias. Sem burocracia.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-purple-brand py-8 text-center px-6">
        <p className="text-white text-xl md:text-2xl font-bold italic">
          "Você não precisa de muitas roupas, você só precisa das peças certas para você."
        </p>
      </section>

      <FAQ />

      <section className="py-12 md:py-24 pb-32 md:pb-40 bg-cover bg-center bg-no-repeat relative px-4 md:px-6" id="contact" style={{ backgroundImage: "url('/img/FOTO10 1.png')" }}>
        <div className="absolute inset-0 bg-wine/75 dark:bg-zinc-900/90 backdrop-blur-sm"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-b from-transparent to-wine"></div>
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 p-6 md:p-10 rounded-[24px] md:rounded-[40px] shadow-xl text-center border-2 border-primary/20 relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-wine dark:text-white mb-3 md:mb-4">Ainda ficou com dúvida?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 md:mb-8 text-base md:text-lg">Aperte o botão para falar com a nossa equipe no WhatsApp.</p>
          <a className="flex items-center justify-center gap-3 md:gap-4 bg-[#29AF1C] text-white font-black text-lg md:text-2xl py-4 md:py-6 px-6 md:px-8 rounded-2xl hover:brightness-105 transition-all shadow-lg shadow-green-500/20 w-full whitespace-nowrap" href="https://wa.me/+5562993167132" target="_blank" rel="noopener noreferrer">
            <img alt="WhatsApp" className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0" src="/img/wppbranco-removebg-preview.png" />
            Falar no Whatsapp
          </a>
        </div>
      </section>

      <footer className="bg-wine pt-20 pb-10 px-6 text-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="mb-10">
            <img alt="Meu Luuk" className="h-[150px]" src="/img/Grey Neutral Centric Italy Travel Video (1).png" />
          </div>

          <div className="w-full h-px bg-white/10 mb-8"></div>
          <div className="flex flex-col md:flex-row justify-center items-center w-full gap-4 text-sm text-gray-400 text-center">
            <p>© 2026 Meu Luuk. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a className="hover:text-white transition-colors" href="#">Termos de Uso</a>
              <a className="hover:text-white transition-colors" href="#">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
