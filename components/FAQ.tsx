import React, { useState } from 'react';

interface FAQItemProps {
    question: string;
    answer: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 dark:border-zinc-700 last:border-b-0">
            <button
                className="w-full py-6 flex items-center justify-between text-left group"
                onClick={onClick}
            >
                <span className="text-lg md:text-xl font-bold text-wine dark:text-white group-hover:text-purple-brand transition-colors pr-4">
                    {question}
                </span>
                <span
                    className={`material-icons-outlined text-2xl text-purple-brand flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                >
                    expand_more
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'O que é o Meu Luuk?',
            answer: (
                <div className="space-y-4">
                    <p>
                        É um método completo de organização de guarda-roupa que utiliza um app de catalogação gratuito como ferramenta. Com o Meu Luuk, você aprende a:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-brand">✓</span>
                            <span>Organizar todo o seu guarda-roupa usando apenas o celular</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-brand">✓</span>
                            <span>Fotografar e catalogar suas peças corretamente</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-brand">✓</span>
                            <span>Montar looks infinitos com o que você já tem</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-brand">✓</span>
                            <span>Se arrumar mais rápido toda manhã</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-brand">✓</span>
                            <span>Fazer compras mais assertivas (sem desperdício)</span>
                        </li>
                    </ul>
                    <p className="font-medium text-wine dark:text-primary">
                        É como ter um personal stylist + organizador profissional no seu bolso! 💜
                    </p>
                </div>
            ),
        },
        {
            question: 'É um curso? Como funciona?',
            answer: (
                <p>
                    Não, você não terá vídeos para assistir. É um manual prático e rápido te ensinando como usar e transformar o seu guarda-roupa em digital, sem enrolação de forma prática através de um ebook (PDF). O manual ensina passo a passo (com prints de tela) como usar o app gratuito, ajudando você a se arrumar mais rápido e fazer compras mais assertivas.
                </p>
            ),
        },
        {
            question: 'Tenho algum custo extra?',
            answer: (
                <p>
                    Não, você não terá custos extras. O aplicativo que você irá utilizar para ter acesso às suas roupas é totalmente gratuito.
                </p>
            ),
        },
        {
            question: 'Como o provador digital funciona?',
            answer: (
                <div className="space-y-4">
                    <p>
                        Você cadastra uma foto sua simples de corpo inteiro, depois anexa as peças de roupa e o nosso Gerador de Looks combina tudo digitalmente mostrando como o look ficaria em você.
                    </p>
                    <p>
                        Você visualiza se cores, estilos e proporções combinam e consegue decidir melhor:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-brand">✓</span>
                            <span>Se a peça veste bem no seu corpo</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-brand">✓</span>
                            <span>Se combina com roupas que você já tem</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-brand">✓</span>
                            <span>Se vale a pena comprar</span>
                        </li>
                    </ul>
                    <p className="font-medium text-wine dark:text-primary">
                        É como experimentar ANTES de gastar!
                    </p>
                </div>
            ),
        },
        {
            question: 'O que preciso ter para conseguir ter o meu armário digital?',
            answer: (
                <p>
                    Apenas um celular. Funciona tanto em Android quanto iPhone, o app é gratuito.
                </p>
            ),
        },
        {
            question: 'Tem garantia?',
            answer: (
                <p>
                    Sim! <span className="font-bold text-wine dark:text-primary">Garantia de 7 dias.</span> Se você não gostar, não conseguir aplicar, ou simplesmente mudar de ideia, devolvemos 100% do seu dinheiro. Sem burocracia.
                </p>
            ),
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-background-light dark:bg-zinc-900" id="faq">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <span className="inline-block bg-purple-brand/10 text-purple-brand font-bold px-4 py-2 rounded-full text-sm mb-4">
                        Dúvidas?
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-wine dark:text-white">
                        Perguntas Frequentes
                    </h2>
                </div>

                <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-lg p-6 md:p-10 border border-gray-100 dark:border-zinc-700">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
