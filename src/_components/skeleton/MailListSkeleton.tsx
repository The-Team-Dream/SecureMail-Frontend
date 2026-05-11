"use client";
import React from "react";

export const MailListSkeleton = () => {
  return (
    <div className="flex flex-col bg-background h-full">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-4 border-b-2 border-primary-50 animate-pulse bg-ghostBlue"
        >
          {/* Checkbox + Star */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-5 h-5 rounded border-2 border-primary-100 bg-primary-50/40" />
            <div className="w-5 h-5 rounded-full bg-primary-50/40" />
          </div>

          {/* Sender */}
          <div className="w-32 sm:w-48 h-4 bg-primary-100/40 rounded shrink-0 hidden sm:block" />

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="w-3/4 h-4 bg-primary-100/40 rounded" />
            <div className="w-1/2 h-3 bg-primary-50/40 rounded sm:hidden" />
          </div>

          {/* Date */}
          <div className="w-16 h-3 bg-primary-50/40 rounded shrink-0 ml-auto" />
        </div>
      ))}
    </div>
  );
};
