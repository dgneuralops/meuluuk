"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { APP_NAME, APP_TAGLINE } from "@/lib/utils/constants";

const steps = [
  {
    icon: "checkroom",
    title: "Envie suas peças",
    description: "Adicione fotos de roupas, sapatos e acessórios que você quer experimentar juntas.",
    image: "👗",
  },
  {
    icon: "photo_camera",
    title: "Envie sua foto",
    description: "Uma foto de corpo inteiro, de frente, com boa iluminação e fundo neutro.",
    image: "📸",
  },
  {
    icon: "auto_awesome",
    title: "Veja o resultado",
    description: "A IA gera uma imagem realista de você vestindo exatamente aquelas peças.",
    image: "✨",
  },
  {
    icon: "favorite",
    title: "Salve seus looks",
    description: "Guarde seus looks favoritos e comece quantos quiser.",
    image: "💜",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const seen = localStorage.getItem("luuk-onboarding-seen");
    if (seen) {
      router.replace("/pecas");
    }
  }, [router]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("luuk-onboarding-seen", "true");
      router.push("/pecas");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("luuk-onboarding-seen", "true");
    router.push("/pecas");
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {APP_NAME}
          </h1>
          <p className="text-sm text-muted mt-1">{APP_TAGLINE}</p>
        </div>

        <div className="w-full max-w-sm">
          {/* Step indicator dots */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-8 bg-primary"
                    : i < currentStep
                    ? "w-2 bg-primary/40"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="text-center animate-fade-in" key={currentStep}>
            <div className="text-7xl mb-6 animate-float">{step.image}</div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
              {step.title}
            </h2>
            <p className="text-base text-muted leading-relaxed max-w-xs mx-auto">
              {step.description}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-12 space-y-3">
            <Button onClick={handleNext} size="lg" className="w-full">
              {currentStep < steps.length - 1 ? (
                <>
                  Próximo
                  <span className="material-icons-outlined text-lg ml-1">arrow_forward</span>
                </>
              ) : (
                <>
                  Começar
                  <span className="material-icons-outlined text-lg ml-1">auto_awesome</span>
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={handleSkip} className="w-full">
              Pular
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-muted">
          Você recebe 5 créditos gratuitos para experimentar.
        </p>
      </div>
    </div>
  );
}
