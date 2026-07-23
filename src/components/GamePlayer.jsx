import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Maximize2, 
  RotateCw, 
  Heart, 
  ThumbsUp, 
  ExternalLink, 
  Keyboard, 
  Code2, 
  Share2, 
  ShieldAlert,
  Star,
  Play,
  Info,
  Check
} from 'lucide-react';

export const GamePlayer = ({
  game,
  isFavorite,
  isLiked,
  onBack,
  onToggleFavorite,
  onToggleLike,
  onIncrementPlay,
  onPanic,
  onOpenControlsModal,
  onOpenJsonModal
}) => {
  const containerRef = useRef(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    onIncrementPlay(game.id);
  }, [game.id]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error('Exit fullscreen failed:', err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenNewTab = () => {
    window.open(game.iframeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Games</span>
        </button>

        {/* Game Title Info */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {game.category}
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 tracking-tight">
            {game.title}
          </h2>
        </div>

        {/* Action Controls Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenControlsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="View keyboard controls"
          >
            <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Controls</span>
          </button>

          <button
            onClick={onPanic}
            className="p-2 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
            title="Panic Cloak Screen"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Iframe Player Frame */}
      <div 
        ref={containerRef}
        className={`relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
          isTheater ? 'max-w-none w-full h-[85vh]' : ''
        } ${isFullscreen ? 'w-screen h-screen rounded-none border-none p-0' : ''}`}
      >
        {/* Player Controls Bar Above Iframe */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-emerald-400 text-[11px]">JSON Iframe Render Active</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setReloadKey(prev => prev + 1)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Reload Game Frame"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsTheater(!isTheater)}
              className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                isTheater ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle Theater Mode"
            >
              Theater
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className={`relative w-full ${isTheater ? 'h-[calc(85vh-42px)]' : isFullscreen ? 'h-[calc(100vh-42px)]' : 'aspect-[16/9] min-h-[480px] md:min-h-[580px]'}`}>
          {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-900 text-slate-300">
              <Info className="w-12 h-12 text-amber-400" />
              <div className="max-w-md">
                <h3 className="text-lg font-bold text-white">Iframe Preview Notice</h3>
                <p className="text-xs text-slate-400 mt-1">
                  This game's external host requires direct top-level window access. Click below to open in an unblocked tab or window.
                </p>
              </div>
              <button
                onClick={handleOpenNewTab}
                className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-emerald-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Play in New Tab</span>
              </button>
            </div>
          ) : (
            <iframe
              key={reloadKey}
              src={game.iframeUrl}
              title={game.title}
              className="w-full h-full border-0 bg-slate-950"
              allow="autoplay; gamepad; fullscreen; keyboard"
              allowFullScreen
              onError={() => setIframeError(true)}
            />
          )}
        </div>
      </div>

      {/* Under-Player Metadata & Interaction Box */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <h3 className="text-lg font-bold text-slate-100">{game.title}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isFavorite 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              onClick={() => onToggleLike(game.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLiked 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-emerald-400 text-emerald-400' : ''}`} />
              <span>{isLiked ? 'Liked!' : 'Like Game'}</span>
            </button>

            <button
              onClick={handleOpenNewTab}
              className="p-2 text-slate-300 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              title="Open direct iframe in new window"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-300 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Rating</span>
            <div className="flex items-center gap-1 mt-1 text-amber-400 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{game.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Plays</span>
            <div className="flex items-center gap-1 mt-1 text-slate-200 font-bold text-sm font-mono">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>{game.plays.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Category</span>
            <span className="text-xs font-semibold text-emerald-400 mt-1 block">
              {game.category}
            </span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">JSON Source</span>
              <span className="text-[11px] font-mono text-slate-300 mt-1 block">
                games.json
              </span>
            </div>
            <button
              onClick={onOpenJsonModal}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg transition-colors border border-slate-700"
              title="View JSON definition"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Keyboard Controls List */}
        {game.controls && game.controls.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Game Controls Guide</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {game.controls.map((ctrl, i) => (
                <span key={i} className="px-3 py-1 bg-slate-900 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-mono">
                  {ctrl}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
