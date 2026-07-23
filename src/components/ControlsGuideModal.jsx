import React from 'react';
import { X, Keyboard, Gamepad2, Maximize, MousePointer, ShieldAlert } from 'lucide-react';

export const ControlsGuideModal = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Keyboard className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Keyboard Controls & Shortcuts</h3>
              <p className="text-xs text-slate-400">Master player controls for HTML5 iframe games</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-300">
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">WASD & Arrow Keys</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Primary navigation and character movement in 2D and 3D games.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg shrink-0">
                <MousePointer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">Spacebar / Mouse Click</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Jump, action trigger, shoot, or tile interaction.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                <Maximize className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">Fullscreen Toggle</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Click the Fullscreen button on the iframe bar for immersive gameplay.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-rose-950/40 rounded-xl border border-rose-500/30">
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-rose-200">Panic Cloak Shortcut</h4>
                <p className="text-rose-300/80 text-[11px] mt-0.5">Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-white">Esc</kbd> or click Panic Button to switch to study mode.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center text-slate-400 text-[11px]">
            Tip: Click directly inside the game iframe to focus keyboard inputs!
          </div>
        </div>

      </div>
    </div>
  );
};
