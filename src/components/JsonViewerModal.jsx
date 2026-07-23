import React, { useState } from 'react';
import { X, Copy, Download, Check, FileJson, Upload, Sparkles } from 'lucide-react';

export const JsonViewerModal = ({
  isOpen,
  onClose,
  games,
  onImportJson
}) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].iframeUrl) {
          onImportJson(parsed);
          setImportStatus(`Successfully imported ${parsed.length} games from JSON!`);
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('Invalid JSON structure. Must be an array of game objects with iframeUrl.');
        }
      } catch (err) {
        setImportStatus('Error parsing JSON file. Check format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <FileJson className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">games.json Data Engine</h3>
              <p className="text-xs text-slate-400">View, export, or import iframe game definitions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download games.json</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content & Code Area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {importStatus && (
            <div className={`p-3 text-xs rounded-xl font-medium ${
              importStatus.includes('Successfully') 
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}>
              {importStatus}
            </div>
          )}

          {/* Import JSON file strip */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Import custom games.json file:</span>
            </div>
            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-lg cursor-pointer transition-colors font-medium">
              Choose File
              <input 
                type="file" 
                accept=".json" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Code Viewer Container */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto select-text">
            <pre className="text-emerald-400 leading-relaxed">
              {jsonString}
            </pre>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Games Configured: <strong className="text-white">{games.length}</strong></span>
          </div>
          <span>Schema: Game JSON Object with iframeUrl and iframeCode</span>
        </div>

      </div>
    </div>
  );
};
