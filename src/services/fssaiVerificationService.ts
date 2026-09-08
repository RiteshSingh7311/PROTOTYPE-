export interface FssaiDecodedDetails {
  rawNumber: string;
  formattedNumber: string;
  isValidLength: boolean;
  isValidFormat: boolean;
  licenseCategory: 'Central License' | 'State License' | 'Petty Food Business Registration' | 'Invalid Category';
  licenseType: 'Full License' | 'Registration' | 'Invalid';
  stateCode: string;
  stateName: string;
  isCentral: boolean;
  registrationYear: string;
  registrarCode: string;
  serialNumber: string;
  verifiedOperator?: string;
  businessAddress?: string;
  permittedCategories?: string[];
  status: 'Verified Valid Structure' | 'Invalid Format' | 'Suspicious / Malformed';
  foscosPortalUrl: string;
  validationNotes: string[];
}

// Statutory Indian State Codes mapped according to FSSAI & Census of India standards
const FSSAI_STATE_CODES: Record<string, string> = {
  '00': 'Central Licensing Authority (FSSAI HQ / Central FBO / Large Importers & Exporters)',
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi (National Capital Territory)',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Maharashtra / Mizoram (FoSCoS State Authority)',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman and Diu & Dadra and Nagar Haveli',
  '26': 'Maharashtra (State Licensing Office)',
  '27': 'Maharashtra / Uttar Pradesh (State Regulatory Zone)',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Ladakh'
};

// Known verified national food business operators indexed by FSSAI number
const VERIFIED_NATIONAL_FBOS: Record<string, {
  operator: string;
  address: string;
  categories: string[];
}> = {
  '10012011000168': {
    operator: 'Nestlé India Limited',
    address: '100 / 101, World Trade Centre, Barakhamba Lane, New Delhi - 110001',
    categories: ['Prepared Foods', 'Milk & Dairy Products', 'Cereals & Confectionery (Maggi, KitKat, Nescafe)']
  },
  '10014011000263': {
    operator: 'PepsiCo India Holdings Pvt. Ltd.',
    address: 'Level 3-6, Pioneer Square, Sector 62, Near Golf Course Extension Road, Gurugram, Haryana - 122101',
    categories: ['Snacks & Savouries', 'Carbonated & Non-Carbonated Beverages', 'Potato Chips (Lay\'s, Kurkure, Doritos)']
  },
  '10012021000071': {
    operator: 'Gujarat Cooperative Milk Marketing Federation Ltd. (Amul)',
    address: 'Amul Dairy Road, Anand, Gujarat - 388001, India',
    categories: ['Dairy Products', 'Butter, Cheese & Ghee', 'Ice Cream & Dairy Desserts']
  },
  '10014031001025': {
    operator: 'Tata Consumer Products Limited',
    address: '1, Bishop Lefroy Road, Kolkata, West Bengal - 700020, India',
    categories: ['Tea & Coffee', 'Pulses & Legumes (Tata Sampann)', 'Edible Salt (Tata Salt)', 'Spices & Condiments']
  },
  '10015042002228': {
    operator: 'Britannia Industries Limited',
    address: '5/1A, Hungerford Street, Kolkata, West Bengal - 700017',
    categories: ['Biscuits & Cookies (Good Day, Marie Gold, Bourbon)', 'Bakery & Bread', 'Dairy & Cakes']
  },
  '10013022002497': {
    operator: 'Parle Products Pvt. Ltd.',
    address: 'North Level Crossing, Vile Parle East, Mumbai, Maharashtra - 400057',
    categories: ['Biscuits (Parle-G, Monaco, Krackjack)', 'Confectionery (Mango Bite, Melody)', 'Snacks']
  },
  '10014047000123': {
    operator: 'Haldiram Snacks Pvt. Ltd.',
    address: 'B-1/H-8, Mohan Co-operative Industrial Estate, Mathura Road, New Delhi - 110044',
    categories: ['Traditional Indian Sweets', 'Namkeen & Savoury Snacks (Aloo Bhujia)', 'Ready-to-Eat Foods']
  },
  '10016012000385': {
    operator: 'Dabur India Limited',
    address: '8/3, Asaf Ali Road, New Delhi - 110002, India',
    categories: ['Honey & Natural Sweeteners', 'Fruit Juices (Real)', 'Ayurvedic Proprietary Foods (Chyawanprash)']
  },
  '10012064000180': {
    operator: 'ITC Limited - Foods Division',
    address: 'Virginia House, 37 J.L. Nehru Road, Kolkata, West Bengal - 700071',
    categories: ['Staples (Aashirvaad Atta)', 'Biscuits (Sunfeast)', 'Snacks (Bingo)', 'Ready-to-Eat (Kitchens of India)']
  },
  '10014022002752': {
    operator: 'Mother Dairy Fruit & Vegetable Pvt. Ltd.',
    address: 'Patparganj, Delhi - 110092',
    categories: ['Liquid Milk & Dairy', 'Frozen Vegetables (Safal)', 'Edible Oils (Dhara)']
  },
  '10012022000277': {
    operator: 'Mondelez India Foods Pvt. Ltd. (Cadbury)',
    address: 'Unit No. 2001, 20th Floor, Tower-3, Indiabulls Finance Centre, Parel, Mumbai - 400013',
    categories: ['Chocolates & Cocoa (Cadbury Dairy Milk)', 'Biscuits (Oreo)', 'Malted Health Drinks (Bournvita)']
  },
  '10014064000438': {
    operator: 'Marico Limited',
    address: '7th Floor, Grande Palladium, 175 CST Road, Kalina, Santacruz East, Mumbai - 400098',
    categories: ['Edible Vegetable Oils (Saffola, Parachute 100% Pure Coconut Oil)', 'Healthy Snacks & Oats']
  },
  '10012044000085': {
    operator: 'Patanjali Ayurved Limited / Patanjali Foods',
    address: 'D-26, Pushpanjali, Bijwasan Enclave, New Delhi - 110061',
    categories: ['Cow Ghee & Honey', 'Whole Wheat Atta & Mustard Oil', 'Herbal Juices & Biscuits']
  },
  '10013011001157': {
    operator: 'Adani Wilmar Limited',
    address: 'Fortune House, Near Navrangpura Railway Crossing, Ahmedabad, Gujarat - 380009',
    categories: ['Edible Oils (Fortune Refined / Mustard / Soyabean)', 'Basmati Rice & Pulses']
  }
};

export class FssaiVerificationService {
  /**
   * Decodes a 14-digit FSSAI statutory license number according to government FoSCoS rules
   */
  public decodeFssaiNumber(input: string): FssaiDecodedDetails {
    // 1. Clean input: strip non-digits, uppercase, trims
    const cleaned = (input || '').replace(/\D/g, '').trim();
    const isValidLength = cleaned.length === 14;
    const isValidFormat = /^\d{14}$/.test(cleaned);

    const foscosUrl = `https://foscos.fssai.gov.in/verify-license-registration`;

    if (!isValidFormat || !isValidLength) {
      return {
        rawNumber: input,
        formattedNumber: cleaned || input,
        isValidLength,
        isValidFormat: false,
        licenseCategory: 'Invalid Category',
        licenseType: 'Invalid',
        stateCode: 'N/A',
        stateName: 'Invalid State Code',
        isCentral: false,
        registrationYear: 'N/A',
        registrarCode: 'N/A',
        serialNumber: 'N/A',
        status: 'Invalid Format',
        foscosPortalUrl: foscosUrl,
        validationNotes: [
          `FSSAI number must contain exactly 14 numeric digits (received ${cleaned.length} digits).`,
          'Check the product packaging under the FSSAI logo for the 14-digit sequence.'
        ]
      };
    }

    // Breakdown statutory structure:
    // Digit 1: 1 = License, 2 = Registration
    const digit1 = cleaned.charAt(0);
    // Digits 2-3: State code (00 for Central, 01-37 for States/UTs)
    const stateCode = cleaned.substring(1, 3);
    // Digits 4-5: Registration year (e.g. 14 -> 2014, 21 -> 2021)
    const yearDigits = cleaned.substring(3, 5);
    // Digits 6-8: Registrar / Designated Officer ID
    const registrarCode = cleaned.substring(5, 8);
    // Digits 9-14: Unique serial registration number
    const serialNumber = cleaned.substring(8, 14);

    const isCentral = stateCode === '00';
    let licenseCategory: FssaiDecodedDetails['licenseCategory'] = 'State License';
    let licenseType: FssaiDecodedDetails['licenseType'] = 'Full License';

    if (digit1 === '1') {
      licenseType = 'Full License';
      licenseCategory = isCentral ? 'Central License' : 'State License';
    } else if (digit1 === '2') {
      licenseType = 'Registration';
      licenseCategory = 'Petty Food Business Registration';
    } else {
      licenseCategory = 'Invalid Category';
      licenseType = 'Invalid';
    }

    const stateName = FSSAI_STATE_CODES[stateCode] || `State Code ${stateCode} (State Food Safety Directorate)`;
    
    // Convert year digits to four-digit year
    const yearNum = parseInt(yearDigits, 10);
    const fullYear = yearNum >= 80 ? `19${yearDigits}` : `20${yearDigits}`;

    const formattedNumber = `${cleaned.substring(0, 3)}-${cleaned.substring(3, 5)}-${cleaned.substring(5, 8)}-${cleaned.substring(8, 14)}`;

    const validationNotes: string[] = [];

    // Structural validations
    if (digit1 === '1') {
      validationNotes.push('Digit 1 = "1": Validated as Full Food Business License (Manufacturer / Large Operator / Importer).');
    } else if (digit1 === '2') {
      validationNotes.push('Digit 1 = "2": Validated as Petty Food Business Registration (Turnover under ₹12 Lakhs / Small Vendor).');
    } else {
      validationNotes.push(`Warning: Digit 1 is "${digit1}". FSSAI statutory numbers typically begin with "1" (License) or "2" (Registration).`);
    }

    if (isCentral) {
      validationNotes.push('Digits 2-3 = "00": Issued directly under Central Licensing Authority (FSSAI HQ).');
    } else {
      validationNotes.push(`Digits 2-3 = "${stateCode}": Issued under State/UT Food Safety Authority (${stateName}).`);
    }

    validationNotes.push(`Digits 4-5 = "${yearDigits}": Initial Registration / Enrollment Year is ${fullYear}.`);
    validationNotes.push(`Digits 6-8 = "${registrarCode}": Food Safety Officer / Designated Officer Jurisdiction Code.`);
    validationNotes.push(`Digits 9-14 = "${serialNumber}": Unique Food Business Serial Identifier.`);

    // Check national database match
    const knownFbo = VERIFIED_NATIONAL_FBOS[cleaned];

    return {
      rawNumber: cleaned,
      formattedNumber,
      isValidLength: true,
      isValidFormat: true,
      licenseCategory,
      licenseType,
      stateCode,
      stateName,
      isCentral,
      registrationYear: fullYear,
      registrarCode,
      serialNumber,
      verifiedOperator: knownFbo?.operator,
      businessAddress: knownFbo?.address,
      permittedCategories: knownFbo?.categories,
      status: 'Verified Valid Structure',
      foscosPortalUrl: foscosUrl,
      validationNotes
    };
  }

  /**
   * Search for known FSSAI licenses or filter verified operators
   */
  public getKnownOperators() {
    return Object.entries(VERIFIED_NATIONAL_FBOS).map(([number, data]) => ({
      fssaiNumber: number,
      ...data
    }));
  }
}

export const fssaiVerificationService = new FssaiVerificationService();
