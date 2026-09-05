import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-64 rounded-3xl bg-slate-800/60 border border-slate-700/50 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-700/70 rounded-lg"></div>
            <div className="h-4 w-32 bg-slate-700/50 rounded-lg"></div>
          </div>
          <div className="h-16 w-16 bg-slate-700/70 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-12 bg-slate-700/50 rounded-xl"></div>
          <div className="h-12 bg-slate-700/50 rounded-xl"></div>
          <div className="h-12 bg-slate-700/50 rounded-xl"></div>
          <div className="h-12 bg-slate-700/50 rounded-xl"></div>
        </div>
      </div>

      {/* Forecast Strip Skeleton */}
      <div className="h-36 rounded-2xl bg-slate-800/40 border border-slate-700/40 p-4 flex gap-4 overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-1 bg-slate-700/40 rounded-xl min-w-[100px] h-full"></div>
        ))}
      </div>

      {/* Persona Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-60 rounded-2xl bg-slate-800/40 border border-slate-700/40"></div>
        <div className="h-60 rounded-2xl bg-slate-800/40 border border-slate-700/40"></div>
      </div>
    </div>
  );
};
