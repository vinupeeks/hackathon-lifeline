import React, { useState } from 'react';
import { Phone, MapPin, Activity, Clock, FileText, Check, Navigation, AlertTriangle } from 'lucide-react';
import { Hospital, OrganType } from '../data';

export interface HospitalCardProps {
  key?: React.Key;
  hospital: Hospital;
  activeFilter: OrganType | 'ALL';
  onCall: (hospital: Hospital) => void;
}

export function HospitalCard({ hospital, activeFilter, onCall }: HospitalCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const info = `HOSPITAL DETAILED DISPATCH:\n${hospital.name}\nPhone: ${hospital.phone}\nAddress: ${hospital.address}\nEquipment available: ${hospital.equipment.join(', ')}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadgeStyle = (status: 'ACTIVE' | 'ALERT') => {
    if (status === 'ACTIVE') {
      return {
        bg: 'bg-emerald-950/90 border-2 border-emerald-500 text-emerald-300',
        text: 'ACTIVE: TRANSPLANT UNIT READY',
        dot: 'bg-emerald-400'
      };
    } else {
      return {
        bg: 'bg-red-950/90 border-2 border-red-500 text-red-300',
        text: 'ALERT: ICU BEDS REQUIRE IMMEDIATE TELEPHONY VERIFICATION',
        dot: 'bg-yellow-400 animate-pulse'
      };
    }
  };

  const badge = getStatusBadgeStyle(hospital.status);

  return (
    <div 
      id={`hospital-card-${hospital.id}`} 
      className={`bg-zinc-900 border-2 ${hospital.status === 'ALERT' ? 'border-red-900/60' : 'border-zinc-800'} p-5 hover:border-zinc-700 transition-all text-white flex flex-col justify-between`}
    >
      {/* Upper header section */}
      <div>
        <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
          {/* Status Badge */}
          <span id={`status-badge-${hospital.id}`} className={`font-mono text-xs font-bold px-3 py-1.5 flex items-center gap-2 tracking-wide uppercase ${badge.bg}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
            {hospital.status === 'ALERT' ? (
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 font-bold" />
                {hospital.statusText}
              </span>
            ) : (
              <span>{hospital.statusText}</span>
            )}
          </span>

          {/* Quick distance metric banner */}
          <div className="font-mono text-zinc-300 text-xs bg-zinc-950 border border-zinc-800 py-1.5 px-3 flex items-center gap-3">
            <span className="flex items-center gap-1 font-bold text-white">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {hospital.distance.toFixed(1)} miles
            </span>
            <span className="text-zinc-600">|</span>
            <span className="flex items-center gap-1 font-bold text-red-500">
              <Clock className="w-3.5 h-3.5" />
              {hospital.travelTime} mins
            </span>
          </div>
        </div>

        {/* Hospital Name */}
        <h3 id={`name-${hospital.id}`} className="text-xl font-bold font-display tracking-tight text-white mb-1.5 hover:text-red-500 transition-colors">
          {hospital.name}
        </h3>

        {/* Address */}
        <p className="text-zinc-400 text-xs font-mono mb-4 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
          <span>{hospital.address}</span>
        </p>

        {/* Organ Organ Capability Badges */}
        <div className="mb-4">
          <p className="text-zinc-500 font-mono text-[10px] tracking-wider uppercase mb-1.5">ORGAN FAILURE CAPABILITY SPECTRUM:</p>
          <div className="flex flex-wrap gap-1.5">
            {['HEART', 'KIDNEY', 'LIVER', 'LUNG'].map((org) => {
              const supported = hospital.capabilities.includes(org as OrganType);
              const isSelectedType = activeFilter === org;
              
              let styleCls = "bg-zinc-950 text-zinc-700 border-zinc-900";
              if (supported) {
                if (isSelectedType) {
                  // Perfect highlighted match
                  styleCls = "bg-red-600 text-white font-black border-red-500 shadow-md scale-102";
                } else {
                  // Supported but not active filter
                  styleCls = "bg-zinc-800 text-zinc-200 font-semibold border-zinc-700";
                }
              }
              
              return (
                <span 
                  key={org}
                  className={`px-2.5 py-1 text-[11px] font-mono border tracking-widest ${styleCls}`}
                >
                  {org}
                </span>
              );
            })}
          </div>
        </div>

        {/* Onsite Clinical Equipment list in bulleted style */}
        <div className="border-t border-zinc-800/80 pt-3.5 mb-5">
          <p className="text-zinc-400 font-mono text-[11px] font-bold tracking-wider uppercase mb-2 flex items-center gap-1">
            <Activity className="w-4 h-4 text-red-500" />
            ON-SITE EQUIPMENT & DEPLOYED SERVICES:
          </p>
          <ul className="space-y-1.5 pl-1">
            {hospital.equipment.map((equip, index) => (
              <li key={index} className="text-xs text-zinc-300 font-mono flex items-start gap-1.5">
                <span className="text-red-500 font-bold select-none shrink-0">•</span>
                <span className="leading-normal">{equip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Suite - Giant Communication Action */}
      <div className="space-y-2 mt-auto">
        <button
          id={`call-er-btn-${hospital.id}`}
          onClick={() => onCall(hospital)}
          className="w-full bg-red-600 hover:bg-red-700 active:bg-orange-700 text-white font-mono font-black text-sm tracking-widest py-3.5 px-4 transition-all flex items-center justify-center gap-2.5 rounded-none border-b-4 border-red-800 shrink-0"
        >
          <Phone className="w-5 h-5 animate-pulse text-white fill-white shrink-0" />
          <span>CALL ER DIRECT LINE</span>
        </button>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            id={`copy-card-info-${hospital.id}`}
            onClick={handleCopyCopy}
            className="py-2 px-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-left flex items-center justify-between gap-1 rounded-none"
          >
            <span className="truncate">COPY DISPATCH SPEC</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            )}
          </button>

          <a
            id={`maps-redirect-${hospital.id}`}
            href={`https://maps.google.com/?q=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-left flex items-center justify-between gap-1 rounded-none decoration-none"
          >
            <span>ROUTE NAVIGATION</span>
            <Navigation className="w-3.5 h-3.5 text-zinc-600 shrink-0 -rotate-45" />
          </a>
        </div>
      </div>
    </div>
  );
}
