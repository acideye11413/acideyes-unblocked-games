import React, { useState } from 'react';
import { ArrowLeft, RotateCw, Maximize2, ExternalLink, Heart, ThumbsUp, ShieldAlert, Keyboard, Tv } from 'lucide-react';

export default function GamePlayer({
  game,
  isFavorite,
  isLiked,
  onBack,
  onToggleFavorite,
  onToggleLike,
  onOpenControlsModal,
  onOpenPanic
}) {
  const [isTheater, setIsTheater] = useState(false);

  const handleReload = () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleFullscreen = () => {
    const frame = document.getElementById('player-frame');
    if (frame) {
      if (!document.fullscreenElement) {
        frame.requestFullscreen().catch(err => console.error(err));
      } else {
        document.exitFullscreen().catch(err => console.error(err));
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      
      {/* Navigation Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games Catalog</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {game.category}
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-100">
            {game.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenControlsModal}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Controls</span>
          </button>

          <button
            onClick={onOpenPanic}
            className="p-2 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg cursor-pointer"
            title="Panic Button"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Iframe Game Player Box */}
      <div
        id="player-frame"
        className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-emerald-400 text-[11px]">JSON Iframe Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReload}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Reload</span>
            </button>

            <button
              onClick={() => setIsTheater(!isTheater)}
              className={`px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] flex items-center gap-1 cursor-pointer ${
                isTheater ? 'text-emerald-400 font-bold border border-emerald-500/30' : ''
              }`}
            >
              <Tv className="w-3 h-3" />
              <span>Theater</span>
            </button>

            <button
              onClick={handleFullscreen}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        <div className={`relative w-full transition-all duration-300 ${isTheater ? 'h-[80vh]' : 'aspect-[16/9] min-h-[480px]'}`}>
          <iframe
            id="game-iframe"
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full border-0 bg-slate-950"
            allow="autoplay; gamepad; fullscreen; keyboard"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <h3 className="text-lg font-bold text-slate-100">{game.title}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {game.description || 'Enjoy playing this unblocked HTML5 web game.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              onClick={() => onToggleLike(game.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                isLiked
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-emerald-400 text-emerald-400' : ''}`} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>

            <a
              href={game.iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>New Tab</span>
            </a>
          </div>
        </div>

        {game.controls && game.controls.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Game Controls & Keybinds
            </h4>
            <div className="flex flex-wrap gap-2">
              {game.controls.map((controlStr, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono"
                >
                  {controlStr}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
