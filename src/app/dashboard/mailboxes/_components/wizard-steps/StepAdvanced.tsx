"use client";

import React, { useState } from "react";
import { Text } from "@/_components/shared/Text";
import { ChevronDown, ChevronRight } from "lucide-react";
import { WizardFormData, WizardStepProps } from "./WizardTypes";

export function StepAdvanced({ formData = {} as WizardFormData, handleChange = () => {} }: WizardStepProps) {
  const [showSyncDropdown, setShowSyncDropdown] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center text-left">
      <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">Advanced Settings</Text>
      <Text size="sm" font="normal" className="text-primary-400 text-center mb-14 tracking-wide">Please add the below data to complete adding your account</Text>

      <div className="flex flex-col gap-6 w-full max-w-[460px] mx-auto">
        <div className="w-full">
          <label className="block text-[14px] text-primary-500 mb-2">
            Sync Interval (Minutes)
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSyncDropdown(!showSyncDropdown)}
              className="w-full h-[52px] flex items-center justify-between px-5 border border-primary-200 rounded-[16px] outline-none text-primary bg-card hover:border-primary-300 transition-colors"
            >
              <span className="text-[14px] font-medium text-primary-700">
                {formData.syncInterval ? (formData.syncInterval === "5" ? "Every 5 Minutes" : `${formData.syncInterval} Minutes`) : "Select From The List"}
              </span>
              <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform duration-200 ${showSyncDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSyncDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-primary-50 rounded-[16px] z-50 flex flex-col p-2 gap-1 animate-in fade-in zoom-in-95 duration-150 shadow-sm border border-primary-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { handleChange("syncInterval", i.toString()); setShowSyncDropdown(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-[12px] transition-colors hover:bg-primary-200/60 ${formData.syncInterval === i.toString() ? 'bg-primary-200/40 text-primary-900' : 'text-primary-500'}`}
                  >
                    <span className="text-[14px] font-medium">
                      {i} Minutes
                    </span>
                    <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
