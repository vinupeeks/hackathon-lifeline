import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Search, 
  RefreshCw, 
  WifiOff, 
  Siren, 
  Compass, 
  Bookmark, 
  FilterX, 
  Clock, 
  AlertOctagon,
  Copy,
  Check
} from 'lucide-react';
import { HOSPITALS, Hospital, OrganType } from './data';
import { HospitalCard } from './components/HospitalCard';
import { EmergencyDialer } from './components/EmergencyDialer';
import { ProtocolSafety } from './components/ProtocolSafety';

// Define simulation sector locations
interface BeaconSector {
  id: string;
  name: string;
  distanceOffset: number; // offset added to hospital values
  travelTimeMultiplier: number;
}

const BEACON_SECTORS: BeaconSector[] = [
  { id: 'sec-1', name: 'Metro Depot (Sector 4 / Ground Base)', distanceOffset: 0, travelTimeMultiplier: 1.0 },
  { id: 'sec-2', name: 'Heights Terminal (High Altitude Sector)', distanceOffset: 3.1, travelTimeMultiplier: 1.4 },
  { id: 'sec-3', name: 'East Maritime Basin (Industrial Shoreline)', distanceOffset: 7.4, travelTimeMultiplier: 1.9 },
];

export default function App() {
  const [activeFilter, setActiveFilter] = useState<OrganType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<BeaconSector>(BEACON_SECTORS[0]);
  const [sortOption, setSortOption] = useState<'DISTANCE' | 'STATUS' | 'NAME'>('DISTANCE');
  const [activeCallHospital, setActiveCallHospital] = useState<Hospital | null>(null);
  
  // High accuracy state for system clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [copiedRegistry, setCopiedRegistry] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as high fidelity ISO-like military timestamp
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setCurrentTime(timestamp);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute simulated hospital locations depending on active simulated sector
  const getSimulatedHospital = (hosp: Hospital): Hospital => {
    const adjustedDistance = hosp.distance + selectedSector.distanceOffset;
    const adjustedTime = Math.round(hosp.travelTime * selectedSector.travelTimeMultiplier);
    return {
      ...hosp,
      distance: Number(adjustedDistance.toFixed(1)),
      travelTime: adjustedTime
    };
  };

  const simulatedHospitals = HOSPITALS.map(getSimulatedHospital);

  // Filter hospitals according to Organ capability & text search
  const filteredHospitals = simulatedHospitals.filter(hosp => {
    // Organ filter
    const matchesOrgan = activeFilter === 'ALL' || hosp.capabilities.includes(activeFilter);
    
    // Search query matches name, address, or listed equipment
    const text = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      hosp.name.toLowerCase().includes(text) ||
      hosp.address.toLowerCase().includes(text) ||
      hosp.statusText.toLowerCase().includes(text) ||
      hosp.equipment.some(eq => eq.toLowerCase().includes(text)) ||
      hosp.capabilities.some(cap => cap.toLowerCase().includes(text));

    return matchesOrgan && matchesSearch;
  });

  // Sort logic
  const sortedHospitals = [...filteredHospitals].sort((a, b) => {
    if (sortOption === 'DISTANCE') {
      return a.distance - b.distance;
    }
    if (sortOption === 'STATUS') {
      // ACTIVE first, ALERT second
      if (a.status === 'ACTIVE' && b.status === 'ALERT') return -1;
      if (a.status === 'ALERT' && b.status === 'ACTIVE') return 1;
      return a.distance - b.distance; // secondary sort
    }
    if (sortOption === 'NAME') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const handleOrgTap = (organ: OrganType) => {
    if (activeFilter === organ) {
      setActiveFilter('ALL'); // untap reverts to ALL
    } else {
      setActiveFilter(organ);
    }
  };

  const handleCallInitiation = (hosp: Hospital) => {
    setActiveCallHospital(hosp);
  };

  const handleCopyRegistryPayload = () => {
    const serialized = sortedHospitals.map(h => 
      `HOSPITAL: ${h.name}\n- DISTANCE: ${h.distance} mi (${h.travelTime} min)\n- CAPABILITIES: ${h.capabilities.join(', ')}\n- PHONE/ER: ${h.phone}\n- STATUS: ${h.statusText}`
    ).join('\n\n');
    
    const meta = `LIFELINE-MATCH REGISTRY PAYLOAD\nTIMESTAMP: ${currentTime}\nBEACON ROOT: ${selectedSector.name}\nACTIVE FILTER: ${activeFilter}\nTOTAL MATCHES: ${sortedHospitals.length}\n\n${serialized}`;
    
    navigator.clipboard.writeText(meta);
    setCopiedRegistry(true);
    setTimeout(() => setCopiedRegistry(false), 2500);
  };

  // Metrics for quick emergency dashboard readout
  const totalClinics = simulatedHospitals.length;
  const activeMatchingCount = sortedHospitals.length;
  const greenUnitsCount = sortedHospitals.filter(h => h.status === 'ACTIVE').length;
  const alertUnitsCount = sortedHospitals.filter(h => h.status === 'ALERT').length;

  return (
    <div id="app-root-layout" className="min-h-screen bg-[#0a0c10] text-[#eaeef4] font-sans antialiased selection:bg-red-600 selection:text-white flex flex-col">
      
      {/* 1. TOP MILITARY CRISIS SPEC TICKER */}
      <header id="crisis-ticker-bar" className="w-full bg-red-600 border-b border-red-700 py-2 px-4 shadow-md shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-white">
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold tracking-widest uppercase">
            <span className="inline-block w-2.5 h-2.5 bg-white rounded-full animate-ping shrink-0" />
            <Siren className="w-4 h-4 text-white" />
            <span className="text-white">LIFELINE-MATCH // CLINICAL ORGAN ALLOCATION SYSTEM</span>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] font-mono font-semibold">
            {/* Offline confirmation badge */}
            <span className="flex items-center gap-1 bg-zinc-950/40 px-2 py-0.5 border border-white/20 text-zinc-100 uppercase">
              <WifiOff className="w-3.5 h-3.5" />
              OFFLINE DEPLOYMENT CERTIFIED
            </span>
            <span>SYSTEM_TIME: <span className="bg-black/40 px-2 py-0.5 font-bold tracking-wider">{currentTime || 'SYNCING...'}</span></span>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main id="main-crisis-workspace" className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* UPPER TITLE BLOCK (Zero marketing, stark clinical info) */}
        <div id="registry-title-block" className="border-b-2 border-zinc-900 pb-5 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
          <div>
            <p className="text-red-500 font-mono text-xs font-bold tracking-widest uppercase mb-1">
              REGIONAL PATIENT ALLOCATION REPERTORY
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white flex items-center gap-2">
              LIFELINE-MATCH REGISTRY
            </h1>
            <p className="text-zinc-500 font-mono text-xs mt-1.5 leading-relaxed max-w-3xl">
              Strict factual directory template for emergency ambulance telemetry, hospital capabilities, and direct ER line communications. Filtered instantly to eliminate allocation delay under high-urgency conditions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              id="registry-copy-payload-btn"
              onClick={handleCopyRegistryPayload}
              className="w-full lg:w-auto py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 rounded-none"
            >
              {copiedRegistry ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  COPIED ACTIVE DISPATCH DATA
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-500" />
                  EXPORT FILTERED REGISTRY
                </>
              )}
            </button>
            <div className="w-full lg:w-auto text-center py-2.5 px-4 bg-zinc-950/60 border border-zinc-800 font-mono text-[11px] text-zinc-400">
              <span className="font-bold text-white">{activeMatchingCount}</span> of {totalClinics} Hospital Units Match Filters
            </div>
          </div>
        </div>

        {/* ================= SECTION A: THE INSTANT FILTER HEADER ================= */}
        <section id="section-instant-filter" className="bg-zinc-950 border-2 border-red-950 p-5 rounded-none">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 block rounded-none" />
              <h2 className="text-xs font-mono font-black tracking-widest uppercase text-zinc-200">
                CRITICAL ORGAN RECIPIENT CAPABILITY FILTER (SELECT SINGLE CATEGORY TO ENGAGE INSTANT SWIFT-MATCH):
              </h2>
            </div>
            
            {activeFilter !== 'ALL' && (
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-900/50 px-2 py-0.5 font-mono font-bold uppercase animate-pulse">
                ACTIVE COUPLING PROTOCOL IN FOCUS
              </span>
            )}
          </div>

          {/* Primary Organ Filter Grid */}
          <div id="organ-filter-button-grid" className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'HEART', label: 'HEART FAILURE / ECMO', icon: Heart, desc: 'ECMO, LVAD, Cardiothoracic ICU' },
              { type: 'KIDNEY', label: 'KIDNEY FAILURE / DIALYSIS', icon: Activity, desc: '24/7 Hemodialysis, CRRT, CVVH' },
              { type: 'LIVER', label: 'LIVER FAILURE / HEPATIC', icon: Bookmark, desc: 'Hepatobiliary Suite, MARS Therapy' },
              { type: 'LUNG', label: 'LUNG FAILURE / PULMONARY', icon: Compass, desc: 'Double Lung, HFOV, Respirators' },
            ].map((btn) => {
              const Icon = btn.icon;
              const isSelected = activeFilter === btn.type;
              
              return (
                <button
                  key={btn.type}
                  id={`filter-btn-${btn.type.toLowerCase()}`}
                  onClick={() => handleOrgTap(btn.type as OrganType)}
                  className={`relative p-4 text-left border-2 transition-all flex flex-col justify-between h-28 cursor-pointer rounded-none select-none group ${
                    isSelected 
                      ? 'bg-red-600 border-red-500 text-white' 
                      : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-red-500 group-hover:scale-105 transition-transform'}`} />
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 border ${
                      isSelected ? 'bg-red-800 border-red-400 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                    }`}>
                      {isSelected ? 'MATCH ACTIVE' : 'ENGAGE FILTER'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className={`font-mono text-sm font-bold tracking-wider leading-tight ${isSelected ? 'text-white' : 'text-zinc-100'}`}>
                      {btn.label}
                    </p>
                    <p className={`font-mono text-[10px] mt-0.5 truncate ${isSelected ? 'text-red-100' : 'text-zinc-500'}`}>
                      {btn.desc}
                    </p>
                  </div>

                  {/* High contrast selection outline check */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-white border-b-2 border-l-2 border-red-600 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-red-600 block" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick reset option line */}
          <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-400">Current Scope:</span>
              <span className="font-mono text-xs font-bold text-white uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5">
                {activeFilter === 'ALL' ? 'Showing All Hospital Units (No Filter)' : `Filtering: ${activeFilter} Capabilities Only`}
              </span>
            </div>

            {activeFilter !== 'ALL' && (
              <button
                id="reset-filter-btn"
                onClick={() => setActiveFilter('ALL')}
                className="font-mono text-xs text-red-400 hover:text-white bg-zinc-900 border border-red-950 hover:border-red-600 py-1.5 px-3 flex items-center gap-1.5 transition-all rounded-none cursor-pointer"
              >
                <FilterX className="w-3.5 h-3.5" />
                CLEAR ORGAN FILTER (SHOW ALL UNITS)
              </button>
            )}
          </div>
        </section>

        {/* GRID LAYOUT FOR SECONDARY TELEMETRY CONTROLS & EMERGENCY DIRECTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT RECON / SIDE PANEL CONTROLS: 1 Column */}
          <div id="side-telemetry-controls" className="space-y-6">
            
            {/* SEARCH PANEL WITH CRITICAL METRICS */}
            <div id="quick-search-box" className="bg-zinc-950 border-2 border-zinc-900 p-5">
              <div className="flex items-center gap-1.5 mb-3 text-white">
                <span className="w-2 h-2 bg-red-500 block" />
                <h3 className="font-mono text-xs font-bold tracking-widest uppercase">
                  1. RECON & PATIENT PORTAL
                </h3>
              </div>

              {/* Input for searching hospital capability */}
              <div className="relative mb-4">
                <input
                  type="text"
                  id="clinical-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query equipment, name or capability..."
                  className="w-full bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-700 focus:border-red-600 text-white font-mono text-xs px-3 py-3 pl-9 placeholder-zinc-500 outline-none rounded-none focus:ring-0"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-xs font-mono text-zinc-500 hover:text-white"
                  >
                    [CLEAR]
                  </button>
                )}
              </div>

              {/* Sort Logic */}
              <div id="sort-logic-wrapper" className="space-y-2 mb-4">
                <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">SORT SEARCH RESULTS BY:</p>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: 'DISTANCE', label: 'CLOSEST / MIN' },
                    { key: 'STATUS', label: 'UNIT ACTIVE' },
                    { key: 'NAME', label: 'ALPHABETICAL' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      id={`sort-btn-${opt.key.toLowerCase()}`}
                      onClick={() => setSortOption(opt.key as any)}
                      className={`py-1.5 px-1 font-mono text-[10px] border tracking-wider text-center transition-all rounded-none cursor-pointer ${
                        sortOption === opt.key 
                          ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-bold' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated GPS Beacon Sector Shift */}
              <div id="gps-simulation-wrapper" className="bg-zinc-900/60 p-3.5 border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-zinc-400 flex items-center gap-1 block">
                    <Compass className="w-3.5 h-3.5 text-zinc-500" />
                    SIMULATED TRANSMITTER POSITION:
                  </span>
                  <span className="font-mono text-[9px] text-zinc-500">DISPLACEMENT SIM</span>
                </div>

                <div className="space-y-1.5">
                  {BEACON_SECTORS.map((sec) => (
                    <button
                      key={sec.id}
                      id={`sector-beacon-btn-${sec.id}`}
                      onClick={() => setSelectedSector(sec)}
                      className={`w-full py-1.5 px-2.5 text-left font-mono text-xs border transition-all flex justify-between items-center rounded-none cursor-pointer ${
                        selectedSector.id === sec.id
                          ? 'bg-red-950 border-red-500 text-red-200 font-bold'
                          : 'bg-zinc-900 border-zinc-800/85 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="truncate">{sec.name}</span>
                      <span className="text-[10px] font-bold tracking-tight text-red-500">
                        {sec.distanceOffset === 0 ? '±0.0 mi' : `+${sec.distanceOffset} mi`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* REAL-TIME ALIGNMENT METRICS READOUT */}
            <div id="live-allocation-metrics" className="bg-zinc-955 border-2 border-zinc-900 p-5 space-y-3">
              <div className="flex gap-1.5 items-center text-white border-b border-zinc-900 pb-2">
                <span className="w-2 h-2 bg-emerald-500 block" />
                <h3 className="font-mono text-xs font-bold tracking-widest uppercase">
                  ACTIVE REGISTRY STATISTICS
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                <div className="bg-zinc-900 p-2.5 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 uppercase">ONLINE TARGETS</p>
                  <p className="text-xl font-bold text-white mt-1">{totalClinics}</p>
                </div>
                <div className="bg-zinc-900 p-2.5 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 uppercase">MATCHING SPEC</p>
                  <p className="text-xl font-bold text-red-500 mt-1">{activeMatchingCount}</p>
                </div>
                <div className="bg-zinc-900 p-2.5 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 uppercase">TRANSPLANTS READY</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{greenUnitsCount}</p>
                </div>
                <div className="bg-zinc-900 p-2.5 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 uppercase">CAPACITY ALERTS</p>
                  <p className={`text-xl font-bold mt-1 ${alertUnitsCount > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
                    {alertUnitsCount}
                  </p>
                </div>
              </div>

              {/* Pre-vetted clinical notice */}
              <div className="text-[10px] text-zinc-500 font-mono leading-relaxed bg-zinc-900/30 p-2.5 border border-zinc-900/60 mt-2">
                <strong>Telephony Warning:</strong> Dialing a clinical ER desk records your line metadata. Ensure you have the target patient’s verified blood panel or transport ticket in hand.
              </div>
            </div>

            {/* 3. SAFETY PROTOCOLS */}
            <ProtocolSafety />

          </div>

          {/* RIGHT EMERGENCY DIRECTORY STACK: 2 Columns */}
          <div id="section-hospital-stack" className="lg:col-span-2 space-y-4">
            
            {/* LIST TITLE BAR */}
            <div className="bg-zinc-950 border border-zinc-900 p-4 flex flex-wrap justify-between items-center gap-3">
              <div id="results-headline" className="font-mono flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold text-white tracking-wide uppercase">
                  {filteredHospitals.length === 0 ? 'ZERO VERIFIED HOSPITALS FOUND' : `VERIFIED HOSPITALS SORTED BY ${sortOption === 'STATUS' ? 'ACTIVE UNITS' : sortOption}`}
                </span>
                {searchQuery && (
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 border border-zinc-700 uppercase">
                    Query: "{searchQuery}"
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-400 font-mono">
                Showing <strong className="text-white">{sortedHospitals.length}</strong> of <strong className="text-white">{totalClinics}</strong> Hospitals
              </div>
            </div>

            {/* Hospital cards stack */}
            <div id="hospital-cards-vertical-wrapper" className="space-y-4">
              {sortedHospitals.length > 0 ? (
                sortedHospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    activeFilter={activeFilter}
                    onCall={handleCallInitiation}
                  />
                ))
              ) : (
                <div id="no-matches-fallback-card" className="bg-zinc-950 border-4 border-red-650 p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <AlertOctagon className="w-16 h-16 text-red-500 animate-pulse border-2 border-red-500 p-2" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display text-white tracking-tight uppercase">
                      CRITICAL FAULT: NO HOSPITAL CAPABILITIES DIRECTLY MEET CURRENT SEARCH PROTOCOL
                    </h3>
                    <p className="text-xs text-red-400 font-mono max-w-xl mx-auto leading-relaxed">
                      All filters loaded must match the hospital’s certified active clinical registry. Either expand query parameters, reset the active organ filter, or call regional trauma central routing lines immediately.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      id="reset-query-panic-button"
                      onClick={() => {
                        setActiveFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="py-3 px-6 bg-red-600 hover:bg-neutral-800 text-white hover:text-red-500 font-mono font-bold text-xs tracking-wider border-b-4 border-red-800 rounded-none transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      FORCE RESET ALL SEARCH PROTOCOLS
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick emergency notice bottom bar */}
            <div id="disclaimer-bottom-bar" className="bg-zinc-950 p-4 border border-zinc-800 text-[10px] text-zinc-500 font-mono leading-relaxed">
              <p>
                <strong>SYSTEM ALLOCATION STATS DISCLAIMER:</strong> LifeLine-Match template delivers instant reference directory layout based on clinical data models. Contact authorities first. GPS and latency times metrics are simulated based on target transmit coordinates. Complete compliance is checked under hospital code rules.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer id="app-footer" className="bg-zinc-950 border-t border-zinc-900 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 inline-block" />
            <span>LIFELINE-MATCH APPMED REGISTER v4.2.14. SECURE TRANSMITTED DATA DIRECT TO DEVICE.</span>
          </div>
          <div>
            <span>SYSTEM ENCODING: ISO-1044 // LATENCY: 0.12ms</span>
          </div>
        </div>
      </footer>

      {/* EMERGENCY OUTBOUND DIALER OVERLAY */}
      <EmergencyDialer
        hospital={activeCallHospital}
        onClose={() => setActiveCallHospital(null)}
      />

    </div>
  );
}
