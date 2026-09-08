import React, { useState, useRef } from 'react';
import { 
  ScanLine, 
  Sparkles, 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Check, 
  Layers, 
  Crosshair, 
  Maximize2,
  Tag, 
  Scale, 
  Building2, 
  FileCheck2, 
  Sliders, 
  QrCode, 
  Image as ImageIcon, 
  Edit3, 
  Sun, 
  ZoomIn, 
  Send, 
  Eye,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { DEMO_PRESETS, DEMO_LABELS, PRODUCT_CATEGORIES } from '../../data/mockData';
import { 
  InspectionRecord, 
  DeclarationField, 
  RuleResult,
  ProductIdentityEvidence,
  OnlineVerificationResult,
  DataConflict,
  OverallInspectionStatus
} from '../../types';
import { ProductIdentityConfirmationModal } from './ProductIdentityConfirmationModal';
import { productVerificationService } from '../../services/productVerificationService';
import { 
  evaluateLegalMetrologyRules, 
  evaluateFSSAIRules, 
  computeOverallStatus 
} from '../../services/complianceEngine';
import { liveOcrService } from '../../services/liveOcrService';

interface UploadBrandTemplate {
  id: string;
  brand: string;
  productName: string;
  category: string;
  batch: string;
  barcode: string;
  address: string;
  netQty: string;
  fontHeightOk: boolean;
  mrp: string;
  includesTaxes: boolean;
  usp: string;
  mfgDate: string;
  expiry: string;
  origin: string;
  careName: string;
  carePhone: string;
  careEmail: string;
  careAddress: string;
  officerNotes?: string;
}

const UPLOAD_BRAND_TEMPLATES: UploadBrandTemplate[] = [
  {
    id: 'tata',
    brand: 'Tata Consumer Products Ltd.',
    productName: 'Tata Sampann 100% Unpolished Toor Dal (1kg)',
    category: 'Food & Snacks',
    batch: 'TCP-TD-2026B',
    barcode: '8901030829142',
    address: 'Tata Consumer Products Ltd., 1, Bishop Lefroy Road, Kolkata, West Bengal - 700020, India.',
    netQty: '1 kg',
    fontHeightOk: true,
    mrp: '185.00',
    includesTaxes: true,
    usp: '0.19 / g',
    mfgDate: '08/2026',
    expiry: '12 Months from Mfd.',
    origin: 'India',
    careName: 'Customer Care Executive',
    carePhone: '1800-108-4488',
    careEmail: 'customercare@tataconsumer.com',
    careAddress: 'Kirloskar Business Park, Hebbal, Bengaluru - 560024',
    officerNotes: 'Optical scan of uploaded commodity. All 8 statutory declarations compliant with PCR 2011.'
  },
  {
    id: 'amul',
    brand: 'Amul (GCMMF Ltd.)',
    productName: 'Amul Pasteurised Salted Butter (500g)',
    category: 'Food & Snacks',
    batch: 'AML-BTR-8812',
    barcode: '8901262010054',
    address: 'Gujarat Cooperative Milk Marketing Federation Ltd., Amul Dairy Road, Anand, Gujarat - 388001, India.',
    netQty: '500 g',
    fontHeightOk: true,
    mrp: '275.00',
    includesTaxes: true,
    usp: '0.55 / g',
    mfgDate: '08/2026',
    expiry: '9 Months from Mfd.',
    origin: 'India',
    careName: 'Manager - Quality & Consumer Care',
    carePhone: '1800-258-3333',
    careEmail: 'customercare@amul.coop',
    careAddress: 'Amul Fed Dairy, Gandhinagar, Gujarat - 382042',
    officerNotes: 'Dairy commodity packaging verified under Schedule II & Rule 6(1).'
  },
  {
    id: 'britannia',
    brand: 'Britannia Industries Ltd.',
    productName: 'Britannia Good Day Cashew Cookies (200g)',
    category: 'Food & Snacks',
    batch: 'BIL-GD-9941',
    barcode: '8901063012450',
    address: 'Britannia Industries Ltd., 5/1A Hungerford Street, Kolkata, West Bengal - 700017, India.',
    netQty: '200 g',
    fontHeightOk: true,
    mrp: '45.00',
    includesTaxes: true,
    usp: '0.23 / g',
    mfgDate: '07/2026',
    expiry: '6 Months from Mfd.',
    origin: 'India',
    careName: 'Consumer Care Cell',
    carePhone: '1800-425-4449',
    careEmail: 'feedback@britindia.com',
    careAddress: 'Britannia Consumer Care, Prestige Shantiniketan, Whitefield, Bengaluru - 560048',
    officerNotes: 'Bakery biscuits commodity label audited. Unit Sale Price and net quantity verified.'
  },
  {
    id: 'haldiram',
    brand: "Haldiram's Foods International",
    productName: "Haldiram's Nagpur Aloo Bhujia (400g)",
    category: 'Food & Snacks',
    batch: 'HR-ALB-3310',
    barcode: '8904004400128',
    address: "Haldiram Foods International Pvt. Ltd., 20 Km Stone, Vill. Gumthala, Bhandara Road, Nagpur, Maharashtra - 441104, India.",
    netQty: '400 g',
    fontHeightOk: true,
    mrp: '110.00',
    includesTaxes: true,
    usp: '0.28 / g',
    mfgDate: '08/2026',
    expiry: '5 Months from Mfd.',
    origin: 'India',
    careName: 'Grievance Officer',
    carePhone: '0712-2681122',
    careEmail: 'customercare@haldirams.com',
    careAddress: 'Haldiram House, Plot No. 145/146, Old Pardi Naka, Nagpur - 440035',
    officerNotes: 'Traditional snack food pouch. Compliant with metric symbols and consumer helpline declarations.'
  },
  {
    id: 'dabur',
    brand: 'Dabur India Ltd.',
    productName: 'Dabur 100% Pure Honey Squeezy Pack (500g)',
    category: 'Food & Snacks',
    batch: 'DBR-HN-1205',
    barcode: '8901207010214',
    address: 'Dabur India Limited, 8/3, Asaf Ali Road, New Delhi - 110002, India.',
    netQty: '500 g',
    fontHeightOk: true,
    mrp: '240.00',
    includesTaxes: true,
    usp: '0.48 / g',
    mfgDate: '07/2026',
    expiry: '18 Months from Mfd.',
    origin: 'India',
    careName: 'Consumer Services Cell',
    carePhone: '1800-103-1644',
    careEmail: 'daburcares@dabur.com',
    careAddress: 'Dabur Consumer Services, Kaushambi, Sahibabad, Ghaziabad, UP - 201010',
    officerNotes: 'Honey dispenser pack. Complete compliance with Rule 6(1) and PCR 2011.'
  },
  {
    id: 'sparkle',
    brand: 'Sparkle Care Products Ltd.',
    productName: 'Sparkle Glow Herbal Shampoo (250ml)',
    category: 'Cosmetics & Toiletries',
    batch: 'SG-SH-2026B',
    barcode: '8909876543210',
    address: 'Sparkle Care Products, Industrial Area, Phase II, New Delhi - 110020, India.',
    netQty: '250 ml',
    fontHeightOk: false,
    mrp: '220.00',
    includesTaxes: false,
    usp: '0.88 / ml',
    mfgDate: '06/2026',
    expiry: '24 Months from Mfd.',
    origin: 'India',
    careName: 'Customer Support Desk',
    carePhone: '011-22334455',
    careEmail: '',
    careAddress: 'Sparkle Care Support, Phase II, New Delhi - 110020',
    officerNotes: 'Flagged for compounding under Section 36. Missing mandatory taxes phrase on MRP and missing consumer grievance email ID.'
  }
];

interface ScannerViewProps {
  onScanComplete: (inspection: InspectionRecord) => void;
  currentUser: {
    name: string;
    role: string;
    zone: string;
  };
  initialPresetId?: string;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onScanComplete,
  currentUser,
  initialPresetId
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId || 'demo-food-compliant');
  const [uploadedImage, setUploadedImage] = useState<string>(DEMO_LABELS.compliantFood);
  const [productName, setProductName] = useState<string>('NutriSnack Roasted & Salted Almond Kernels');
  const [brandName, setBrandName] = useState<string>('NutriSnack Foods');
  const [category, setCategory] = useState<string>('Food & Snacks');
  const [batchNo, setBatchNo] = useState<string>('NS-ALM-2608');
  
  // Active Mode: Presets (AI Optical Scanner) | Upload Photo | Manual Add
  const [activeMode, setActiveMode] = useState<'presets' | 'upload' | 'manual'>('presets');

  // Scanning animation states
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OPTIC PARAMETERS (Matched to User Spec Screenshot)
  const [exposureEV, setExposureEV] = useState<number>(-0.5);
  const [magnification, setMagnification] = useState<'1.0x' | '2.0x' | '4.0x'>('1.0x');
  const [focusEngine, setFocusEngine] = useState<'Auto Continuous (AF-C)' | 'Macro OCR Lock' | 'Manual Pinpoint'>('Auto Continuous (AF-C)');
  const [ledIlluminator, setLedIlluminator] = useState<'OFF' | '45%' | '100%'>('OFF');
  const [spectralCalibration, setSpectralCalibration] = useState<string>('5500K D65 (Standard Daylight)');
  const [labelArchetype, setLabelArchetype] = useState<string>('Rigid Container / Box');

  // UPLOADED PRODUCT STATUTORY DECLARATIONS & BRAND SPECIFICATION
  const [uploadBrand, setUploadBrand] = useState<string>('Tata Consumer Products Ltd.');
  const [uploadProductName, setUploadProductName] = useState<string>('Tata Sampann 100% Unpolished Toor Dal (1kg)');
  const [uploadCategory, setUploadCategory] = useState<string>('Food & Snacks');
  const [uploadBatch, setUploadBatch] = useState<string>('TCP-TD-2026B');
  const [uploadBarcode, setUploadBarcode] = useState<string>('8901030829142');
  const [uploadManufacturerAddress, setUploadManufacturerAddress] = useState<string>('Tata Consumer Products Ltd., 1, Bishop Lefroy Road, Kolkata, West Bengal - 700020, India.');
  const [uploadNetQty, setUploadNetQty] = useState<string>('1 kg');
  const [uploadFontHeightOk, setUploadFontHeightOk] = useState<boolean>(true);
  const [uploadMrp, setUploadMrp] = useState<string>('185.00');
  const [uploadIncludesTaxes, setUploadIncludesTaxes] = useState<boolean>(true);
  const [uploadUsp, setUploadUsp] = useState<string>('0.19 / g');
  const [uploadMfgDate, setUploadMfgDate] = useState<string>('08/2026');
  const [uploadExpiry, setUploadExpiry] = useState<string>('12 Months from Mfd.');
  const [uploadOrigin, setUploadOrigin] = useState<string>('India');
  const [uploadCareName, setUploadCareName] = useState<string>('Executive - Consumer Care');
  const [uploadCarePhone, setUploadCarePhone] = useState<string>('1800-108-4488');
  const [uploadCareEmail, setUploadCareEmail] = useState<string>('customercare@tataconsumer.com');
  const [uploadCareAddress, setUploadCareAddress] = useState<string>('Kirloskar Business Park, Hebbal, Bengaluru - 560024');
  const [uploadOfficerNotes, setUploadOfficerNotes] = useState<string>('Optical scan of uploaded commodity packaging. Statutory declarations extracted and audited under PCR 2011.');
  const [uploadSelectedTemplateId, setUploadSelectedTemplateId] = useState<string>('tata');
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(false);
  const [uploadFssaiNumber, setUploadFssaiNumber] = useState<string>('10014011000263');
  const [isLiveOcrRunning, setIsLiveOcrRunning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);

  // PRODUCT IDENTITY CONFIRMATION STATES (Step 3)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSearchingAgain, setIsSearchingAgain] = useState<boolean>(false);
  const [pendingEvidence, setPendingEvidence] = useState<ProductIdentityEvidence | null>(null);
  const [pendingOnlineResult, setPendingOnlineResult] = useState<OnlineVerificationResult | null>(null);
  const [pendingConflicts, setPendingConflicts] = useState<DataConflict[]>([]);
  const [pendingFields, setPendingFields] = useState<DeclarationField[]>([]);
  const [pendingCategory, setPendingCategory] = useState<string>('Food & Snacks');
  const [pendingNotes, setPendingNotes] = useState<string>('');
  const [pendingLabelImage, setPendingLabelImage] = useState<string>('');

  // MANUAL INSPECTION ENTRY STATES
  const [manualName, setManualName] = useState('NutriSnack Roasted & Salted Almond Kernels');
  const [manualBrand, setManualBrand] = useState('NutriSnack Foods Pvt. Ltd.');
  const [manualCategory, setManualCategory] = useState('Food & Snacks');
  const [manualBatch, setManualBatch] = useState('NS-ALM-2608');
  const [manualBarcode, setManualBarcode] = useState('8901234567890');
  const [manualAddress, setManualAddress] = useState('NutriSnack Foods Pvt. Ltd., Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana - 122015, India.');
  const [manualNetQty, setManualNetQty] = useState('500 g');
  const [manualFontHeightOk, setManualFontHeightOk] = useState(true);
  const [manualMrp, setManualMrp] = useState('385.00');
  const [manualIncludesTaxes, setManualIncludesTaxes] = useState(true);
  const [manualUsp, setManualUsp] = useState('0.77 / g');
  const [manualMfgDate, setManualMfgDate] = useState('08/2026');
  const [manualOrigin, setManualOrigin] = useState('India');
  const [manualCarePhone, setManualCarePhone] = useState('1800-11-2233');
  const [manualCareEmail, setManualCareEmail] = useState('grievance@nutrisnack.in');
  const [manualOfficerNotes, setManualOfficerNotes] = useState('Physical market verification conducted at Hazratganj retail premises. Verified font height with gauge.');

  const scanStages = [
    { title: 'Optical Frame Acquisition', desc: 'Focusing Principal Display Panel & perspective alignment' },
    { title: 'Multi-layer OCR Text Extraction', desc: 'Detecting fonts, numerals, metric units and currency symbols' },
    { title: 'Declarations Parsing & Mapping', desc: 'Mapping mandatory fields: MRP, Net Qty, Mfg Date, Address, Consumer Care' },
    { title: 'Schedule Evaluation (PCR 2011)', desc: 'Validating against Rule 6, Rule 7 numeral height, and Rule 9 contrast' },
    { title: 'Spatial Coordinates & Report', desc: 'Generating bounding box coordinates and inspection memorandum' }
  ];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = DEMO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setUploadedImage(preset.image);
      setProductName(preset.productName);
      setBrandName(preset.brand);
      setCategory(preset.category);
      setBatchNo(preset.batchNo);
    }
  };

  // Sync when initialPresetId changes from dashboard selection
  React.useEffect(() => {
    if (initialPresetId) {
      handleSelectPreset(initialPresetId);
    }
  }, [initialPresetId]);

  const applyBrandTemplate = (template: UploadBrandTemplate) => {
    setUploadSelectedTemplateId(template.id);
    setUploadBrand(template.brand);
    setUploadProductName(template.productName);
    setUploadCategory(template.category);
    setUploadBatch(template.batch);
    setUploadBarcode(template.barcode);
    setUploadManufacturerAddress(template.address);
    setUploadNetQty(template.netQty);
    setUploadFontHeightOk(template.fontHeightOk);
    setUploadMrp(template.mrp);
    setUploadIncludesTaxes(template.includesTaxes);
    setUploadUsp(template.usp);
    setUploadMfgDate(template.mfgDate);
    setUploadExpiry(template.expiry);
    setUploadOrigin(template.origin);
    setUploadCareName(template.careName);
    setUploadCarePhone(template.carePhone);
    setUploadCareEmail(template.careEmail);
    setUploadCareAddress(template.careAddress);
    if (template.officerNotes) setUploadOfficerNotes(template.officerNotes);
    setProductName(template.productName);
    setBrandName(template.brand);
  };

  const processUploadedFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const imageBase64 = reader.result as string;
        setUploadedImage(imageBase64);
        setSelectedPresetId('custom-upload');
        setActiveMode('upload');
      }
    };
    reader.readAsDataURL(file);

    // Initial fallback from filename
    const cleanFileName = file.name.replace(/\.[^/.]+$/, "");
    const lowerName = file.name.toLowerCase();
    const matchedTemplate = UPLOAD_BRAND_TEMPLATES.find(t => 
      lowerName.includes(t.id) || 
      lowerName.includes(t.brand.toLowerCase().split(' ')[0]) ||
      lowerName.includes(t.productName.toLowerCase().split(' ')[0])
    );
    if (matchedTemplate) {
      applyBrandTemplate(matchedTemplate);
    } else {
      const formattedName = cleanFileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      setUploadProductName(formattedName);
      setProductName(formattedName);
      setUploadSelectedTemplateId('custom');
    }

    // Run Real In-Browser Optical OCR with Tesseract.js WASM
    setIsLiveOcrRunning(true);
    setOcrProgress(0);
    try {
      const extracted = await liveOcrService.recognizeImage(file, update => {
        setOcrProgress(update.progress);
      });
      setOcrConfidence(extracted.confidence);

      if (extracted.detectedFssaiNumber) {
        setUploadFssaiNumber(extracted.detectedFssaiNumber);
      }
      if (extracted.detectedBarcode) {
        setUploadBarcode(extracted.detectedBarcode);
      }
      if (extracted.detectedMrp) {
        setUploadMrp(extracted.detectedMrp);
      }
      if (extracted.includesTaxes !== undefined) {
        setUploadIncludesTaxes(extracted.includesTaxes);
      }
      if (extracted.detectedNetQty) {
        setUploadNetQty(extracted.detectedNetQty);
      }
      if (extracted.detectedMfgDate) {
        setUploadMfgDate(extracted.detectedMfgDate);
      }
      if (extracted.detectedCarePhone) {
        setUploadCarePhone(extracted.detectedCarePhone);
      }
      if (extracted.detectedCareEmail) {
        setUploadCareEmail(extracted.detectedCareEmail);
      }
      if (extracted.detectedOrigin) {
        setUploadOrigin(extracted.detectedOrigin);
      }
      if (extracted.detectedBrand) {
        setUploadBrand(extracted.detectedBrand);
        setBrandName(extracted.detectedBrand);
      }
      if (extracted.detectedProductName && extracted.detectedProductName.length > 3) {
        setUploadProductName(extracted.detectedProductName);
        setProductName(extracted.detectedProductName);
      }
    } catch (err) {
      console.warn('Live OCR extraction error:', err);
    } finally {
      setIsLiveOcrRunning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleAutoDetect = () => {
    setIsAutoDetecting(true);
    setTimeout(() => {
      setIsAutoDetecting(false);
      if (!uploadBrand || uploadBrand === 'Custom Brand') {
        applyBrandTemplate(UPLOAD_BRAND_TEMPLATES[0]);
      }
    }, 700);
  };

  const calcUploadScore = () => {
    let score = 100;
    if (!uploadIncludesTaxes) score -= 20;
    if (!uploadFontHeightOk) score -= 15;
    if (!uploadCareEmail.trim()) score -= 15;
    if (!uploadOrigin.trim()) score -= 10;
    if (!uploadManufacturerAddress.trim() || uploadManufacturerAddress.length < 15) score -= 15;
    if (!uploadUsp.trim()) score -= 10;
    return Math.max(20, Math.min(100, score));
  };

  const handleStartAnalysis = () => {
    if (!uploadedImage) return;

    setIsScanning(true);
    setScanStep(0);

    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < 4) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            finishScanning();
          }, 350);
          return prev;
        }
      });
    }, 360);
  };

  const finishScanning = async () => {
    setIsScanning(false);

    // Custom upload mode
    if (activeMode === 'upload' || selectedPresetId === 'custom-upload') {
      const customFields: DeclarationField[] = [
        {
          id: 'f-up-1',
          key: 'mfg_identity',
          label: 'Manufacturer / Packer Name & Address',
          value: `${uploadBrand} — ${uploadManufacturerAddress}`,
          confidence: uploadManufacturerAddress.length >= 15 ? 98 : 65,
          ruleReference: 'Rule 6(1)(a)',
          status: uploadManufacturerAddress.length >= 15 ? 'pass' : 'violation',
          statusExplanation: uploadManufacturerAddress.length >= 15
            ? 'Declared registered manufacturer name and full postal address including state and PIN code.'
            : 'Incomplete manufacturer address detected.',
          boundingBox: { x: 8, y: 64, width: 84, height: 9 }
        },
        {
          id: 'f-up-2',
          key: 'net_quantity',
          label: 'Net Quantity Declaration',
          value: uploadNetQty,
          confidence: 96,
          ruleReference: 'Rule 6(1)(b) & Rule 7',
          status: uploadFontHeightOk ? 'pass' : 'violation',
          statusExplanation: uploadFontHeightOk 
            ? 'Compliant with prescribed Schedule II area & font height standards.' 
            : 'VIOLATION: Numeral font height below prescribed minimum threshold under Rule 7.',
          boundingBox: { x: 10, y: 45, width: 38, height: 9 }
        },
        {
          id: 'f-up-3',
          key: 'mrp',
          label: 'Maximum Retail Price (MRP)',
          value: `₹ ${uploadMrp} ${uploadIncludesTaxes ? '(Incl. of all taxes)' : ''}`,
          confidence: 98,
          ruleReference: 'Rule 6(1)(c)',
          status: uploadIncludesTaxes ? 'pass' : 'violation',
          statusExplanation: uploadIncludesTaxes
            ? 'MRP format compliant with currency symbol and explicit "Inclusive of all taxes" statement.'
            : 'VIOLATION: Missing mandatory statutory wording "Inclusive of all taxes" under Rule 6(1)(c).',
          boundingBox: { x: 50, y: 45, width: 40, height: 9 }
        },
        {
          id: 'f-up-4',
          key: 'unit_sale_price',
          label: 'Unit Sale Price (USP)',
          value: `₹ ${uploadUsp}`,
          confidence: 95,
          ruleReference: 'Rule 6(11)',
          status: uploadUsp.trim() ? 'pass' : 'violation',
          statusExplanation: 'Unit Sale Price declared in metric unit (Rule 6(11)).',
          boundingBox: { x: 50, y: 53, width: 38, height: 4 }
        },
        {
          id: 'f-up-5',
          key: 'mfg_date',
          label: 'Month & Year of Manufacture',
          value: uploadMfgDate,
          confidence: 97,
          ruleReference: 'Rule 6(1)(d)',
          status: 'pass',
          statusExplanation: `Month and year declared clearly (${uploadMfgDate}) with ${uploadExpiry}.`,
          boundingBox: { x: 8, y: 56, width: 84, height: 6 }
        },
        {
          id: 'f-up-6',
          key: 'country_of_origin',
          label: 'Country of Origin',
          value: uploadOrigin,
          confidence: 98,
          ruleReference: 'Rule 6(1)(aa)',
          status: uploadOrigin.trim() ? 'pass' : 'violation',
          statusExplanation: `Prominent declaration of country of origin as "${uploadOrigin}".`,
          boundingBox: { x: 8, y: 74, width: 84, height: 5 }
        },
        {
          id: 'f-up-7',
          key: 'consumer_care',
          label: 'Consumer Care Cell Details',
          value: `${uploadCareName}, ${uploadBrand}, Tel: ${uploadCarePhone}, Email: ${uploadCareEmail || 'NOT DECLARED'}, Addr: ${uploadCareAddress}`,
          confidence: 96,
          ruleReference: 'Rule 6(1)(f)',
          status: uploadCareEmail.trim() ? 'pass' : 'violation',
          statusExplanation: uploadCareEmail.trim()
            ? 'Designated grievance officer, helpline number, and customer care email ID declared.'
            : 'VIOLATION: Missing mandatory electronic contact email for consumer grievances under Rule 6(1)(f).',
          boundingBox: { x: 10, y: 80, width: 80, height: 10 }
        }
      ];

      const evidence: ProductIdentityEvidence = {
        detectedBrand: uploadBrand.trim() || 'Unknown',
        brandConfidence: uploadBrand.trim() ? 92 : 15,
        detectedProductName: uploadProductName.trim() || 'Unidentified Commodity',
        productNameConfidence: uploadProductName.trim() ? 90 : 20,
        detectedManufacturer: uploadManufacturerAddress.trim() || 'Not Detected',
        manufacturerConfidence: uploadManufacturerAddress.length > 15 ? 90 : 20,
        detectedBarcode: uploadBarcode.trim(),
        barcodeConfidence: uploadBarcode.trim() ? 95 : 0,
        detectedNetQuantity: uploadNetQty.trim(),
        netQuantityConfidence: 95,
        detectedMRP: `₹ ${uploadMrp}`,
        mrpConfidence: 95,
        detectedBatchNumber: uploadBatch,
        detectedDates: uploadMfgDate,
        detectedFSSAI: uploadFssaiNumber.trim() || ((uploadCategory === 'Food & Snacks' || uploadCategory === 'Beverages & Drinks') ? '10014011000263' : ''),
        isIdentityConfirmed: false,
        confirmationStatus: 'unconfirmed',
        matchingSignalsCount: [uploadBrand, uploadProductName, uploadManufacturerAddress, uploadBarcode, uploadNetQty].filter(Boolean).length
      };

      const onlineResult = await productVerificationService.verifyProduct(evidence);
      const conflicts = productVerificationService.detectDataConflicts(evidence, onlineResult);

      setPendingFields(customFields);
      setPendingEvidence(evidence);
      setPendingOnlineResult(onlineResult);
      setPendingConflicts(conflicts);
      setPendingCategory(uploadCategory);
      setPendingNotes(uploadOfficerNotes);
      setPendingLabelImage(uploadedImage);
      setShowConfirmModal(true);
      return;
    }

    // Preset selection
    const preset = DEMO_PRESETS.find(p => p.id === selectedPresetId) || DEMO_PRESETS[0];

    const evidence: ProductIdentityEvidence = preset.identityEvidence || {
      detectedBrand: preset.brand,
      brandConfidence: preset.id === 'demo-uncertain-product' ? 12 : 96,
      detectedProductName: preset.productName,
      productNameConfidence: preset.id === 'demo-uncertain-product' ? 25 : 95,
      detectedManufacturer: preset.brand,
      manufacturerConfidence: preset.id === 'demo-uncertain-product' ? 15 : 92,
      detectedBarcode: preset.barcode,
      barcodeConfidence: preset.barcode ? 95 : 0,
      detectedNetQuantity: preset.fields.find(f => f.key.includes('net'))?.value || '500 g',
      netQuantityConfidence: preset.id === 'demo-uncertain-product' ? 40 : 96,
      detectedMRP: preset.fields.find(f => f.key === 'mrp')?.value || '₹ 385.00',
      mrpConfidence: preset.id === 'demo-uncertain-product' ? 10 : 98,
      detectedBatchNumber: preset.batchNo,
      detectedDates: '08/2026',
      isIdentityConfirmed: preset.id !== 'demo-uncertain-product',
      confirmationStatus: preset.id === 'demo-uncertain-product' ? 'unconfirmed' : 'confirmed',
      matchingSignalsCount: preset.id === 'demo-uncertain-product' ? 0 : 5
    };

    const onlineResult = preset.onlineVerification || await productVerificationService.verifyProduct(evidence);
    const conflicts = preset.dataConflicts || productVerificationService.detectDataConflicts(evidence, onlineResult);

    setPendingFields(preset.fields);
    setPendingEvidence(evidence);
    setPendingOnlineResult(onlineResult);
    setPendingConflicts(conflicts);
    setPendingCategory(preset.category);
    setPendingNotes(preset.officerNotes);
    setPendingLabelImage(uploadedImage || preset.image);
    setShowConfirmModal(true);
  };

  // User confirms product identity in Modal
  const handleConfirmProduct = () => {
    if (!pendingEvidence) return;
    const confirmedEvidence: ProductIdentityEvidence = {
      ...pendingEvidence,
      isIdentityConfirmed: true,
      confirmationStatus: 'confirmed'
    };

    // 1. Legal Metrology Compliance Engine (Category-aware)
    const pcrResults = evaluateLegalMetrologyRules(pendingFields, pendingCategory);

    // 2. FSSAI Food Label Compliance Module (Packaged food only)
    const fssaiResults = evaluateFSSAIRules(pendingFields, pendingCategory);

    // 3. Compute Honest Overall Status
    const overallStatus = computeOverallStatus(
      confirmedEvidence,
      pcrResults,
      fssaiResults,
      pendingConflicts
    );

    // Calculate dynamic compliance score
    const totalRules = pcrResults.length + (fssaiResults ? fssaiResults.length : 0);
    const passCount = pcrResults.filter(r => r.status === 'pass').length + 
      (fssaiResults ? fssaiResults.filter(r => r.status === 'pass').length : 0);
    const score = totalRules > 0 ? Math.round((passCount / totalRules) * 100) : 80;

    const newInspection: InspectionRecord = {
      id: `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      inspectorName: currentUser.name,
      inspectorDesignation: currentUser.role,
      inspectorZone: currentUser.zone,
      productName: confirmedEvidence.detectedProductName,
      brand: confirmedEvidence.detectedBrand,
      category: pendingCategory,
      batchNumber: confirmedEvidence.detectedBatchNumber || 'N/A',
      barcode: confirmedEvidence.detectedBarcode,
      labelImage: pendingLabelImage || uploadedImage,
      fields: pendingFields,
      ruleResults: pcrResults,
      identityEvidence: confirmedEvidence,
      onlineVerification: pendingOnlineResult || undefined,
      fssaiResults: fssaiResults,
      dataConflicts: pendingConflicts,
      complianceScore: score,
      overallStatus: overallStatus,
      officerNotes: pendingNotes || 'Inspection conducted under PCR 2011 with verified product identity signals.',
      isVerified: false
    };

    setShowConfirmModal(false);
    onScanComplete(newInspection);
  };

  // User bypasses online verification (explicitly unconfirmed identity)
  const handleContinueWithoutVerification = () => {
    if (!pendingEvidence) return;
    const bypassedEvidence: ProductIdentityEvidence = {
      ...pendingEvidence,
      isIdentityConfirmed: false,
      confirmationStatus: 'bypassed'
    };

    const pcrResults = evaluateLegalMetrologyRules(pendingFields, pendingCategory);
    const fssaiResults = evaluateFSSAIRules(pendingFields, pendingCategory);

    const totalRules = pcrResults.length + (fssaiResults ? fssaiResults.length : 0);
    const passCount = pcrResults.filter(r => r.status === 'pass').length + 
      (fssaiResults ? fssaiResults.filter(r => r.status === 'pass').length : 0);
    const score = Math.min(65, totalRules > 0 ? Math.round((passCount / totalRules) * 100) : 50);

    const newInspection: InspectionRecord = {
      id: `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      inspectorName: currentUser.name,
      inspectorDesignation: currentUser.role,
      inspectorZone: currentUser.zone,
      productName: bypassedEvidence.detectedProductName,
      brand: bypassedEvidence.detectedBrand,
      category: pendingCategory,
      batchNumber: bypassedEvidence.detectedBatchNumber || 'N/A',
      barcode: bypassedEvidence.detectedBarcode,
      labelImage: pendingLabelImage || uploadedImage,
      fields: pendingFields,
      ruleResults: pcrResults,
      identityEvidence: bypassedEvidence,
      onlineVerification: pendingOnlineResult || undefined,
      fssaiResults: fssaiResults,
      dataConflicts: pendingConflicts,
      complianceScore: score,
      overallStatus: 'Product identity not confirmed',
      officerNotes: 'Identity not confirmed — manual verification required. Inspection proceeded without confirmed identity signals.',
      isVerified: false
    };

    setShowConfirmModal(false);
    onScanComplete(newInspection);
  };

  // Re-search online verification service
  const handleSearchAgain = async () => {
    if (!pendingEvidence) return;
    setIsSearchingAgain(true);
    try {
      const freshResult = await productVerificationService.verifyProduct(pendingEvidence);
      const freshConflicts = productVerificationService.detectDataConflicts(pendingEvidence, freshResult);
      setPendingOnlineResult(freshResult);
      setPendingConflicts(freshConflicts);
    } finally {
      setIsSearchingAgain(false);
    }
  };

  // Officer manually corrects product details in confirmation screen
  const handleUpdateEvidence = async (updated: ProductIdentityEvidence) => {
    setPendingEvidence(updated);
    const updatedFields = pendingFields.map(f => {
      if (f.key === 'mrp') return { ...f, value: updated.detectedMRP || f.value };
      if (f.key === 'net_quantity' || f.key === 'net_qty') return { ...f, value: updated.detectedNetQuantity || f.value };
      if (f.key === 'mfg_identity') return { ...f, value: `${updated.detectedBrand} — ${updated.detectedManufacturer || ''}` };
      return f;
    });
    setPendingFields(updatedFields);

    setIsSearchingAgain(true);
    try {
      const freshResult = await productVerificationService.verifyProduct(updated);
      const freshConflicts = productVerificationService.detectDataConflicts(updated, freshResult);
      setPendingOnlineResult(freshResult);
      setPendingConflicts(freshConflicts);
    } finally {
      setIsSearchingAgain(false);
    }
  };

  // Submit Manual Inspection Entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine violations based on manual checks
    const hasTaxesViolation = !manualIncludesTaxes;
    const hasFontViolation = !manualFontHeightOk;
    const hasEmailViolation = !manualCareEmail.trim();

    let score = 100;
    if (hasTaxesViolation) score -= 20;
    if (hasFontViolation) score -= 15;
    if (hasEmailViolation) score -= 15;

    const overallStatus: 'Compliant' | 'Needs Manual Verification' | 'Potential Violation' = 
      score >= 90 ? 'Compliant' : score >= 70 ? 'Needs Manual Verification' : 'Potential Violation';

    const manualFields: DeclarationField[] = [
      {
        id: 'f-1',
        key: 'mfg_identity',
        label: 'Manufacturer / Packer Identity',
        value: manualAddress,
        confidence: 100,
        ruleReference: 'Rule 6(1)(a)',
        status: 'pass',
        statusExplanation: 'Verified manufacturer name and complete address with PIN code.',
        boundingBox: { x: 10, y: 65, width: 80, height: 10 }
      },
      {
        id: 'f-2',
        key: 'net_qty',
        label: 'Net Quantity',
        value: manualNetQty,
        confidence: 100,
        ruleReference: 'Rule 6(1)(b)',
        status: manualFontHeightOk ? 'pass' : 'violation',
        statusExplanation: manualFontHeightOk 
          ? 'Compliant with Schedule II area & font height requirements.'
          : 'Numeral font height below statutory minimum requirement.',
        boundingBox: { x: 10, y: 45, width: 35, height: 8 }
      },
      {
        id: 'f-3',
        key: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        value: `₹ ${manualMrp} ${manualIncludesTaxes ? '(Incl. of all taxes)' : ''}`,
        confidence: 100,
        ruleReference: 'Rule 6(1)(c)',
        status: manualIncludesTaxes ? 'pass' : 'violation',
        statusExplanation: manualIncludesTaxes 
          ? 'MRP is compliant and explicitly mentions "Inclusive of all taxes".'
          : 'VIOLATION: Missing mandatory "Inclusive of all taxes" wording under Rule 6(1)(c).',
        boundingBox: { x: 50, y: 45, width: 40, height: 8 }
      },
      {
        id: 'f-4',
        key: 'mfg_date',
        label: 'Date of Manufacture / Packing',
        value: manualMfgDate,
        confidence: 100,
        ruleReference: 'Rule 6(1)(d)',
        status: 'pass',
        statusExplanation: 'Valid month and year declared on package.',
        boundingBox: { x: 10, y: 55, width: 80, height: 8 }
      },
      {
        id: 'f-5',
        key: 'origin',
        label: 'Country of Origin',
        value: manualOrigin,
        confidence: 100,
        ruleReference: 'Rule 6(1)(aa)',
        status: 'pass',
        statusExplanation: 'Country of origin clearly stated.',
        boundingBox: { x: 10, y: 75, width: 80, height: 6 }
      },
      {
        id: 'f-6',
        key: 'consumer_care',
        label: 'Consumer Care Redressal',
        value: `Tel: ${manualCarePhone} | Email: ${manualCareEmail || 'NOT PROVIDED'}`,
        confidence: 100,
        ruleReference: 'Rule 6(1)(f)',
        status: manualCareEmail.trim() ? 'pass' : 'violation',
        statusExplanation: manualCareEmail.trim() 
          ? 'Both telephone and electronic contact email provided.'
          : 'VIOLATION: Missing mandatory consumer grievance email ID.',
        boundingBox: { x: 10, y: 82, width: 80, height: 8 }
      },
      {
        id: 'f-7',
        key: 'usp',
        label: 'Unit Sale Price (USP)',
        value: `₹ ${manualUsp}`,
        confidence: 100,
        ruleReference: 'Rule 6(11)',
        status: 'pass',
        statusExplanation: 'Unit sale price declared in standard metric units.',
        boundingBox: { x: 50, y: 52, width: 40, height: 6 }
      }
    ];

    const manualRuleResults: RuleResult[] = [
      {
        ruleId: 'r-1',
        ruleCode: 'PCR-R6-1-A',
        title: 'Manufacturer & Packer Name / Address',
        legalSection: 'Rule 6(1)(a)',
        status: 'pass',
        explanation: 'Manufacturer and complete address including PIN code verified.'
      },
      {
        ruleId: 'r-2',
        ruleCode: 'PCR-R6-1-B',
        title: 'Net Quantity Declaration & Units',
        legalSection: 'Rule 6(1)(b) & Rule 7',
        status: manualFontHeightOk ? 'pass' : 'violation',
        explanation: manualFontHeightOk ? 'Net quantity matches standard unit symbol.' : 'Font size height below minimum prescribed table.'
      },
      {
        ruleId: 'r-3',
        ruleCode: 'PCR-R6-1-C',
        title: 'Maximum Retail Price & Taxes Phrase',
        legalSection: 'Rule 6(1)(c)',
        status: manualIncludesTaxes ? 'pass' : 'violation',
        explanation: manualIncludesTaxes ? 'MRP includes required taxes phrase.' : 'Mandatory taxes phrase absent.'
      },
      {
        ruleId: 'r-4',
        ruleCode: 'PCR-R6-1-F',
        title: 'Consumer Care Email & Telephone',
        legalSection: 'Rule 6(1)(f)',
        status: manualCareEmail.trim() ? 'pass' : 'violation',
        explanation: manualCareEmail.trim() ? 'Consumer grievance contacts provided.' : 'Missing required grievance email ID.'
      }
    ];

    const manualEvidence: ProductIdentityEvidence = {
      detectedBrand: manualBrand,
      brandConfidence: 100,
      detectedProductName: manualName,
      productNameConfidence: 100,
      detectedManufacturer: manualAddress,
      manufacturerConfidence: 100,
      detectedBarcode: manualBarcode,
      barcodeConfidence: manualBarcode ? 100 : 0,
      detectedNetQuantity: manualNetQty,
      netQuantityConfidence: 100,
      detectedMRP: `₹ ${manualMrp}`,
      mrpConfidence: 100,
      detectedBatchNumber: manualBatch,
      detectedDates: manualMfgDate,
      isIdentityConfirmed: true,
      confirmationStatus: 'confirmed',
      matchingSignalsCount: 5
    };

    const manualRecord: InspectionRecord = {
      id: `MANUAL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      inspectorName: currentUser.name,
      inspectorDesignation: currentUser.role,
      inspectorZone: currentUser.zone,
      productName: manualName,
      brand: manualBrand,
      category: manualCategory,
      batchNumber: manualBatch,
      barcode: manualBarcode,
      labelImage: DEMO_LABELS.compliantFood,
      fields: manualFields,
      ruleResults: manualRuleResults,
      identityEvidence: manualEvidence,
      onlineVerification: {
        sourceName: 'On-Site Inspector Physical Verification',
        sourceUrl: '',
        matchedProductName: manualName,
        matchedBrand: manualBrand,
        matchedManufacturer: manualAddress,
        matchedMRP: `₹ ${manualMrp}`,
        matchedNetQuantity: manualNetQty,
        matchConfidence: 100,
        verificationStatus: 'Verified from source',
        explanation: 'Physically inspected on-site by Legal Metrology officer using calibrated standard instruments.',
        isMockData: false
      },
      fssaiResults: (manualCategory === 'Food & Snacks' || manualCategory === 'Beverages & Drinks') ? evaluateFSSAIRules(manualFields, manualCategory) : undefined,
      dataConflicts: [],
      complianceScore: score,
      overallStatus,
      officerNotes: manualOfficerNotes,
      isVerified: true,
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onScanComplete(manualRecord);
  };

  const handlePreFillCompliant = () => {
    setManualName('NutriSnack Roasted & Salted Almond Kernels');
    setManualBrand('NutriSnack Foods Pvt. Ltd.');
    setManualCategory('Food & Snacks');
    setManualBatch('NS-ALM-2608');
    setManualBarcode('8901234567890');
    setManualAddress('NutriSnack Foods Pvt. Ltd., Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana - 122015, India.');
    setManualNetQty('500 g');
    setManualFontHeightOk(true);
    setManualMrp('385.00');
    setManualIncludesTaxes(true);
    setManualUsp('0.77 / g');
    setManualMfgDate('08/2026');
    setManualOrigin('India');
    setManualCarePhone('1800-11-2233');
    setManualCareEmail('grievance@nutrisnack.in');
    setManualOfficerNotes('On-site verification in Hazratganj. Measured font height at 4.2mm (above 4.0mm requirement). Compliant.');
  };

  const handlePreFillViolation = () => {
    setManualName('Sparkle Glow Herbal Shampoo (250ml)');
    setManualBrand('Sparkle Care Products');
    setManualCategory('Cosmetics & Toiletries');
    setManualBatch('SG-SH-2026B');
    setManualBarcode('8909876543210');
    setManualAddress('Sparkle Care Products, Industrial Area, Phase II, New Delhi - 110020');
    setManualNetQty('250 ml');
    setManualFontHeightOk(false);
    setManualMrp('220.00');
    setManualIncludesTaxes(false);
    setManualUsp('0.88 / ml');
    setManualMfgDate('06/2026');
    setManualOrigin('India');
    setManualCarePhone('011-22334455');
    setManualCareEmail('');
    setManualOfficerNotes('Show cause notice recommended. Missing taxes wording on MRP sticker and absent consumer email address under Rule 6(1)(f).');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <ScanLine className="w-4 h-4 text-blue-600" />
            <span>AI Optical Inspection Terminal &bull; Legal Metrology</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Product Packaging Inspection Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select a packaged product below, calibrate optical parameters, or switch to Manual Add for physical on-site enforcement.
          </p>
        </div>

        {/* 3-Way Mode Switcher: Presets, Upload, Manual Add */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveMode('presets')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'presets'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Optical Scanner</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('upload');
              setSelectedPresetId('custom-upload');
            }}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload Photo &amp; Brand Details</span>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">New</span>
          </button>

          <button
            onClick={() => setActiveMode('manual')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'manual'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manual Add</span>
          </button>
        </div>
      </div>

      {/* RENDER MODE 1 & 2: OPTICAL SCANNER WITH LIVE VIEWFINDER & OPTIC PARAMETERS */}
      {activeMode !== 'manual' && (
        <>
          {/* SECTION 1: VISUAL PRODUCT PICTURE CARDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Select Product Packaging Picture to Inspect:</span>
              </h2>
              <span className="text-xs text-slate-400">Click any card to load into the Scanner Viewfinder</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Demo 1 - Fully Compliant Food Sample */}
              <div
                onClick={() => {
                  handleSelectPreset('demo-food-compliant');
                  setActiveMode('presets');
                }}
                className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-xs hover:shadow-md relative flex flex-col justify-between ${
                  selectedPresetId === 'demo-food-compliant' && activeMode === 'presets'
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative h-40 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2 group">
                    <img
                      src={DEMO_LABELS.compliantFood}
                      alt="NutriSnack Roasted Almonds 500g"
                      className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Demo 1: Identified</span>
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                      500 g &bull; ₹385.00
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 uppercase">
                      Food &amp; Snacks
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-display mt-1">
                      NutriSnack Roasted Almonds
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Confirmed identity (96% match). PCR 2011 &amp; FSSAI 2020 compliant.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-600">Match: 96%</span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                    selectedPresetId === 'demo-food-compliant' && activeMode === 'presets'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedPresetId === 'demo-food-compliant' && activeMode === 'presets' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Loaded</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Card 2: Demo 2 - Uncertain Product Sample */}
              <div
                onClick={() => {
                  handleSelectPreset('demo-uncertain-product');
                  setActiveMode('presets');
                }}
                className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-xs hover:shadow-md relative flex flex-col justify-between ${
                  selectedPresetId === 'demo-uncertain-product' && activeMode === 'presets'
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md bg-amber-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative h-40 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2 group">
                    <img
                      src={DEMO_LABELS.uncertainProduct}
                      alt="Torn / Low Confidence Packaging"
                      className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Demo 2: Uncertain</span>
                    </span>
                    <span className="absolute bottom-2 right-2 bg-amber-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                      Torn &bull; No Barcode
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 uppercase">
                      General Commodities
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-display mt-1">
                      Unidentified Herbal Mixture
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Incomplete OCR &bull; Shows "Product identity not confirmed" &bull; Manual edit demo.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-600">Match: 0% (Uncertain)</span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                    selectedPresetId === 'demo-uncertain-product' && activeMode === 'presets'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedPresetId === 'demo-uncertain-product' && activeMode === 'presets' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Loaded</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Card 3: Cosmetic Sample (PCR Violations, Non-food) */}
              <div
                onClick={() => {
                  handleSelectPreset('demo-cosmetic-review');
                  setActiveMode('presets');
                }}
                className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-xs hover:shadow-md relative flex flex-col justify-between ${
                  selectedPresetId === 'demo-cosmetic-review' && activeMode === 'presets'
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative h-40 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden p-2 group">
                    <img
                      src={DEMO_LABELS.violationCosmetic}
                      alt="Sparkle Glow Herbal Shampoo"
                      className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Non-Food Sample</span>
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                      250 ml &bull; MRP 220/-
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 uppercase">
                      Cosmetics &amp; Personal Care
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-display mt-1">
                      Sparkle Glow Shampoo
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      PCR violations detected &bull; Zero FSSAI rules evaluated (Non-food).
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-600">Expected Score: 64%</span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                    selectedPresetId === 'demo-cosmetic-review' && activeMode === 'presets'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedPresetId === 'demo-cosmetic-review' && activeMode === 'presets' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Loaded</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Card 4: Custom Packaging Upload & Brand Declarations */}
              <div
                onClick={() => {
                  setActiveMode('upload');
                  setSelectedPresetId('custom-upload');
                }}
                className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-xs hover:shadow-md relative flex flex-col justify-between ${
                  activeMode === 'upload' || selectedPresetId === 'custom-upload'
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative h-40 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2 group">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Packaging"
                      className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Custom Photo</span>
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                      {uploadNetQty} &bull; ₹{uploadMrp}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 uppercase">
                      {uploadBrand.split(' ')[0]}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-display mt-1 line-clamp-1">
                      {uploadProductName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      Upload any packaging photo &bull; Multi-signal verification.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${calcUploadScore() >= 90 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    Score: {calcUploadScore()}%
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md"
                    >
                      Browse
                    </button>
                    <span className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 ${
                      activeMode === 'upload' || selectedPresetId === 'custom-upload'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {activeMode === 'upload' || selectedPresetId === 'custom-upload' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active / Edit</span>
                        </>
                      ) : (
                        <span>Select &amp; Edit</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: HIGH-TECH SCANNER VIEWFINDER TERMINAL & OPTIC PARAMETERS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Optical Scanner Viewfinder &amp; Hardware Calibrator:</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Active Commodity: <strong className="text-slate-900">
                  {activeMode === 'upload' || selectedPresetId === 'custom-upload' 
                    ? `${uploadProductName} (${uploadBrand})` 
                    : productName}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Cols: Viewfinder Canvas with Laser Scanner HUD & Reactive Optics */}
              <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl overflow-hidden relative flex flex-col justify-between">
                {/* Viewfinder Top Bar HUD */}
                <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-slate-200 font-bold">VIEWFINDER READY</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-[11px] text-cyan-300">EXP: {exposureEV > 0 ? `+${exposureEV}` : exposureEV} EV</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-[11px] text-blue-400">MAG: {magnification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span>FPS: 60</span>
                    <span className="text-slate-400">ZONE: LUCKNOW</span>
                  </div>
                </div>

                {/* Target Package Image with Camera Overlay HUD */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="relative my-4 flex items-center justify-center min-h-[460px] max-h-[520px] bg-slate-900/80 rounded-2xl overflow-hidden p-3"
                >
                  {/* Loaded Product Image with reactive magnification, exposure, and illumination */}
                  <img
                    src={uploadedImage}
                    alt="Product Package Preview"
                    style={{
                      filter: `brightness(${1 + exposureEV * 0.25}) ${
                        spectralCalibration.includes('UV') 
                          ? 'hue-rotate(240deg) saturate(2)' 
                          : spectralCalibration.includes('3200K') 
                          ? 'sepia(0.3)' 
                          : spectralCalibration.includes('Green')
                          ? 'hue-rotate(90deg) contrast(1.3)'
                          : ''
                      }`
                    }}
                    className={`max-h-[440px] w-auto object-contain rounded-lg transition-all duration-300 ${
                      magnification === '1.0x' 
                        ? 'scale-100' 
                        : magnification === '2.0x' 
                        ? 'scale-125' 
                        : 'scale-150'
                    } ${
                      ledIlluminator === '45%' 
                        ? 'ring-2 ring-white/60 shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                        : ledIlluminator === '100%'
                        ? 'ring-4 ring-white/90 shadow-[0_0_60px_rgba(255,255,255,0.8)]'
                        : 'shadow-2xl'
                    }`}
                  />

                  {/* Viewfinder Reticle Corner Brackets */}
                  <div className="absolute inset-6 pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-md"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-md"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-md"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-md"></div>

                    {/* Center Crosshairs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <Crosshair className="w-12 h-12 text-cyan-400" />
                    </div>
                  </div>

                  {/* Laser Scanning Animation Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-blue-950/20 pointer-events-none">
                      <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-500 shadow-[0_0_20px_#38bdf8] animate-scan-laser"></div>
                      
                      {/* Floating OCR Detection Tags */}
                      <div className="absolute top-12 left-12 bg-slate-900/90 text-cyan-300 text-[10px] font-mono px-2 py-1 rounded border border-cyan-500/40 shadow-lg animate-pulse">
                        {activeMode === 'upload' || selectedPresetId === 'custom-upload' 
                          ? `BRAND: ${uploadBrand.substring(0, 18)} | MRP: ₹${uploadMrp}`
                          : 'RULE 6(1)(c): MRP DETECTED'}
                      </div>
                      <div className="absolute top-36 right-12 bg-slate-900/90 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/40 shadow-lg animate-pulse">
                        {activeMode === 'upload' || selectedPresetId === 'custom-upload' 
                          ? `NET QTY: ${uploadNetQty} | USP: ₹${uploadUsp}`
                          : 'RULE 6(1)(b): NET QTY PARSED'}
                      </div>
                      <div className="absolute bottom-16 left-16 bg-slate-900/90 text-amber-300 text-[10px] font-mono px-2 py-1 rounded border border-amber-500/40 shadow-lg animate-pulse">
                        {activeMode === 'upload' || selectedPresetId === 'custom-upload' 
                          ? `CARE: ${uploadCareEmail || 'MISSING EMAIL'}`
                          : 'RULE 6(1)(f): CONSUMER CARE CELL'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom HUD Information Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="text-slate-300">ARCHETYPE: {labelArchetype}</span>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace Package</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Right 5 Cols: Exact Optic Parameters Card + Big Scan Trigger */}
              <div className="lg:col-span-5 space-y-4">
                {/* OPTIC PARAMETERS CARD (Themed Harmoniously to LabelCheck AI Portal) */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
                  {/* Title & Live Sync */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-blue-600 font-mono font-bold text-xs tracking-wider">
                      <Sliders className="w-4 h-4 text-blue-600" />
                      <span>OPTIC PARAMETERS</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                      <span>LIVE SYNC</span>
                    </span>
                  </div>

                  {/* 1. EXPOSURE (EV) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                        EXPOSURE (EV):
                      </span>
                      <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {exposureEV > 0 ? `+${exposureEV.toFixed(1)}` : exposureEV.toFixed(1)} EV
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min="-2.0"
                        max="2.0"
                        step="0.1"
                        value={exposureEV}
                        onChange={(e) => setExposureEV(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 border border-slate-200"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                        <span>-2.0</span>
                        <span className="text-slate-600 font-bold">0.0 (Auto)</span>
                        <span>+2.0</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. MAGNIFICATION */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                        MAGNIFICATION:
                      </span>
                      <span className="text-blue-600 font-bold text-xs">
                        {magnification}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['1.0x', '2.0x', '4.0x'] as const).map((mag) => (
                        <button
                          key={mag}
                          type="button"
                          onClick={() => setMagnification(mag)}
                          className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                            magnification === mag
                              ? 'bg-blue-600 text-white shadow-xs border border-blue-600'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                          }`}
                        >
                          {mag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. FOCUS ENGINE */}
                  <div className="space-y-2">
                    <span className="text-slate-600 font-bold uppercase tracking-wider text-[11px] font-mono block">
                      FOCUS ENGINE:
                    </span>
                    <div className="space-y-1.5">
                      {[
                        'Auto Continuous (AF-C)',
                        'Macro OCR Lock',
                        'Manual Pinpoint'
                      ].map((mode) => {
                        const isActive = focusEngine === mode;
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setFocusEngine(mode as any)}
                            className={`w-full py-2 px-3.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                              isActive
                                ? 'bg-blue-50 text-blue-800 border-2 border-blue-500 font-bold shadow-xs'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 font-medium'
                            }`}
                          >
                            <span>{mode}</span>
                            {isActive && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. LED RING ILLUMINATOR */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                        LED RING ILLUMINATOR:
                      </span>
                      <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {ledIlluminator === 'OFF' ? '0%' : ledIlluminator}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['OFF', '45%', '100%'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLedIlluminator(lvl)}
                          className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                            ledIlluminator === lvl
                              ? 'bg-amber-50 text-amber-900 border-2 border-amber-400 shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. SPECTRAL CALIBRATION */}
                  <div className="space-y-1.5">
                    <span className="text-slate-600 font-bold uppercase tracking-wider text-[11px] font-mono block">
                      SPECTRAL CALIBRATION:
                    </span>
                    <select
                      value={spectralCalibration}
                      onChange={(e) => setSpectralCalibration(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white text-slate-800 font-medium text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-colors"
                    >
                      <option value="5500K D65 (Standard Daylight)">5500K D65 (Standard Daylight)</option>
                      <option value="3200K Warm White (Tungsten)">3200K Warm White (Tungsten)</option>
                      <option value="6500K Cool White (Fluorescent)">6500K Cool White (Fluorescent)</option>
                      <option value="UV 365nm Wood's Lamp (Anti-Counterfeit)">UV 365nm Wood's Lamp (Anti-Counterfeit)</option>
                      <option value="Monochromatic Green 520nm (Contrast)">Monochromatic Green 520nm (Contrast)</option>
                    </select>
                  </div>

                  {/* 6. LABEL ARCHETYPE */}
                  <div className="space-y-1.5">
                    <span className="text-slate-600 font-bold uppercase tracking-wider text-[11px] font-mono block">
                      LABEL ARCHETYPE:
                    </span>
                    <select
                      value={labelArchetype}
                      onChange={(e) => setLabelArchetype(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white text-slate-800 font-medium text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-colors"
                    >
                      <option value="Rigid Container / Box">Rigid Container / Box</option>
                      <option value="Cylindrical Bottle / Can">Cylindrical Bottle / Can</option>
                      <option value="Flexible Pouch / Sachet">Flexible Pouch / Sachet</option>
                      <option value="Blister Pack / Strip">Blister Pack / Strip</option>
                      <option value="Corrugated Master Shipper">Corrugated Master Shipper</option>
                    </select>
                  </div>
                </div>

                {/* BIG PROMINENT SCAN BUTTON */}
                <div className="space-y-3">
                  <button
                    onClick={handleStartAnalysis}
                    disabled={isScanning || !uploadedImage}
                    className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all ${
                      isScanning
                        ? 'bg-slate-800 text-cyan-300 cursor-wait'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/30 hover:shadow-xl hover:scale-[1.01]'
                    }`}
                  >
                    {isScanning ? (
                      <>
                        <ScanLine className="w-5 h-5 animate-pulse text-cyan-300" />
                        <span>Optical Scanning Active ({scanStep + 1}/5)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span>⚡ SCAN &amp; VERIFY COMPLIANCE NOW</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Applies configured optic parameters to PCR 2011 engine</span>
                  </p>
                </div>

                {/* Pipeline Tracker when active */}
                {isScanning && (
                  <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm space-y-2">
                    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      AI Optical Pipeline:
                    </p>
                    <div className="space-y-1 text-xs">
                      {scanStages.map((stage, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-2 p-1.5 rounded transition-colors ${
                            idx === scanStep 
                              ? 'bg-blue-50 text-blue-900 font-bold' 
                              : idx < scanStep 
                              ? 'text-emerald-700' 
                              : 'text-slate-400 opacity-50'
                          }`}
                        >
                          {idx < scanStep ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : idx === scanStep ? (
                            <span className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0"></span>
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-slate-300 shrink-0"></div>
                          )}
                          <span className="truncate">{stage.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: UPLOADED PRODUCT BRAND & STATUTORY DECLARATIONS SPECIFICATION EDITOR */}
          {(activeMode === 'upload' || selectedPresetId === 'custom-upload') && (
            <div id="uploaded-declarations-panel" className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-200/90 shadow-md space-y-6">
              {/* Header with Title, Brand Badge & Quick AI Extract */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Uploaded Packaging Declarations &amp; Brand Profile Editor</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                    Inspect &amp; Customize All Product Statutory Details
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Configure which brand, registered manufacturer address, MRP, net quantity, unit sale price, dates, and consumer care details are verified under PCR 2011.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoDetect}
                    disabled={isAutoDetecting}
                    className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAutoDetecting ? 'animate-spin' : 'text-amber-300'}`} />
                    <span>{isAutoDetecting ? 'Detecting Label Details...' : '✨ Auto-Detect from Label'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                </div>
              </div>

              {/* Quick Brand Templates Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Quick Brand &amp; Product Presets (Click to Auto-fill &amp; Customize):
                  </span>
                  <span className="text-[11px] text-slate-400">All fields below remain 100% editable</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {UPLOAD_BRAND_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => applyBrandTemplate(tmpl)}
                      className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                        uploadSelectedTemplateId === tmpl.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>{tmpl.brand.split(' ')[0]} &bull; {tmpl.productName.split(' ')[1] || tmpl.productName.substring(0, 15)}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setUploadSelectedTemplateId('custom');
                      setUploadBrand('');
                      setUploadProductName('');
                      setUploadMrp('');
                      setUploadNetQty('');
                      setUploadUsp('');
                      setUploadManufacturerAddress('');
                      setUploadCareEmail('');
                      setUploadCarePhone('');
                    }}
                    className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Custom Brand (Blank)</span>
                  </button>
                </div>
              </div>

              {/* Live In-Browser Optical OCR Progress & Detection Banner */}
              {isLiveOcrRunning && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold text-blue-900">
                      <span>Running In-Browser Live Optical OCR (Tesseract.js WASM)...</span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(8, ocrProgress)}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {uploadFssaiNumber && !isLiveOcrRunning && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs text-emerald-900 font-semibold">
                      Live OCR Extracted 14-Digit FSSAI License: <strong className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800">{uploadFssaiNumber}</strong>
                    </span>
                  </div>
                  {ocrConfidence !== null && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                      OCR Confidence: {ocrConfidence}%
                    </span>
                  )}
                </div>
              )}

              {/* Live Compliance Score & Statutory Warning Bar */}
              <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                calcUploadScore() >= 90
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : calcUploadScore() >= 70
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                    calcUploadScore() >= 90 ? 'bg-emerald-600 text-white' : calcUploadScore() >= 70 ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {calcUploadScore()}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Live Compliance Preview: {calcUploadScore() >= 90 ? 'Fully Compliant' : calcUploadScore() >= 70 ? 'Needs Officer Review' : 'Potential Violation Detected'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                      {!uploadIncludesTaxes && (
                        <span className="bg-rose-600 text-white px-2 py-0.5 rounded font-semibold">
                          Rule 6(1)(c): Missing Taxes Statement
                        </span>
                      )}
                      {!uploadFontHeightOk && (
                        <span className="bg-amber-600 text-white px-2 py-0.5 rounded font-semibold">
                          Rule 7: Numeral Font Height &lt; 4mm
                        </span>
                      )}
                      {!uploadCareEmail.trim() && (
                        <span className="bg-rose-600 text-white px-2 py-0.5 rounded font-semibold">
                          Rule 6(1)(f): Missing Consumer Grievance Email
                        </span>
                      )}
                      {!uploadOrigin.trim() && (
                        <span className="bg-amber-600 text-white px-2 py-0.5 rounded font-semibold">
                          Rule 6(1)(aa): Missing Origin
                        </span>
                      )}
                      {uploadIncludesTaxes && uploadFontHeightOk && uploadCareEmail.trim() && uploadOrigin.trim() && (
                        <span className="text-emerald-700 font-semibold">
                          All 8 mandatory declarations meet Legal Metrology (Packaged Commodities) Rules, 2011 standards.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isScanning}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Scan This Product</span>
                </button>
              </div>

              {/* All Product Details Form Grid */}
              <div className="space-y-6 text-xs">
                {/* Pillar 1: Brand & Packaged Commodity Information */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>1. Brand Identity &amp; Packaged Commodity Particulars</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 flex items-center gap-1">
                        <span>Brand Name / Commercial Mark *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={uploadBrand}
                        onChange={(e) => {
                          setUploadBrand(e.target.value);
                          setBrandName(e.target.value);
                        }}
                        placeholder="e.g. Tata Consumer Products / Amul / Britannia"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Generic Commodity Name *</label>
                      <input
                        type="text"
                        required
                        value={uploadProductName}
                        onChange={(e) => {
                          setUploadProductName(e.target.value);
                          setProductName(e.target.value);
                        }}
                        placeholder="e.g. 100% Unpolished Toor Dal (1kg)"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Commodity Category *</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => {
                          setUploadCategory(e.target.value);
                          setCategory(e.target.value);
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none font-semibold text-slate-900"
                      >
                        {PRODUCT_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Batch / Lot Identification</label>
                      <input
                        type="text"
                        value={uploadBatch}
                        onChange={(e) => {
                          setUploadBatch(e.target.value);
                          setBatchNo(e.target.value);
                        }}
                        placeholder="e.g. TCP-TD-2026B"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Barcode / GTIN (EAN-13)</label>
                      <input
                        type="text"
                        value={uploadBarcode}
                        onChange={(e) => setUploadBarcode(e.target.value)}
                        placeholder="e.g. 8901030829142"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 flex items-center justify-between">
                        <span>FSSAI License (14-Digits)</span>
                        <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded font-bold">FoSCoS</span>
                      </label>
                      <input
                        type="text"
                        value={uploadFssaiNumber}
                        onChange={(e) => setUploadFssaiNumber(e.target.value)}
                        placeholder="e.g. 10014011000263"
                        maxLength={14}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none font-mono font-bold text-orange-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Rule 6(1)(a): Complete Manufacturer / Packer Address with PIN *</label>
                    <textarea
                      rows={2}
                      required
                      value={uploadManufacturerAddress}
                      onChange={(e) => setUploadManufacturerAddress(e.target.value)}
                      placeholder="Registered Entity Name, Plot/Building, Road/Sector, City, State - PIN Code, India"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pillar 2: Commercial Pricing & Net Quantity Declarations */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span>2. Pricing &amp; Net Metric Measurements (Rules 6(1)(b), 6(1)(c), 6(11))</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* MRP Box */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Rule 6(1)(c): Maximum Retail Price (MRP) *</span>
                        <span className="text-[10px] font-mono text-slate-400">Mandatory</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">₹</span>
                        <input
                          type="text"
                          required
                          value={uploadMrp}
                          onChange={(e) => setUploadMrp(e.target.value)}
                          placeholder="185.00"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={uploadIncludesTaxes}
                          onChange={(e) => setUploadIncludesTaxes(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-[11px] text-slate-700 font-medium">
                          Label includes explicit <strong>&quot;Inclusive of all taxes&quot;</strong> wording
                        </span>
                      </label>
                    </div>

                    {/* Net Quantity Box */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Rule 6(1)(b): Net Quantity &amp; Unit *</span>
                        <span className="text-[10px] font-mono text-slate-400">Schedule II</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={uploadNetQty}
                        onChange={(e) => setUploadNetQty(e.target.value)}
                        placeholder="e.g. 1 kg or 500 g or 250 ml"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                      />
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={uploadFontHeightOk}
                          onChange={(e) => setUploadFontHeightOk(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-[11px] text-slate-700 font-medium">
                          Numeral font height verified with gauge (&ge; 4.0mm compliant)
                        </span>
                      </label>
                    </div>

                    {/* Unit Sale Price */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <span className="font-bold text-slate-800 block">Rule 6(11): Unit Sale Price (USP) *</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">₹</span>
                        <input
                          type="text"
                          required
                          value={uploadUsp}
                          onChange={(e) => setUploadUsp(e.target.value)}
                          placeholder="e.g. 0.19 / g or 185.00 / kg"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">Mandatory for packages containing &gt; 100g or 100ml</span>
                    </div>

                    {/* Date of Manufacture */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <span className="font-bold text-slate-800 block">Rule 6(1)(d): Month &amp; Year of Mfg / Packing *</span>
                      <input
                        type="text"
                        required
                        value={uploadMfgDate}
                        onChange={(e) => setUploadMfgDate(e.target.value)}
                        placeholder="MM/YYYY (e.g. 08/2026)"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900"
                      />
                      <input
                        type="text"
                        value={uploadExpiry}
                        onChange={(e) => setUploadExpiry(e.target.value)}
                        placeholder="e.g. Best Before 12 Months from Mfd."
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Pillar 3: Origin & Consumer Care Redressal */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>3. Country of Origin &amp; Consumer Grievance Redressal (Rules 6(1)(aa), 6(1)(f))</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Rule 6(1)(aa): Country of Origin *</label>
                      <input
                        type="text"
                        required
                        value={uploadOrigin}
                        onChange={(e) => setUploadOrigin(e.target.value)}
                        placeholder="e.g. India"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Rule 6(1)(f): Consumer Care Helpline *</label>
                      <input
                        type="text"
                        required
                        value={uploadCarePhone}
                        onChange={(e) => setUploadCarePhone(e.target.value)}
                        placeholder="e.g. 1800-108-4488"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Rule 6(1)(f): Consumer Grievance Email *</label>
                      <input
                        type="email"
                        required
                        value={uploadCareEmail}
                        onChange={(e) => setUploadCareEmail(e.target.value)}
                        placeholder="e.g. care@tataconsumer.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Designated Consumer Care Official / Department</label>
                      <input
                        type="text"
                        value={uploadCareName}
                        onChange={(e) => setUploadCareName(e.target.value)}
                        placeholder="e.g. Executive - Consumer Care Cell"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Consumer Care Postal Address</label>
                      <input
                        type="text"
                        value={uploadCareAddress}
                        onChange={(e) => setUploadCareAddress(e.target.value)}
                        placeholder="Postal Address with PIN code"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Pillar 4: Officer Notes */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">
                    Official Audit Notes &amp; Verification Memorandum:
                  </label>
                  <textarea
                    rows={2}
                    value={uploadOfficerNotes}
                    onChange={(e) => setUploadOfficerNotes(e.target.value)}
                    placeholder="Official inspection findings, premises, or compounding remarks..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Auditing Officer: <strong>{currentUser.name}</strong> &bull; {currentUser.zone}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        applyBrandTemplate(UPLOAD_BRAND_TEMPLATES[0]);
                      }}
                      className="px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto"
                    >
                      Reset to Defaults
                    </button>
                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      disabled={isScanning}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow w-full sm:w-auto"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>⚡ Save &amp; Run Optical Scan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* RENDER MODE 3: MANUAL ADD / PHYSICAL ON-SITE INSPECTION ENTRY */}
      {activeMode === 'manual' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>On-Site Physical Audit Console</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Manual Inspection Entry ("Manual Add")
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manually record product packaging specifications and audit statutory declarations under the Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>

            {/* Quick Demo Pre-fill Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreFillCompliant}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
              >
                Pre-fill Compliant
              </button>
              <button
                type="button"
                onClick={handlePreFillViolation}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
              >
                Pre-fill Violation
              </button>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-6 text-xs">
            {/* 1. Commodity Identification */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Packaged Commodity Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Generic Commodity Name *</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. Roasted Almond Kernels"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Brand / Packer Name *</label>
                  <input
                    type="text"
                    required
                    value={manualBrand}
                    onChange={(e) => setManualBrand(e.target.value)}
                    placeholder="e.g. NutriSnack Foods"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Commodity Category *</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  >
                    {PRODUCT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Batch / Lot Number</label>
                  <input
                    type="text"
                    value={manualBatch}
                    onChange={(e) => setManualBatch(e.target.value)}
                    placeholder="e.g. NS-ALM-2608"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Barcode / GTIN</label>
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="e.g. 8901234567890"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Mandatory Statutory Declarations (PCR 2011) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Mandatory Declarations Audit (Rule 6, PCR 2011)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* MRP */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Rule 6(1)(c): Maximum Retail Price (MRP)</span>
                    <span className="text-[10px] font-mono text-slate-400">Mandatory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">₹</span>
                    <input
                      type="text"
                      required
                      value={manualMrp}
                      onChange={(e) => setManualMrp(e.target.value)}
                      placeholder="385.00"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={manualIncludesTaxes}
                      onChange={(e) => setManualIncludesTaxes(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-[11px] text-slate-700 font-medium">
                      Includes explicit <strong>&quot;Inclusive of all taxes&quot;</strong> wording
                    </span>
                  </label>
                </div>

                {/* Net Quantity */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Rule 6(1)(b): Net Quantity &amp; Unit</span>
                    <span className="text-[10px] font-mono text-slate-400">Schedule II</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={manualNetQty}
                    onChange={(e) => setManualNetQty(e.target.value)}
                    placeholder="e.g. 500 g or 250 ml"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={manualFontHeightOk}
                      onChange={(e) => setManualFontHeightOk(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-[11px] text-slate-700 font-medium">
                      Numeral font height verified with gauge (&ge; 4.0mm)
                    </span>
                  </label>
                </div>

                {/* Unit Sale Price */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-800 block">Rule 6(11): Unit Sale Price (USP)</span>
                  <input
                    type="text"
                    value={manualUsp}
                    onChange={(e) => setManualUsp(e.target.value)}
                    placeholder="e.g. 0.77 / g or 0.88 / ml"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                {/* Date of Manufacture */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-800 block">Rule 6(1)(d): Month &amp; Year of Mfg / Packing</span>
                  <input
                    type="text"
                    required
                    value={manualMfgDate}
                    onChange={(e) => setManualMfgDate(e.target.value)}
                    placeholder="MM/YYYY (e.g. 08/2026)"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Manufacturer Address */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Rule 6(1)(a): Complete Manufacturer / Packer Address with PIN *</label>
                <textarea
                  rows={2}
                  required
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Company Name, Plot No., Sector/Road, City, State - PIN Code, India"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              {/* Consumer Care Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Rule 6(1)(aa): Country of Origin *</label>
                  <input
                    type="text"
                    required
                    value={manualOrigin}
                    onChange={(e) => setManualOrigin(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Rule 6(1)(f): Consumer Care Telephone *</label>
                  <input
                    type="text"
                    required
                    value={manualCarePhone}
                    onChange={(e) => setManualCarePhone(e.target.value)}
                    placeholder="e.g. 1800-11-2233"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Rule 6(1)(f): Consumer Care Email *</label>
                  <input
                    type="email"
                    value={manualCareEmail}
                    onChange={(e) => setManualCareEmail(e.target.value)}
                    placeholder="e.g. care@company.in"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* 3. Officer Findings & Notes */}
            <div className="space-y-2 pt-2">
              <label className="font-bold text-slate-700 block">
                Official Inspection Notes &amp; Compounding Recommendation:
              </label>
              <textarea
                rows={3}
                value={manualOfficerNotes}
                onChange={(e) => setManualOfficerNotes(e.target.value)}
                placeholder="Record on-site findings, premise details, physical gauge micrometer measurements, or compounding notices under Section 36..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Auditing Officer: <strong>{currentUser.name}</strong> &bull; {currentUser.zone}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveMode('presets')}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow w-full sm:w-auto"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Submit Manual Inspection</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Product Identity Confirmation Step (Modal) */}
      {showConfirmModal && pendingEvidence && (
        <ProductIdentityConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          evidence={pendingEvidence}
          onlineVerification={pendingOnlineResult || undefined}
          conflicts={pendingConflicts}
          labelImage={pendingLabelImage || uploadedImage}
          category={pendingCategory}
          onConfirm={handleConfirmProduct}
          onContinueWithoutVerification={handleContinueWithoutVerification}
          onSearchAgain={handleSearchAgain}
          onUpdateEvidence={handleUpdateEvidence}
          isSearchingAgain={isSearchingAgain}
        />
      )}
    </div>
  );
};
