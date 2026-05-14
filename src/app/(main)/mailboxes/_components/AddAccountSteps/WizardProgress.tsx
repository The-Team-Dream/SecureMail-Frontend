import React from "react";
import { Check } from "lucide-react";

interface WizardProgressProps {
  step: number;
  steps: { id: number; icon: React.ElementType }[];
  goToStep?: (step: number) => void;
}

export function WizardProgress({ step, steps, goToStep }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
      {steps.map((s, index) => {
        const isCompleted = step > s.id;
        const isActive = step === s.id;
        const Icon = s.icon;

        return (
          <React.Fragment key={`step-${s.id}`}>
            <div 
              className={`flex flex-col items-center shrink-0 ${goToStep ? 'cursor-pointer' : ''}`}
              onClick={() => goToStep && goToStep(s.id)}
            >
              {isActive ? (
                <div className="w-[46px] h-[46px] rounded-full border-dashed border-2 border-secondary-600 flex items-center justify-center p-[3px]">
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-secondary-200">
                    <Icon className="w-5 h-5 text-secondary-800" />
                  </div>
                </div>
              ) : isCompleted ? (
                <div className="w-8 h-8 rounded-full bg-secondary-700 flex items-center justify-center relative">
                  <Check className="w-5 h-5 stroke-3 text-background" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center relative">
                  <Icon className="w-5 h-5 text-primary-700" />
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-[2.5px] flex-1 mx-3 transition-colors duration-300 rounded-[5px] ${s.id < step ? "bg-secondary-600" : "bg-primary-100"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
