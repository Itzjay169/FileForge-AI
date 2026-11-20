'use client';

import { ForgeButton, forgeToast } from '@/components/sakuga';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Bot,
  ArrowRight,
  Info,
  Sliders,
  Zap
} from 'lucide-react';
import { AiAssistantPlan, AiFileContext } from '@fileforge/shared';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export interface AiCopilotCardProps {
  file: File | null;
  onPlanExecuted?: (result: any) => void;
}

const SAMPLE_PROMPTS = [
  'Compress this video for WhatsApp',
  'Make this image under 500 KB',
  'Remove background from this photo',
  'Convert this PDF to editable DOCX',
  'Prepare this presentation for email'
];

export const AiCopilotCard: React.FC<AiCopilotCardProps> = ({ file, onPlanExecuted }) => {
  const prefersReduced = useReducedMotion();
  const [query, setQuery] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<AiAssistantPlan | null>(null);

  const handleGeneratePlan = async (userPrompt: string) => {
    const activeQuery = userPrompt.trim();
    if (!activeQuery) return;

    if (!file) {
      forgeToast.warning('Select a file first', 'Please upload or select an asset before prompting the AI Assistant.');
      return;
    }

    setIsPlanning(true);
    setCurrentPlan(null);

    try {
      const ext = file.name.split('.').pop() || '';
      const fileContext: AiFileContext = {
        originalName: file.name,
        sizeBytes: file.size,
        extension: ext,
        mimeType: file.type || 'application/octet-stream'
      };

      const res = await fetch('/api/ai/assistant/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery, fileContext })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'AI planning failed');

      setCurrentPlan(json.data);
      forgeToast.info('AI Execution Plan Formulated', 'Review settings and confirm below.');
    } catch (err: any) {
      forgeToast.error('AI Planning Error', err.message);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleExecutePlan = async () => {
    if (!currentPlan || !file) return;

    setIsExecuting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('plan', JSON.stringify(currentPlan));

      const res = await fetch('/api/ai/assistant/execute', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Plan execution failed');

      forgeToast.success('AI Plan Executed Successfully', json.data.outputName);
      onPlanExecuted?.(json.data);
    } catch (err: any) {
      forgeToast.error('Execution Failed', err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-violet-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-violet-950/20 overflow-hidden">
      {/* Anime Energy Gradient Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-400" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">AI File Assistant</h3>
              <span className="text-[10px] font-mono uppercase bg-pink-500/15 text-pink-300 border border-pink-500/30 px-1.5 py-0.5 rounded font-bold">
                Copilot
              </span>
            </div>
            <p className="text-xs text-white/40">Natural language optimization & transparent neural transforms</p>
          </div>
        </div>

        {file && (
          <span className="text-xs font-mono text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-xl truncate max-w-[200px]">
            Target: {file.name}
          </span>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setQuery(prompt);
              handleGeneratePlan(prompt);
            }}
            className="text-xs text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 transition-colors cursor-pointer"
          >
            &quot;{prompt}&quot;
          </button>
        ))}
      </div>

      {/* Natural Language Prompt Input Bar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGeneratePlan(query);
            }}
            placeholder={
              file
                ? `Ask AI what to do with ${file.name}...`
                : 'Upload or select a file first, then enter prompt...'
            }
            className="w-full h-12 pl-4 pr-10 bg-black/40 border border-white/15 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>

        <ForgeButton variant="primary"
          size="md"
          onClick={() => handleGeneratePlan(query)}
          isLoading={isPlanning}
          disabled={isPlanning || !query.trim()}
          className="h-12 px-5"
        >
          <Send className="w-4 h-4 mr-1.5" />
          <span>Analyze</span>
        </ForgeButton>
      </div>

      {/* Formulated Plan Confirmation Card */}
      <AnimatePresence>
        {currentPlan && (
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            className="bg-[#12121e] border-2 border-violet-500/40 rounded-2xl p-5 shadow-xl space-y-4"
          >
            {/* Title & Intent */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                  {currentPlan.intent.replace('_', ' ')}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{currentPlan.title}</h4>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-white/40 block">Projected Size</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {currentPlan.estimatedOutputSizeFormatted}
                </span>
              </div>
            </div>

            {/* AI Explanation */}
            <p className="text-xs text-white/80 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/5">
              {currentPlan.explanation}
            </p>

            {/* Settings Applied Table */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                Configured Execution Settings:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                {Object.entries(currentPlan.appliedSettings).map(([key, value]) => (
                  <div key={key} className="bg-black/30 border border-white/5 rounded-lg p-2">
                    <span className="text-white/40 block text-[10px] truncate">{key}</span>
                    <span className="text-white/90 truncate block">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparent AI Disclosure Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-200">
              <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  AI Disclosure Notice • {currentPlan.aiDisclosure.engine} ({currentPlan.aiDisclosure.model})
                </span>
                <span className="text-pink-200/80 mt-0.5 block">
                  {currentPlan.aiDisclosure.disclosureText}
                </span>
              </div>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <ForgeButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPlan(null)}
              >
                <span>Dismiss</span>
              </ForgeButton>

              <ForgeButton variant="primary"
                size="sm"
                onClick={handleExecutePlan}
                isLoading={isExecuting}
                disabled={isExecuting}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Confirm & Apply AI Settings</span>
              </ForgeButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
