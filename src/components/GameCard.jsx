import React from 'react';
import { Heart, Play, Star } from 'lucide-react';

export default function GameCard({ game, isFavorite, onPlay, onToggleFavorite }) {
  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        {/* Category & Favorite Overlay Header */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
            {game.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            className="pointer-events-auto p-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-rose-400 border border-slate-700/50 transition-transform active:scale-90"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
          </button>
        </div>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/40 transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.description || 'Play this unblocked HTML5 game directly in your browser.'}
          </p>
        </div>

        {/* Rating and Plays Footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{(game.rating || 4.8).toFixed(1)}</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            {(game.plays || 0).toLocaleString()} plays
          </span>
        </div>
      </div>
    </div>
  );
}
