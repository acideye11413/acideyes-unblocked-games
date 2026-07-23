import React from 'react';
import { X, Keyboard, ShieldAlert, Sparkles, Gamepad2 } from 'lucide-react';

export default function ControlsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Controls & Shortcuts</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Gamepad2 className="w-4 h-4" />
              <span>Standard Game Controls</span>
            </div>
            <ul className="space-y-1 pl-6 list-disc text-slate-300">
              <li><strong className="text-white">WASD / Arrow Keys:</strong> Character & Navigation Movement</li>
              <li><strong className="text-white">Spacebar / Mouse Click:</strong> Jump / Flap / Action Trigger</li>
              <li><strong className="text-white">R Key:</strong> Reset or Restart Current Level</li>
            </ul>
          </div>

          <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <ShieldAlert className="w-4 h-4" />
              <span>Panic Cloak Shortcut</span>
            </div>
            <p className="text-slate-300">
              Press <kbd className="px-1.5 py-0.5 bg-slate-950 rounded border border-slate-700 font-mono text-white">Esc</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-950 rounded border border-slate-700 font-mono text-white">~</kbd> at any time to instantly hide games and display a realistic educational study portal.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 cursor-pointer text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
