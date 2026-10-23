import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import api from '../services/api';

const STEP_COLORS = ['text-emerald-700', 'text-sky-700', 'text-amber-800', 'text-orange-800', 'text-purple-700', 'text-pink-700', 'text-pink-700', 'text-pink-400', 'text-sky-700'];

export function SimulateButton({ onUpdate }: { onUpdate?: () => void }) {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (polling) {
      interval = setInterval(async () => {
        try {
          const status = await api.simulateStatus();
          setState(status);
          if (!status.running) {
            setPolling(false);
            setLoading(false);
            if (onUpdate) onUpdate();
          }
        } catch { /* ignore */ }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [polling, onUpdate]);

  const startSimulation = async () => {
    setLoading(true);
    setExpanded(true);
    try {
      const result = await api.simulateStart();
      setState(result.state);
      setPolling(true);
    } catch (err: any) {
      alert('Simulation failed: ' + err.message);
      setLoading(false);
    }
  };

  const resetSimulation = async () => {
    try {
      await api.simulateReset();
      setState(null);
      setExpanded(false);
      if (onUpdate) onUpdate();
    } catch { /* ignore */ }
  };

  const isRunning = state?.running;
  const isDone = state && !state.running && state.step > 0;
  const steps = state?.steps || [];

  return (
    <div className="card border-2 border-purple-200/30 bg-purple-200/10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-stone-800 flex items-center gap-2">
            <span className="text-purple-700">🎯</span>
            Demo Simulation
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Simulate a water-borne disease outbreak in Rongpur village</p>
        </div>
        <div className="flex gap-2">
          {(isRunning || isDone) && (
            <button onClick={resetSimulation} className="btn-ghost text-xs flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
          <button
            onClick={expanded ? () => setExpanded(!expanded) : startSimulation}
            disabled={loading && !isDone}
            className={`btn flex items-center gap-2 text-sm ${isDone ? 'bg-emerald-200/40 hover:bg-emerald-200/60 text-emerald-600' : 'bg-purple-200 hover:bg-purple-200 text-white'} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading && !isDone ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Running...</>
            ) : isDone ? (
              <><CheckCircle className="w-4 h-4" /> Completed</>
            ) : (
              <><Play className="w-4 h-4" /> Simulate Risk Increase</>
            )}
          </button>
        </div>
      </div>

      {expanded && steps.length > 0 && (
        <div className="border-t border-orange-100 pt-3 mt-3 space-y-2 animate-fade-in">
          <p className="text-xs font-medium text-stone-700 uppercase tracking-wide mb-2">
            Simulation Progress — {state?.step || 0}/{state?.totalSteps || 9} Steps
          </p>
          <div className="relative">
            {steps.map((step: any, i: number) => (
              <div key={step.step} className={`flex items-start gap-3 py-2 px-3 rounded-lg mb-1 transition-all ${step.status === 'running' ? 'bg-purple-200/30 border border-purple-200/30' : step.status === 'done' ? 'opacity-70' : 'opacity-30'}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {step.status === 'done' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                  ) : step.status === 'running' ? (
                    <Loader2 className="w-4 h-4 text-purple-700 animate-spin" />
                  ) : (
                    <ChevronRight className={`w-4 h-4 ${STEP_COLORS[i]}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-semibold ${STEP_COLORS[i]}`}>{step.title}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${step.riskScore >= 75 ? 'bg-pink-200/20 text-pink-700' : step.riskScore >= 50 ? 'bg-orange-200/20 text-orange-800' : step.riskScore >= 25 ? 'bg-amber-200/20 text-amber-800' : 'bg-emerald-200/20 text-emerald-700'}`}>
                      Risk: {step.riskScore}
                    </span>
                  </div>
                  <p className="text-stone-700 text-xs mt-0.5 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          {isDone && (
            <div className="mt-3 p-3 bg-emerald-200/20 border border-emerald-200/30 rounded-lg">
              <p className="text-emerald-700 text-xs font-medium">✅ Simulation complete! Check the map and alerts to see Rongpur in CRITICAL state.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SimulateButton;
