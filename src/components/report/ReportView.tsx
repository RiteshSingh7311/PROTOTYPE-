import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Scale, 
  ShieldCheck, 
  Calendar, 
  User, 
  MapPin, 
  QrCode, 
  FileCheck, 
  Building2, 
  Check, 
  Award, 
  ShieldAlert,
  Globe,
  Utensils,
  AlertOctagon
} from 'lucide-react';
import { InspectionRecord, ConsumerComplaint } from '../../types';
import { CertificateModal } from '../common/CertificateModal';
import { NoticeModal } from '../common/NoticeModal';

interface ReportViewProps {
  inspection: InspectionRecord;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  inspection,
  onBack
}) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inspection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${inspection.id}_Compliance_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const passCount = inspection.ruleResults.filter(r => r.status === 'pass').length;
  const reviewCount = inspection.ruleResults.filter(r => r.status === 'review').length;
  const violationCount = inspection.ruleResults.filter(r => r.status === 'violation').length;

  const isCompliant = 
    inspection.overallStatus === 'Compliant' || 
    inspection.overallStatus === 'Compliant based on configured checks';

  const isFoodProduct = inspection.category.toLowerCase().includes('food') || 
    Boolean(inspection.fssaiResults && inspection.fssaiResults.length > 0);

  const violationComplaint: ConsumerComplaint = {
    id: `NOTC-INSP-${inspection.id.replace(/[^0-9]/g, '') || '2026'}`,
    timestamp: inspection.timestamp,
    complainantName: `Suo-Motu Market Inspection (${inspection.inspectorName})`,
    complainantContact: '+91-522-2615599 (Legal Metrology)',
    productName: inspection.productName,
    brand: inspection.brand,
    category: inspection.category,
    storeOrPlatform: 'Market Inspection Sample, Hazratganj Circle',
    location: inspection.inspectorZone,
    violationType: inspection.ruleResults.filter(r => r.status === 'violation').map(r => `${r.legalSection}: ${r.title}`).join(', ') || 'Statutory Declaration Discrepancy under PCR 2011',
    description: `Official Legal Metrology physical audit recorded non-compliance with compliance score of ${inspection.complianceScore}%. Mandatory declarations failed verification under Legal Metrology (Packaged Commodities) Rules, 2011.`,
    status: 'Notice Issued',
    priority: 'High',
    assignedOfficer: inspection.inspectorName
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Action Toolbar (Hidden during print) */}
      <div className="no-print bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Audit Results</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Certificate Download Button */}
          {isCompliant ? (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              title="Download Official Statutory Certificate of Compliance (PDF/Print)"
            >
              <Award className="w-4 h-4" />
              <span>Download Statutory Certificate</span>
            </button>
          ) : (
            <button
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              title="Download Statutory Show-Cause Notice under Section 36 (PDF/Print)"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Download Sec 36 Notice</span>
            </button>
          )}

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data (JSON)</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Download Memo (PDF/Print)</span>
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          inspection={inspection}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Show-Cause Notice Modal */}
      {showNoticeModal && (
        <NoticeModal
          complaint={violationComplaint}
          onClose={() => setShowNoticeModal(false)}
        />
      )}

      {/* Printable Formal Digital Compliance Memo */}
      <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-card print:border-none print:shadow-none print:p-0 space-y-8 print-card">
        {/* Document Header with Government / Legal Metrology Style */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  LM
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  LEGAL METROLOGY ENFORCEMENT DIVISION
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-display">
                Digital Compliance Inspection Memorandum
              </h1>
              <p className="text-xs text-slate-500">
                Under Legal Metrology Act, 2009, Packaged Commodities Rules, 2011 &amp; FSSAI Regulations, 2020
              </p>
            </div>

            {/* Serial Reference & Status */}
            <div className="text-right space-y-1">
              <span className="font-mono font-bold text-sm bg-slate-100 px-2.5 py-1 rounded border border-slate-300 inline-block text-slate-900">
                {inspection.id}
              </span>
              <p className="text-[11px] text-slate-500">Generated: {inspection.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Inspection Meta Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Inspecting Officer</span>
            <span className="font-bold text-slate-800">{inspection.inspectorName}</span>
            <span className="text-[10px] text-slate-500 block">{inspection.inspectorDesignation}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Jurisdiction / Zone</span>
            <span className="font-bold text-slate-800">{inspection.inspectorZone}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Audit Determination</span>
            <span className={`font-bold inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] ${
              isCompliant
                ? 'bg-emerald-100 text-emerald-800'
                : inspection.overallStatus.includes('manual') || inspection.overallStatus.includes('identity')
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {inspection.overallStatus}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Compliance Score</span>
            <span className="text-lg font-extrabold font-display text-slate-900">
              {inspection.complianceScore}%
            </span>
          </div>
        </div>

        {/* Product Identity Confirmation & Registry Verification Section */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
            1. Product Identification &amp; Registry Corroboration
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block">Identity Status:</span>
                <span className={`font-bold ${inspection.isIdentityConfirmed ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {inspection.isIdentityConfirmed 
                    ? 'Confirmed by Officer' 
                    : 'Unconfirmed / Manual Verification Protocol'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Online Verification Source:</span>
                <span className="font-semibold text-slate-800">
                  {inspection.onlineVerification?.sourceName || 'No online match found'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Signal Match Confidence:</span>
                <span className="font-mono font-bold text-slate-800">
                  {inspection.identityEvidence?.matchConfidence ?? inspection.onlineVerification?.matchConfidence ?? 0}%
                </span>
              </div>
            </div>

            {inspection.dataConflicts && inspection.dataConflicts.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 space-y-1">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                  Recorded Declaration Conflicts:
                </span>
                {inspection.dataConflicts.map((c, i) => (
                  <p key={i} className="text-[11px] text-rose-800 font-mono">
                    &bull; {(c.field || c.fieldName || 'Declaration').toUpperCase()}: Label shows "{c.labelValue}" vs Registry shows "{c.onlineValue || c.catalogValue}" ({c.explanation})
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Commodity Particulars with Embedded Label Thumbnail */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
            2. Particulars of the Packaged Commodity
          </h2>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-32 h-36 bg-slate-100 rounded-lg border border-slate-300 p-1 flex items-center justify-center shrink-0">
              <img
                src={inspection.labelImage}
                alt={inspection.productName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs flex-1">
              <div>
                <span className="text-slate-500">Commodity Name:</span>
                <p className="font-bold text-slate-900">{inspection.productName}</p>
              </div>
              <div>
                <span className="text-slate-500">Brand / Declared Packer:</span>
                <p className="font-bold text-slate-900">{inspection.brand}</p>
              </div>
              <div>
                <span className="text-slate-500">Commodity Category:</span>
                <p className="font-semibold text-slate-800">{inspection.category}</p>
              </div>
              <div>
                <span className="text-slate-500">Batch / Lot Number:</span>
                <p className="font-mono font-semibold text-slate-800">{inspection.batchNumber || 'Not Indicated'}</p>
              </div>
              <div>
                <span className="text-slate-500">Barcode / EAN-13:</span>
                <p className="font-mono font-semibold text-slate-800">{inspection.barcode || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-500">Verification Engine:</span>
                <p className="font-semibold text-blue-700">PackSURE AI Evidence Engine v3.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Checklist Table: PCR 2011 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Mandatory Declaration Audit Checklist (PCR 2011)
            </h2>
            <div className="text-[11px] text-slate-500 flex items-center gap-3">
              <span>Passed: <strong className="text-emerald-600">{passCount}</strong></span>
              <span>Review: <strong className="text-amber-600">{reviewCount}</strong></span>
              <span>Violations: <strong className="text-rose-600">{violationCount}</strong></span>
            </div>
          </div>

          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2.5 border-r border-slate-200 w-16">Rule</th>
                <th className="p-2.5 border-r border-slate-200 w-44">Declaration Item</th>
                <th className="p-2.5 border-r border-slate-200">Detected Value / Finding</th>
                <th className="p-2.5 text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {inspection.ruleResults.map((r, i) => (
                <tr key={i} className={r.status === 'violation' ? 'bg-rose-50/50' : r.status === 'review' ? 'bg-amber-50/40' : ''}>
                  <td className="p-2.5 border-r border-slate-200 font-mono font-semibold text-[11px]">
                    {r.legalSection}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-medium">
                    {r.title}
                  </td>
                  <td className="p-2.5 border-r border-slate-200">
                    {r.detectedText && (
                      <p className="font-mono text-[11px] text-slate-900 mb-0.5">
                        "{r.detectedText}"
                      </p>
                    )}
                    <p className="text-[11px] text-slate-600">{r.explanation}</p>
                  </td>
                  <td className="p-2.5 text-center whitespace-nowrap font-bold text-[11px]">
                    {r.status === 'pass' && (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        PASS
                      </span>
                    )}
                    {r.status === 'review' && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        REVIEW
                      </span>
                    )}
                    {r.status === 'violation' && (
                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        VIOLATION
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compliance Checklist Table: FSSAI 2020 (Only For Packaged Food) */}
        {isFoodProduct && inspection.fssaiResults && inspection.fssaiResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                <span>4. FSSAI Food Label Audit Checklist (FSS (Labelling &amp; Display) Regulations, 2020)</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Packaged Food Only
              </span>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-emerald-50 text-emerald-900 font-semibold border-b border-emerald-200">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-24">Regulation</th>
                  <th className="p-2.5 border-r border-slate-200 w-44">Declaration</th>
                  <th className="p-2.5 border-r border-slate-200">Extracted Value / Evidence</th>
                  <th className="p-2.5 text-center w-28">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {inspection.fssaiResults.map((f, i) => (
                  <tr key={i} className={f.status === 'violation' ? 'bg-rose-50/50' : f.status === 'review' ? 'bg-amber-50/40' : ''}>
                    <td className="p-2.5 border-r border-slate-200 font-mono font-semibold text-[11px]">
                      {f.regulationRef}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-medium">
                      {f.declaration}
                    </td>
                    <td className="p-2.5 border-r border-slate-200">
                      {f.extractedValue && (
                        <p className="font-mono text-[11px] text-slate-900 mb-0.5">
                          "{f.extractedValue}"
                        </p>
                      )}
                      <p className="text-[11px] text-slate-600">{f.explanation || f.evidence}</p>
                    </td>
                    <td className="p-2.5 text-center whitespace-nowrap font-bold text-[11px]">
                      {f.status === 'pass' && (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          COMPLIANT
                        </span>
                      )}
                      {f.status === 'review' && (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          REVIEW
                        </span>
                      )}
                      {f.status === 'violation' && (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          NON-COMPLIANT
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inspector Remarks & Endorsement Block */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
            {isFoodProduct ? '5' : '4'}. Inspector Endorsement &amp; Compounding Recommendation
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <p className="text-slate-700 italic">
              "{inspection.officerNotes || 'No specific physical discrepancies noted. Package sample retained for standard audit archive.'}"
            </p>
            {inspection.isVerified && (
              <p className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1 pt-1 border-t border-slate-200">
                <Check className="w-3.5 h-3.5" />
                <span>Digitally endorsed by {inspection.inspectorName} on {inspection.timestamp}</span>
              </p>
            )}
          </div>
        </div>

        {/* Signature & Verification Seal Row */}
        <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs text-slate-600">
          <div className="space-y-1">
            <div className="w-16 h-16 bg-slate-100 rounded border border-slate-300 p-1 flex items-center justify-center">
              <QrCode className="w-14 h-14 text-slate-800" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Verify Online: {inspection.id}</p>
          </div>

          <div className="text-right space-y-8">
            <div className="w-48 border-b border-slate-400 pb-1">
              <p className="font-serif italic text-sm text-slate-800">{inspection.inspectorName}</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">{inspection.inspectorName}</p>
              <p className="text-[11px] text-slate-500">{inspection.inspectorDesignation}</p>
              <p className="text-[11px] text-slate-400">Legal Metrology Department</p>
            </div>
          </div>
        </div>

        {/* Statutory Legal Disclaimer */}
        <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed">
          <p>
            <strong>Statutory Disclaimer:</strong> This digital inspection memorandum is generated via PackSURE AI based on evidence-first OCR extraction and configurable statutory rule evaluations under the Legal Metrology (Packaged Commodities) Rules, 2011 and Food Safety &amp; Standards (Labelling and Display) Regulations, 2020. Automated findings represent technical advisory assessments. Official enforcement notices, seizures, or compounding proceedings under Section 36 of the Legal Metrology Act, 2009 require physical verification by authorized gazetted officers.
          </p>
        </div>
      </div>
    </div>
  );
};

