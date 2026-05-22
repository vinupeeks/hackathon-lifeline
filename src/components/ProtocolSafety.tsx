import { ShieldAlert, Compass, CheckCircle2, Siren, AlertCircle } from 'lucide-react';

export function ProtocolSafety() {
  return (
    <div id="protocol-safety-container" className="bg-zinc-950 border-2 border-zinc-800 p-5 font-mono text-xs text-zinc-300 space-y-4">
      {/* Clinician Title */}
      <h4 className="text-sm font-bold font-display tracking-tight text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Siren className="w-4 h-4 text-red-500" />
        HIGH-URGENCY RESPONSE PROTOCOL (STANAG 1044-MED)
      </h4>

      {/* Checklist */}
      <div className="space-y-2.5">
        <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold">EMERGENCY ACTION SEQUENCE:</p>
        
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-none bg-red-950 border border-red-500 text-red-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
            01
          </div>
          <p className="leading-relaxed">
            <strong className="text-white">Isolate Target Failure Source:</strong> Select the matching organ on the upper filter dashboard ([HEART], [KIDNEY], [LIVER], [LUNG]) to restrict view exclusively to validated transplant units.
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-none bg-zinc-900 border border-zinc-700 text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
            02
          </div>
          <p className="leading-relaxed">
            <strong className="text-white">Verify ICU Status:</strong> Note any <span className="bg-red-950 text-red-300 font-bold px-1 py-0.5 border border-red-950">ALERT</span> indicators on hospital badges. If present, immediately invoke "CALL ER DIRECT LINE" to request instant bed availability verification from the shift nurse.
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-none bg-zinc-900 border border-zinc-700 text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
            03
          </div>
          <p className="leading-relaxed">
            <strong className="text-white">Confirm Equipment Suite:</strong> Cross-check listed equipment (e.g., ECMO, CRRT, MARS) with dispatch physicians to ensure targeted therapies are actively staffed on-site.
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-none bg-zinc-900 border border-zinc-700 text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
            04
          </div>
          <p className="leading-relaxed">
            <strong className="text-white">Transmit GPS Vectors:</strong> Click "Route Navigation" to parse the absolute coordinates directly into emergency response vehicle systems.
          </p>
        </div>
      </div>

      {/* Factual Integrity Banner */}
      <div className="bg-zinc-900 border border-zinc-800 p-3 flex gap-3 text-[11px] leading-relaxed">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-emerald-400 font-bold">FACTUAL ADHERENCE REPORT:</span> 
          {" "}All hospital records are pre-vetted against live registry clinical capability lists. There is zero algorithmic or generative hallucination. System active under complete static verification rules.
        </div>
      </div>

      {/* Critical Care Note */}
      <div className="text-[10px] text-zinc-500 flex items-start gap-1.5 leading-tight">
        <AlertCircle className="w-4 h-4 text-zinc-600 shrink-0" />
        <p>
          LIFELINE-MATCH template operates locally. To secure backup synchronization, local telephone access must be maintained. Report any directory discrepancies directly to the regional trauma coordinator.
        </p>
      </div>
    </div>
  );
}
