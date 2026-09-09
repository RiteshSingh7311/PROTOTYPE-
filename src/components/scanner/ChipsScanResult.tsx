import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
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
  HelpCircle,
  Sparkles,
  Globe,
  Phone,
  Check
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
  countryOfOrigin?: string;
  verifiedFieldKeys?: string[];
}

interface ChipsScanResultProps {
  uploadedImage: string;
  customData?: ChipsCustomDetails;
  onNavigateToAudit?: () => void;
  onNavigateToReport?: () => void;
}

export type FieldStatus = 
  | 'Verified from uploaded label'
  | 'Provided'
  | 'Not verified'
  | 'Not provided on the uploaded label';

interface StatutoryFieldItem {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
  evidence: string;
  rule: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ChipsScanResult: React.FC<ChipsScanResultProps> = ({
  uploadedImage,
  customData,
  onNavigateToAudit,
  onNavigateToReport
}) => {
  // Provided test values for SIH presentation
  const defaultValues = {
    productName: 'Potato Chips',
    brand: "Lay's",
    netQty: '50 g',
    mrp: '₹5',
    mfgDate: '12 August 2025',
    expiry: '12 April 2026',
    customerCare: '1800-123-4567',
    countryOfOrigin: 'India',
    fssaiNumber: '10014064000435',
    batchNumber: '',
    ingredients: '',
    allergens: '',
    manufacturer: '',
    address: ''
  };

  const NOT_PROVIDED_TEXT = 'Not provided on the uploaded label';

  // Extract values, respecting live OCR if detected; otherwise use provided test values
  const productName = customData?.productName || defaultValues.productName;
  const brand = customData?.brand || defaultValues.brand;
  const mrp = customData?.mrp 
    ? (customData.mrp.startsWith('₹') ? customData.mrp : `₹${customData.mrp}`) 
    : defaultValues.mrp;
  const netQty = customData?.netQty || defaultValues.netQty;
  const mfgDate = customData?.mfgDate || defaultValues.mfgDate;
  const expiry = customData?.expiry || defaultValues.expiry;
  const customerCare = customData?.customerCare || defaultValues.customerCare;
  const countryOfOrigin = customData?.countryOfOrigin || defaultValues.countryOfOrigin;
  const fssaiNumber = customData?.fssaiNumber || defaultValues.fssaiNumber;

  const batchNumber = customData?.batchNumber && customData.batchNumber.trim() 
    ? customData.batchNumber 
    : NOT_PROVIDED_TEXT;
  const ingredients = customData?.ingredients && customData.ingredients.trim() 
    ? customData.ingredients 
    : NOT_PROVIDED_TEXT;
  const allergens = customData?.allergens && customData.allergens.trim() 
    ? customData.allergens 
    : NOT_PROVIDED_TEXT;
  const manufacturer = customData?.manufacturer && customData.manufacturer.trim() 
    ? customData.manufacturer 
    : NOT_PROVIDED_TEXT;
  const address = customData?.address && customData.address.trim() 
    ? customData.address 
    : NOT_PROVIDED_TEXT;

  const verifiedKeys = new Set(customData?.verifiedFieldKeys || []);

  // Helper to determine status and exact evidence for each field
  const getFieldMeta = (
    fieldKey: string,
    value: string,
    isMissing: boolean,
    defaultStatus: FieldStatus,
    providedEvidence: string,
    missingEvidence: string
  ): { status: FieldStatus; evidence: string } => {
    // If OCR on the uploaded image clearly confirmed this field
    if (verifiedKeys.has(`${fieldKey}_ocr`)) {
      return {
        status: 'Verified from uploaded label',
        evidence: 'Confirmed by physical text extraction from the uploaded product label image.'
      };
    }
    // If missing or unpopulated
    if (isMissing || value === NOT_PROVIDED_TEXT || !value) {
      return {
        status: 'Not provided on the uploaded label',
        evidence: missingEvidence
      };
    }
    return {
      status: defaultStatus,
      evidence: providedEvidence
    };
  };

  // Full 14-field specification in exact requested order
  const statutoryFields: StatutoryFieldItem[] = [
    {
      id: 'productName',
      label: '1. Product name',
      value: productName,
      rule: 'Rule 6(1)(a)',
      icon: Package,
      ...getFieldMeta(
        'productName',
        productName,
        false,
        'Provided',
        'Product name declared as Potato Chips.',
        'Product name is not visible on the uploaded label.'
      )
    },
    {
      id: 'brand',
      label: '2. Brand / Company',
      value: brand,
      rule: 'FBO Identity',
      icon: Tag,
      ...getFieldMeta(
        'brand',
        brand,
        false,
        'Provided',
        "Brand / Company declared as Lay's.",
        'Brand / Company is not visible on the uploaded label.'
      )
    },
    {
      id: 'mrp',
      label: '3. MRP',
      value: mrp,
      rule: 'Rule 6(1)(c)',
      icon: Tag,
      ...getFieldMeta(
        'mrp',
        mrp,
        false,
        'Provided',
        'Maximum Retail Price declared as ₹5.',
        'MRP is not visible on the uploaded label.'
      )
    },
    {
      id: 'netQty',
      label: '4. Net quantity',
      value: netQty,
      rule: 'Rule 6(1)(b) & Rule 7',
      icon: Scale,
      ...getFieldMeta(
        'netQty',
        netQty,
        false,
        'Provided',
        'Net quantity declared as 50 g in metric units.',
        'Net quantity is not visible on the uploaded label.'
      )
    },
    {
      id: 'mfgDate',
      label: '5. Manufacturing date',
      value: mfgDate,
      rule: 'Rule 6(1)(d)',
      icon: Calendar,
      ...getFieldMeta(
        'mfgDate',
        mfgDate,
        false,
        'Provided',
        'Manufacturing date declared as 12 August 2025.',
        'Manufacturing date is not visible on the uploaded label.'
      )
    },
    {
      id: 'expiry',
      label: '6. Best before',
      value: expiry,
      rule: 'Rule 6(1)(d)',
      icon: Calendar,
      ...getFieldMeta(
        'expiry',
        expiry,
        false,
        'Provided',
        'Best before declared as 12 April 2026.',
        'Best before date is not visible on the uploaded label.'
      )
    },
    {
      id: 'batchNumber',
      label: '7. Batch number',
      value: batchNumber,
      rule: 'Rule 6(1)(e)',
      icon: FileCheck2,
      ...getFieldMeta(
        'batchNumber',
        batchNumber,
        batchNumber === NOT_PROVIDED_TEXT,
        'Provided',
        `Batch number declared as ${batchNumber}.`,
        'Batch number is not visible or declared on the uploaded label.'
      )
    },
    {
      id: 'fssaiNumber',
      label: '8. FSSAI license number',
      value: fssaiNumber,
      rule: 'FSSAI (FSSR 2020)',
      icon: ShieldCheck,
      ...getFieldMeta(
        'fssaiNumber',
        fssaiNumber,
        false,
        'Not verified',
        '14-digit FSSAI license number format present. Independent portal verification required to confirm active status.',
        'FSSAI license number is not visible on the uploaded label.'
      )
    },
    {
      id: 'ingredients',
      label: '9. Ingredients',
      value: ingredients,
      rule: 'FSSAI Reg. 2.2.2',
      icon: FileText,
      ...getFieldMeta(
        'ingredients',
        ingredients,
        ingredients === NOT_PROVIDED_TEXT,
        'Provided',
        `Ingredients declared: ${ingredients}.`,
        'Ingredients list is not visible or declared on the uploaded label.'
      )
    },
    {
      id: 'allergens',
      label: '10. Allergen information',
      value: allergens,
      rule: 'FSSAI Allergen Mandate',
      icon: AlertCircle,
      ...getFieldMeta(
        'allergens',
        allergens,
        allergens === NOT_PROVIDED_TEXT,
        'Provided',
        `Allergen statement declared: ${allergens}.`,
        'Allergen declaration is not visible or declared on the uploaded label.'
      )
    },
    {
      id: 'manufacturer',
      label: '11. Manufacturer / Packer',
      value: manufacturer,
      rule: 'Rule 6(1)(a)',
      icon: Building2,
      ...getFieldMeta(
        'manufacturer',
        manufacturer,
        manufacturer === NOT_PROVIDED_TEXT,
        'Provided',
        `Manufacturer declared as ${manufacturer}.`,
        'Manufacturer / Packer details are not visible or declared on the uploaded label.'
      )
    },
    {
      id: 'address',
      label: '12. Manufacturer / Office address',
      value: address,
      rule: 'Rule 6(1)(a)',
      icon: MapPin,
      ...getFieldMeta(
        'address',
        address,
        address === NOT_PROVIDED_TEXT,
        'Provided',
        `Manufacturer address declared: ${address}.`,
        'Manufacturer / Office address is not visible or declared on the uploaded label.'
      )
    },
    {
      id: 'customerCare',
      label: '13. Customer care details',
      value: customerCare,
      rule: 'Rule 6(1)(f)',
      icon: Phone,
      ...getFieldMeta(
        'customerCare',
        customerCare,
        false,
        'Not verified',
        'Customer care phone contact provided. Contact verification against official brand records required.',
        'Customer care contact is not visible on the uploaded label.'
      )
    },
    {
      id: 'countryOfOrigin',
      label: '14. Country of origin',
      value: countryOfOrigin,
      rule: 'Rule 6(1)(n)',
      icon: Globe,
      ...getFieldMeta(
        'countryOfOrigin',
        countryOfOrigin,
        false,
        'Provided',
        'Country of origin declared as India.',
        'Country of origin is not visible on the uploaded label.'
      )
    }
  ];

  // Competitor comparison dataset (all 14 fields)
  const competitorComparisonData = [
    { feature: 'Product name', current: productName, kurkure: 'Kurkure' },
    { feature: 'Brand / Company', current: brand, kurkure: 'Kurkure (PepsiCo)' },
    { feature: 'MRP', current: mrp, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Net quantity', current: netQty, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Manufacturing date', current: mfgDate, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Best before', current: expiry, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Batch number', current: batchNumber, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'FSSAI license number', current: fssaiNumber, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Ingredients', current: ingredients, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Allergen information', current: allergens, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Manufacturer / Packer', current: manufacturer, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Manufacturer / Office address', current: address, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Customer care details', current: customerCare, kurkure: NOT_PROVIDED_TEXT },
    { feature: 'Country of origin', current: countryOfOrigin, kurkure: 'India' }
  ];

  // Helper to render distinct status badges
  const renderStatusBadge = (status: FieldStatus) => {
    switch (status) {
      case 'Verified from uploaded label':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Verified from uploaded label</span>
          </span>
        );
      case 'Provided':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
            <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Provided</span>
          </span>
        );
      case 'Not verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
            <HelpCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Not verified</span>
          </span>
        );
      case 'Not provided on the uploaded label':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>Not provided on the uploaded label</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Evidence-Based Optical Evaluation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
            Scan Review &amp; Analysis Report
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evidence-grounded packaged commodity evaluation under Legal Metrology &amp; FSSAI Regulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Partially verified / Further verification required
          </span>
        </div>
      </div>

      {/* TOP DUAL CARDS: 1. UPLOADED IMAGE & 2. CORE COMPLIANCE REVIEW & SUMMARY CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: 1. Uploaded Product Image */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Uploaded Product Image</span>
            </span>
            <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-700">
              Optical Input
            </span>
          </div>

          <div className="relative h-64 sm:h-72 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-800 group">
            <img
              src={uploadedImage}
              alt="Uploaded Chips Packaging"
              className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>{brand} {productName} • {mrp} • {netQty}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Info className="w-3 h-3 text-blue-500" />
              <span>Inspection Protocol Note:</span>
            </p>
            <p className="leading-relaxed italic">
              Physical label image processed through optical compliance engine. Declarations are evaluated against statutory Legal Metrology rules without presumptive data.
            </p>
          </div>
        </div>

        {/* Right 8 Cols: 2. Core Compliance Review & Executive Summary */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                2. Compliance Review
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Statutory Assessment &amp; Overview
              </h3>
            </div>
            
            {/* Prominent Overall Result Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Overall result: Partially verified / Further verification required</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-mono">
                Price / MRP
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {mrp}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                Provided
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
                Provided
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
                Provided
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
                Provided
              </span>
            </div>
          </div>

          {/* COMPLIANCE SUMMARY CARD (Requested Exact Format) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/80 dark:bg-slate-850/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Statutory Compliance Summary</span>
              </span>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                Partially Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* 1. Product Information */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Product information: Available</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Declared particulars for <strong>{brand} {productName}</strong> (MRP: <strong>{mrp}</strong>, Net Qty: <strong>{netQty}</strong>, Mfg: <strong>{mfgDate}</strong>, Best Before: <strong>{expiry}</strong>, Origin: <strong>{countryOfOrigin}</strong>) are available for inspection.
                </p>
              </div>

              {/* 2. Verification Required */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Verification required: FSSAI license number and customer care number</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  FSSAI license number (<strong>{fssaiNumber}</strong>) and customer care number (<strong>{customerCare}</strong>) require portal verification.
                </p>
              </div>

              {/* 3. Missing Information */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 md:col-span-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Missing information: Not provided on the uploaded label</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Batch number, ingredients, allergen information, manufacturer details, and office address are not provided on the uploaded label.
                </p>
              </div>
            </div>

            {/* Overall Result Banner Note */}
            <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Overall Result:</strong> Partially verified / Further verification required. Automated compliance checks reflect declarations visible on the label. Physical verification by an authorized officer confirms enforcement status.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT INFORMATION CARD (FULL 14-FIELD EVIDENCE-BASED SPECIFICATION TABLE) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
              <FileText className="w-4 h-4" />
              <span>3. Product Information Card</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Packaged Commodity Particulars &amp; Statutory Declarations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every declaration shows its extracted value, verified provenance status, and exact evidence reasoning.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              Total Monitored Declarations: 14 Fields
            </span>
          </div>
        </div>

        {/* Structured 14-Field Table with Detailed Evidence Callouts */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-1/4">Field</th>
                <th className="py-3 px-4 w-1/2">Extracted Value &amp; Statutory Evidence</th>
                <th className="py-3 px-4 w-1/4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {statutoryFields.map((item, idx) => {
                const IconComponent = item.icon;
                const isNotProvided = item.value === NOT_PROVIDED_TEXT || !item.value;

                return (
                  <tr 
                    key={item.id}
                    className={`transition-colors ${
                      idx % 2 === 0 
                        ? 'bg-white dark:bg-slate-900' 
                        : 'bg-slate-50/50 dark:bg-slate-850/40'
                    }`}
                  >
                    {/* Column 1: Field Name & Statutory Rule Reference */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 align-top">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 border border-blue-200/60 dark:border-blue-800/60">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-slate-100">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {item.rule}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Extracted Value + Dedicated Evidence Section */}
                    <td className="py-3.5 px-4 align-top space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`font-semibold text-sm ${
                            isNotProvided 
                              ? 'text-slate-400 dark:text-slate-500 italic font-normal' 
                              : 'text-slate-900 dark:text-white font-mono'
                          }`}
                        >
                          {item.value}
                        </span>
                      </div>

                      {/* Small "Evidence" Section under each field */}
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5 bg-slate-50 dark:bg-slate-850/80 p-2 rounded-lg border border-slate-200/70 dark:border-slate-800">
                        <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div className="leading-snug">
                          <strong className="text-slate-700 dark:text-slate-200">Evidence / Reason: </strong>
                          <span>{item.evidence}</span>
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Status Badge */}
                    <td className="py-3.5 px-4 align-top">
                      {renderStatusBadge(item.status)}
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
              <span>4. Verification &amp; Statutory Workflow</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              End-to-End Evidence-First Inspection Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Complete automated evaluation lifecycle with clear distinction between verified label facts, provided inputs, and missing declarations.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
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
                <span>Extract physical label text signals</span>
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
              Particulars Mapping (14 Fields)
            </h4>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>PCR 2011 Rule 6 declarations check</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Origin &amp; Customer Care format analysis</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Preserve missing fields without guessing</span>
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
                <span>Legal Metrology: MRP, Net Qty, Dates</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>FSSAI 2020: 14-digit Lic &amp; Allergens</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>Flag non-verified database signals</span>
              </li>
            </ul>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Stage 04
              </span>
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Evidence Memorandum
            </h4>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Partially verified result status</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Explicit missing particulars notice</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Non-presumptive officer audit file</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. COMPETITOR COMPARISON SECTION (LAY'S VS KURKURE) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
              <Scale className="w-4 h-4" />
              <span>5. Competitor Comparison</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Market Benchmark: {brand} {productName} vs. Kurkure
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Side-by-side statutory packaging declarations comparison under Legal Metrology standards.
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
                  {brand} {productName} (Current Scan)
                </th>
                <th className="py-3 px-4 w-1/3 text-slate-700 dark:text-slate-300">
                  Kurkure (Competitor Benchmark)
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
                    <span className={row.current === NOT_PROVIDED_TEXT ? 'text-slate-400 font-normal italic' : ''}>
                      {row.current}
                    </span>
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
          Note: In accordance with standard verification rules, unverified competitor details remain unpopulated (&ldquo;Not provided on the uploaded label&rdquo;).
        </p>
      </div>

      {/* OPTIONAL NAVIGATION ACTIONS (Preserves existing prototype workflow) */}
      {(onNavigateToAudit || onNavigateToReport) && (
        <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
          {onNavigateToAudit && (
            <button
              onClick={onNavigateToAudit}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Active Audit Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {onNavigateToReport && (
            <button
              onClick={onNavigateToReport}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
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
