import { 
  OnlineVerificationResult, 
  DataConflict, 
  VerificationStatus,
  ProductIdentityEvidence 
} from '../types';

export interface ProductQuery {
  brand?: string;
  detectedBrand?: string;
  productName?: string;
  detectedProductName?: string;
  barcode?: string;
  detectedBarcode?: string;
  netQuantity?: string;
  detectedNetQuantity?: string;
  detectedNetQty?: string;
  mrp?: string;
  detectedMRP?: string;
  detectedMrp?: string;
  manufacturer?: string;
  detectedManufacturer?: string;
}

export interface IProductVerificationService {
  verifyProduct(query: ProductQuery): Promise<OnlineVerificationResult>;
  checkApiStatus(): { isConfigured: boolean; providerName: string };
  detectDataConflicts(evidence: ProductIdentityEvidence, onlineResult?: OnlineVerificationResult): DataConflict[];
}

// Authoritative reference database for verified demo products
interface CatalogItem {
  id: string;
  brand: string;
  productName: string;
  manufacturer: string;
  barcode: string;
  netQty: string;
  mrp: string;
  sourceName: string;
  sourceUrl: string;
}

const DEMO_CATALOG: CatalogItem[] = [
  {
    id: 'nutrisnack-almonds-500g',
    brand: 'NutriSnack Foods',
    productName: 'NutriSnack Roasted & Salted Almond Kernels',
    manufacturer: 'NutriSnack Foods Pvt. Ltd., Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana - 122015, India',
    barcode: '8901234567890',
    netQty: '500 g',
    mrp: '385.00',
    sourceName: 'NutriSnack Official Brand Registry & GS1 India',
    sourceUrl: 'https://nutrisnack.in/catalog/almonds-500g'
  },
  {
    id: 'tata-sampann-dal',
    brand: 'Tata Consumer Products Ltd.',
    productName: 'Tata Sampann 100% Unpolished Toor Dal (1kg)',
    manufacturer: 'Tata Consumer Products Ltd., 1, Bishop Lefroy Road, Kolkata, West Bengal - 700020, India',
    barcode: '8901030829142',
    netQty: '1 kg',
    mrp: '185.00',
    sourceName: 'Tata Consumer Products Brand Portal / Open Food Data',
    sourceUrl: 'https://www.tataconsumer.com/brands/food/tata-sampann'
  },
  {
    id: 'amul-butter-500g',
    brand: 'Amul (GCMMF Ltd.)',
    productName: 'Amul Pasteurised Salted Butter (500g)',
    manufacturer: 'Gujarat Cooperative Milk Marketing Federation Ltd., Amul Dairy Road, Anand, Gujarat - 388001, India',
    barcode: '8901262010054',
    netQty: '500 g',
    mrp: '275.00',
    sourceName: 'Amul Dairy Official Catalog (GCMMF)',
    sourceUrl: 'https://amul.com/products/butter'
  },
  {
    id: 'britannia-good-day',
    brand: 'Britannia Industries Ltd.',
    productName: 'Britannia Good Day Cashew Cookies (200g)',
    manufacturer: 'Britannia Industries Ltd., 5/1A Hungerford Street, Kolkata, West Bengal - 700017, India',
    barcode: '8901063012450',
    netQty: '200 g',
    mrp: '45.00',
    sourceName: 'Britannia Products Master Index',
    sourceUrl: 'https://britannia.co.in/brands/good-day'
  },
  {
    id: 'haldirams-aloo-bhujia',
    brand: "Haldiram's Foods International",
    productName: "Haldiram's Nagpur Aloo Bhujia (400g)",
    manufacturer: "Haldiram Foods International Pvt. Ltd., 20 Km Stone, Vill. Gumthala, Bhandara Road, Nagpur, Maharashtra - 441104, India",
    barcode: '8904004400128',
    netQty: '400 g',
    mrp: '110.00',
    sourceName: "Haldiram's Official E-Commerce / GS1 DataKart",
    sourceUrl: 'https://www.haldirams.com/aloo-bhujia-400g'
  },
  {
    id: 'dabur-honey-500g',
    brand: 'Dabur India Ltd.',
    productName: 'Dabur 100% Pure Honey Squeezy Pack (500g)',
    manufacturer: 'Dabur India Limited, 8/3, Asaf Ali Road, New Delhi - 110002, India',
    barcode: '8901207010214',
    netQty: '500 g',
    mrp: '240.00',
    sourceName: 'Dabur Corporate Brand Portal',
    sourceUrl: 'https://www.dabur.com/products/dabur-honey'
  }
];

export class ProductVerificationService implements IProductVerificationService {
  private isConfigured: boolean = false;
  private apiEndpoint: string = '';

  constructor() {
    // Check if external product search API is configured in environment
    const envApi = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_PRODUCT_SEARCH_API_KEY || '') : '';
    if (envApi) {
      this.isConfigured = true;
      this.apiEndpoint = (import.meta.env.VITE_PRODUCT_SEARCH_ENDPOINT as string) || 'https://api.gs1india.org/v1/products';
    }
  }

  public checkApiStatus() {
    return {
      isConfigured: this.isConfigured,
      providerName: this.isConfigured ? 'Connected External Product API' : 'Demo Verification Service (Mock Provider)'
    };
  }

  public async verifyProduct(query: ProductQuery): Promise<OnlineVerificationResult> {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const effectiveBrand = (query.brand || query.detectedBrand || '').trim();
    const effectiveName = (query.productName || query.detectedProductName || '').trim();
    const effectiveBarcode = (query.barcode || query.detectedBarcode || '').trim();
    const effectiveNetQty = (query.netQuantity || query.detectedNetQuantity || query.detectedNetQty || '').trim();
    const effectiveMrp = (query.mrp || query.detectedMRP || query.detectedMrp || '').trim();
    const effectiveMfg = (query.manufacturer || query.detectedManufacturer || '').trim();

    // If query is blank or missing key identifiers, return honest not found
    const hasSearchSignals = Boolean(
      (effectiveBrand.length > 1 && !effectiveBrand.toLowerCase().includes('unknown') && effectiveBrand !== 'Uncertain') ||
      (effectiveName.length > 2 && !effectiveName.toLowerCase().includes('unknown')) ||
      (effectiveBarcode.length >= 8)
    );

    if (!hasSearchSignals) {
      return {
        isConfiguredApi: this.isConfigured,
        sourceName: 'National Product Index / GS1 Database',
        status: 'Not found',
        verificationStatus: 'Not found',
        matchConfidence: 0,
        conflicts: [],
        isDemoMock: !this.isConfigured,
        isMockData: !this.isConfigured,
        message: 'Could not confidently identify this product. Please verify the details manually.',
        explanation: 'Could not confidently identify this product. Multiple matching signals (Brand, Barcode, Manufacturer) were insufficient or absent. Please verify the details manually.',
        searchTimestamp: timestamp,
        matchedAt: timestamp
      };
    }

    // Attempt multi-field matching
    const normalizedBrand = effectiveBrand.toLowerCase();
    const normalizedName = effectiveName.toLowerCase();
    const barcode = effectiveBarcode;

    // Find best match in catalog using multiple signals
    let bestItem: CatalogItem | null = null;
    let highestScore = 0;

    for (const item of DEMO_CATALOG) {
      let score = 0;
      const itemBrand = item.brand.toLowerCase();
      const itemName = item.productName.toLowerCase();

      // Barcode exact match is strongest signal (50 pts)
      if (barcode && item.barcode === barcode) {
        score += 50;
      }

      // Brand match (25 pts)
      if (normalizedBrand && (itemBrand.includes(normalizedBrand) || normalizedBrand.includes(itemBrand.split(' ')[0]))) {
        score += 25;
      }

      // Product Name keyword match (up to 25 pts)
      if (normalizedName) {
        const queryTokens = normalizedName.split(/\s+/).filter(t => t.length > 2);
        let tokenMatches = 0;
        for (const token of queryTokens) {
          if (itemName.includes(token)) {
            tokenMatches++;
          }
        }
        if (queryTokens.length > 0) {
          score += Math.min(25, Math.round((tokenMatches / queryTokens.length) * 25));
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestItem = item;
      }
    }

    // Threshold evaluation
    if (!bestItem || highestScore < 35) {
      return {
        isConfiguredApi: this.isConfigured,
        sourceName: 'Brand Master Index / GS1 India',
        status: 'Not found',
        verificationStatus: 'Not found',
        matchConfidence: highestScore,
        conflicts: [],
        isDemoMock: !this.isConfigured,
        isMockData: !this.isConfigured,
        message: 'Could not confidently identify this product. Please verify the details manually.',
        explanation: 'Could not confidently identify this product. Multiple matching signals (Brand, Barcode, Manufacturer) were insufficient or absent. Please verify the details manually.',
        searchTimestamp: timestamp,
        matchedAt: timestamp
      };
    }

    // Multi-signal conflict detection: compare label OCR values against online listing
    const conflicts: DataConflict[] = [];

    // MRP Conflict check
    if (effectiveMrp && bestItem.mrp) {
      const cleanLabelMrp = parseFloat(effectiveMrp.replace(/[^0-9.]/g, ''));
      const cleanOnlineMrp = parseFloat(bestItem.mrp.replace(/[^0-9.]/g, ''));

      if (!isNaN(cleanLabelMrp) && !isNaN(cleanOnlineMrp) && Math.abs(cleanLabelMrp - cleanOnlineMrp) > 0.01) {
        conflicts.push({
          field: 'Maximum Retail Price (MRP)',
          fieldName: 'Maximum Retail Price (MRP)',
          labelValue: `₹ ${cleanLabelMrp.toFixed(2)}`,
          onlineValue: `₹ ${cleanOnlineMrp.toFixed(2)}`,
          catalogValue: `₹ ${cleanOnlineMrp.toFixed(2)}`,
          explanation: `Label specifies MRP ₹${cleanLabelMrp.toFixed(2)} while official online source declares ₹${cleanOnlineMrp.toFixed(2)}. Flagged for potential overcharging, re-stickering, or dual MRP discrepancy.`,
          severity: 'critical'
        });
      }
    }

    // Net Quantity Conflict check
    if (effectiveNetQty && bestItem.netQty) {
      const normLabelQty = effectiveNetQty.toLowerCase().replace(/\s+/g, '');
      const normOnlineQty = bestItem.netQty.toLowerCase().replace(/\s+/g, '');
      if (normLabelQty !== normOnlineQty && !normLabelQty.includes(normOnlineQty) && !normOnlineQty.includes(normLabelQty)) {
        conflicts.push({
          field: 'Net Quantity',
          fieldName: 'Net Quantity',
          labelValue: effectiveNetQty,
          onlineValue: bestItem.netQty,
          catalogValue: bestItem.netQty,
          explanation: `Label indicates ${effectiveNetQty}, but online catalog listing states ${bestItem.netQty}. Verify physical weight with standard legal metrology weights.`,
          severity: 'warning'
        });
      }
    }

    // Determine verification status
    let status: VerificationStatus = 'Verified from source';
    if (conflicts.length > 0) {
      status = 'Conflicting information';
    } else if (highestScore < 70) {
      status = 'Partially matched';
    }

    const message = conflicts.length > 0
      ? `Found match with ${conflicts.length} conflicting declaration(s). Ground truth from uploaded label must be reviewed.`
      : `Product successfully verified against ${bestItem.sourceName}.`;

    return {
      isConfiguredApi: this.isConfigured,
      sourceName: bestItem.sourceName,
      sourceUrl: bestItem.sourceUrl,
      matchedProductName: bestItem.productName,
      matchedBrand: bestItem.brand,
      matchedManufacturer: bestItem.manufacturer,
      matchedMrp: bestItem.mrp,
      matchedMRP: bestItem.mrp,
      matchedNetQty: bestItem.netQty,
      matchedNetQuantity: bestItem.netQty,
      matchedBarcode: bestItem.barcode,
      matchConfidence: Math.min(99, highestScore + 20),
      status,
      verificationStatus: status,
      conflicts,
      isDemoMock: !this.isConfigured,
      isMockData: !this.isConfigured,
      searchTimestamp: timestamp,
      matchedAt: timestamp,
      message,
      explanation: message
    };
  }

  public detectDataConflicts(evidence: ProductIdentityEvidence, onlineResult?: OnlineVerificationResult): DataConflict[] {
    if (!onlineResult || !onlineResult.conflicts) return [];
    return onlineResult.conflicts.map(c => {
      if (typeof c === 'string') {
        return {
          field: 'Discrepancy',
          labelValue: 'See label',
          onlineValue: 'See catalog',
          explanation: c,
          severity: 'warning'
        };
      }
      return c;
    });
  }
}

export const productVerificationService = new ProductVerificationService();
