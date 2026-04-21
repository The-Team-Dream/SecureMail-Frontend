import React from "react";
import { Check } from "lucide-react";

interface WizardProgressProps {
  step: number;
  steps: { id: number; icon: React.ElementType }[];
}

export function WizardProgress({ step, steps }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-[620px] mx-auto mb-8 px-2">
      {steps.map((s, index) => {
        const isCompleted = step > s.id;
        const isActive = step === s.id;

        return (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center flex-shrink-0">
              {isActive ? (
                <div className="w-[36px] h-[36px] rounded-full border-[1.5px] border-dashed border-[#87BE00] flex items-center justify-center bg-card p-[3px]">
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-[#E0FF95]">
                    <s.icon className="w-4 h-4 stroke-[2] text-[#87BE00]" />
                  </div>
                </div>
              ) : isCompleted ? (
                <div className="w-8 h-8 rounded-full bg-[#87BE00] flex items-center justify-center relative">
                  <Check className="w-4 h-4 stroke-[3] text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#DFDFDF] flex items-center justify-center relative">
                  <s.icon className="w-4 h-4 stroke-[2] text-[#8A8A8A]" />
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-[1px] flex-1 mx-3 transition-colors duration-300 ${s.id < step ? 'bg-[#87BE00]' : 'bg-[#DFDFDF]'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
