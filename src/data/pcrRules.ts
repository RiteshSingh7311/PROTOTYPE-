import { ComplianceRule } from '../types';

export const DEFAULT_PCR_RULES: ComplianceRule[] = [
  {
    id: 'rule-mfg-identity',
    code: 'PCR-R6-1-A',
    title: 'Manufacturer / Packer / Importer Identity & Address',
    legalSection: 'Rule 6(1)(a) & Rule 6(2)',
    description: 'Name and complete physical address of the manufacturer, or packer, or importer must be clearly declared.',
    category: 'all',
    severity: 'critical',
    isActive: true,
    validationType: 'presence',
    guidelines: 'Must provide full address enabling consumer or enforcement officer to locate premises. Mere city name is insufficient if pin code/premise missing.'
  },
  {
    id: 'rule-country-origin',
    code: 'PCR-R6-1-AA',
    title: 'Country of Origin / Manufacture',
    legalSection: 'Rule 6(1)(aa)',
    description: 'The name of the country of origin or manufacture or assembly must be mentioned on imported and domestic packages.',
    category: 'all',
    severity: 'high',
    isActive: true,
    validationType: 'presence',
    guidelines: 'Should state "Country of Origin: India" or name of manufacturing nation for imported articles.'
  },
  {
    id: 'rule-net-quantity',
    code: 'PCR-R6-1-B',
    title: 'Net Quantity Declaration in Standard SI Units',
    legalSection: 'Rule 6(1)(b) & Rule 7',
    description: 'Net quantity in terms of standard unit of weight or measure (g, kg, ml, l) or number with prescribed font height.',
    category: 'all',
    severity: 'critical',
    isActive: true,
    validationType: 'numeric',
    guidelines: 'Units must follow SI notation (g, kg, ml, L). Minimum numeral height: 2mm for <=50g/ml; 4mm for 200g-1kg.'
  },
  {
    id: 'rule-mrp',
    code: 'PCR-R6-1-C',
    title: 'Maximum Retail Price (Inclusive of all taxes)',
    legalSection: 'Rule 6(1)(c)',
    description: 'Retail sale price as "Maximum or Max. Retail Price Rs. / ₹ ... incl. of all taxes" or "MRP Rs. / ₹ ... incl. of all taxes".',
    category: 'all',
    severity: 'critical',
    isActive: true,
    validationType: 'pattern',
    guidelines: 'Must include phrase "incl. of all taxes" or "inclusive of all taxes". Simple "MRP 150" without tax clarification is non-compliant.'
  },
  {
    id: 'rule-mfg-date',
    code: 'PCR-R6-1-D',
    title: 'Month & Year of Manufacture / Packing / Import',
    legalSection: 'Rule 6(1)(d)',
    description: 'Month and year in which commodity is manufactured, packed or pre-packed must be clearly stated.',
    category: 'all',
    severity: 'high',
    isActive: true,
    validationType: 'pattern',
    guidelines: 'Can be printed as MM/YYYY, Mon/YYYY or written clearly. For items with best-before, both dates or lifespan required.'
  },
  {
    id: 'rule-consumer-care',
    code: 'PCR-R6-1-F',
    title: 'Consumer Care Cell Details',
    legalSection: 'Rule 6(1)(f)',
    description: 'Name, address, telephone number, and e-mail address of the person or office to be contacted in case of consumer complaints.',
    category: 'all',
    severity: 'critical',
    isActive: true,
    validationType: 'presence',
    guidelines: 'Must provide telephone number, email, and designated officer/department title.'
  },
  {
    id: 'rule-unit-sale-price',
    code: 'PCR-R6-11',
    title: 'Unit Sale Price (USP)',
    legalSection: 'Rule 6(11)',
    description: 'Declaration of unit sale price (e.g. ₹ per g / ₹ per ml / ₹ per item) alongside the MRP for packages > 100g/ml.',
    category: 'all',
    severity: 'high',
    isActive: true,
    validationType: 'numeric',
    guidelines: 'Mandatory on commodities to allow consumers to compare prices easily across different pack sizes.'
  },
  {
    id: 'rule-readability-contrast',
    code: 'PCR-R9',
    title: 'Prominence, Legibility & Contrast of Declarations',
    legalSection: 'Rule 9(1)',
    description: 'Declarations must be conspicuous, legible, prominent, and distinct from the background color.',
    category: 'all',
    severity: 'medium',
    isActive: true,
    validationType: 'contrast',
    guidelines: 'Background contrast must allow easy optical reading. Words should not be obscured by graphic elements.'
  }
];
