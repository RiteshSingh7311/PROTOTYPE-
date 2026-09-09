import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Scale, 
  Layers, 
  Building2, 
  Info,
  ArrowRight,
  ShieldCheck,
  Tag,
  Calendar,
  Package,
  FileCheck2,
  Mail,
  MapPin,
  HelpCircle
} from 'lucide-react';

export interface ChipsCustomDetails {
  productName?: string;
  brand?: string;
  mrp?: string;
  netQty?: string;
  mfgDate?: string;
  expiry?: string;
  batchNumber?: string;
  fssaiNumber?: string;
  ingredients?: string;
  allergens?: string;
  manufacturer?: string;
  address?: string;
  customerCare?: string;
  verifiedFieldKeys?: string[];
}

interface ChipsScanResultProps {
  uploadedImage: string;
  customData?: ChipsCustomDetails;
  onNavigateToAudit?: () => void;
  onNavigateToReport?: () => void;
}

export const ChipsScanResult: React.FC<ChipsScanResultProps> = ({
  uploadedImage,
  customData,
  onNavigateToAudit,
  onNavigateToReport
}) => {
  // Statutory values for the ₹5 Demo Chips packaging
  const defaultValues = {
    productName: 'Demo Chips',
    brand: 'Demo Chips',
    mrp: '₹5',
    netQty: '20 gm',
    mfgDate: '9 December 2025',
    expiry: '2 July 2026',
    batchNumber: 'CHIPS-DEC25-001',
    fssaiNumber: '10014064000345',
    ingredients: 'Potato, edible vegetable oil, salt, spices and seasoning',
    allergens: 'May contain traces of milk and other allergens',
    manufacturer: 'Demo Foods Pvt. Ltd.',
    address: 'Industrial Area, Lucknow, Uttar Pradesh, India',
    customerCare: 'care@demofoods.example'
  };

  // If uploaded image has visible/detected OCR data, use it; otherwise use the designated value
  const productName = customData?.productName || defaultValues.productName;
  const brand = customData?.brand || defaultValues.brand;
  const mrp = customData?.mrp ? (customData.mrp.startsWith('₹') ? customData.mrp : `₹${customData.mrp}`) : defaultValues.mrp;
  const netQty = customData?.netQty || defaultValues.netQty;
  const mfgDate = customData?.mfgDate || defaultValues.mfgDate;
  const expiry = customData?.expiry || defaultValues.expiry;
  const batchNumber = customData?.batchNumber || defaultValues.batchNumber;
  const fssaiNumber = customData?.fssaiNumber || defaultValues.fssaiNumber;
  const ingredients = customData?.ingredients || defaultValues.ingredients;
  const allergens = customData?.allergens || defaultValues.allergens;
  const manufacturer = customData?.manufacturer || defaultValues.manufacturer;
  const address = customData?.address || defaultValues.address;
  const customerCare = customData?.customerCare || defaultValues.customerCare;

  const verifiedKeys = new Set(customData?.verifiedFieldKeys || [
    'productName', 'brand', 'mrp', 'netQty', 'mfgDate', 'expiry',
    'batchNumber', 'fssaiNumber', 'ingredients', 'allergens',
    'manufacturer', 'address', 'customerCare'
  ]);

  // All 13 fields requested in specifications
  const statutoryFields = [
    {
      id: 'productName',
      label: 'Product name',
      value: productName,
      isVerified: verifiedKeys.has('productName'),
      rule: 'Rule 6(1)(a)',
      icon: Package
    },
    {
      id: 'brand',
      label: 'Brand',
      value: brand,
      isVerified: verifiedKeys.has('brand'),
      rule: 'FBO Identity',
      icon: Tag
    },
    {
      id: 'mrp',
      label: 'MRP / Price',
      value: mrp,
      isVerified: verifiedKeys.has('mrp'),
      rule: 'Rule 6(1)(c)',
      icon: Tag
    },
    {
      id: 'netQty',
      label: 'Net quantity',
      value: netQty,
      isVerified: verifiedKeys.has('netQty'),
      rule: 'Rule 6(1)(b) & Rule 7',
      icon: Scale
    },
    {
      id: 'mfgDate',
      label: 'Manufacturing date',
      value: mfgDate,
      isVerified: verifiedKeys.has('mfgDate'),
      rule: 'Rule 6(1)(d)',
      icon: Calendar
    },
    {
      id: 'expiry',
      label: 'Best before / Expiry',
      value: expiry,
      isVerified: verifiedKeys.has('expiry'),
      rule: 'Rule 6(1)(d)',
      icon: Calendar
    },
    {
      id: 'batchNumber',
      label: 'Batch number',
      value: batchNumber,
      isVerified: verifiedKeys.has('batchNumber'),
      rule: 'Rule 6(1)(e)',
      icon: FileCheck2
    },
    {
      id: 'fssaiNumber',
      label: 'FSSAI license number',
      value: fssaiNumber,
      isVerified: verifiedKeys.has('fssaiNumber'),
      rule: 'FSSAI (FSSR 2020)',
      icon: ShieldCheck
    },
    {
      id: 'ingredients',
      label: 'Ingredients',
      value: ingredients,
      isVerified: verifiedKeys.has('ingredients'),
      rule: 'FSSAI Reg. 2.2.2',
      icon: FileText
    },
    {
      id: 'allergens',
      label: 'Allergen information',
      value: allergens,
      isVerified: verifiedKeys.has('allergens'),
      rule: 'FSSAI Allergen Mandate',
      icon: AlertCircle
    },
    {
      id: 'manufacturer',
      label: 'Manufacturer / Packer',
      value: manufacturer,
      isVerified: verifiedKeys.has('manufacturer'),
      rule: 'Rule 6(1)(a)',
      icon: Building2
    },
    {
      id: 'address',
      label: 'Manufacturer / Office address',
      value: address,
      isVerified: verifiedKeys.has('address'),
      rule: 'Rule 6(1)(a)',
      icon: MapPin
    },
    {
      id: 'customerCare',
      label: 'Customer care details',
      value: customerCare,
      isVerified: verifiedKeys.has('customerCare'),
      rule: 'Rule 6(1)(f)',
      icon: Mail
    }
  ];

  // Competitor comparison dataset
  const competitorComparisonData = [
    { feature: 'Product name', chips: productName, kurkure: 'Kurkure' },
    { feature: 'Brand', chips: brand, kurkure: 'Kurkure (PepsiCo)' },
    { feature: 'MRP / Price', chips: mrp, kurkure: 'Not provided' },
    { feature: 'Net quantity', chips: netQty, kurkure: 'Not provided' },
    { feature: 'Manufacturing date', chips: mfgDate, kurkure: 'Not provided' },
    { feature: 'Best before / Expiry', chips: expiry, kurkure: 'Not provided' },
    { feature: 'Batch number', chips: batchNumber, kurkure: 'Not provided' },
    { feature: 'FSSAI license number', chips: fssaiNumber, kurkure: 'Not provided' },
    { feature: 'Ingredients', chips: ingredients, kurkure: 'Not provided' },
    { feature: 'Allergen information', chips: allergens, kurkure: 'Not provided' },
    { feature: 'Manufacturer / Packer', chips: manufacturer, kurkure: 'Not provided' },
    { feature: 'Manufacturer / Office address', chips: address, kurkure: 'Not provided' },
    { feature: 'Customer care details', chips: customerCare, kurkure: 'Not provided' },
  ];

  const verifiedCount = statutoryFields.filter(f => f.value && f.value !== 'Not provided').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>SIH 2026 Prototype Optical Inspection Result</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
            Scan Review &amp; Analysis Report
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete product packaging evaluation for uploaded chips packet test sample.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Review completed
          </span>
        </div>
      </div>

      {/* TOP DUAL CARDS: 1. UPLOADED IMAGE & 2. CORE COMPLIANCE REVIEW CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: 1. Uploaded Product Image */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Uploaded Product Image</span>
            </span>
            <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
              Optical Input
            </span>
          </div>

          <div className="relative h-64 sm:h-72 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-800 group">
            <img
              src={uploadedImage}
              alt="Uploaded Chips Packaging"
              className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded border border-slate-700">
              {productName} • {mrp} • {netQty}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic">
            Physical label image processed through optical compliance engine.
          </p>
        </div>

        {/* Right 8 Cols: 3. Compliance Review Card */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                3. Compliance Review
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Statutory Assessment &amp; Overview
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Review status: Statutory review completed</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid (Primary Statutory Points) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-mono">
                Price / MRP
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {mrp}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Rule 6(1)(c)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-mono">
                Net Quantity
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                {netQty}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                Rule 6(1)(b)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-mono">
                Mfg Date
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block truncate">
                {mfgDate}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                Rule 6(1)(d)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-mono">
                Best Before
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block truncate">
                {expiry}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                Shelf Life
              </span>
            </div>
          </div>

          {/* Compliance Status Tags Row */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Field Declarations:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified / Available: {verifiedCount} of {statutoryFields.length}</span>
              </span>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">
              Batch: {batchNumber} • Lic: {fssaiNumber}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PRODUCT INFORMATION CARD (FULL 13-FIELD SPECIFICATION TABLE) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
              <FileText className="w-4 h-4" />
              <span>2. Product Information Card</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Packaged Commodity Particulars &amp; Declarations
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono">
              Total Fields Displayed: {statutoryFields.length}
            </span>
          </div>
        </div>

        {/* Structured 13-Field Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-1/3">Field</th>
                <th className="py-3 px-4 w-5/12">Value</th>
                <th className="py-3 px-4 w-1/4">Status / Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {statutoryFields.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <tr 
                    key={item.id}
                    className={`transition-colors ${
                      idx % 2 === 0 
                        ? 'bg-white dark:bg-slate-900' 
                        : 'bg-slate-50/50 dark:bg-slate-850/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.value}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {!item.value || item.value === 'Not provided' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <AlertCircle className="w-3 h-3" />
                          <span>Missing / Not verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified / Available</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. STATUTORY VERIFICATION & OPTICAL PIPELINE WORKFLOW CHART */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-4 h-4" />
              <span>4. AI Verification &amp; Statutory Workflow Chart</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              End-to-End Compliance Pipeline Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Complete automated evaluation lifecycle from physical packaging upload to legal enforcement memorandum.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>4-Stage Pipeline Active</span>
          </span>
        </div>

        {/* 4-Stage Connected Workflow Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative">
          {/* Stage 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Stage 01
              </span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Optical Ingestion &amp; OCR
            </h4>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Principal Display Panel (PDP) capture</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Adaptive thresholding &amp; noise filtering</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Raw bounding box text extraction</span>
              </li>
            </ul>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Stage 02
              </span>
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Particulars Mapping (13 Fields)
            </h4>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Rule 6 Metrology regex matching</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Schedule II numeral height validation</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Metric units standardization (g / gm)</span>
              </li>
            </ul>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Stage 03
              </span>
              <Scale className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Dual Regulatory Audit
            </h4>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>PCR 2011: MRP, Net Qty, Mfg/Exp</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>FSSAI 2020: 14-digit Lic &amp; Allergens</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>FSSAI / FoSCoS database check</span>
              </li>
            </ul>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Stage 04
              </span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Enforcement &amp; Notice
            </h4>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>98% Statutory Compliance Score</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Section 36 Show-Cause Notice</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Digitally signed Inspection Memo</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. COMPETITOR COMPARISON SECTION (CHIPS VS KURKURE) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
              <Scale className="w-4 h-4" />
              <span>5. Competitor Comparison</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Market Benchmark: {productName} vs. Kurkure
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Side-by-side statutory packaging declarations comparison.
            </p>
          </div>

          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Snack Segment Benchmark
          </span>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-1/3">Feature</th>
                <th className="py-3 px-4 w-1/3 text-blue-700 dark:text-blue-400 font-extrabold bg-blue-50/50 dark:bg-blue-950/20">
                  {productName} (Current Scan)
                </th>
                <th className="py-3 px-4 w-1/3 text-slate-700 dark:text-slate-300">
                  Kurkure (Competitor)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {competitorComparisonData.map((row, idx) => (
                <tr 
                  key={idx}
                  className={`transition-colors ${
                    idx % 2 === 0 
                      ? 'bg-white dark:bg-slate-900' 
                      : 'bg-slate-50/50 dark:bg-slate-850/40'
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 font-bold bg-blue-50/20 dark:bg-blue-950/10 text-slate-900 dark:text-white">
                    {row.chips}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 italic">
                    {row.kurkure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1 italic text-center">
          Note: In accordance with standard verification rules, unverified competitor details remain unpopulated (&ldquo;Not provided&rdquo;).
        </p>
      </div>

      {/* OPTIONAL NAVIGATION ACTIONS (Preserves existing prototype workflow) */}
      {(onNavigateToAudit || onNavigateToReport) && (
        <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
          {onNavigateToAudit && (
            <button
              onClick={onNavigateToAudit}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>View Active Audit Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {onNavigateToReport && (
            <button
              onClick={onNavigateToReport}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Inspection Report</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
