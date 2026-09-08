import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Edit3, 
  Save, 
  X, 
  Sparkles, 
  HelpCircle,
  Eye,
  RefreshCw,
  Info,
  Scale,
  Globe,
  ExternalLink,
  ShieldCheck,
  AlertOctagon,
  FileSearch,
  Layers
} from 'lucide-react';
import { DeclarationField, InspectionRecord, OnlineVerificationResult } from '../../types';

interface ExtractedDataViewProps {
  inspection: InspectionRecord;
  onUpdateField: (fieldId: string, newValue: string) => void;
  onNavigateToEvidence: (fieldId?: string) => void;
  onNavigateToResults: () => void;
}

export const ExtractedDataView: React.FC<ExtractedDataViewProps> = ({
  inspection,
  onUpdateField,
  onNavigateToEvidence,
  onNavigateToResults
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'label' | 'online'>('all');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const startEdit = (field: DeclarationField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
  };

  const cancelEdit = () => {
    setEditingFieldId(null);
    setEditValue('');
  };

  const handleSaveEdit = (fieldId: string) => {
    onUpdateField(fieldId, editValue);
    setEditingFieldId(null);
  };

  const evidence = inspection.identityEvidence;
  const online = inspection.onlineVerification;

  // Extract primary signals from fields if not directly on evidence
  const brandVal = evidence?.detectedBrand || 
    inspection.fields.find(f => f.key === 'brand' || f.key === 'manufacturer_name')?.value || 
    inspection.brand;
  const productVal = evidence?.detectedProductName || 
    inspection.fields.find(f => f.key === 'generic_name' || f.key === 'commodity_name')?.value || 
    inspection.productName;
  const mrpVal = evidence?.detectedMRP || 
    inspection.fields.find(f => f.key === 'mrp' || f.key === 'retail_sale_price')?.value || 
    'Not detected';
  const netQtyVal = evidence?.detectedNetQuantity || 
    inspection.fields.find(f => f.key === 'net_quantity')?.value || 
    'Not detected';
  const mfrVal = evidence?.detectedManufacturer || 
    inspection.fields.find(f => f.key === 'manufacturer_address' || f.key === 'packer_address')?.value || 
    'Not detected';
  const barcodeVal = evidence?.detectedBarcode || inspection.barcode || 'N/A';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evidence-First Product Extraction &amp; Verification</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Label Extraction &amp; Cross-Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical label OCR detections are preserved as statutory ground truth. Online registry data provides secondary cross-check.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToEvidence()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            Open Evidence Viewer
          </button>
          <button
            onClick={onNavigateToResults}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Proceed to Compliance Audit
          </button>
        </div>
      </div>

      {/* Navigation View Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Complete Overview (Side-by-Side)</span>
        </button>

        <button
          onClick={() => setActiveTab('label')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'label'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSearch className="w-3.5 h-3.5" />
          <span>Section A: Extracted from Label</span>
        </button>

        <button
          onClick={() => setActiveTab('online')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'online'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Section B: Online Verification</span>
        </button>
      </div>

      {/* SECTION A: EXTRACTED FROM UPLOADED LABEL */}
      {(activeTab === 'all' || activeTab === 'label') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Section A: Extracted from Uploaded Label
              </h2>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                Primary Ground Truth
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Raw OCR text and declarations detected on physical packaging
            </p>
          </div>

          {/* Quick Signal Summary Box */}
          <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected Brand</span>
              <p className="text-xs font-bold text-slate-900 truncate mt-0.5" title={brandVal}>
                {brandVal}
              </p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected Product</span>
              <p className="text-xs font-bold text-slate-900 truncate mt-0.5" title={productVal}>
                {productVal}
              </p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected MRP</span>
              <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                {mrpVal}
              </p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected Net Qty</span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                {netQtyVal}
              </p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Barcode / GTIN</span>
              <p className="text-xs font-mono text-slate-700 mt-0.5 truncate">
                {barcodeVal}
              </p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected Mfr</span>
              <p className="text-xs font-semibold text-slate-800 truncate mt-0.5" title={mfrVal}>
                {mfrVal}
              </p>
            </div>
          </div>

          {/* Full Declarations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspection.fields.map((field) => {
              const isEditing = editingFieldId === field.id;

              return (
                <div
                  key={field.id}
                  className={`bg-white rounded-xl p-5 border transition-all shadow-card space-y-3 ${
                    field.status === 'violation'
                      ? 'border-rose-200 ring-1 ring-rose-200/50'
                      : field.status === 'review'
                      ? 'border-amber-200 ring-1 ring-amber-200/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-display">
                          {field.label}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {field.ruleReference}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Field Key: <code className="text-slate-500 font-mono">{field.key}</code>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        field.status === 'pass'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : field.status === 'review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {field.status === 'pass' && <CheckCircle2 className="w-3 h-3" />}
                        {field.status === 'review' && <AlertTriangle className="w-3 h-3" />}
                        {field.status === 'violation' && <XCircle className="w-3 h-3" />}
                        <span className="capitalize">{field.status}</span>
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">
                        Confidence: <strong className="text-slate-700">{field.confidence}%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={3}
                          className="w-full text-xs p-2 rounded border border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono bg-white text-slate-800"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(field.id)}
                            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded flex items-center gap-1 shadow-sm"
                          >
                            <Save className="w-3 h-3" />
                            Save Correction
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-mono font-medium text-slate-900 break-words leading-relaxed">
                          {field.value}
                        </p>
                        {field.isEdited && (
                          <span className="inline-block mt-1 text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                            Edited by Officer
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 flex items-start gap-1.5 pt-1">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{field.statusExplanation}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => onNavigateToEvidence(field.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Highlight on Label</span>
                    </button>

                    {!isEditing && (
                      <button
                        onClick={() => startEdit(field)}
                        className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Value</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION B: ONLINE VERIFICATION */}
      {(activeTab === 'all' || activeTab === 'online') && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Section B: Online Verification &amp; Registry Cross-Check
              </h2>
              <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                Secondary Corroboration
              </span>
            </div>
            {online?.isMockData && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Demo verification data (mock service)
              </span>
            )}
          </div>

          {online ? (
            <div className="bg-white rounded-xl border border-indigo-100 shadow-card p-6 space-y-5">
              {/* Online Registry Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-slate-900">{online.sourceName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      online.status === 'Verified from source'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : online.status === 'Partially matched'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : online.status === 'Conflicting information'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : online.status === 'Manual verification required'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {online.status}
                    </span>
                  </div>
                  {online.sourceUrl && (
                    <a
                      href={online.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-mono break-all"
                    >
                      <span>{online.sourceUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  )}
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3.5 py-2 text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 block">Match Confidence</span>
                  <span className="text-lg font-extrabold text-indigo-950 font-display">
                    {online.matchConfidence}%
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison Table: Label (Ground Truth) vs Online Match */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Multi-Signal Field Corroboration</span>
                  <span>* Physical label is authoritative under Legal Metrology Rules</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3 border-r border-slate-200 w-36">Field</th>
                        <th className="p-3 border-r border-slate-200 bg-blue-50/50 text-blue-900">
                          Detected from Label (Ground Truth)
                        </th>
                        <th className="p-3 border-r border-slate-200 bg-indigo-50/50 text-indigo-900">
                          Matched Online Registry
                        </th>
                        <th className="p-3 text-center w-28">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {/* Product Name */}
                      <tr>
                        <td className="p-3 font-semibold border-r border-slate-200">Product Name</td>
                        <td className="p-3 border-r border-slate-200 font-medium">{productVal}</td>
                        <td className="p-3 border-r border-slate-200 text-slate-700">{online.matchedProductName || 'Not matched'}</td>
                        <td className="p-3 text-center">
                          {online.matchedProductName ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">Match</span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Unverified</span>
                          )}
                        </td>
                      </tr>

                      {/* Brand */}
                      <tr>
                        <td className="p-3 font-semibold border-r border-slate-200">Brand Name</td>
                        <td className="p-3 border-r border-slate-200 font-medium">{brandVal}</td>
                        <td className="p-3 border-r border-slate-200 text-slate-700">{online.matchedBrand || 'Not matched'}</td>
                        <td className="p-3 text-center">
                          {online.matchedBrand ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">Match</span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Unverified</span>
                          )}
                        </td>
                      </tr>

                      {/* Manufacturer */}
                      <tr>
                        <td className="p-3 font-semibold border-r border-slate-200">Manufacturer</td>
                        <td className="p-3 border-r border-slate-200 font-medium">{mfrVal}</td>
                        <td className="p-3 border-r border-slate-200 text-slate-700">{online.matchedManufacturer || 'Not matched'}</td>
                        <td className="p-3 text-center">
                          {online.matchedManufacturer ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">Match</span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Unverified</span>
                          )}
                        </td>
                      </tr>

                      {/* MRP */}
                      <tr className={online.matchedMRP && mrpVal !== 'Not detected' && !online.matchedMRP.includes(mrpVal.replace(/[^0-9]/g, '')) ? 'bg-rose-50/40' : ''}>
                        <td className="p-3 font-semibold border-r border-slate-200">MRP (Retail Price)</td>
                        <td className="p-3 border-r border-slate-200 font-mono font-bold text-slate-900">{mrpVal}</td>
                        <td className="p-3 border-r border-slate-200 font-mono text-slate-700">{online.matchedMRP || 'Not listed'}</td>
                        <td className="p-3 text-center">
                          {online.matchedMRP && mrpVal !== 'Not detected' ? (
                            online.matchedMRP.includes(mrpVal.replace(/[^0-9]/g, '')) ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">Match</span>
                            ) : (
                              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-bold border border-rose-200">Conflict</span>
                            )
                          ) : (
                            <span className="text-slate-400 text-[11px]">N/A</span>
                          )}
                        </td>
                      </tr>

                      {/* Net Quantity */}
                      <tr>
                        <td className="p-3 font-semibold border-r border-slate-200">Net Quantity</td>
                        <td className="p-3 border-r border-slate-200 font-mono font-bold text-slate-900">{netQtyVal}</td>
                        <td className="p-3 border-r border-slate-200 font-mono text-slate-700">{online.matchedNetQuantity || 'Not listed'}</td>
                        <td className="p-3 text-center">
                          {online.matchedNetQuantity && netQtyVal !== 'Not detected' ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">Match</span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">N/A</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conflict details or explanatory notes */}
              {online.conflicts && online.conflicts.length > 0 ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Cross-Verification Discrepancies Noted:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-rose-700 pl-1">
                    {online.conflicts.map((c, i) => (
                      <li key={i}>
                        {typeof c === 'string' ? c : `${(c.field || c.fieldName || 'Discrepancy')}: ${c.explanation}`}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-rose-600 italic pt-1">
                    * The Legal Metrology enforcement inspector must examine the physical packaging to confirm the stamped declaration.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    No silent replacement occurred. OCR declarations extracted in Section A are preserved independently and will govern the statutory Legal Metrology inspection check.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="text-sm font-bold text-amber-900">
                Could not confidently identify this product. Please verify the details manually.
              </h3>
              <p className="text-xs text-amber-700 max-w-lg mx-auto">
                No reliable catalog or online match was returned for the extracted label signals.
                Inspection continues under standard provisional manual verification protocol.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

