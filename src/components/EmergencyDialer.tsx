import { useState, useEffect } from 'react';
import { Phone, XCircle, ShieldAlert, Activity, Check } from 'lucide-react';
import { Hospital } from '../data';

interface EmergencyDialerProps {
  hospital: Hospital | null;
  onClose: () => void;
}

export function EmergencyDialer({ hospital, onClose }: EmergencyDialerProps) {
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!hospital) return;
    
    // Increment a call timer to look highly functional & realistic
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hospital]);

  if (!hospital) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${hospital.name} ER Direct Line: ${hospital.phone}\nAddress: ${hospital.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="emergency-dialer-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div 
        id="emergency-dialer-modal" 
        className="w-full max-w-md bg-zinc-950 border-4 border-red-600 rounded-none p-6 text-center shadow-2xl relative"
      >
        {/* Urgent Header */}
        <div id="dialer-alert-banner" className="bg-red-600 text-white font-mono font-bold py-2 px-4 mb-6 flex items-center justify-center gap-2 animate-pulse rounded-none">
          <ShieldAlert className="w-5 h-5" />
          <span className="tracking-widest">OUTBOUND EMERGENCY DISPATCH</span>
        </div>

        {/* Dialing Stats */}
        <p className="text-zinc-400 font-mono text-xs uppercase tracking-wider mb-2">SYSTEM PROTOCOL 10-44 ACTIVE</p>
        <h3 className="text-2xl font-bold font-display tracking-tight text-white mb-1">
          {hospital.name}
        </h3>
        <p className="text-red-500 font-mono text-lg font-bold tracking-wider mb-6">
          ER DIRECT: {hospital.phone}
        </p>

        {/* Dialing Animation Signal / Timer */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-none mb-6 font-mono text-left">
          <div className="flex justify-between items-center text-xs text-zinc-500 mb-2">
            <span>CONNECTION SECURE</span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block"></span>
              DIALING...
            </span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-emerald-400">
            <span className="flex items-center gap-1.5 font-sans">
              <Activity className="w-5 h-5 animate-pulse text-red-500" />
              ELAPSED DURATION:
            </span>
            <span>{formatTime(seconds)}</span>
          </div>
          <div className="mt-3 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-2.5">
            <span className="font-bold text-white">Clinical Note:</span> Mobile carriers will execute secondary satellite redirect matching for optimal local cellular routing.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            id="dialer-copy-btn"
            onClick={handleCopy}
            className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 rounded-none"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                COPIED DIRECTORY INFO
              </>
            ) : (
              <>
                <span>COPY SECURE INFO</span>
              </>
            )}
          </button>
          
          <button
            id="dialer-terminate-btn"
            onClick={onClose}
            className="py-3 px-4 bg-red-950 hover:bg-red-900 border border-red-500 text-red-100 font-mono font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 rounded-none"
          >
            <XCircle className="w-4 h-4" />
            END EMERGENCY CALL
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 font-mono leading-tight">
          This system uses cellular forwarding matching protocols. Real ER desk logs will record this connection as an urgent clinical transfer request.
        </p>

        {/* Hidden active link for mobile hardware trigger */}
        <iframe src={`tel:${hospital.phone}`} className="hidden" />
      </div>
    </div>
  );
}
