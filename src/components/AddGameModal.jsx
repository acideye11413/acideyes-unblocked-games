import React, { useState } from 'react';
import { extractIframeSrc, generateIframeCode } from '../utils/gameStorage';
import { X, Code2, Sparkles, Image, Globe, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  'Action',
  'Arcade',
  'Puzzle',
  'Sports',
  'Retro',
  'Strategy',
  'Casual'
];

const PRESET_THUMBNAILS = [
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=500&auto=format&fit=crop&q=80'
];

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [thumbnail, setThumbnail] = useState(PRESET_THUMBNAILS[0]);
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('WASD / Arrow Keys: Move, Spacebar: Action');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a game title.');
      return;
    }

    if (!iframeInput.trim()) {
      setError('Please enter an iframe URL or HTML embed code.');
      return;
    }

    const cleanUrl = extractIframeSrc(iframeInput);
    if (!cleanUrl || (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://'))) {
      setError('Invalid URL format. Please provide a valid http:// or https:// URL.');
      return;
    }

    const cleanCode = iframeInput.trim().startsWith('<iframe')
      ? iframeInput.trim()
      : generateIframeCode(cleanUrl, title);

    const controlsArray = controls
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    onAddGame({
      title: title.trim(),
      category,
      iframeUrl: cleanUrl,
      iframeCode: cleanCode,
      thumbnail: thumbnail.trim() || PRESET_THUMBNAILS[0],
      description: description.trim() || 'Custom user embedded HTML5 game.',
      controls: controlsArray.length > 0 ? controlsArray : ['WASD / Arrow Keys: Move']
    });

    // Reset Form
    setTitle('');
    setIframeInput('');
    setDescription('');
    setError('');
    onClose();
  };

  const handleFillSample = () => {
    setTitle('Hexagon Spin');
    setCategory('Puzzle');
    setIframeInput('https://hextris.io/');
    setDescription('A fast-paced hexagon rotation puzzle game.');
    setThumbnail(PRESET_THUMBNAILS[0]);
    setControls('Left/Right Arrow Keys: Rotate Hexagon');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Add Custom Iframe Game</h3>
              <p className="text-xs text-slate-400">Embed any HTML5 game link into the JSON system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleFillSample}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Sample Iframe Game</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Game Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Slope 3D / Super Mario"
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Iframe URL or HTML Embed Code</span>
            </label>
            <textarea
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              placeholder='Paste https://game-url.com or <iframe src="..."></iframe>'
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono h-20 focus:outline-none focus:border-emerald-500 resize-none"
              required
            />
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-500" />
              <span>Paste any unblocked embed code or direct game URL.</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-emerald-400" />
              <span>Thumbnail Image URL</span>
            </label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400">Or pick preset:</span>
              <div className="flex items-center gap-1.5">
                {PRESET_THUMBNAILS.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThumbnail(img)}
                    className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all ${
                      thumbnail === img ? 'border-emerald-400 scale-110' : 'border-slate-700'
                    }`}
                  >
                    <img src={img} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief overview of gameplay..."
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Controls (comma separated)</label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="WASD: Move, Spacebar: Jump, Left Click: Attack"
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              Add to Game List
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
