import { 
  InspectionRecord, 
  DeclarationField, 
  RuleResult,
  ProductIdentityEvidence,
  OnlineVerificationResult,
  FSSAICheckResult,
  DataConflict
} from '../types';

// Pre-defined SVG Label Data URLs for Demo Products
export const DEMO_LABELS = {
  compliantFood: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800" style="background:#FFFDF5; font-family:'Segoe UI',Roboto,sans-serif;">
      <!-- Product Package Border & Design -->
      <rect x="15" y="15" width="570" height="770" rx="16" fill="#FFFFFF" stroke="#0F766E" stroke-width="4"/>
      <rect x="25" y="25" width="550" height="110" rx="10" fill="#0F766E"/>
      <text x="300" y="65" fill="#FFFFFF" font-size="28" font-weight="bold" text-anchor="middle" letter-spacing="1">NUTRISNACK FOODS</text>
      <text x="300" y="100" fill="#CCFBF1" font-size="16" text-anchor="middle">PREMIUM ROASTED &amp; SALTED ALMONDS</text>

      <!-- Front Artwork Badge -->
      <circle cx="300" cy="205" r="55" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
      <text x="300" y="200" fill="#92400E" font-size="14" font-weight="bold" text-anchor="middle">100% NATURAL</text>
      <text x="300" y="220" fill="#B45309" font-size="12" text-anchor="middle">CALIFORNIA ALMONDS</text>

      <!-- Principal Display Declarations Panel -->
      <rect x="40" y="280" width="520" height="480" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>

      <!-- Declaration Box 1: Product Name -->
      <g id="box-product-name">
        <text x="60" y="315" fill="#64748B" font-size="11" font-weight="bold">GENERIC COMMODITY NAME</text>
        <text x="60" y="338" fill="#0F172A" font-size="16" font-weight="bold">Roasted &amp; Salted Almond Kernels</text>
      </g>

      <!-- Declaration Box 2: Net Quantity -->
      <g id="box-net-qty">
        <rect x="60" y="360" width="220" height="65" rx="6" fill="#ECFDF5" stroke="#10B981" stroke-width="1.5"/>
        <text x="75" y="385" fill="#065F46" font-size="11" font-weight="bold">NET QUANTITY (Rule 6(1)(b))</text>
        <text x="75" y="412" fill="#047857" font-size="22" font-weight="bold">500 g</text>
      </g>

      <!-- Declaration Box 3: MRP & USP -->
      <g id="box-mrp">
        <rect x="310" y="360" width="230" height="65" rx="6" fill="#F0FDF4" stroke="#22C55E" stroke-width="1.5"/>
        <text x="325" y="383" fill="#15803D" font-size="11" font-weight="bold">MAX. RETAIL PRICE (Rule 6(1)(c))</text>
        <text x="325" y="403" fill="#166534" font-size="15" font-weight="bold">&#8377; 385.00 (Incl. of all taxes)</text>
        <text x="325" y="418" fill="#16A34A" font-size="11">Unit Sale Price: &#8377; 0.77 / g</text>
      </g>

      <!-- Declaration Box 4: Mfg Date & Batch -->
      <g id="box-mfg-date">
        <text x="60" y="455" fill="#475569" font-size="11" font-weight="bold">MFD. DATE / BATCH NO. (Rule 6(1)(d))</text>
        <text x="60" y="475" fill="#1E293B" font-size="14" font-weight="600">Mfd: 08/2026 | Batch: NS-ALM-2608 | Best Before: 9 Months</text>
      </g>

      <!-- Declaration Box 5: Manufacturer & Complete Address -->
      <g id="box-mfg-identity">
        <text x="60" y="515" fill="#475569" font-size="11" font-weight="bold">MANUFACTURED &amp; PACKED BY (Rule 6(1)(a)):</text>
        <text x="60" y="535" fill="#1E293B" font-size="13" font-weight="500">NutriSnack Foods Pvt. Ltd., Plot 42, Sector 18, Udyog Vihar,</text>
        <text x="60" y="555" fill="#1E293B" font-size="13" font-weight="500">Gurugram, Haryana - 122015, India.</text>
      </g>

      <!-- Declaration Box 6: Country of Origin -->
      <g id="box-origin">
        <text x="60" y="595" fill="#475569" font-size="11" font-weight="bold">COUNTRY OF ORIGIN (Rule 6(1)(aa)):</text>
        <text x="60" y="615" fill="#1E293B" font-size="14" font-weight="bold">India (Raw almonds imported from USA)</text>
      </g>

      <!-- Declaration Box 7: Consumer Care -->
      <g id="box-consumer-care">
        <rect x="60" y="635" width="480" height="75" rx="6" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1"/>
        <text x="75" y="658" fill="#334155" font-size="11" font-weight="bold">CONSUMER COMPLAINT CELL (Rule 6(1)(f)):</text>
        <text x="75" y="678" fill="#0F172A" font-size="12">Manager, Consumer Care, NutriSnack Foods Pvt. Ltd., at above address</text>
        <text x="75" y="698" fill="#2563EB" font-size="12">Toll Free: 1800-209-4411 | Email: care@nutrisnack.in</text>
      </g>

      <!-- Barcode Graphic -->
      <rect x="60" y="725" width="220" height="25" fill="#000000"/>
      <text x="170" y="745" fill="#FFFFFF" font-size="9" text-anchor="middle">8 901234 567890</text>
      <text x="490" y="740" fill="#059669" font-size="11" font-weight="bold" text-anchor="end">&#10004; FSSAI Lic. 10018022007890</text>
    </svg>
  `)}`,

  violationCosmetic: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800" style="background:#0F172A; font-family:'Segoe UI',Roboto,sans-serif;">
      <!-- Product Package Border & Design -->
      <rect x="15" y="15" width="570" height="770" rx="16" fill="#1E293B" stroke="#6366F1" stroke-width="3"/>
      <rect x="25" y="25" width="550" height="110" rx="10" fill="#312E81"/>
      <text x="300" y="65" fill="#F43F5E" font-size="28" font-weight="bold" text-anchor="middle" letter-spacing="1">SPARKLE GLOW</text>
      <text x="300" y="98" fill="#E2E8F0" font-size="15" text-anchor="middle">HERBAL REJUVENATING SHAMPOO</text>

      <!-- Front Design Graphic -->
      <circle cx="300" cy="205" r="50" fill="#4338CA" stroke="#818CF8" stroke-width="1.5"/>
      <text x="300" y="200" fill="#FFFFFF" font-size="13" font-weight="bold" text-anchor="middle">AYURVEDIC</text>
      <text x="300" y="218" fill="#C7D2FE" font-size="11" text-anchor="middle">HAIR FORMULA</text>

      <!-- Label Details Panel with Contrast and Formatting Violations -->
      <rect x="40" y="280" width="520" height="480" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>

      <!-- Declaration 1: Ambiguous Address (Missing Pin code & premises) -->
      <g id="box-mfg-identity">
        <text x="60" y="315" fill="#94A3B8" font-size="11" font-weight="bold">MFD &amp; PACKED BY:</text>
        <text x="60" y="338" fill="#CBD5E1" font-size="13">Sparkle Cosmetics, Industrial Estate, Lucknow, UP</text>
        <text x="60" y="354" fill="#F87171" font-size="11">[Warning: Complete street/premise address &amp; pincode not specified]</text>
      </g>

      <!-- Declaration 2: Non-standard Net Quantity & Low Font Height -->
      <g id="box-net-qty">
        <rect x="60" y="375" width="220" height="65" rx="6" fill="#450A0A" stroke="#EF4444" stroke-width="1.5"/>
        <text x="75" y="398" fill="#FCA5A5" font-size="11" font-weight="bold">VOL / QTY (Potential Violation)</text>
        <text x="75" y="423" fill="#F87171" font-size="14" font-weight="bold">Net Vol: 250 ml. (approx)</text>
      </g>

      <!-- Declaration 3: Non-compliant MRP (Missing 'inclusive of all taxes', no USP) -->
      <g id="box-mrp">
        <rect x="310" y="375" width="230" height="65" rx="6" fill="#450A0A" stroke="#EF4444" stroke-width="1.5"/>
        <text x="325" y="398" fill="#FCA5A5" font-size="11" font-weight="bold">PRICE (Rule 6(1)(c) Non-compliant)</text>
        <text x="325" y="423" fill="#F87171" font-size="18" font-weight="bold">MRP: 220/-</text>
        <text x="325" y="435" fill="#FECDD3" font-size="9">[Missing mandatory "incl. of all taxes" &amp; USP]</text>
      </g>

      <!-- Declaration 4: Date of Mfg -->
      <g id="box-mfg-date">
        <text x="60" y="475" fill="#94A3B8" font-size="11" font-weight="bold">MFD DATE:</text>
        <text x="60" y="495" fill="#E2E8F0" font-size="13">July 2026 (Batch B-902)</text>
      </g>

      <!-- Declaration 5: Consumer Care (Missing email & postal address) -->
      <g id="box-consumer-care">
        <rect x="60" y="520" width="480" height="70" rx="6" fill="#451A03" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="75" y="545" fill="#FDE68A" font-size="11" font-weight="bold">FOR FEEDBACK / QUERIES (Rule 6(1)(f)):</text>
        <text x="75" y="567" fill="#FCD34D" font-size="13">Call Helpline: +91 9876543210</text>
        <text x="75" y="582" fill="#FBBF24" font-size="10">[Missing mandatory email address and designated officer name]</text>
      </g>

      <!-- Declaration 6: Low Contrast Disclaimer -->
      <g id="box-contrast-issue">
        <text x="60" y="625" fill="#475569" font-size="11">Country of Origin: Made in India | Reg. Trade Mark</text>
        <text x="60" y="645" fill="#334155" font-size="10">Unit Sale Price not declared on label outer sleeve.</text>
      </g>

      <!-- Barcode Graphic -->
      <rect x="60" y="700" width="180" height="30" fill="#334155"/>
      <text x="150" y="720" fill="#94A3B8" font-size="10" text-anchor="middle">8 909999 112233</text>
      <text x="520" y="720" fill="#EF4444" font-size="12" font-weight="bold" text-anchor="end">Action Required</text>
    </svg>
  `)}`,

  uncertainProduct: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800" style="background:#F1F5F9; font-family:'Segoe UI',Roboto,sans-serif;">
      <!-- Product Package Border & Torn Package Design -->
      <rect x="15" y="15" width="570" height="770" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2" stroke-dasharray="8 6"/>
      
      <!-- Torn Header Banner -->
      <path d="M 25,25 L 575,25 L 575,100 L 480,120 L 420,95 L 350,115 L 280,95 L 180,115 L 100,90 L 25,110 Z" fill="#64748B"/>
      <text x="300" y="65" fill="#F1F5F9" font-size="22" font-weight="bold" text-anchor="middle" letter-spacing="1">NATURAL ... [TORN / OBSCURED]</text>
      <text x="300" y="90" fill="#CBD5E1" font-size="13" text-anchor="middle">TRADITIONAL HERBAL MIXTURE (?)</text>

      <!-- Blurred Front Graphic Area -->
      <circle cx="300" cy="205" r="50" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2"/>
      <text x="300" y="210" fill="#94A3B8" font-size="14" font-style="italic" text-anchor="middle">[Graphic Smudged]</text>

      <!-- Warning Watermark -->
      <rect x="60" y="270" width="480" height="50" rx="8" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="300" y="300" fill="#92400E" font-size="14" font-weight="bold" text-anchor="middle">&#9888; UNCONFIRMED IDENTITY / INSUFFICIENT EVIDENCE</text>

      <!-- Incomplete / Smudged Declarations Panel -->
      <rect x="40" y="340" width="520" height="420" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>

      <!-- Declaration 1: Unknown Brand & Manufacturer -->
      <g id="box-unknown-brand">
        <text x="60" y="380" fill="#94A3B8" font-size="11" font-weight="bold">BRAND / PROPRIETOR:</text>
        <text x="60" y="405" fill="#64748B" font-size="14" font-style="italic">[Unidentifiable - Illegible Brandmark]</text>
      </g>

      <!-- Declaration 2: Partial Net Quantity -->
      <g id="box-partial-net-qty">
        <rect x="60" y="430" width="220" height="60" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
        <text x="75" y="455" fill="#64748B" font-size="11" font-weight="bold">NET QUANTITY (Uncertain)</text>
        <text x="75" y="480" fill="#334155" font-size="18" font-bold="bold">~200 g (?)</text>
      </g>

      <!-- Declaration 3: Missing / Torn MRP -->
      <g id="box-missing-mrp">
        <rect x="310" y="430" width="230" height="60" rx="6" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1.5"/>
        <text x="325" y="455" fill="#991B1B" font-size="11" font-weight="bold">MRP / PRICE DECLARATION</text>
        <text x="325" y="478" fill="#DC2626" font-size="13" font-weight="bold">[Torn / Not Detected]</text>
      </g>

      <!-- Declaration 4: Indecipherable Address -->
      <g id="box-unclear-address">
        <text x="60" y="525" fill="#94A3B8" font-size="11" font-weight="bold">PACKED BY / ADDRESS:</text>
        <text x="60" y="545" fill="#475569" font-size="12">Mfd at: Plot ... Phase ..., [Water Damaged - Illegible], PIN: [Missing]</text>
      </g>

      <!-- Declaration 5: No Barcode / No FSSAI -->
      <g id="box-no-barcode">
        <rect x="60" y="580" width="480" height="80" rx="6" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="300" y="615" fill="#64748B" font-size="12" font-weight="bold" text-anchor="middle">NO GTIN / EAN-13 BARCODE DETECTED</text>
        <text x="300" y="638" fill="#94A3B8" font-size="11" text-anchor="middle">FSSAI License / Registration Mark Absent</text>
      </g>

      <!-- OCR Status Note -->
      <text x="300" y="710" fill="#94A3B8" font-size="11" text-anchor="middle">OCR Vision Confidence: 24% &bull; Multi-signal match: 0/5</text>
    </svg>
  `)}`
};

export const DEMO_PRESETS = [
  {
    id: 'demo-food-compliant',
    title: 'NutriSnack Roasted Almonds (500g)',
    subtitle: 'Packaged Food Commodity — Fully Compliant',
    category: 'Food & Snacks',
    badge: '100% Compliant Demo',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    productName: 'NutriSnack Roasted & Salted Almond Kernels',
    brand: 'NutriSnack Foods',
    batchNo: 'NS-ALM-2608',
    barcode: '8901234567890',
    image: DEMO_LABELS.compliantFood,
    complianceScore: 98,
    overallStatus: 'Compliant' as const,
    officerNotes: 'All 8 mandatory declarations compliant with PCR 2011 font height, unit of measurement, and tax wording.',
    fields: [
      {
        id: 'f-1',
        key: 'mfg_identity',
        label: 'Manufacturer / Packer Name & Address',
        value: 'NutriSnack Foods Pvt. Ltd., Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana - 122015, India',
        confidence: 99,
        ruleReference: 'Rule 6(1)(a)',
        status: 'pass' as const,
        statusExplanation: 'Complete physical address with plot number, industrial sector, city, state, and 6-digit PIN code detected.',
        boundingBox: { x: 7, y: 64, width: 86, height: 8 }
      },
      {
        id: 'f-2',
        key: 'net_quantity',
        label: 'Net Quantity Declaration',
        value: '500 g',
        confidence: 98,
        ruleReference: 'Rule 6(1)(b) & Rule 7',
        status: 'pass' as const,
        statusExplanation: 'Standard metric unit (g). Numeral height exceeds prescribed minimum 4mm requirement for 200g-1kg range.',
        boundingBox: { x: 10, y: 45, width: 37, height: 9 }
      },
      {
        id: 'f-3',
        key: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        value: '₹ 385.00 (Incl. of all taxes)',
        confidence: 99,
        ruleReference: 'Rule 6(1)(c)',
        status: 'pass' as const,
        statusExplanation: 'Exact compliance with prescribed format. Contains currency symbol and explicit "(Incl. of all taxes)".',
        boundingBox: { x: 51, y: 45, width: 39, height: 9 }
      },
      {
        id: 'f-4',
        key: 'unit_sale_price',
        label: 'Unit Sale Price (USP)',
        value: '₹ 0.77 / g',
        confidence: 96,
        ruleReference: 'Rule 6(11)',
        status: 'pass' as const,
        statusExplanation: 'Unit Sale Price declared per gram, compliant with 2021 amendment for packages exceeding 100g.',
        boundingBox: { x: 52, y: 52, width: 36, height: 3 }
      },
      {
        id: 'f-5',
        key: 'mfg_date',
        label: 'Month & Year of Manufacture',
        value: '08/2026',
        confidence: 97,
        ruleReference: 'Rule 6(1)(d)',
        status: 'pass' as const,
        statusExplanation: 'Month and year declared clearly in MM/YYYY format with associated batch ID and Best Before indication.',
        boundingBox: { x: 7, y: 56, width: 86, height: 5 }
      },
      {
        id: 'f-6',
        key: 'consumer_care',
        label: 'Consumer Care Cell Details',
        value: 'Manager, Consumer Care, NutriSnack Foods Pvt. Ltd., Tel: 1800-209-4411, Email: care@nutrisnack.in',
        confidence: 98,
        ruleReference: 'Rule 6(1)(f)',
        status: 'pass' as const,
        statusExplanation: 'Designated executive, complete postal address, working toll-free number, and customer support email found.',
        boundingBox: { x: 10, y: 79, width: 80, height: 10 }
      },
      {
        id: 'f-7',
        key: 'country_of_origin',
        label: 'Country of Origin',
        value: 'India',
        confidence: 99,
        ruleReference: 'Rule 6(1)(aa)',
        status: 'pass' as const,
        statusExplanation: 'Clear declaration of country of origin printed on principal display panel.',
        boundingBox: { x: 7, y: 74, width: 86, height: 4 }
      }
    ],
    ruleResults: [
      {
        ruleId: 'rule-mfg-identity',
        ruleCode: 'PCR-R6-1-A',
        title: 'Manufacturer / Packer Identity & Address',
        legalSection: 'Rule 6(1)(a)',
        status: 'pass' as const,
        explanation: 'Complete legal identity with registered address and postal PIN is clearly printed on display panel.',
        detectedText: 'NutriSnack Foods Pvt. Ltd., Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana - 122015, India'
      },
      {
        ruleId: 'rule-country-origin',
        ruleCode: 'PCR-R6-1-AA',
        title: 'Country of Origin',
        legalSection: 'Rule 6(1)(aa)',
        status: 'pass' as const,
        explanation: 'Country of origin declared prominently as "India".',
        detectedText: 'Country of Origin: India'
      },
      {
        ruleId: 'rule-net-quantity',
        ruleCode: 'PCR-R6-1-B',
        title: 'Net Quantity & Numeral Height',
        legalSection: 'Rule 6(1)(b) & Rule 7',
        status: 'pass' as const,
        explanation: 'Expressed in grams ("500 g") using valid SI symbol. Numeral height complies with Rule 7 schedule table.',
        detectedText: 'Net Quantity: 500 g'
      },
      {
        ruleId: 'rule-mrp',
        ruleCode: 'PCR-R6-1-C',
        title: 'Maximum Retail Price Declaration',
        legalSection: 'Rule 6(1)(c)',
        status: 'pass' as const,
        explanation: 'Proper format: includes Indian Rupee symbol and "Incl. of all taxes".',
        detectedText: '₹ 385.00 (Incl. of all taxes)'
      },
      {
        ruleId: 'rule-unit-sale-price',
        ruleCode: 'PCR-R6-11',
        title: 'Unit Sale Price (USP)',
        legalSection: 'Rule 6(11)',
        status: 'pass' as const,
        explanation: 'Unit sale price provided as ₹0.77/g in conjunction with total retail sale price.',
        detectedText: 'Unit Sale Price: ₹ 0.77 / g'
      },
      {
        ruleId: 'rule-mfg-date',
        ruleCode: 'PCR-R6-1-D',
        title: 'Month & Year of Manufacture',
        legalSection: 'Rule 6(1)(d)',
        status: 'pass' as const,
        explanation: 'Mfd 08/2026 clearly legible with batch correlation.',
        detectedText: 'Mfd: 08/2026'
      },
      {
        ruleId: 'rule-consumer-care',
        ruleCode: 'PCR-R6-1-F',
        title: 'Consumer Care Cell Details',
        legalSection: 'Rule 6(1)(f)',
        status: 'pass' as const,
        explanation: 'All four components (Contact Person, Address, Phone, Email) are present and verified.',
        detectedText: 'Tel: 1800-209-4411 | Email: care@nutrisnack.in'
      },
      {
        ruleId: 'rule-readability-contrast',
        ruleCode: 'PCR-R9',
        title: 'Prominence & Legibility',
        legalSection: 'Rule 9(1)',
        status: 'pass' as const,
        explanation: 'High contrast text on clean background. No obscuring graphics.',
        detectedText: 'Contrast ratio 12.8:1 (Excellent)'
      }
    ],
    identityEvidence: {
      detectedBrand: 'NutriSnack Foods',
      brandConfidence: 98,
      detectedProductName: 'NutriSnack Roasted & Salted Almond Kernels',
      productNameConfidence: 96,
      detectedManufacturer: 'NutriSnack Foods Pvt. Ltd., Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana - 122015, India',
      manufacturerConfidence: 95,
      detectedBarcode: '8901234567890',
      barcodeConfidence: 99,
      detectedNetQuantity: '500 g',
      netQuantityConfidence: 98,
      detectedMRP: '₹ 385.00',
      mrpConfidence: 99,
      detectedBatchNumber: 'NS-ALM-2608',
      detectedDates: '08/2026',
      detectedFSSAI: '10018022007890',
      isIdentityConfirmed: true,
      confirmationStatus: 'confirmed' as const,
      matchingSignalsCount: 5
    },
    onlineVerification: {
      sourceName: 'National Packaged Commodity Database & Brand Registry (Demo Mock)',
      sourceUrl: 'https://data.gov.in/registry/packaged-commodities/demo-8901234567890',
      matchedProductName: 'NutriSnack Roasted & Salted Almond Kernels',
      matchedBrand: 'NutriSnack Foods',
      matchedManufacturer: 'NutriSnack Foods Pvt. Ltd., Gurugram, Haryana',
      matchedMRP: '₹ 385.00',
      matchedNetQuantity: '500 g',
      matchConfidence: 96,
      verificationStatus: 'Verified from source' as const,
      explanation: 'Confirmed match across 5 independent signals (Barcode, Brand, Product Name, Net Quantity, MRP). Label values strictly match catalog records.',
      isMockData: true,
      matchedAt: '2026-09-08 14:30'
    },
    fssaiResults: [
      {
        regulationCode: 'FSSAI-FSSR-2020-R5-1',
        title: 'FSSAI Logo & 14-Digit License Number',
        legalReference: 'FSS (Labelling and Display) Reg. 2020, Reg 5(1)',
        status: 'pass' as const,
        detectedValue: 'Lic. No. 10018022007890 (Valid 14-digit state/central license)',
        explanation: 'FSSAI symbol with valid 14-digit manufacturer license number displayed clearly on Principal Display Panel.'
      },
      {
        regulationCode: 'FSSAI-FSSR-2020-R5-2',
        title: 'Vegetarian / Non-Vegetarian Logo',
        legalReference: 'FSS (Labelling and Display) Reg. 2020, Reg 5(2)',
        status: 'pass' as const,
        detectedValue: 'Green filled circle inside green square outline (Vegetarian food symbol)',
        explanation: 'Mandatory vegetarian logo with compliant square boundary dimensions detected.'
      },
      {
        regulationCode: 'FSSAI-FSSR-2020-R5-3',
        title: 'Nutritional Information Table',
        legalReference: 'FSS (Labelling and Display) Reg. 2020, Reg 5(3)',
        status: 'pass' as const,
        detectedValue: 'Energy (579 kcal), Protein (21.2g), Carbs (21.6g), Fat (49.9g), Sodium (180mg) per 100g',
        explanation: 'Nutritional declarations declare energy, protein, carbohydrates, total sugars, added sugars, dietary fiber, and sodium per 100g.'
      },
      {
        regulationCode: 'FSSAI-FSSR-2020-R5-4',
        title: 'Ingredients Declaration & Order of Prominence',
        legalReference: 'FSS (Labelling and Display) Reg. 2020, Reg 5(4)',
        status: 'pass' as const,
        detectedValue: 'Ingredients: Roasted Almonds (98%), Edible Common Salt (2%)',
        explanation: 'Descending order of weight/volume adhered to.'
      },
      {
        regulationCode: 'FSSAI-FSSR-2020-R5-5',
        title: 'Allergen Advisory Warning',
        legalReference: 'FSS (Labelling and Display) Reg. 2020, Reg 5(5)',
        status: 'pass' as const,
        detectedValue: 'Contains Tree Nuts (Almonds). Processed in facility handling seeds.',
        explanation: 'Mandatory bold allergen warning printed in compliance with 2020 Regulations.'
      }
    ],
    dataConflicts: []
  },
  {
    id: 'demo-cosmetic-review',
    title: 'Sparkle Glow Herbal Shampoo (250ml)',
    subtitle: 'Cosmetics & Toiletries — Potential Violations Detected',
    category: 'Personal Care & Cosmetics',
    badge: 'Violations & Review Demo',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    productName: 'Sparkle Glow Herbal Rejuvenating Shampoo',
    brand: 'Sparkle Cosmetics',
    batchNo: 'B-902',
    barcode: '8909999112233',
    image: DEMO_LABELS.violationCosmetic,
    complianceScore: 64,
    overallStatus: 'Needs Manual Verification' as const,
    officerNotes: 'Flagged for non-compliant MRP formatting, missing consumer care email, unapproved abbreviation for Net Volume, and missing Unit Sale Price (Rule 6(11)).',
    fields: [
      {
        id: 'f-201',
        key: 'mfg_identity',
        label: 'Manufacturer / Packer Name & Address',
        value: 'Sparkle Cosmetics, Industrial Estate, Lucknow, UP',
        confidence: 89,
        ruleReference: 'Rule 6(1)(a)',
        status: 'review' as const,
        statusExplanation: 'Incomplete premises address. Missing factory/plot number and mandatory 6-digit postal PIN code.',
        boundingBox: { x: 7, y: 39, width: 86, height: 7 }
      },
      {
        id: 'f-202',
        key: 'net_quantity',
        label: 'Net Quantity Declaration',
        value: 'Net Vol: 250 ml. (approx)',
        confidence: 91,
        ruleReference: 'Rule 6(1)(b) & Rule 7',
        status: 'violation' as const,
        statusExplanation: 'Non-compliant terms: "approx" is strictly prohibited under Rule 6. Trailing dot in "ml." violates SI standardization.',
        boundingBox: { x: 10, y: 47, width: 37, height: 9 }
      },
      {
        id: 'f-203',
        key: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        value: 'MRP: 220/-',
        confidence: 95,
        ruleReference: 'Rule 6(1)(c)',
        status: 'violation' as const,
        statusExplanation: 'Strict violation: Omitted mandatory legal phrase "inclusive of all taxes" or "incl. of all taxes". Use of "/-" is deprecated.',
        boundingBox: { x: 51, y: 47, width: 39, height: 9 }
      },
      {
        id: 'f-204',
        key: 'unit_sale_price',
        label: 'Unit Sale Price (USP)',
        value: 'Not Detected',
        confidence: 96,
        ruleReference: 'Rule 6(11)',
        status: 'violation' as const,
        statusExplanation: 'Mandatory USP (e.g. ₹0.88 / ml) not detected on package label.',
        boundingBox: { x: 7, y: 80, width: 86, height: 4 }
      },
      {
        id: 'f-205',
        key: 'mfg_date',
        label: 'Month & Year of Manufacture',
        value: 'July 2026',
        confidence: 94,
        ruleReference: 'Rule 6(1)(d)',
        status: 'pass' as const,
        statusExplanation: 'Month and year declared clearly. Batch reference present.',
        boundingBox: { x: 7, y: 59, width: 86, height: 5 }
      },
      {
        id: 'f-206',
        key: 'consumer_care',
        label: 'Consumer Care Cell Details',
        value: 'Call Helpline: +91 9876543210',
        confidence: 92,
        ruleReference: 'Rule 6(1)(f)',
        status: 'violation' as const,
        statusExplanation: 'Missing mandatory email address and postal address for grievances under Rule 6(1)(f).',
        boundingBox: { x: 10, y: 65, width: 80, height: 9 }
      },
      {
        id: 'f-207',
        key: 'country_of_origin',
        label: 'Country of Origin',
        value: 'Made in India',
        confidence: 88,
        ruleReference: 'Rule 6(1)(aa)',
        status: 'review' as const,
        statusExplanation: 'Printed in low contrast font at footer. Requires officer physical verification of visibility.',
        boundingBox: { x: 7, y: 78, width: 86, height: 4 }
      }
    ],
    ruleResults: [
      {
        ruleId: 'rule-mfg-identity',
        ruleCode: 'PCR-R6-1-A',
        title: 'Manufacturer / Packer Identity & Address',
        legalSection: 'Rule 6(1)(a)',
        status: 'review' as const,
        explanation: 'Address specifies "Industrial Estate, Lucknow, UP" without plot/shed number or PIN code.',
        detectedText: 'Sparkle Cosmetics, Industrial Estate, Lucknow, UP'
      },
      {
        ruleId: 'rule-country-origin',
        ruleCode: 'PCR-R6-1-AA',
        title: 'Country of Origin',
        legalSection: 'Rule 6(1)(aa)',
        status: 'pass' as const,
        explanation: 'Detected as Made in India, though contrast requires verification.',
        detectedText: 'Made in India'
      },
      {
        ruleId: 'rule-net-quantity',
        ruleCode: 'PCR-R6-1-B',
        title: 'Net Quantity & Numeral Height',
        legalSection: 'Rule 6(1)(b)',
        status: 'violation' as const,
        explanation: 'Use of word "approx" is prohibited under Legal Metrology rules. Dot after "ml." is non-compliant.',
        detectedText: 'Net Vol: 250 ml. (approx)'
      },
      {
        ruleId: 'rule-mrp',
        ruleCode: 'PCR-R6-1-C',
        title: 'Maximum Retail Price Declaration',
        legalSection: 'Rule 6(1)(c)',
        status: 'violation' as const,
        explanation: 'Crucial phrase "inclusive of all taxes" is completely missing. Subject to compounding/notice.',
        detectedText: 'MRP: 220/-'
      },
      {
        ruleId: 'rule-unit-sale-price',
        ruleCode: 'PCR-R6-11',
        title: 'Unit Sale Price (USP)',
        legalSection: 'Rule 6(11)',
        status: 'violation' as const,
        explanation: 'Commodity volume > 100ml requires mandatory USP declaration per ml.',
        detectedText: 'None detected'
      },
      {
        ruleId: 'rule-mfg-date',
        ruleCode: 'PCR-R6-1-D',
        title: 'Month & Year of Manufacture',
        legalSection: 'Rule 6(1)(d)',
        status: 'pass' as const,
        explanation: 'July 2026 declared legibly with Batch B-902.',
        detectedText: 'July 2026 (Batch B-902)'
      },
      {
        ruleId: 'rule-consumer-care',
        ruleCode: 'PCR-R6-1-F',
        title: 'Consumer Care Cell Details',
        legalSection: 'Rule 6(1)(f)',
        status: 'violation' as const,
        explanation: 'Only mobile phone number provided. Email address and grievance officer contact are missing.',
        detectedText: 'Call Helpline: +91 9876543210'
      },
      {
        ruleId: 'rule-readability-contrast',
        ruleCode: 'PCR-R9',
        title: 'Prominence & Legibility',
        legalSection: 'Rule 9(1)',
        status: 'review' as const,
        explanation: 'Bottom declarations printed in dark slate on dark purple background (Contrast ratio 2.4:1, below recommended 4.5:1).',
        detectedText: 'Contrast ratio 2.4:1 (Poor readability)'
      }
    ],
    identityEvidence: {
      detectedBrand: 'Sparkle Cosmetics',
      brandConfidence: 91,
      detectedProductName: 'Sparkle Glow Herbal Rejuvenating Shampoo',
      productNameConfidence: 89,
      detectedManufacturer: 'Sparkle Cosmetics, Industrial Estate, Lucknow, UP',
      manufacturerConfidence: 82,
      detectedBarcode: '8909999112233',
      barcodeConfidence: 95,
      detectedNetQuantity: 'Net Vol: 250 ml. (approx)',
      netQuantityConfidence: 91,
      detectedMRP: 'MRP: 220/-',
      mrpConfidence: 95,
      detectedBatchNumber: 'B-902',
      detectedDates: 'July 2026',
      detectedFSSAI: '',
      isIdentityConfirmed: true,
      confirmationStatus: 'confirmed' as const,
      matchingSignalsCount: 4
    },
    onlineVerification: {
      sourceName: 'Cosmetics Brand Catalog (Demo Mock)',
      sourceUrl: 'https://brandcatalog.in/demo/sparkle-shampoo-250',
      matchedProductName: 'Sparkle Glow Herbal Rejuvenating Shampoo',
      matchedBrand: 'Sparkle Cosmetics',
      matchedManufacturer: 'Sparkle Cosmetics Pvt. Ltd.',
      matchedMRP: '₹ 220.00',
      matchedNetQuantity: '250 ml',
      matchConfidence: 88,
      verificationStatus: 'Partially matched' as const,
      explanation: 'Brand and product name matched online catalog. Label exhibits statutory drafting violations (missing "incl of taxes", missing PIN, unapproved "approx").',
      isMockData: true,
      matchedAt: '2026-09-08 11:15'
    },
    fssaiResults: undefined,
    dataConflicts: []
  },
  {
    id: 'demo-uncertain-product',
    title: 'Torn / Low-Confidence Label (Demo 2: Uncertain Product)',
    subtitle: 'Incomplete Declarations & No Online Match — Identity Not Confirmed',
    category: 'General Commodities',
    badge: 'Demo 2: Uncertain Identity',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    productName: 'Unidentified Herbal Mixture (Partial)',
    brand: 'Unknown / Not Detected',
    batchNo: 'Not Legible',
    barcode: '',
    image: DEMO_LABELS.uncertainProduct,
    complianceScore: 36,
    overallStatus: 'Product identity not confirmed' as const,
    officerNotes: 'OCR detected incomplete and smudged declarations. Online verification failed to match signals. Inspection marked as Identity Not Confirmed.',
    fields: [
      {
        id: 'f-u-1',
        key: 'mfg_identity',
        label: 'Manufacturer / Packer Name & Address',
        value: 'Plot ... Phase ..., [Water Damaged - Illegible], PIN: [Missing]',
        confidence: 22,
        ruleReference: 'Rule 6(1)(a)',
        status: 'violation' as const,
        statusExplanation: 'Indecipherable manufacturer premises and missing postal PIN code due to torn/smudged label.',
        boundingBox: { x: 8, y: 64, width: 84, height: 9 }
      },
      {
        id: 'f-u-2',
        key: 'net_quantity',
        label: 'Net Quantity Declaration',
        value: '~200 g (?)',
        confidence: 42,
        ruleReference: 'Rule 6(1)(b) & Rule 7',
        status: 'review' as const,
        statusExplanation: 'Uncertain declaration. Approximate indicator detected; requires manual physical weighment.',
        boundingBox: { x: 10, y: 53, width: 38, height: 8 }
      },
      {
        id: 'f-u-3',
        key: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        value: 'Not Detected / Torn',
        confidence: 15,
        ruleReference: 'Rule 6(1)(c)',
        status: 'violation' as const,
        statusExplanation: 'MRP area is torn or absent. Mandatory retail price could not be extracted.',
        boundingBox: { x: 50, y: 53, width: 40, height: 8 }
      },
      {
        id: 'f-u-4',
        key: 'unit_sale_price',
        label: 'Unit Sale Price (USP)',
        value: 'Not Detected',
        confidence: 10,
        ruleReference: 'Rule 6(11)',
        status: 'violation' as const,
        statusExplanation: 'Unit Sale Price completely missing from package.',
        boundingBox: { x: 50, y: 62, width: 40, height: 4 }
      },
      {
        id: 'f-u-5',
        key: 'mfg_date',
        label: 'Month & Year of Manufacture',
        value: 'Not Legible',
        confidence: 18,
        ruleReference: 'Rule 6(1)(d)',
        status: 'violation' as const,
        statusExplanation: 'Date stamp indecipherable. Batch identification lost.',
        boundingBox: { x: 8, y: 73, width: 84, height: 5 }
      },
      {
        id: 'f-u-6',
        key: 'country_of_origin',
        label: 'Country of Origin',
        value: 'Not Found',
        confidence: 12,
        ruleReference: 'Rule 6(1)(aa)',
        status: 'violation' as const,
        statusExplanation: 'Country of origin not declared on visible packaging.',
        boundingBox: { x: 8, y: 79, width: 84, height: 4 }
      }
    ],
    ruleResults: [
      {
        ruleId: 'rule-u-identity',
        ruleCode: 'PCR-R6-1-A',
        title: 'Manufacturer / Packer Identity & Address',
        legalSection: 'Rule 6(1)(a)',
        status: 'violation' as const,
        explanation: 'Manufacturer name and full address cannot be established from label evidence.',
        detectedText: 'Plot ... Phase ... [Illegible]'
      },
      {
        ruleId: 'rule-u-mrp',
        ruleCode: 'PCR-R6-1-C',
        title: 'Maximum Retail Price Declaration',
        legalSection: 'Rule 6(1)(c)',
        status: 'violation' as const,
        explanation: 'Mandatory MRP declaration is missing or torn. Section 36 penalty applicable.',
        detectedText: 'Not Detected'
      },
      {
        ruleId: 'rule-u-qty',
        ruleCode: 'PCR-R6-1-B',
        title: 'Net Quantity Declaration',
        legalSection: 'Rule 6(1)(b)',
        status: 'review' as const,
        explanation: 'Quantity numeral is faint and questionable. Physical laboratory verification required.',
        detectedText: '~200 g (?)'
      },
      {
        ruleId: 'rule-u-usp',
        ruleCode: 'PCR-R6-11',
        title: 'Unit Sale Price (USP)',
        legalSection: 'Rule 6(11)',
        status: 'violation' as const,
        explanation: 'USP not found.',
        detectedText: 'Not Detected'
      }
    ],
    identityEvidence: {
      detectedBrand: 'Unknown / Not Detected',
      brandConfidence: 12,
      detectedProductName: 'Unidentified Herbal Mixture (Partial)',
      productNameConfidence: 28,
      detectedManufacturer: 'Indecipherable / Missing Address',
      manufacturerConfidence: 15,
      detectedBarcode: '',
      barcodeConfidence: 0,
      detectedNetQuantity: '~200 g (?)',
      netQuantityConfidence: 42,
      detectedMRP: 'Not Detected',
      mrpConfidence: 10,
      detectedBatchNumber: 'Not Legible',
      detectedDates: 'Not Found',
      detectedFSSAI: '',
      isIdentityConfirmed: false,
      confirmationStatus: 'unconfirmed' as const,
      matchingSignalsCount: 0
    },
    onlineVerification: {
      sourceName: 'National Commodity Registry (Demo Mock Provider)',
      sourceUrl: '',
      matchedProductName: 'None',
      matchedBrand: 'None',
      matchedManufacturer: 'None',
      matchedMRP: 'None',
      matchedNetQuantity: 'None',
      matchConfidence: 0,
      verificationStatus: 'Not found' as const,
      explanation: 'Could not confidently identify this product. Multiple matching signals (Brand, Barcode, Manufacturer) were insufficient or absent. Please verify the details manually.',
      isMockData: true,
      matchedAt: '2026-09-08 23:10'
    },
    fssaiResults: undefined,
    dataConflicts: []
  }
];

export const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'INSP-2026-0841',
    timestamp: '2026-09-08 14:30',
    inspectorName: 'GASLIGHTER',
    inspectorDesignation: 'Inspector of Legal Metrology (ILM)',
    inspectorZone: 'Lucknow Zone, Uttar Pradesh',
    productName: 'NutriSnack Roasted & Salted Almond Kernels',
    brand: 'NutriSnack Foods',
    category: 'Food & Snacks',
    barcode: '8901234567890',
    batchNumber: 'NS-ALM-2608',
    labelImage: DEMO_LABELS.compliantFood,
    fields: DEMO_PRESETS[0].fields,
    ruleResults: DEMO_PRESETS[0].ruleResults,
    identityEvidence: DEMO_PRESETS[0].identityEvidence,
    onlineVerification: DEMO_PRESETS[0].onlineVerification,
    fssaiResults: DEMO_PRESETS[0].fssaiResults,
    dataConflicts: DEMO_PRESETS[0].dataConflicts,
    complianceScore: 98,
    overallStatus: 'Compliant',
    officerNotes: 'Random market surveillance inspection at SuperMart Hazratganj, Lucknow. Packaging fully complies with PCR 2011 norms.',
    isVerified: true,
    verifiedAt: '2026-09-08 14:45'
  },
  {
    id: 'INSP-2026-0839',
    timestamp: '2026-09-08 11:15',
    inspectorName: 'Ananya Deshmukh',
    inspectorDesignation: 'Assistant Controller, Legal Metrology',
    inspectorZone: 'Mumbai Metropolitan Region',
    productName: 'Sparkle Glow Herbal Rejuvenating Shampoo',
    brand: 'Sparkle Cosmetics',
    category: 'Personal Care & Cosmetics',
    barcode: '8909999112233',
    batchNumber: 'B-902',
    labelImage: DEMO_LABELS.violationCosmetic,
    fields: DEMO_PRESETS[1].fields,
    ruleResults: DEMO_PRESETS[1].ruleResults,
    identityEvidence: DEMO_PRESETS[1].identityEvidence,
    onlineVerification: DEMO_PRESETS[1].onlineVerification,
    fssaiResults: DEMO_PRESETS[1].fssaiResults,
    dataConflicts: DEMO_PRESETS[1].dataConflicts,
    complianceScore: 64,
    overallStatus: 'Needs Manual Verification',
    officerNotes: 'Seized sample from wholesale distributor. Issued preliminary notice under Section 36 for missing tax wording and consumer email.',
    isVerified: false
  },
  {
    id: 'INSP-2026-0832',
    timestamp: '2026-09-07 16:40',
    inspectorName: 'GASLIGHTER',
    inspectorDesignation: 'Inspector of Legal Metrology (ILM)',
    inspectorZone: 'Lucknow Zone, Uttar Pradesh',
    productName: 'AeroPure Smart Air Purifier Filter',
    brand: 'AeroPure Tech',
    category: 'Electronics & Hardware',
    barcode: '8905544332211',
    batchNumber: 'AP-2026-F1',
    labelImage: DEMO_LABELS.compliantFood,
    fields: DEMO_PRESETS[0].fields,
    ruleResults: DEMO_PRESETS[0].ruleResults,
    complianceScore: 94,
    overallStatus: 'Compliant',
    officerNotes: 'Routine importer compliance inspection at inland container depot, Transport Nagar, Lucknow.',
    isVerified: true,
    verifiedAt: '2026-09-07 17:10'
  },
  {
    id: 'INSP-2026-0828',
    timestamp: '2026-09-06 13:20',
    inspectorName: 'Vikramjit Singh',
    inspectorDesignation: 'Enforcement Officer',
    inspectorZone: 'Punjab State Directorate',
    productName: 'Golden Grain Premium Basmati Rice 5kg',
    brand: 'Golden Agro',
    category: 'Food & Snacks',
    barcode: '8907812903344',
    batchNumber: 'GG-R-441',
    labelImage: DEMO_LABELS.compliantFood,
    fields: DEMO_PRESETS[0].fields,
    ruleResults: DEMO_PRESETS[0].ruleResults,
    complianceScore: 92,
    overallStatus: 'Compliant',
    officerNotes: 'Standard packing verification. Net weight verified on certified working standard scale.',
    isVerified: true,
    verifiedAt: '2026-09-06 13:50'
  },
  {
    id: 'INSP-2026-0815',
    timestamp: '2026-09-05 10:05',
    inspectorName: 'S. K. Ramanathan',
    inspectorDesignation: 'Inspector of Legal Metrology',
    inspectorZone: 'Chennai South Zone',
    productName: 'QuickClean Surface Disinfectant Liquid 500ml',
    brand: 'QuickClean India',
    category: 'Household & Cleaning',
    barcode: '8903322114455',
    batchNumber: 'QC-DIS-88',
    labelImage: DEMO_LABELS.violationCosmetic,
    fields: DEMO_PRESETS[1].fields,
    ruleResults: DEMO_PRESETS[1].ruleResults,
    complianceScore: 58,
    overallStatus: 'Potential Violation',
    officerNotes: 'Font size of Net Volume is 1.5mm, strictly below 4mm mandated under Rule 7 for 500ml packages.',
    isVerified: false
  },
  {
    id: 'INSP-2026-0802',
    timestamp: '2026-09-03 15:30',
    inspectorName: 'Ananya Deshmukh',
    inspectorDesignation: 'Assistant Controller, Legal Metrology',
    inspectorZone: 'Mumbai Metropolitan Region',
    productName: 'DentaWhite Charcoal Toothpaste 150g',
    brand: 'DentaWhite Health',
    category: 'Personal Care & Cosmetics',
    barcode: '8906655441122',
    batchNumber: 'DW-TP-12',
    labelImage: DEMO_LABELS.violationCosmetic,
    fields: DEMO_PRESETS[1].fields,
    ruleResults: DEMO_PRESETS[1].ruleResults,
    complianceScore: 71,
    overallStatus: 'Needs Manual Verification',
    officerNotes: 'Unit sale price missing. Forwarded to zonal committee for verification.',
    isVerified: true,
    verifiedAt: '2026-09-03 17:00'
  }
];

export const PRODUCT_CATEGORIES = [
  'Food & Snacks',
  'Personal Care & Cosmetics',
  'Beverages & Drinks',
  'Electronics & Appliances',
  'Household & Cleaning',
  'Pharmaceutical & Wellness',
  'General Commodities'
];
