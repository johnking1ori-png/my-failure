import { useState, useRef } from 'react';
import { Terminal, Upload, Play, AlertCircle, CheckCircle2, Loader2, Sparkles, Image as ImageIcon, Video, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { explainFailure } from './services/gemini';

export default function App() {
  const [log, setLog] = useState('');
  const [context, setContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ rootCause: string; explanation: string; nextSteps: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [uploadKey, setUploadKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    let selectedFiles: File[] = [];

    if ('files' in e.target && e.target.files) {
      selectedFiles = Array.from(e.target.files);
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      selectedFiles = Array.from(e.dataTransfer.files);
    }

    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      setUploadKey(prev => prev + 1);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (!log && files.length === 0) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const data = await explainFailure(log, context, files);
      setResult(data);
      // Optional: Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container min-h-screen py-8">
      {/* Branded Header */}
      <header className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 badge mb-6 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Zero-Setup Multimodal Reasoning Engine
        </motion.div>
        <h1 className="text-6xl font-extrabold mb-6 tracking-tighter text-white">
          My <span className="text-indigo-500">Failure</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
          Gemini 3’s reasoning capabilities allow the system to correlate log warnings, runtime errors, and visual evidence to identify technical root causes instantly.
        </p>
      </header>

      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Step 1: Logs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-slate-900/40 backdrop-blur-xl border-slate-800/50 p-8 md:p-10 rounded-[2.5rem]"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">1</span>
            <div className="flex items-center gap-2 text-white">
              <Terminal size={22} className="text-indigo-400" />
              <h2 className="text-xl font-bold">Technical Logs</h2>
            </div>
          </div>
          <textarea
            className="w-full bg-slate-950/90 border border-slate-800 rounded-3xl p-6 font-mono text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all min-h-[350px] shadow-2xl resize-none"
            placeholder="Paste your stack trace or error log here..."
            value={log}
            onChange={(e) => setLog(e.target.value)}
          />
        </motion.section>

        {/* Step 2: Media */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-slate-900/40 backdrop-blur-xl border-slate-800/50 p-8 md:p-10 rounded-[2.5rem]"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">2</span>
            <div className="flex items-center gap-2 text-white">
              <Upload size={22} className="text-indigo-400" />
              <h2 className="text-xl font-bold">Visual Correlation</h2>
            </div>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleFileUpload(e as any)}
            className="group relative overflow-hidden border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer"
          >
            <input
              key={uploadKey}
              type="file"
              multiple
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
            />
            <div className="flex justify-center gap-4 mb-4">
              <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                <ImageIcon size={28} />
              </div>
              <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                <Video size={28} />
              </div>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 font-bold text-sm group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                <Upload size={18} />
                {files.length > 0 ? "Add More Evidence" : "Select Files"}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-4">Or drag and drop recordings and screenshots here</p>
          </div>

          {files.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="relative group/item bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg text-slate-500">
                    {file.type.startsWith('video') ? <Video size={16} /> : <ImageIcon size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="p-1 hover:bg-red-500/20 hover:text-red-400 text-slate-600 rounded-lg transition-colors"
                  >
                    <Sparkles size={14} className="rotate-45" /> {/* Using Sparkles as a fancy X replacement or just X icon if available */}
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Step 3: Context \u0026 Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-slate-900/40 backdrop-blur-xl border-slate-800/50 p-6 md:p-8 rounded-[2rem]"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">3</span>
            <div className="flex items-center gap-2 text-white">
              <AlertCircle size={22} className="text-indigo-400" />
              <h2 className="text-xl font-bold">Hypothesis Context</h2>
            </div>
          </div>
          <textarea
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-8 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 min-h-[100px]"
            placeholder="e.g., 'Only fails on production build', 'Started after updating React'..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          <button
            className="group relative w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 py-6 text-2xl font-black text-white transition-all hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(79,70,229,0.4)] shadow-2xl shadow-indigo-600/20 active:scale-[0.98]"
            disabled={isAnalyzing}
            onClick={startAnalysis}
          >
            <div className="flex items-center justify-center gap-4 relative z-10">
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin w-10 h-10" />
                  <span>SYNTHESIZING...</span>
                </>
              ) : (
                <>
                  <span className="tracking-tighter">EXECUTE MY FAILURE</span>
                  <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </div>
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.section>

        {/* Result Area */}
        <div id="result-section" className="pb-24">
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card border-indigo-500/30 bg-indigo-500/5 text-center py-20 rounded-[3rem]"
              >
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Accessing Neural Failure Logic</h3>
                <p className="text-slate-400 max-w-xs mx-auto">
                  Gemini is synthesizing cross-modal evidence into a structured reasoning protocol...
                </p>
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 max-w-4xl mx-auto"
              >
                <div className="card border-emerald-500/30 shadow-2xl shadow-emerald-500/20 bg-slate-900/60 backdrop-blur-2xl p-10 md:p-14 rounded-[3.5rem]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 border-b border-slate-800/50 pb-10">
                    <div className="flex items-center gap-5 text-emerald-400">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl ring-1 ring-emerald-500/20">
                        <CheckCircle2 size={36} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Reasoning Report</h2>
                        <span className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Status: Complete</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-16">
                    {/* Phase 01: Cognitive Summary */}
                    <div className="relative pl-10 border-l-2 border-indigo-500/30">
                      <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        Phase 01: Cognitive Summary
                      </h3>
                      <p className="text-slate-100 text-2xl leading-relaxed font-semibold tracking-tight">
                        {result.explanation}
                      </p>
                    </div>

                    {/* Phase 02: Root Cause */}
                    <div className="p-8 bg-slate-950/80 rounded-[2rem] border border-slate-800/50 shadow-inner group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Terminal size={120} />
                      </div>
                      <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-3 relative z-10">
                        <Terminal size={18} /> Phase 02: Neural Root Cause Analysis
                      </h3>
                      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-inner relative z-10">
                        <p className="text-slate-300 whitespace-pre-wrap font-mono text-base leading-[1.8] tracking-tight">
                          {result.rootCause}
                        </p>
                      </div>
                    </div>

                    {/* Phase 03: Resolution */}
                    <div className="relative pl-10 border-l-2 border-emerald-500/30">
                      <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                        Phase 03: Resolution Protocol
                      </h3>
                      <div className="grid grid-cols-1 gap-5">
                        {result.nextSteps.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-6 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                          >
                            <div className="mt-1 w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-lg font-black ring-1 ring-emerald-500/40">
                              {i + 1}
                            </div>
                            <p className="text-slate-100 text-xl font-medium leading-relaxed font-semibold">{step}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { setResult(null); setLog(''); setContext(''); setFiles([]); setUploadKey(k => k + 1) }, 500) }}
                    className="text-slate-500 hover:text-indigo-400 transition-colors text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:bg-slate-800 px-8 py-4 rounded-full border border-slate-800 shadow-sm"
                  >
                    <Sparkles size={16} /> Reset Engine \u0026 Start New Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
