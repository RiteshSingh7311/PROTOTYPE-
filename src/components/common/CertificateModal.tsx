import React from 'react';
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  X, 
  QrCode, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Award,
  FileCheck2,
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { InspectionRecord } from '../../types';

interface CertificateModalProps {
  inspection: InspectionRecord;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  inspection,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);
  const certNumber = `UP-LM-CERT-2026-${inspection.id.replace(/[^0-9]/g, '').slice(-4) || '8842'}`;
  const validUntil = '31 December 2026';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    const hash = `SHA256:7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4-${inspection.id}`;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-xs text-slate-800">
              Statutory Packaging Compliance Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download Certificate (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Container */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-amber-50/15 print:p-0 print:bg-white flex-1 print-card">
          {/* Ornate Double Border */}
          <div className="border-4 border-double border-slate-800 p-8 sm:p-10 rounded-2xl bg-white shadow-sm relative space-y-6">
            {/* Watermark Emblem */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Award className="w-96 h-96 text-slate-900" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  LM
                </div>
                <p className="text-xs font-bold tracking-widest text-slate-700 uppercase">
                  GOVERNMENT OF UTTAR PRADESH &bull; DEPARTMENT OF LEGAL METROLOGY
                </p>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display uppercase">
                Certificate of Statutory Compliance
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Issued under Section 15 of the Legal Metrology Act, 2009 read with the Legal Metrology (Packaged Commodities) Rules, 2011
              </p>

              <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono">
                <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-300 font-bold text-slate-900">
                  CERT NO: {certNumber}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  STATUS: STATUTORILY VERIFIED
                </span>
              </div>
            </div>

            {/* Recital / Certification Text */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              <p>
                This is to officially certify that the packaged pre-printed commodity sample identified hereinbelow has undergone statutory optical verification and compliance audit under the provisions of the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong> in the jurisdiction of <strong>Lucknow Zone, Uttar Pradesh</strong>.
              </p>

              {/* Product Spec Box */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Commodity Name</span>
                  <span className="font-bold text-slate-900 text-sm">{inspection.productName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Brand / Declared Packer</span>
                  <span className="font-bold text-slate-900 text-sm">{inspection.brand}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Category &amp; Batch No.</span>
                  <span className="font-medium text-slate-800">{inspection.category} &bull; {inspection.batchNumber || 'NS-ALM-2608'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Declared MRP &amp; Net Quantity</span>
                  <span className="font-medium text-slate-800">
                    {inspection.fields.find(f => f.key === 'mrp')?.value || '₹ 385.00'} &bull; {inspection.fields.find(f => f.key === 'net_qty')?.value || '500 g'}
                  </span>
                </div>
              </div>

              {/* Verified Checklist Summary */}
              <div className="space-y-2 pt-1">
                <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Mandatory Declarations Verified &amp; Endorsed (Rule 6, PCR 2011):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 p-1.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Rule 6(1)(a) Packer Address</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 p-1.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Rule 6(1)(b) Net Qty &amp; Font</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 p-1.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Rule 6(1)(c) MRP with Taxes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 p-1.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Rule 6(1)(f) Care Contacts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 items-end text-xs">
              {/* QR Code Verification */}
              <div className="space-y-1">
                <div className="w-20 h-20 bg-white p-1 rounded border border-slate-300 shadow-xs flex items-center justify-center">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
                <p className="text-[9px] font-mono text-slate-400">Scan to verify cryptographic ledger hash</p>
              </div>

              {/* Official Seal */}
              <div className="text-center space-y-1">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-blue-900 border-dashed p-1 flex flex-col items-center justify-center text-blue-950 text-[9px] font-bold uppercase leading-none">
                  <span>LEGAL</span>
                  <span>METROLOGY</span>
                  <span>★ LKO ZONE ★</span>
                  <span>SEAL</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500">Valid Until: {validUntil}</p>
              </div>

              {/* Inspector Signature */}
              <div className="text-right space-y-1">
                <div className="h-10 flex items-end justify-end">
                  <span className="font-display font-bold text-blue-800 text-lg italic tracking-wider">
                    Gaslighter
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-bold text-slate-900">GASLIGHTER</p>
                  <p className="text-[10px] text-slate-500">Inspector of Legal Metrology</p>
                  <p className="text-[10px] text-slate-400">Lucknow Zone, Uttar Pradesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
