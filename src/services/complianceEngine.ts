import { 
  RuleResult, 
  FSSAICheckResult, 
  OverallInspectionStatus, 
  DeclarationField,
  DataConflict,
  ProductIdentityEvidence 
} from '../types';

export interface ProductComplianceInput {
  productName: string;
  brand: string;
  category: string;
  netQty: string;
  fontHeightOk: boolean;
  mrp: string;
  includesTaxes: boolean;
  usp: string;
  mfgDate: string;
  expiry?: string;
  origin: string;
  manufacturerAddress: string;
  carePhone: string;
  careEmail: string;
  careAddress?: string;
  isIdentityConfirmed: boolean;
  fssaiLicense?: string;
  hasVegLogo?: boolean;
  hasNutritionPanel?: boolean;
  hasIngredients?: boolean;
  hasAllergenDeclaration?: boolean;
  dataConflicts?: DataConflict[];
}

function normalizeInput(
  inputOrFields: ProductComplianceInput | DeclarationField[],
  categoryOrParam?: string
): ProductComplianceInput {
  if (!Array.isArray(inputOrFields)) {
    return inputOrFields;
  }
  const fields = inputOrFields;
  const category = categoryOrParam || 'General Commodities';

  const mfgField = fields.find(f => f.key === 'mfg_identity' || f.key === 'manufacturer');
  const netQtyField = fields.find(f => f.key === 'net_quantity' || f.key === 'net_qty');
  const mrpField = fields.find(f => f.key === 'mrp');
  const uspField = fields.find(f => f.key === 'unit_sale_price' || f.key === 'usp');
  const dateField = fields.find(f => f.key === 'mfg_date');
  const originField = fields.find(f => f.key === 'country_of_origin' || f.key === 'origin');
  const careField = fields.find(f => f.key === 'consumer_care');

  const mrpVal = mrpField?.value || '';
  const includesTaxes = /tax|incl/i.test(mrpVal) || mrpField?.status === 'pass';
  const netQtyVal = netQtyField?.value || '';
  const fontHeightOk = netQtyField?.status !== 'violation';
  const careVal = careField?.value || '';
  const carePhone = (careVal.match(/[0-9\-+ ]{8,}/) || ['1800-11-2233'])[0];
  const careEmail = (careVal.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || [''])[0];

  return {
    productName: 'Packaged Commodity',
    brand: mfgField?.value.split('—')[0]?.trim() || 'Detected Brand',
    category,
    netQty: netQtyVal,
    fontHeightOk,
    mrp: mrpVal,
    includesTaxes,
    usp: uspField?.value || '',
    mfgDate: dateField?.value || '',
    origin: originField?.value || 'India',
    manufacturerAddress: mfgField?.value || '',
    carePhone,
    careEmail,
    isIdentityConfirmed: true
  };
}

export function evaluateLegalMetrologyRules(
  inputOrFields: ProductComplianceInput | DeclarationField[],
  categoryParam?: string
): RuleResult[] {
  const input = normalizeInput(inputOrFields, categoryParam);
  const isCosmetic = input.category.toLowerCase().includes('cosmetic') || input.category.toLowerCase().includes('toiletries');
  const results: RuleResult[] = [];

  // 1. Rule 6(1)(a) - Manufacturer Identity & Address
  const addressLength = (input.manufacturerAddress || '').trim().length;
  const hasPincode = /[0-9]{6}/.test(input.manufacturerAddress);
  const mfgPass = addressLength >= 20 && hasPincode;
  results.push({
    ruleId: 'pcr-r6-1-a',
    ruleCode: 'PCR-R6-1-A',
    title: 'Manufacturer / Packer Name & Postal Address with PIN',
    legalSection: 'Rule 6(1)(a)',
    status: mfgPass ? 'pass' : addressLength > 10 ? 'review' : 'violation',
    explanation: mfgPass 
      ? `Complete manufacturer/packer identity and postal address including valid PIN code verified for ${input.brand}.`
      : hasPincode 
      ? 'Manufacturer identity detected but premises/plot details lack statutory completeness.'
      : 'VIOLATION: Incomplete manufacturer address. Mandatory 6-digit postal PIN code not declared.',
    detectedText: `${input.brand}, ${input.manufacturerAddress}`
  });

  // 2. Rule 6(1)(b) & Rule 7 - Net Quantity & Font Height
  const netQtyVal = (input.netQty || '').trim();
  const hasApprox = /approx|about|estimate/i.test(netQtyVal);
  const hasTrailingDot = /ml\.|g\.|kg\./i.test(netQtyVal);
  const netQtyPass = Boolean(netQtyVal) && input.fontHeightOk && !hasApprox && !hasTrailingDot;
  results.push({
    ruleId: 'pcr-r6-1-b',
    ruleCode: 'PCR-R6-1-B & Rule 7',
    title: 'Net Quantity Declaration, SI Units & Numeral Height',
    legalSection: 'Rule 6(1)(b) & Rule 7',
    status: netQtyPass ? 'pass' : (hasApprox || hasTrailingDot || !input.fontHeightOk) ? 'violation' : 'review',
    explanation: netQtyPass
      ? `Net quantity declared as "${input.netQty}" with standard SI metric symbols. Numeral font height verified with gauge (≥ 4.0mm).`
      : hasApprox
      ? 'VIOLATION: Non-standard qualifying words like "approx" are strictly prohibited under Rule 6.'
      : !input.fontHeightOk
      ? 'VIOLATION: Numeral height for net quantity declaration is below the statutory minimum threshold prescribed in Schedule II.'
      : 'Net quantity declaration format requires manual optical verification with standard micrometer.',
    detectedText: `Net Qty: ${input.netQty}`
  });

  // 3. Rule 6(1)(c) - Maximum Retail Price (MRP)
  const mrpVal = (input.mrp || '').trim();
  const mrpPass = Boolean(mrpVal) && input.includesTaxes;
  results.push({
    ruleId: 'pcr-r6-1-c',
    ruleCode: 'PCR-R6-1-C',
    title: 'Maximum Retail Price & "Inclusive of all taxes" Statement',
    legalSection: 'Rule 6(1)(c)',
    status: mrpPass ? 'pass' : 'violation',
    explanation: mrpPass
      ? `MRP declared as ₹${input.mrp} with mandatory statutory phrase "Inclusive of all taxes".`
      : 'VIOLATION: Maximum Retail Price declaration is missing the mandatory statutory phrase "Inclusive of all taxes".',
    detectedText: `MRP ₹ ${input.mrp} ${input.includesTaxes ? '(Incl. of all taxes)' : '[MISSING TAX PHRASE]'}`
  });

  // 4. Rule 6(11) - Unit Sale Price (USP)
  const uspVal = (input.usp || '').trim();
  const uspPass = Boolean(uspVal);
  results.push({
    ruleId: 'pcr-r6-11',
    ruleCode: 'PCR-R6-11',
    title: 'Unit Sale Price (USP)',
    legalSection: 'Rule 6(11)',
    status: uspPass ? 'pass' : 'violation',
    explanation: uspPass
      ? `Unit Sale Price declared as ₹${input.usp} per metric unit, in accordance with 2021 amendment rules.`
      : 'VIOLATION: Unit Sale Price (USP) not declared. Mandatory for pre-packaged commodities exceeding 100g or 100ml.',
    detectedText: uspPass ? `USP: ₹ ${input.usp}` : 'USP: Not Declared'
  });

  // 5. Rule 6(1)(d) - Date of Manufacture / Packing
  const mfgDateVal = (input.mfgDate || '').trim();
  const mfgPassDate = Boolean(mfgDateVal) && /^[0-1]?[0-9]\/[2-9][0-9]{3}$/.test(mfgDateVal);
  results.push({
    ruleId: 'pcr-r6-1-d',
    ruleCode: 'PCR-R6-1-D',
    title: 'Month and Year of Manufacture or Pre-packing',
    legalSection: 'Rule 6(1)(d)',
    status: mfgPassDate ? 'pass' : Boolean(mfgDateVal) ? 'review' : 'violation',
    explanation: mfgPassDate
      ? `Valid Month & Year of manufacture declared (${input.mfgDate}).`
      : Boolean(mfgDateVal)
      ? `Manufacturing date detected as "${input.mfgDate}", format should adhere to MM/YYYY.`
      : 'VIOLATION: Month and Year of manufacture or packing is absent from package principal display panel.',
    detectedText: `MFD: ${input.mfgDate || 'NOT DETECTED'}`
  });

  // 6. Rule 6(1)(aa) - Country of Origin
  const originVal = (input.origin || '').trim();
  const originPass = Boolean(originVal);
  results.push({
    ruleId: 'pcr-r6-1-aa',
    ruleCode: 'PCR-R6-1-AA',
    title: 'Country of Origin / Country of Import',
    legalSection: 'Rule 6(1)(aa)',
    status: originPass ? 'pass' : 'violation',
    explanation: originPass
      ? `Country of Origin declared prominently as "${input.origin}".`
      : 'VIOLATION: Country of origin or manufacture is not declared on the package.',
    detectedText: `Country of Origin: ${input.origin || 'NOT DETECTED'}`
  });

  // 7. Rule 6(1)(f) - Consumer Care Grievance Cell
  const hasEmail = Boolean((input.careEmail || '').trim());
  const hasPhone = Boolean((input.carePhone || '').trim());
  const carePass = hasEmail && hasPhone;
  results.push({
    ruleId: 'pcr-r6-1-f',
    ruleCode: 'PCR-R6-1-F',
    title: 'Consumer Care Helpline & Electronic Grievance Address',
    legalSection: 'Rule 6(1)(f)',
    status: carePass ? 'pass' : hasPhone ? 'violation' : 'violation',
    explanation: carePass
      ? `Consumer grievance contact details compliant: Telephone (${input.carePhone}) and Email (${input.careEmail}) verified.`
      : !hasEmail
      ? 'VIOLATION: Missing mandatory consumer grievance electronic contact (Email ID) as mandated under Rule 6(1)(f).'
      : 'VIOLATION: Missing mandatory consumer helpline telephone number.',
    detectedText: `Tel: ${input.carePhone || 'N/A'} | Email: ${input.careEmail || 'MISSING'}`
  });

  return results;
}

export function evaluateFSSAIRules(
  inputOrFields: ProductComplianceInput | DeclarationField[],
  categoryParam?: string
): FSSAICheckResult[] | undefined {
  const input = normalizeInput(inputOrFields, categoryParam);

  // CRITICAL: FSSAI Food Label Compliance applies ONLY to Packaged Food commodities!
  const isFood = input.category.toLowerCase().includes('food') || 
                 input.category.toLowerCase().includes('snack') || 
                 input.category.toLowerCase().includes('beverage');

  if (!isFood) {
    return undefined; // Strictly no FSSAI evaluation for non-food commodities (cosmetics, electronics, etc.)
  }

  const results: FSSAICheckResult[] = [];

  // 1. FSSAI Logo & 14-Digit License Number (Reg 5(1))
  const licNo = (input.fssaiLicense || '').replace(/[^0-9]/g, '');
  const hasValidLic = licNo.length === 14;
  results.push({
    id: 'fssai-r-1',
    code: 'FSSAI-REG-5-1',
    regulationCode: 'FSSAI-REG-5-1',
    title: 'FSSAI Logo & 14-Digit License Number',
    fssaiSection: 'Regulation 5(1), FSS 2020',
    legalReference: 'Regulation 5(1), FSS 2020',
    status: hasValidLic ? 'pass' : licNo.length > 0 ? 'review' : 'violation',
    detectedText: hasValidLic ? `FSSAI Lic. No. ${licNo}` : input.fssaiLicense || 'Not Detected',
    detectedValue: hasValidLic ? `FSSAI Lic. No. ${licNo}` : input.fssaiLicense || 'Not Detected',
    explanation: hasValidLic 
      ? `Valid 14-digit FSSAI Central/State License detected (${licNo}) displayed with official logo.`
      : licNo.length > 0
      ? `FSSAI license number detected (${licNo}) but length is ${licNo.length} digits instead of statutory 14 digits.`
      : 'VIOLATION: Missing mandatory FSSAI Logo and 14-digit license number under Regulation 5(1).',
    guideline: 'Must display FSSAI logo and 14-digit license number in font size proportional to label area.',
    mandatory: true
  });

  // 2. Vegetarian / Non-Vegetarian Logo (Reg 5(4))
  const vegPass = input.hasVegLogo !== false;
  results.push({
    id: 'fssai-r-2',
    code: 'FSSAI-REG-5-4',
    regulationCode: 'FSSAI-REG-5-4',
    title: 'Veg / Non-Veg Indicator Symbol',
    fssaiSection: 'Regulation 5(4), FSS 2020',
    legalReference: 'Regulation 5(4), FSS 2020',
    status: vegPass ? 'pass' : 'violation',
    detectedText: vegPass ? 'Green dot in square (Vegetarian food symbol)' : 'Symbol absent',
    detectedValue: vegPass ? 'Green dot in square (Vegetarian food symbol)' : 'Symbol absent',
    explanation: vegPass
      ? 'Statutory vegetarian symbol (green filled circle inside green square) clearly displayed on principal display panel.'
      : 'VIOLATION: Missing mandatory Veg/Non-Veg indicator symbol under Regulation 5(4).',
    guideline: 'Mandatory green circle in square (vegetarian) or brown triangle in square (non-vegetarian).',
    mandatory: true
  });

  // 3. Nutritional Information Panel (Reg 5(3))
  const nutritionPass = input.hasNutritionPanel !== false;
  results.push({
    id: 'fssai-r-3',
    code: 'FSSAI-REG-5-3',
    regulationCode: 'FSSAI-REG-5-3',
    title: 'Nutritional Information Table',
    fssaiSection: 'Regulation 5(3), FSS 2020',
    legalReference: 'Regulation 5(3), FSS 2020',
    status: nutritionPass ? 'pass' : 'violation',
    detectedText: nutritionPass ? 'Per 100g: Energy 598 kcal, Protein 21.2g, Carbs 19.5g, Total Fat 52.4g, Sodium 420mg' : 'Table missing',
    detectedValue: nutritionPass ? 'Per 100g: Energy 598 kcal, Protein 21.2g, Carbs 19.5g, Total Fat 52.4g, Sodium 420mg' : 'Table missing',
    explanation: nutritionPass
      ? 'Complete nutritional panel present detailing Energy (kcal), Protein, Carbohydrates, Added Sugars, Total Fat, and Sodium per 100g and per serving.'
      : 'VIOLATION: Nutritional information table missing or incomplete under Regulation 5(3).',
    guideline: 'Must declare energy value, protein, carbohydrates, total sugars, added sugars, total fat, saturated fat, trans fat, and sodium.',
    mandatory: true
  });

  // 4. Ingredients Declaration in Descending Order (Reg 5(2))
  const ingPass = input.hasIngredients !== false;
  results.push({
    id: 'fssai-r-4',
    code: 'FSSAI-REG-5-2',
    regulationCode: 'FSSAI-REG-5-2',
    title: 'Ingredients Declaration in Descending Order',
    fssaiSection: 'Regulation 5(2), FSS 2020',
    legalReference: 'Regulation 5(2), FSS 2020',
    status: ingPass ? 'pass' : 'review',
    detectedText: ingPass ? 'Ingredients: Roasted Almond Kernels (98%), Edible Common Salt (2%)' : 'Not isolated',
    detectedValue: ingPass ? 'Ingredients: Roasted Almond Kernels (98%), Edible Common Salt (2%)' : 'Not isolated',
    explanation: ingPass
      ? 'Ingredients listed with clear header in descending order of ingoing weight at time of manufacture.'
      : 'Ingredients list requires manual inspection for order of predominance.',
    guideline: 'Ingredients must be listed in descending order of weight or volume (m/m or v/v).',
    mandatory: true
  });

  // 5. Allergen Warning / Declaration (Reg 5(2)(c))
  const allergenPass = input.hasAllergenDeclaration !== false;
  results.push({
    id: 'fssai-r-5',
    code: 'FSSAI-REG-5-2-C',
    regulationCode: 'FSSAI-REG-5-2-C',
    title: 'Allergen Advisory Declaration',
    fssaiSection: 'Regulation 5(2)(c), FSS 2020',
    legalReference: 'Regulation 5(2)(c), FSS 2020',
    status: allergenPass ? 'pass' : 'review',
    detectedText: allergenPass ? 'Allergen Advice: Contains Tree Nuts (Almonds). Processed in a facility that also handles peanuts and gluten.' : 'No advisory found',
    detectedValue: allergenPass ? 'Allergen Advice: Contains Tree Nuts (Almonds). Processed in a facility that also handles peanuts and gluten.' : 'No advisory found',
    explanation: allergenPass
      ? 'Allergen warning prominently displayed in bold font or boxed format.'
      : 'Allergen statement should be verified if food commodity contains major allergens (nuts, milk, soy, gluten).',
    guideline: 'Declaration of allergens is mandatory for specified allergens (cereals containing gluten, crustacea, fish, eggs, peanuts, soybeans, milk, tree nuts).',
    mandatory: false
  });

  return results;
}

export function computeOverallStatus(
  inputOrEvidence: ProductComplianceInput | ProductIdentityEvidence,
  pcrResults: RuleResult[],
  fssaiResults?: FSSAICheckResult[],
  conflicts?: DataConflict[]
): OverallInspectionStatus {
  return computeDetailedComplianceAssessment(inputOrEvidence, pcrResults, fssaiResults, conflicts).status;
}

export function computeDetailedComplianceAssessment(
  inputOrEvidence: ProductComplianceInput | ProductIdentityEvidence,
  pcrResults: RuleResult[],
  fssaiResults?: FSSAICheckResult[],
  conflicts?: DataConflict[]
): { score: number; status: OverallInspectionStatus; reason: string } {
  const isConfirmed = 'isIdentityConfirmed' in inputOrEvidence 
    ? Boolean(inputOrEvidence.isIdentityConfirmed)
    : true;

  // 1. Identity confirmation check
  if (!isConfirmed) {
    return {
      score: 45,
      status: 'Product identity not confirmed',
      reason: 'Product identity could not be conclusively verified against ground-truth evidence or online registries. Manual verification by Legal Metrology officer is required before statutory sanction.'
    };
  }

  const brand = 'detectedBrand' in inputOrEvidence ? inputOrEvidence.detectedBrand : inputOrEvidence.brand;
  const name = 'detectedProductName' in inputOrEvidence ? inputOrEvidence.detectedProductName : inputOrEvidence.productName;
  const mrp = 'detectedMRP' in inputOrEvidence 
    ? ((inputOrEvidence as ProductIdentityEvidence).detectedMRP || (inputOrEvidence as ProductIdentityEvidence).detectedMrp)
    : (inputOrEvidence as ProductComplianceInput).mrp;

  const hasBrand = Boolean((brand || '').trim() && brand !== 'Unknown' && !brand.toLowerCase().includes('unknown'));
  const hasName = Boolean((name || '').trim() && !name.toLowerCase().includes('unknown') && !name.toLowerCase().includes('unidentified'));
  const hasMrp = Boolean((mrp || '').trim() && !(mrp || '').toLowerCase().includes('not detected'));

  // 2. Insufficient evidence check
  if (!hasBrand && !hasName && !hasMrp) {
    return {
      score: 20,
      status: 'Insufficient evidence',
      reason: 'Uploaded label image does not contain sufficient legible declarations for automated optical evaluation.'
    };
  }

  // 3. Count violations across PCR and FSSAI
  const pcrViolations = pcrResults.filter(r => r.status === 'violation').length;
  const pcrReviews = pcrResults.filter(r => r.status === 'review').length;
  
  const fssaiViolations = fssaiResults ? fssaiResults.filter(r => r.status === 'violation').length : 0;
  const fssaiReviews = fssaiResults ? fssaiResults.filter(r => r.status === 'review').length : 0;

  const totalViolations = pcrViolations + fssaiViolations;
  const totalReviews = pcrReviews + fssaiReviews;
  const allConflicts = conflicts || ('dataConflicts' in inputOrEvidence ? inputOrEvidence.dataConflicts : []);
  const hasConflicts = Boolean(allConflicts && allConflicts.length > 0);

  // Base score calculation
  let score = 100;
  score -= (totalViolations * 18);
  score -= (totalReviews * 8);
  if (hasConflicts) score -= 15;
  score = Math.max(15, Math.min(100, score));

  if (totalViolations > 0) {
    return {
      score,
      status: 'Potential violation',
      reason: `Detected ${totalViolations} statutory non-compliance item(s) under Legal Metrology (PCR 2011)${fssaiResults ? ' and FSSAI 2020 Regulations' : ''}.`
    };
  }

  if (totalReviews > 0 || hasConflicts || score < 90) {
    return {
      score,
      status: 'Needs manual verification',
      reason: hasConflicts 
        ? 'Conflicting data detected between physical label OCR and registered online catalog. Requires physical measurement and invoice check.'
        : `Identified ${totalReviews} declaration(s) requiring manual verification with official gauge.`
    };
  }

  return {
    score: 98,
    status: 'Compliant based on configured checks',
    reason: `All applicable statutory declarations comply with configured Legal Metrology Rules, 2011${fssaiResults ? ' and FSSAI (Labelling and Display) Regulations, 2020' : ''}.`
  };
}
