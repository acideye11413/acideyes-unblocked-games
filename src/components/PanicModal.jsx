import React from 'react';
import { GraduationCap, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';

export default function PanicModal({ onExit }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-800 font-sans overflow-y-auto select-none animate-fade-in">
      {/* Top Academic Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold shadow">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Google Classroom & Study Portal</h1>
            <p className="text-xs text-slate-500">Computer Science & Advanced Mathematics • Fall Quarter</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Classroom (Esc)</span>
        </button>
      </header>

      {/* Classroom Content */}
      <main className="max-w-4xl mx-auto py-8 px-6 space-y-6">
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-800 text-white rounded-2xl p-6 shadow-md space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase bg-white/20 px-2.5 py-1 rounded-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Active Module Assignment</span>
          </div>
          <h2 className="text-2xl font-bold">Binary Search Trees & Algorithmic Complexity Analysis</h2>
          <p className="text-xs text-teal-100">Due Today, 11:59 PM • 100 Points Possible</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Chapter 4 Reading Notes</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">Completed</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review in-order and post-order traversal properties in binary search tree structures before tomorrow's exam. Calculate O(log N) average depth vs O(N) worst case.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Lab Assignment 4 Code Submission</h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">In Progress</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete exercise problems 1 through 5 on line-segment intersection algorithms and balanced Red-Black tree rotations.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Study Questions & Key Definitions</h3>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Definition 4.1:</strong> A Binary Search Tree is a node-based binary tree data structure where left key values are lesser and right key values are greater.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Theorem 4.2:</strong> An in-order traversal of a valid Binary Search Tree yields key values in ascending sorted order.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
