import React from 'react';
import { Play, Star, Heart, Flame, Trash2, Code2 } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onSelectGame,
  onToggleFavorite,
  onDeleteCustomGame
}) => {
  const formatPlays = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };

  return (
    <div 
      onClick={() => onSelectGame(game)}
      className="group relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-950/20 hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      {/* Thumbnail Aspect Box */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
              {game.category}
            </span>
            {game.featured && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                <Flame className="w-3 h-3 text-amber-400" />
                Featured
              </span>
            )}
            {game.isCustom && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 backdrop-blur-sm">
                <Code2 className="w-3 h-3 text-teal-400" />
                Custom
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            className="pointer-events-auto p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/50 backdrop-blur-sm transition-transform active:scale-90"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-400'
            }`} />
          </button>
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
          </div>
        </div>

        {/* Delete Custom Game Button */}
        {game.isCustom && onDeleteCustomGame && (
          <button
            onClick={(e) => onDeleteCustomGame(e, game.id)}
            className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete custom game"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Bottom Footer Stats */}
        <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <Play className="w-3 h-3 text-slate-500" />
            <span>{formatPlays(game.plays)} plays</span>
          </div>
        </div>
      </div>
    </div>
  );
};
