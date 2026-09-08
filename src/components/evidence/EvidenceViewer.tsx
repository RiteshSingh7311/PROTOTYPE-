import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  FileText, 
  Tag, 
  Layers, 
  ShieldCheck, 
  Info,
  Check,
  Edit2
} from 'lucide-react';
import { InspectionRecord, DeclarationField } from '../../types';

interface EvidenceViewerProps {
  inspection: InspectionRecord;
  selectedFieldId?: string;
  onSelectField: (fieldId: string) => void;
  onVerifyInspection: (notes: string) => void;
  onNavigateToReport: () => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  inspection,
  selectedFieldId,
  onSelectField,
  onVerifyInspection,
  onNavigateToReport
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [officerNotes, setOfficerNotes] = useState<string>(inspection.officerNotes || '');
  const [isMarkingVerified, setIsMarkingVerified] = useState<boolean>(false);

  const activeField = inspection.fields.find(f => f.id === selectedFieldId) || inspection.fields[0];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const handleVerify = () => {
    onVerifyInspection(officerNotes);
    setIsMarkingVerified(true);
    setTimeout(() => setIsMarkingVerified(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Optical Evidence Inspector</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Packaging Label Evidence &amp; Spatial Coordinates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-examine extracted declarations directly against high-resolution bounding boxes on the Principal Display Panel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Generate Inspection Report
          </button>
        </div>
      </div>

      {/* Main Grid: Label Visualizer (Left) vs Evidence Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Canvas with Overlay Bounding Boxes (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-card flex flex-col justify-between overflow-hidden">
          {/* Zoom Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Interactive Label Overlay</span>
              <span className="text-slate-500">|</span>
              <span className="text-xs text-slate-400 font-mono">Zoom: {Math.round(zoomLevel * 100)}%</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={handleZoomOut}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-0.5 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors font-mono"
                title="Reset Zoom"
              >
                100%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="relative my-4 overflow-auto flex items-center justify-center min-h-[520px] max-h-[600px] bg-slate-950/60 rounded-lg p-2">
            <div 
              className="relative inline-block transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            >
              {/* Product Label Image */}
              <img
                src={inspection.labelImage}
                alt="Product Label"
                className="max-h-[540px] w-auto rounded shadow-2xl select-none"
              />

              {/* Bounding Box Overlays */}
              {inspection.fields.map((f) => {
                const isSelected = activeField?.id === f.id;
                const statusColor = 
                  f.status === 'pass' 
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300' 
                    : f.status === 'review'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                    : 'border-rose-500 bg-rose-500/25 text-rose-200';

                return (
                  <div
                    key={f.id}
                    onClick={() => onSelectField(f.id)}
                    style={{
                      left: `${f.boundingBox.x}%`,
                      top: `${f.boundingBox.y}%`,
                      width: `${f.boundingBox.width}%`,
                      height: `${f.boundingBox.height}%`
                    }}
                    className={`absolute cursor-pointer border-2 transition-all rounded ${statusColor} ${
                      isSelected 
                        ? 'ring-4 ring-blue-400/80 scale-[1.01] z-20 shadow-lg' 
                        : 'hover:scale-[1.01] hover:ring-2 hover:ring-white/60 z-10'
                    }`}
                  >
                    <div className="absolute -top-3 left-1 bg-slate-950/90 text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold tracking-wider uppercase border border-slate-700 shadow-sm flex items-center gap-1">
                      <span>{f.ruleReference}</span>
                      {f.status === 'pass' && <span className="text-emerald-400">●</span>}
                      {f.status === 'review' && <span className="text-amber-400">▲</span>}
                      {f.status === 'violation' && <span className="text-rose-400">✖</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom legend */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-300"></span>
                <span>Compliant</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 border border-amber-300"></span>
                <span>Needs Verification</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 border border-rose-300"></span>
                <span>Potential Violation</span>
              </span>
            </div>
            <span className="text-slate-500 font-mono">Click any box to inspect</span>
          </div>
        </div>

        {/* Right Column: Selected Evidence & Verification Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Field Details Card */}
          {activeField && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                    {activeField.ruleReference}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 font-display">
                    {activeField.label}
                  </h3>
                </div>

                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  activeField.status === 'pass'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : activeField.status === 'review'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {activeField.status === 'pass' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {activeField.status === 'review' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {activeField.status === 'violation' && <XCircle className="w-3.5 h-3.5" />}
                  <span className="capitalize">{activeField.status}</span>
                </span>
              </div>

              {/* Detected Text Box */}
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Detected Optical Text
                </p>
                <p className="text-xs font-mono font-medium text-slate-900 leading-relaxed break-words bg-white p-2.5 rounded border border-slate-200">
                  {activeField.value}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>OCR Confidence: <strong className="text-slate-800">{activeField.confidence}%</strong></span>
                  <span className="font-mono text-slate-400">X:{activeField.boundingBox.x}% Y:{activeField.boundingBox.y}%</span>
                </div>
              </div>

              {/* Metrology Finding & Requirement */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">Legal Assessment Finding:</p>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed">
                  {activeField.statusExplanation}
                </p>
              </div>

              {/* Quick Field Selector Bar */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 mb-2">Switch Declaration Region:</p>
                <div className="flex flex-wrap gap-1.5">
                  {inspection.fields.map(f => (
                    <button
                      key={f.id}
                      onClick={() => onSelectField(f.id)}
                      className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                        activeField.id === f.id
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {f.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Officer Endorsement & Verification Block */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Inspector Manual Verification &amp; Endorsement</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Official Notes / Remarks for Inspection File
              </label>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="Enter physical observations, compounding recommendation, or verification notes..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={handleVerify}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-2 transition-colors"
              >
                {isMarkingVerified ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Marked as Verified!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Save Officer Verification &amp; Notes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
