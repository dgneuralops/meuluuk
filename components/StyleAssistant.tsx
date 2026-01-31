
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const StyleAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Olá! Sou sua consultora de estilo IA do Meu Luuk. Como posso ajudar você a montar seu look hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Você é uma consultora de estilo especializada chamada Lu, do aplicativo 'Meu Luuk'. Seu tom é amigável, moderno, encorajador e prático. Você ajuda usuários a combinarem roupas que já possuem e a descobrirem seu estilo pessoal. Sempre responda em Português do Brasil de forma concisa.",
          temperature: 0.7,
        },
      });

      const aiText = response.text || "Desculpe, tive um probleminha. Pode repetir?";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Poxa, não consegui me conectar agora. Tente novamente em instantes!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-purple-brand/20">
          {/* Header */}
          <div className="bg-wine p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-wine font-bold">L</div>
              <span className="font-bold">Lu - Assistente de Estilo</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
              <span className="material-icons-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-peach-light dark:bg-zinc-900">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-purple-brand text-white rounded-tr-none' 
                    : 'bg-white dark:bg-zinc-800 dark:text-white rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl animate-pulse text-xs text-gray-400">Lu está pensando...</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: O que combina com jeans claro?"
                className="flex-1 bg-gray-50 dark:bg-zinc-700 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary dark:text-white"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="w-10 h-10 bg-primary text-wine rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
              >
                <span className="material-icons-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-wine text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group relative"
        >
          <div className="absolute -top-12 right-0 bg-primary text-wine text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Dúvida de Estilo?
          </div>
          <span className="material-icons-outlined text-3xl">auto_awesome</span>
        </button>
      )}
    </div>
  );
};

export default StyleAssistant;
