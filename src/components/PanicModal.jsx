import React, { useEffect } from 'react';
import { Shield, BookOpen, GraduationCap, X } from 'lucide-react';

export const PanicModal = ({
  isActive,
  onDeactivate
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === '`') {
        onDeactivate();
      }
    };
    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onDeactivate]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 text-slate-800 font-sans overflow-y-auto select-none">
      
      {/* Mock Google Classroom / Educational Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900">Google Classroom & Study Portal</h1>
            <p className="text-xs text-slate-500">Period 3 Computer Science & Mathematics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono border border-slate-200">
            Press Esc or ~ to Return
          </span>
          <button
            onClick={onDeactivate}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Exit Panic Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Classroom Content Body */}
      <main className="max-w-4xl mx-auto py-8 px-6 space-y-6">
        
        {/* Course Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-2xl p-6 shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
            Active Assignment
          </span>
          <h2 className="text-2xl font-bold mt-2">Unit 4: Data Structures & Algorithmic Analysis</h2>
          <p className="text-xs text-teal-100 mt-1">Due Today, 11:59 PM • 100 Points</p>
        </div>

        {/* Study Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Chapter Reading: Binary Search Trees</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review node insertion, deletion, and in-order traversal properties in binary search tree structures before tomorrow's lab.
            </p>
            <div className="pt-2 text-xs text-slate-400 font-mono">
              Status: Submitted
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              <span>Lab 4: Computational Geometry</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete exercise problems 1 through 5 on line-segment intersection algorithms using standard 2D vector mathematics.
            </p>
            <div className="pt-2 text-xs text-teal-600 font-semibold">
              Grade: 100% (A+)
            </div>
          </div>
        </div>

        {/* Fake Reference Notes Box */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Reference Documentation: Time Complexity Overview
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In computer science, the time complexity is the computational complexity that describes the amount of computer time it takes to run an algorithm. Big O notation expresses the worst-case scenario, while Omega indicates the lower bound.
          </p>
        </div>

      </main>

    </div>
  );
};
