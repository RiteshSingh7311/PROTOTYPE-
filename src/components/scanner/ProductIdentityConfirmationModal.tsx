import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  RefreshCw, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  QrCode, 
  Building2, 
  Tag, 
  Scale, 
  Search,
  ArrowRight,
  AlertOctagon,
  Eye
} from 'lucide-react';
import { 
  ProductIdentityEvidence, 
  OnlineVerificationResult, 
  DataConflict, 
  VerificationStatus 
} from '../../types';

interface ProductIdentityConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: ProductIdentityEvidence;
  onlineVerification?: OnlineVerificationResult;
  conflicts: DataConflict[];
  labelImage: string;
  category: string;
  onConfirm: () => void;
  onContinueWithoutVerification: () => void;
  onSearchAgain: () => Promise<void> | void;
  onUpdateEvidence: (updated: ProductIdentityEvidence) => void;
  isSearchingAgain?: boolean;
}

export const ProductIdentityConfirmationModal: React.FC<ProductIdentityConfirmationModalProps> = ({
  isOpen,
  onClose,
  evidence,
  onlineVerification,
  conflicts,
  labelImage,
  category,
  onConfirm,
  onContinueWithoutVerification,
  onSearchAgain,
  onUpdateEvidence,
  isSearchingAgain = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBrand, setEditBrand] = useState(evidence.detectedBrand || '');
  const [editName, setEditName] = useState(evidence.detectedProductName || '');
  const [editMfg, setEditMfg] = useState(evidence.detectedManufacturer || '');
  const [editBarcode, setEditBarcode] = useState(evidence.detectedBarcode || '');
  const [editNetQty, setEditNetQty] = useState(evidence.detectedNetQuantity || '');
  const [editMrp, setEditMrp] = useState(evidence.detectedMRP || '');

  if (!isOpen) return null;

  const isLowConfidence = (onlineVerification?.matchConfidence || 0) < 50 || 
    (evidence.brandConfidence || 0) < 40 || 
    evidence.detectedBrand.toLowerCase().includes('unknown');

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProductIdentityEvidence = {
      ...evidence,
      detectedBrand: editBrand.trim() || 'Unknown',
      brandConfidence: editBrand.trim() ? 90 : 15,
      detectedProductName: editName.trim() || 'Unidentified Commodity',
      productNameConfidence: editName.trim() ? 90 : 20,
      detectedManufacturer: editMfg.trim() || 'Not Stated',
      manufacturerConfidence: editMfg.trim() ? 88 : 15,
      detectedBarcode: editBarcode.trim(),
      barcodeConfidence: editBarcode.trim() ? 95 : 0,
      detectedNetQuantity: editNetQty.trim() || 'Not Detected',
      netQuantityConfidence: editNetQty.trim() ? 90 : 20,
      detectedMRP: editMrp.trim() || 'Not Detected',
      mrpConfidence: editMrp.trim() ? 90 : 15,
      isIdentityConfirmed: true,
      confirmationStatus: 'confirmed',
      matchingSignalsCount: [editBrand, editName, editMfg, editBarcode, editNetQty].filter(v => Boolean(v && v !== 'Unknown')).length
    };
    onUpdateEvidence(updated);
    setIsEditing(false);
  };

  const getStatusBadge = (status?: VerificationStatus) => {
    switch (status) {
      case 'Verified from source':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified from source
          </span>
        );
      case 'Partially matched':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3.5 h-3.5" />
            Partially matched
          </span>
        );
      case 'Conflicting information':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Conflicting information
          </span>
        );
      case 'Not found':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Not found
          </span>
        );
      case 'Manual verification required':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertOctagon className="w-3.5 h-3.5" />
            Manual verification required
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider bg-blue-600 text-white">
                Step 3 of Inspection Lifecycle
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-300 font-medium">Evidence-First Product Verification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-white flex items-center gap-2">
              <span>Is this the correct product?</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Legal Metrology inspection protocol requires confirmed product identification before statutory compliance analysis. 
              Review OCR label evidence and online registry cross-checks below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Cancel & Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 flex-1 bg-slate-50/50">
          
          {/* Top Status Alert if Identity is Uncertain */}
          {isLowConfidence ? (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-amber-950">Product Identity Not Confirmed</span>
                  <span className="bg-amber-200/70 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    Manual Verification Required
                  </span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Could not confidently identify this product. Multiple matching signals (Brand, Barcode, Manufacturer) are incomplete or torn on the uploaded label. 
                  You can edit the details manually, search again, or continue with an explicit unconfirmed identity warning.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950">High-Confidence Optical Identity Detected</span>
                  <p className="text-emerald-700 text-[11px]">
                    Matched across {evidence.matchingSignalsCount || 4}+ signals with high visual confidence.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                Confidence: {onlineVerification?.matchConfidence || 95}%
              </span>
            </div>
          )}

          {/* Conflicting Information Alert (if any) */}
          {conflicts && conflicts.length > 0 && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-950 space-y-2 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-bold text-xs uppercase tracking-wide text-rose-900">
                  Conflicting Information Detected ({conflicts.length} Discrepancies)
                </span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                Notice: Physical label values differ from the online registry. 
                <strong> The physical label remains the primary legal evidence for PCR 2011 inspections.</strong> 
                Online data is supporting verification only.
              </p>
              <div className="divide-y divide-rose-200/60 pt-1 text-xs">
                {conflicts.map((c, i) => (
                  <div key={i} className="py-1.5 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-rose-900">{c.fieldName}:</span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="bg-white text-slate-800 px-2 py-0.5 rounded border border-rose-200">
                        Label OCR: <strong>{c.labelValue}</strong>
                      </span>
                      <span className="text-rose-400">&ne;</span>
                      <span className="bg-white text-slate-800 px-2 py-0.5 rounded border border-rose-200">
                        Online Catalog: <strong>{c.catalogValue}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dual Evidence Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* CARD 1: PRODUCT IDENTITY (EXTRACTED FROM UPLOADED LABEL) */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">A</span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
                      Extracted from Uploaded Label
                    </h3>
                    <span className="text-[10px] text-slate-400 block">OCR / Vision Ground Truth</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Primary Evidence
                </span>
              </div>

              {/* Thumbnail + Core Product Details */}
              <div className="flex items-start gap-3.5">
                <div className="w-20 h-24 bg-slate-50 rounded-lg border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={labelImage}
                    alt="Label Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="space-y-1.5 flex-1 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Detected Commodity Name:</span>
                    <p className="font-bold text-slate-900 leading-snug break-words">
                      {evidence.detectedProductName}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Detected Brand:</span>
                    <p className="font-semibold text-slate-800">
                      {evidence.detectedBrand}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Category:</span>
                    <span className="inline-block bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-semibold ml-1">
                      {category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Fields Table */}
              <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-start justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Manufacturer / Packer:</span>
                  <span className="font-medium text-slate-800 text-right text-[11px] max-w-[240px] break-words">
                    {evidence.detectedManufacturer || 'Not Detected'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Barcode / GTIN:</span>
                  <span className="font-mono text-slate-800 text-[11px] font-semibold">
                    {evidence.detectedBarcode || <span className="text-slate-400 italic">None visible</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Net Quantity (OCR):</span>
                  <span className="font-mono text-slate-800 text-[11px] font-bold">
                    {evidence.detectedNetQuantity || 'Not Detected'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Maximum Retail Price (OCR):</span>
                  <span className="font-mono text-slate-900 text-[11px] font-extrabold text-emerald-700">
                    {evidence.detectedMRP || 'Not Detected'}
                  </span>
                </div>
                {evidence.detectedFSSAI && (
                  <div className="flex items-center justify-between gap-2 py-1">
                    <span className="text-slate-500 text-[11px]">FSSAI License No.:</span>
                    <span className="font-mono text-blue-700 text-[11px] font-bold">
                      {evidence.detectedFSSAI}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: ONLINE VERIFICATION & REGISTRY CROSS-CHECK */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">B</span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
                      Online Verification
                    </h3>
                    <span className="text-[10px] text-slate-400 block">Registry &amp; Catalog Matching Service</span>
                  </div>
                </div>
                {getStatusBadge(onlineVerification?.verificationStatus)}
              </div>

              {/* Service Disclaimer Badge */}
              <div className="bg-slate-100 rounded-lg p-2.5 border border-slate-200 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">
                    {onlineVerification?.sourceName || 'Product Verification Service'}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    Live Indian FMCG Registry (Open Food Facts &amp; FSSAI)
                  </span>
                </div>
                {onlineVerification?.sourceUrl && (
                  <p className="text-[10px] text-blue-600 truncate flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>{onlineVerification.sourceUrl}</span>
                  </p>
                )}
              </div>

              {/* Matched Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Matched Product Name:</span>
                  <span className="font-bold text-slate-900 text-right text-[11px]">
                    {onlineVerification?.matchedProductName || 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Matched Brand:</span>
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {onlineVerification?.matchedBrand || 'None'}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Matched Manufacturer:</span>
                  <span className="font-medium text-slate-700 text-right text-[11px] max-w-[240px] break-words">
                    {onlineVerification?.matchedManufacturer || 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Matched MRP:</span>
                  <span className="font-mono text-slate-800 text-[11px] font-semibold">
                    {onlineVerification?.matchedMRP || 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span className="text-slate-500 text-[11px]">Matched Net Quantity:</span>
                  <span className="font-mono text-slate-800 text-[11px] font-semibold">
                    {onlineVerification?.matchedNetQuantity || 'None'}
                  </span>
                </div>
              </div>

              {/* Match Confidence Bar */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 text-[11px]">Multi-Signal Confidence:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {onlineVerification?.matchConfidence || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (onlineVerification?.matchConfidence || 0) >= 80
                        ? 'bg-emerald-500'
                        : (onlineVerification?.matchConfidence || 0) >= 50
                        ? 'bg-blue-500'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${onlineVerification?.matchConfidence || 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug pt-1">
                  {onlineVerification?.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* EDIT DETAILS FORM (Collapsible) */}
          {isEditing && (
            <form onSubmit={handleSaveEdit} className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Manual Product Identity Correction</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Product / Commodity Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    placeholder="Enter full product name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    placeholder="Enter brand or marketing entity"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Manufacturer / Packer / Importer Address</label>
                  <input
                    type="text"
                    value={editMfg}
                    onChange={(e) => setEditMfg(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    placeholder="Premises address, city, state, PIN code"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Barcode / GTIN</label>
                  <input
                    type="text"
                    value={editBarcode}
                    onChange={(e) => setEditBarcode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                    placeholder="EAN-13 / UPC / GTIN"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Net Quantity</label>
                  <input
                    type="text"
                    value={editNetQty}
                    onChange={(e) => setEditNetQty(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                    placeholder="e.g. 500 g or 250 ml"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Maximum Retail Price (MRP)</label>
                  <input
                    type="text"
                    value={editMrp}
                    onChange={(e) => setEditMrp(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                    placeholder="e.g. ₹ 385.00"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Corrected Details</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Details</span>
              </button>
            )}

            <button
              onClick={onSearchAgain}
              disabled={isSearchingAgain}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSearchingAgain ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isSearchingAgain ? 'Searching...' : 'Search Again'}</span>
            </button>

            <button
              onClick={onContinueWithoutVerification}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Proceed to compliance checks without confirmed identity (Will be flagged in audit)"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Continue Without Online Verification</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Product &amp; Analyze</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
