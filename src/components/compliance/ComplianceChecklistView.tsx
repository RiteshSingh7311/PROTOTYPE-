import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Edit3, 
  FileText, 
  ShieldCheck, 
  Scale, 
  AlertOctagon, 
  Check, 
  Filter, 
  Info,
  ChevronRight,
  HelpCircle,
  Award,
  Utensils,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { InspectionRecord, RuleResult, DeclarationStatus } from '../../types';
import { CertificateModal } from '../common/CertificateModal';

interface ComplianceChecklistViewProps {
  inspection: InspectionRecord;
  onNavigateToEvidence: (fieldId?: string) => void;
  onNavigateToOCR: () => void;
  onNavigateToReport: () => void;
  onMarkVerified: () => void;
}

export const ComplianceChecklistView: React.FC<ComplianceChecklistViewProps> = ({
  inspection,
  onNavigateToEvidence,
  onNavigateToOCR,
  onNavigateToReport,
  onMarkVerified
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [justVerified, setJustVerified] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Filter PCR rules
  const filteredRules = inspection.ruleResults.filter(rule => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pass') return rule.status === 'pass';
    if (filterStatus === 'review') return rule.status === 'review';
    if (filterStatus === 'violation') return rule.status === 'violation';
    return true;
  });

  const passCount = inspection.ruleResults.filter(r => r.status === 'pass').length;
  const reviewCount = inspection.ruleResults.filter(r => r.status === 'review').length;
  const violationCount = inspection.ruleResults.filter(r => r.status === 'violation').length;

  const isFoodProduct = inspection.category.toLowerCase().includes('food') || 
    Boolean(inspection.fssaiResults && inspection.fssaiResults.length > 0);

  const handleVerifyClick = () => {
    onMarkVerified();
    setJustVerified(true);
    setTimeout(() => setJustVerified(false), 2500);
  };

  const isFullyCompliant = 
    inspection.overallStatus === 'Compliant' || 
    inspection.overallStatus === 'Compliant based on configured checks';

  const isIdentityUncertain = 
    inspection.isIdentityConfirmed === false || 
    inspection.overallStatus === 'Product identity not confirmed' ||
    (Boolean(inspection.identityEvidence) && (inspection.identityEvidence?.matchConfidence ?? 100) < 50 && !inspection.isIdentityConfirmed);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* 1. Product Identity Confirmation Status Banner */}
      {isIdentityUncertain ? (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-amber-800 font-display">
                    Product Identity Not Confirmed
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded border border-amber-500/30">
                    Manual Verification Required
                  </span>
                </div>
                <p className="text-xs text-amber-700/90 mt-1 leading-relaxed">
                  The system could not establish a confident multi-signal identity match from OCR evidence alone.
                  Per Legal Metrology protocol, automated compliance scores are provisional. Please manually verify label declarations.
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToOCR}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
            >
              Verify & Edit Details
            </button>
          </div>
        </div>
      ) : inspection.isIdentityConfirmed ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800">
                  Product Identity Confirmed
                </span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-700 px-2 py-0.5 rounded">
                  Match Confidence: {inspection.identityEvidence?.matchConfidence ?? 96}%
                </span>
              </div>
              <p className="text-xs text-emerald-700/90 mt-0.5">
                Evidence matched against authoritative records: <strong className="text-emerald-900">{inspection.brand}</strong> &bull; <strong className="text-emerald-900">{inspection.productName}</strong>
              </p>
            </div>
          </div>
          {inspection.onlineVerification && (
            <div className="text-xs text-slate-500 text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Registry Source:</span>
              <span className="font-semibold text-slate-700">{inspection.onlineVerification.sourceName}</span>
            </div>
          )}
        </div>
      ) : null}

      {/* 2. Conflicting Information Alert Banner */}
      {inspection.dataConflicts && inspection.dataConflicts.length > 0 && (
        <div className="bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h2 className="text-sm font-bold text-rose-800 font-display flex items-center gap-2">
                  <span>Conflicting Information Flagged Between Label &amp; Online Registry</span>
                  <span className="text-[10px] font-mono bg-rose-500/20 text-rose-800 px-2 py-0.5 rounded border border-rose-500/30">
                    {inspection.dataConflicts.length} Conflict{inspection.dataConflicts.length > 1 ? 's' : ''}
                  </span>
                </h2>
                <p className="text-xs text-rose-700/90 mt-1 leading-relaxed">
                  <strong>Legal Metrology Principle:</strong> The physical value visible on the uploaded label is retained as primary inspection ground truth. Online registry data serves as supporting cross-verification only. The system does not automatically assume online data overrides the physical label.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {inspection.dataConflicts.map((conflict, idx) => (
                  <div key={idx} className="bg-white/80 border border-rose-200 rounded-xl p-3.5 text-xs space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-rose-100 pb-1.5">
                      <span className="font-bold text-slate-800 capitalize">{conflict.field} Discrepancy</span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        Conflict Detected
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-sans block">Label (Ground Truth):</span>
                        <strong className="text-slate-900">{conflict.labelValue}</strong>
                      </div>
                      <div className="bg-rose-50/60 p-2 rounded border border-rose-200">
                        <span className="text-[10px] text-slate-400 font-sans block">Online Registry:</span>
                        <strong className="text-rose-800">{conflict.onlineValue}</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic pt-1">{conflict.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner: Product Overview, Overall Status & Score */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Product Info */}
          <div className="flex items-start gap-4">
            <img
              src={inspection.labelImage}
              alt={inspection.productName}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl border border-slate-200 bg-slate-50 shrink-0 p-1"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {inspection.id}
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500 font-medium">
                  Inspected on: {inspection.timestamp}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {inspection.productName}
              </h1>
              <p className="text-xs text-slate-600">
                Brand: <strong className="text-slate-800">{inspection.brand}</strong> &bull; Category: <strong className="text-slate-800">{inspection.category}</strong>
              </p>
              <p className="text-xs text-slate-500">
                Assigned Inspector: <strong className="text-slate-700">{inspection.inspectorName}</strong> ({inspection.inspectorZone})
              </p>
            </div>
          </div>

          {/* Right: Compliance Status & Score Badge */}
          <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            {/* Score Ring / Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center min-w-[120px]">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Compliance Score
              </p>
              <p className={`text-3xl font-extrabold font-display mt-0.5 ${
                inspection.complianceScore >= 90
                  ? 'text-emerald-600'
                  : inspection.complianceScore >= 70
                  ? 'text-amber-500'
                  : 'text-rose-600'
              }`}>
                {inspection.complianceScore}%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Configured Rules</p>
            </div>

            {/* Status Card */}
            <div className="space-y-2">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Audit Determination
                </p>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    isFullyCompliant
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : inspection.overallStatus === 'Needs Manual Verification' || inspection.overallStatus === 'Needs manual verification'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : inspection.overallStatus === 'Product identity not confirmed'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : inspection.overallStatus === 'Insufficient evidence'
                      ? 'bg-slate-100 text-slate-700 border border-slate-300'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {isFullyCompliant && <CheckCircle2 className="w-4 h-4" />}
                    {(inspection.overallStatus.includes('manual') || inspection.overallStatus.includes('identity')) && <AlertTriangle className="w-4 h-4" />}
                    {(inspection.overallStatus.includes('Violation') || inspection.overallStatus.includes('violation')) && <XCircle className="w-4 h-4" />}
                    <span>{inspection.overallStatus}</span>
                  </span>
                </div>
              </div>

              {inspection.isVerified && (
                <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Check className="w-3 h-3" />
                  <span>Verified by Officer</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateToEvidence()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              View Spatial Evidence
            </button>

            <button
              onClick={onNavigateToOCR}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              Edit Extracted Data
            </button>

            <button
              onClick={handleVerifyClick}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                justVerified || inspection.isVerified
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{justVerified || inspection.isVerified ? 'Marked as Verified' : 'Mark as Verified'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isFullyCompliant && (
              <button
                onClick={() => setShowCertModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                title="Download Official Statutory Compliance Certificate (PDF/Print)"
              >
                <Award className="w-4 h-4" />
                <span>Download Certificate</span>
              </button>
            )}

            <button
              onClick={onNavigateToReport}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              Generate Digital Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Passed Declarations</p>
              <p className="text-xl font-bold text-slate-900 font-display">{passCount} Checks</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            PCR Compliant
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Requires Verification</p>
              <p className="text-xl font-bold text-slate-900 font-display">{reviewCount} Checks</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            Review Needed
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-rose-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Potential Violations</p>
              <p className="text-xl font-bold text-slate-900 font-display">{violationCount} Checks</p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            Non-Compliant
          </span>
        </div>
      </div>

      {/* Checklist Header & Status Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Mandatory PCR 2011 Declaration Checklist</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified against provisions of Rule 6, Rule 7, Rule 9 and Schedule II of Legal Metrology (PC) Rules
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({inspection.ruleResults.length})
            </button>
            <button
              onClick={() => setFilterStatus('violation')}
              className={`px-3 py-1 rounded transition-colors ${
                filterStatus === 'violation'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Violations ({violationCount})
            </button>
            <button
              onClick={() => setFilterStatus('review')}
              className={`px-3 py-1 rounded transition-colors ${
                filterStatus === 'review'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Review ({reviewCount})
            </button>
            <button
              onClick={() => setFilterStatus('pass')}
              className={`px-3 py-1 rounded transition-colors ${
                filterStatus === 'pass'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Passed ({passCount})
            </button>
          </div>
        </div>

        {/* Rule Evaluations List */}
        <div className="divide-y divide-slate-100">
          {filteredRules.map((rule, idx) => (
            <div 
              key={idx} 
              className={`p-5 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                rule.status === 'violation'
                  ? 'bg-rose-50/25 hover:bg-rose-50/40'
                  : rule.status === 'review'
                  ? 'bg-amber-50/20 hover:bg-amber-50/30'
                  : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 font-display">
                    {rule.title}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {rule.legalSection}
                  </span>
                </div>

                {/* Detected Text preview */}
                {rule.detectedText && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Extracted Declaration Text:
                    </span>
                    <p className="font-mono text-slate-800 break-words">{rule.detectedText}</p>
                  </div>
                )}

                {/* Explanation */}
                <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{rule.explanation}</span>
                </p>
              </div>

              {/* Status Badge & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                  rule.status === 'pass'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : rule.status === 'review'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {rule.status === 'pass' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {rule.status === 'review' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {rule.status === 'violation' && <XCircle className="w-3.5 h-3.5" />}
                  <span className="capitalize">
                    {rule.status === 'pass' ? 'Pass' : rule.status === 'review' ? 'Needs Review' : 'Potential Violation'}
                  </span>
                </span>

                <button
                  onClick={() => onNavigateToEvidence()}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <span>Inspect Spatial Evidence</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FSSAI Food Label Compliance Section (Exclusively for Packaged Food) */}
      {isFoodProduct && inspection.fssaiResults && inspection.fssaiResults.length > 0 ? (
        <div className="bg-white rounded-xl border border-emerald-200 shadow-card overflow-hidden">
          <div className="p-5 border-b border-emerald-100 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  FSSAI Module Active
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs font-semibold text-slate-600">Packaged Food Product</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2 mt-1">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span>Food Safety and Standards (Labelling and Display) Regulations, 2020</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory food safety declarations evaluated exclusively for food commodities. Non-food products are exempted.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
                {inspection.fssaiResults.filter(f => f.status === 'pass').length} / {inspection.fssaiResults.length} FSSAI Requirements Passed
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {inspection.fssaiResults.map((fssaiRule, idx) => (
              <div 
                key={idx}
                className={`p-5 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  fssaiRule.status === 'violation'
                    ? 'bg-rose-50/25'
                    : fssaiRule.status === 'review'
                    ? 'bg-amber-50/20'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 font-display">
                      {fssaiRule.declaration}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {fssaiRule.regulationRef}
                    </span>
                  </div>

                  {fssaiRule.extractedValue && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Detected Declaration:
                      </span>
                      <p className="font-mono text-slate-800 break-words">{fssaiRule.extractedValue}</p>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{fssaiRule.explanation || fssaiRule.evidence}</span>
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                    fssaiRule.status === 'pass'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : fssaiRule.status === 'review'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {fssaiRule.status === 'pass' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {fssaiRule.status === 'review' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {fssaiRule.status === 'violation' && <XCircle className="w-3.5 h-3.5" />}
                    <span className="capitalize">
                      {fssaiRule.status === 'pass' ? 'Compliant' : fssaiRule.status === 'review' ? 'Needs Review' : 'Missing / Violation'}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>FSSAI Food Labelling &amp; Display Regulations (2020) are <strong>not applicable</strong> to non-food commodity category: <strong className="text-slate-700">{inspection.category}</strong></span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Rule Exemption Applied</span>
        </div>
      )}

      {/* Statutory Compliance Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          inspection={inspection}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
};

