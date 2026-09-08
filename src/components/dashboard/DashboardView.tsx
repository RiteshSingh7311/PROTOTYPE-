import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ScanLine, 
  FileText, 
  TrendingUp, 
  Scale, 
  Calendar,
  Eye,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  MessageSquareWarning,
  Camera,
  Users,
  Award
} from 'lucide-react';
import { InspectionRecord } from '../../types';
import { DEMO_PRESETS } from '../../data/mockData';
import { CertificateModal } from '../common/CertificateModal';

interface DashboardViewProps {
  inspections: InspectionRecord[];
  onStartNewInspection: (presetId?: string) => void;
  onViewInspection: (inspection: InspectionRecord) => void;
  onViewReport: (inspection: InspectionRecord) => void;
  onNavigateToComplaints?: () => void;
  onNavigateToCommunity?: () => void;
  onNavigateToFssai?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inspections,
  onStartNewInspection,
  onViewInspection,
  onViewReport,
  onNavigateToComplaints,
  onNavigateToCommunity,
  onNavigateToFssai
}) => {
  // Active product loaded inside hero camera viewfinder
  const [selectedHeroPresetId, setSelectedHeroPresetId] = useState<string>('demo-food-compliant');
  const [selectedInspForCert, setSelectedInspForCert] = useState<InspectionRecord | null>(null);
  const activeHeroPreset = DEMO_PRESETS.find(p => p.id === selectedHeroPresetId) || DEMO_PRESETS[0];
  const isCompliantSample = activeHeroPreset.id === 'demo-food-compliant';

  // Aggregate statistics
  const totalInspections = 248;
  const compliantCount = 172;
  const reviewCount = 46;
  const violationCount = 30;

  const complianceRate = Math.round((compliantCount / totalInspections) * 100);

  // Common PCR 2011 violation breakdown data
  const violationCategories = [
    { label: 'Rule 6(1)(c): MRP Format & Taxes Wording', count: 18, percentage: 38, color: 'bg-rose-500' },
    { label: 'Rule 6(1)(f): Incomplete Consumer Care Details', count: 14, percentage: 30, color: 'bg-amber-500' },
    { label: 'Rule 6(1)(b): Net Qty / Font Size Below Min', count: 11, percentage: 24, color: 'bg-orange-500' },
    { label: 'Rule 6(11): Missing Unit Sale Price (USP)', count: 9, percentage: 20, color: 'bg-indigo-500' },
    { label: 'Rule 6(1)(a): Incomplete Manufacturer Address/PIN', count: 7, percentage: 15, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Modern Dashboard Header with Interactive Product Scan Viewfinder */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>SIH 2026 Prototype Portal</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Lucknow Zone, Uttar Pradesh</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
              <span>Officer: GASLIGHTER</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Legal Metrology Compliance Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Statutory market surveillance and packaging verification console under the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong>. Select any product package to mount into the optical scanner and audit statutory declarations.
          </p>

          {/* Direct Product Package Selector */}
          <div className="pt-2 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Choose Product Package to Scan:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedHeroPresetId('demo-food-compliant')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
                  selectedHeroPresetId === 'demo-food-compliant'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🥜 NutriSnack Almonds 500g</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  selectedHeroPresetId === 'demo-food-compliant' ? 'bg-blue-700 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Compliant
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedHeroPresetId('demo-cosmetic-review')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
                  selectedHeroPresetId === 'demo-cosmetic-review'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🧴 Sparkle Glow Shampoo 250ml</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  selectedHeroPresetId === 'demo-cosmetic-review' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
                }`}>
                  Violations
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Product Picture Viewfinder Camera Target */}
        <div 
          onClick={() => onStartNewInspection(selectedHeroPresetId)}
          className="bg-slate-950 p-3.5 rounded-2xl border-2 border-cyan-500/80 hover:border-cyan-400 shadow-xl cursor-pointer transition-all group shrink-0 w-full sm:w-[350px] relative"
          title="Click to Scan this Product Package"
        >
          {/* Top Camera HUD Header */}
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 pb-2 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-bold tracking-wider">OPTICAL SCANNER READY</span>
            </div>
            <span className="text-slate-400">PCR 2011 &bull; 4K SENSOR</span>
          </div>

          {/* Product Picture Target with Optical Reticle & Laser */}
          <div className="relative h-56 bg-slate-900 rounded-xl overflow-hidden p-2 flex items-center justify-center border border-slate-800">
            {/* The Actual Product Picture */}
            <img
              src={activeHeroPreset.image}
              alt={activeHeroPreset.productName}
              className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
            />

            {/* Viewfinder Reticle Corners */}
            <div className="absolute inset-2 pointer-events-none">
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-400"></div>
              
              {/* Center Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-40">
                <div className="w-6 h-0.5 bg-cyan-400"></div>
                <div className="h-6 w-0.5 bg-cyan-400 absolute"></div>
              </div>
            </div>

            {/* Dynamic Laser Scanning Line */}
            <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-scan-laser pointer-events-none opacity-90"></div>

            {/* Floating OCR Bounding Box Badges Superimposed on Product */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow ${
                isCompliantSample ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60' : 'bg-rose-950/90 text-rose-300 border border-rose-500/60'
              }`}>
                {isCompliantSample ? 'Rule 6(1)(c) MRP: ₹385.00' : 'Rule 6(1)(c) MRP: ₹220 (No Tax Phrase)'}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow ${
                isCompliantSample ? 'bg-blue-950/90 text-blue-300 border border-blue-500/60' : 'bg-amber-950/90 text-amber-300 border border-amber-500/60'
              }`}>
                {isCompliantSample ? 'Rule 6(1)(b) Net Qty: 500g' : 'Rule 6(1)(f) Care Email Missing'}
              </span>
            </div>
          </div>

          {/* Product Info Bar & Prominent Scan Trigger */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <p className="font-bold text-white truncate max-w-[220px]">
                {activeHeroPreset.productName}
              </p>
              <span className="font-mono text-cyan-300 font-semibold text-[11px]">
                ₹{activeHeroPreset.fields.find(f => f.key === 'mrp')?.value.split(' ')[0].replace('₹', '') || '385'}
              </span>
            </div>

            {/* Prominent Scan Action Button on the Product Target */}
            <button
              type="button"
              className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all group-hover:shadow-cyan-500/20"
            >
              <ScanLine className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>📸 SCAN THIS PRODUCT NOW</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Notice Pill */}
      <div className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200/70 flex items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 truncate">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">
            <strong>Advisory Notice:</strong> AI detections provide decision support under the Legal Metrology Act, 2009. Official compounding requires officer endorsement.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 shrink-0 hidden sm:inline">
          Active Schedule: PCR 2011
        </span>
      </div>

      {/* 4 Clean, Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Inspections */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Audits</p>
            <p className="text-3xl font-extrabold text-slate-900 font-display">{totalInspections}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18% this month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Compliant Products */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Compliant</p>
            <p className="text-3xl font-extrabold text-emerald-600 font-display">{compliantCount}</p>
            <p className="text-[11px] text-slate-500">
              <strong className="text-emerald-700 font-semibold">{complianceRate}%</strong> statutory pass rate
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Needs Manual Review */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Needs Review</p>
            <p className="text-3xl font-extrabold text-amber-500 font-display">{reviewCount}</p>
            <p className="text-[11px] text-slate-500">
              Borderline font / contrast
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Potential Violations */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Potential Violations</p>
            <p className="text-3xl font-extrabold text-rose-600 font-display">{violationCount}</p>
            <p className="text-[11px] text-rose-600 font-medium">
              Section 36 notices
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Citizen & Consumer Grievances Alert Strip */}
      <div className="bg-gradient-to-r from-rose-50/80 via-white to-amber-50/60 rounded-xl p-4 border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">4 Active Consumer Grievances in Lucknow Zone</span>
              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-rose-200">
                Action Required
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Citizen complaints reported regarding MRP overcharging, missing consumer care emails, and short quantities in Hazratganj &amp; Aminabad.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToComplaints}
          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs shrink-0 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Review Complaints</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Citizen Vigilance Community Board Strip */}
      <div className="bg-gradient-to-r from-blue-50/90 via-white to-cyan-50/60 rounded-xl p-4 border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Consumer Vigilance Community &amp; Discussion Board</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-200">
                Public Transparency Forum
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Citizens and merchants in Lucknow are actively discussing potato chips slack fill, soap bar shrinkflation, and dual MRP.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToCommunity}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs shrink-0 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Open Community Board</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* FSSAI FoSCoS 14-Digit Statutory License Verifier Banner */}
      <div className="bg-linear-to-r from-orange-50/90 via-white to-amber-50/70 rounded-xl p-4 border border-orange-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">National FSSAI FoSCoS License Verification</span>
              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-orange-200">
                14-Digit Decoder
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Verify manufacturer licenses, decode state jurisdictions, issue years, and check the central national Food Safety Compliance System.
            </p>
          </div>
        </div>

        {onNavigateToFssai && (
          <button
            onClick={onNavigateToFssai}
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-xs shrink-0 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Verify by FSSAI Number</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Middle Section: Violation Breakdown + Market Grievance Product Target Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Common PCR 2011 Non-Compliance Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Top Violation Categories (PCR 2011)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Frequency of non-compliant declarations flagged during routine market audits
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/50">
              Past 90 Days
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {violationCategories.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="text-slate-500 font-medium">
                    <strong className="text-slate-900">{item.count} cases</strong> ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage * 2}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 text-center text-xs">
            <div>
              <p className="text-slate-400">Total Seizure Notices</p>
              <p className="text-lg font-bold text-slate-800 font-display mt-0.5">24</p>
            </div>
            <div>
              <p className="text-slate-400">Compounded Cases</p>
              <p className="text-lg font-bold text-slate-800 font-display mt-0.5">19</p>
            </div>
            <div>
              <p className="text-slate-400">Avg. Verification Time</p>
              <p className="text-lg font-bold text-slate-800 font-display mt-0.5">4.2 min</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Market Grievance Product Scan Target */}
        <div 
          onClick={() => onStartNewInspection('demo-cosmetic-review')}
          className="bg-slate-950 rounded-xl p-5 border-2 border-rose-500/70 hover:border-rose-400 shadow-md cursor-pointer group flex flex-col justify-between relative overflow-hidden transition-all"
          title="Click to Scan this Hazratganj Market Sample"
        >
          <div className="space-y-3">
            {/* Header Badge */}
            <div className="flex items-center justify-between text-[10px] font-mono text-rose-400">
              <span className="flex items-center gap-1.5 font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                GRIEVANCE TARGET AUDIT
              </span>
              <span className="text-slate-400">Hazratganj Circle</span>
            </div>

            {/* Product Picture Target with Optical Reticle */}
            <div className="relative h-40 bg-slate-900 rounded-lg overflow-hidden p-2 flex items-center justify-center border border-slate-800">
              <img
                src={DEMO_PRESETS[1].image}
                alt="Sparkle Glow Shampoo"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />

              {/* Viewfinder Reticle Corners */}
              <div className="absolute inset-1.5 pointer-events-none">
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-rose-400"></div>
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-rose-400"></div>
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-rose-400"></div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-rose-400"></div>
              </div>

              {/* Laser Scanning Line */}
              <div className="absolute inset-x-0 h-1 bg-rose-400 shadow-[0_0_10px_#f43f5e] animate-scan-laser pointer-events-none opacity-80"></div>

              {/* Violation Warning Tag on Product */}
              <div className="absolute bottom-2 left-2 pointer-events-none">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-500/60 shadow">
                  ⚠️ MRP: 220/- (Missing Tax Phrase)
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-white">Sparkle Glow Herbal Shampoo (250ml)</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Reported for missing &quot;Inclusive of all taxes&quot; wording and absent consumer grievance email under Rule 6(1)(f).
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              type="button"
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
            >
              <ScanLine className="w-3.5 h-3.5 text-rose-200" />
              <span>📸 SCAN THIS PRODUCT NOW</span>
            </button>
          </div>
        </div>
      </div>

      {/* Direct Product Inspection Station */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-blue-600" />
            <span>One-Click Packaged Commodity Optical Scanners</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any packaged product below to mount directly into the AI Optical Scanner and run statutory PCR 2011 checks:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Product 1 Card */}
          <div
            onClick={() => onStartNewInspection('demo-food-compliant')}
            className="bg-slate-950 p-4 rounded-xl border-2 border-emerald-500/70 hover:border-emerald-400 transition-all cursor-pointer flex items-center gap-4 group shadow-md"
          >
            {/* Viewfinder Framed Product Image */}
            <div className="relative w-24 h-28 bg-slate-900 rounded-lg border border-slate-800 p-1.5 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
              <img src={DEMO_PRESETS[0].image} alt="NutriSnack" className="max-h-full max-w-full object-contain" />
              <div className="absolute inset-1 pointer-events-none">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400"></div>
              </div>
              <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-scan-laser pointer-events-none opacity-80"></div>
            </div>

            <div className="space-y-1 flex-1 text-white">
              <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/50">
                100% Compliant Sample
              </span>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                NutriSnack Roasted Almonds (500g)
              </h3>
              <p className="text-[11px] text-slate-400">₹385.00 &bull; Net Qty: 500g &bull; FSSAI Lic. Verified</p>
              <div className="pt-1">
                <button
                  type="button"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>📸 Scan This Product</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product 2 Card */}
          <div
            onClick={() => onStartNewInspection('demo-cosmetic-review')}
            className="bg-slate-950 p-4 rounded-xl border-2 border-rose-500/70 hover:border-rose-400 transition-all cursor-pointer flex items-center gap-4 group shadow-md"
          >
            {/* Viewfinder Framed Product Image */}
            <div className="relative w-24 h-28 bg-slate-900 rounded-lg border border-slate-800 p-1.5 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
              <img src={DEMO_PRESETS[1].image} alt="Sparkle Glow" className="max-h-full max-w-full object-contain" />
              <div className="absolute inset-1 pointer-events-none">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-rose-400"></div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-rose-400"></div>
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-rose-400"></div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-rose-400"></div>
              </div>
              <div className="absolute inset-x-0 h-0.5 bg-rose-400 shadow-[0_0_8px_#fb7185] animate-scan-laser pointer-events-none opacity-80"></div>
            </div>

            <div className="space-y-1 flex-1 text-white">
              <span className="text-[10px] font-bold bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-500/50">
                Violations Sample (Hazratganj)
              </span>
              <h3 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                Sparkle Glow Herbal Shampoo (250ml)
              </h3>
              <p className="text-[11px] text-slate-400">MRP 220/- &bull; Missing Tax Phrase &amp; Consumer Email</p>
              <div className="pt-1">
                <button
                  type="button"
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>📸 Scan This Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Recent Enforcement Inspections
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged audits across designated circles &bull; Lucknow Zone, Uttar Pradesh
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Latest 6 records</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Inspection ID / Date</th>
                <th className="px-5 py-3.5">Product &amp; Category</th>
                <th className="px-5 py-3.5">Inspector / Zone</th>
                <th className="px-5 py-3.5 text-center">Score</th>
                <th className="px-5 py-3.5">Compliance Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {inspections.map((insp) => (
                <tr key={insp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900">{insp.id}</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{insp.timestamp}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <p className="font-semibold text-slate-900 truncate" title={insp.productName}>
                      {insp.productName}
                    </p>
                    <span className="inline-block mt-0.5 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {insp.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="font-medium text-slate-800">{insp.inspectorName}</p>
                    <p className="text-[11px] text-slate-400">{insp.inspectorZone}</p>
                  </td>

                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <span className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                      insp.complianceScore >= 90 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : insp.complianceScore >= 70
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {insp.complianceScore}%
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      insp.overallStatus === 'Compliant'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : insp.overallStatus === 'Needs Manual Verification'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {insp.overallStatus === 'Compliant' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {insp.overallStatus === 'Needs Manual Verification' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {insp.overallStatus === 'Potential Violation' && <XCircle className="w-3.5 h-3.5" />}
                      <span>{insp.overallStatus}</span>
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                    {insp.overallStatus === 'Compliant' && (
                      <button
                        onClick={() => setSelectedInspForCert(insp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors shadow-2xs"
                        title="Download Official Statutory Compliance Certificate (PDF/Print)"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Certificate</span>
                      </button>
                    )}
                    <button
                      onClick={() => onViewInspection(insp)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                      title="Inspect Evidence & Declarations"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => onViewReport(insp)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      title="Generate Official Inspection Report"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Compliance Certificate Modal */}
      {selectedInspForCert && (
        <CertificateModal
          inspection={selectedInspForCert}
          onClose={() => setSelectedInspForCert(null)}
        />
      )}
    </div>
  );
};
