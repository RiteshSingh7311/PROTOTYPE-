import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Printer, 
  X, 
  Copy, 
  Check, 
  Building2, 
  MapPin, 
  Calendar, 
  Scale, 
  AlertTriangle,
  FileWarning
} from 'lucide-react';
import { ConsumerComplaint } from '../../types';

interface NoticeModalProps {
  complaint: ConsumerComplaint;
  onClose: () => void;
  onNoticeIssued?: (id: string) => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  complaint,
  onClose,
  onNoticeIssued
}) => {
  const [copied, setCopied] = useState(false);
  const noticeRef = `NOTICE/LM/LKO/SEC36/2026/${complaint.id.replace(/[^0-9]/g, '').slice(-4) || '4021'}`;
  const noticeDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    if (onNoticeIssued) {
      onNoticeIssued(complaint.id);
    }
    window.print();
  };

  const handleCopyText = () => {
    const text = `GOVERNMENT OF UTTAR PRADESH
OFFICE OF THE INSPECTOR OF LEGAL METROLOGY, LUCKNOW ZONE
REF: ${noticeRef} | DATE: ${noticeDate}

SHOW CAUSE NOTICE UNDER SECTION 36(1) OF THE LEGAL METROLOGY ACT, 2009
READ WITH THE LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011

TO:
The Manager / Proprietor,
${complaint.storeOrPlatform},
${complaint.location}

SUBJECT: Notice for contravention of mandatory packaging and MRP rules regarding product: ${complaint.productName} (${complaint.brand}).

Whereas a formal consumer grievance (Tracking Ref: ${complaint.id}) has been recorded against your establishment for the following statutory contravention:
Violation Type: ${complaint.violationType}
Description of Default: ${complaint.description}

You are hereby directed to SHOW CAUSE in writing within 14 (fourteen) days from the receipt of this notice as to why penal proceedings under Section 36(1) / Section 48 of the Act should not be instituted or why compounding fees up to ₹25,000 should not be levied.

Issued by:
GASLIGHTER
Inspector of Legal Metrology (ILM)
Lucknow Zone, Uttar Pradesh`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span className="font-bold text-xs text-slate-800">
              Statutory Show-Cause Notice &bull; Section 36
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Notice' : 'Copy Notice'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download Notice (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Notice Document */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-slate-50/50 print:p-0 print:bg-white flex-1 print-card">
          <div className="border-2 border-slate-900 p-8 sm:p-10 rounded-2xl bg-white shadow-sm space-y-6">
            {/* Notice Letterhead */}
            <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center font-bold text-xs">
                  UP
                </div>
                <p className="text-xs font-bold tracking-widest text-slate-700 uppercase">
                  GOVERNMENT OF UTTAR PRADESH &bull; DEPARTMENT OF LEGAL METROLOGY
                </p>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                OFFICE OF THE INSPECTOR OF LEGAL METROLOGY &bull; LUCKNOW ZONE
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-rose-900 tracking-tight font-display uppercase pt-1">
                Statutory Show-Cause Notice
              </h1>
              <p className="text-[11px] text-slate-600">
                Under Section 36(1) &amp; Section 15 of the Legal Metrology Act, 2009 read with the Legal Metrology (Packaged Commodities) Rules, 2011
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-slate-200 mt-3 pt-3">
                <span className="font-bold text-slate-900">
                  REF NO: {noticeRef}
                </span>
                <span className="text-slate-500">
                  DATE OF ISSUE: {noticeDate}
                </span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-1 text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">To (Respondent Establishment):</p>
              <p className="font-bold text-sm text-slate-900">{complaint.storeOrPlatform}</p>
              <p className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{complaint.location}</span>
              </p>
            </div>

            {/* Subject & Facts */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              <p className="font-bold text-slate-900 text-xs uppercase bg-rose-50 p-2 rounded border border-rose-200">
                SUBJECT: Notice for contravention of Rule 6 &amp; Rule 18 regarding pre-packaged commodity: {complaint.productName} ({complaint.brand})
              </p>

              <p>
                <strong>1. WHEREAS</strong>, pursuant to citizen market surveillance and consumer grievance lodged under Reference ID: <strong>{complaint.id}</strong>, it has been reported to this Authority that your commercial establishment has offered for sale or distributed the pre-packaged commodity <strong>{complaint.productName}</strong> in violation of statutory requirements.
              </p>

              <p>
                <strong>2. PARTICULARS OF ALLEGED CONTRAVENTION:</strong>
              </p>
              <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200/80 text-xs space-y-1 font-mono text-slate-800">
                <p><strong>Specific Default:</strong> {complaint.violationType}</p>
                <p><strong>Evidentiary Grounds:</strong> &quot;{complaint.description}&quot;</p>
                <p><strong>Statutory Rule:</strong> Rule 6(1)(c) / Rule 6(1)(f) / Rule 18(2) of the Legal Metrology (Packaged Commodities) Rules, 2011.</p>
              </div>

              <p>
                <strong>3. LEGAL LIABILITY &amp; PENALTIES:</strong><br />
                Contravention of the aforesaid provisions is an offence punishable under <strong>Section 36(1) of the Legal Metrology Act, 2009</strong>, attracting compounding penalty up to <strong>₹25,000/-</strong> for the first offence, and imprisonment with fine up to <strong>₹50,000/-</strong> for subsequent offences.
              </p>

              <p>
                <strong>4. FOURTEEN (14) DAYS SUMMONS TO SHOW CAUSE:</strong><br />
                You are hereby summoned to show cause in writing or appear in person before the undersigned at the <strong>Office of the Inspector of Legal Metrology, Collectorate Campus, Lucknow</strong> within <strong>14 (fourteen) calendar days</strong> from the receipt of this notice, failing which ex-parte compounding or judicial prosecution shall be instituted before the Court of Chief Judicial Magistrate, Lucknow.
              </p>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 items-end text-xs">
              {/* Official Seal */}
              <div className="space-y-2">
                <div className="w-24 h-24 rounded-full border-2 border-rose-900 border-dashed p-1 flex flex-col items-center justify-center text-rose-950 text-[9px] font-bold uppercase leading-tight text-center">
                  <span>OFFICIAL</span>
                  <span>ENFORCEMENT</span>
                  <span>★ LKO ZONE ★</span>
                  <span>LEGAL METROLOGY</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Assigned Officer: {complaint.assignedOfficer}</p>
              </div>

              {/* Officer Signature */}
              <div className="text-right space-y-1">
                <div className="h-10 flex items-end justify-end">
                  <span className="font-display font-bold text-rose-900 text-lg italic tracking-wider">
                    Gaslighter
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-bold text-slate-900">GASLIGHTER</p>
                  <p className="text-[11px] text-slate-600">Inspector of Legal Metrology (ILM)</p>
                  <p className="text-[10px] text-slate-400">Lucknow Zone &bull; Uttar Pradesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
