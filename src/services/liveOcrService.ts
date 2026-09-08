import { createWorker } from 'tesseract.js';
import { fssaiVerificationService, FssaiDecodedDetails } from './fssaiVerificationService';

export interface OcrProgressUpdate {
  status: string;
  progress: number; // 0 to 100
}

export interface ExtractedPackagingDetails {
  rawText: string;
  confidence: number;
  detectedBrand?: string;
  detectedProductName?: string;
  detectedFssaiNumber?: string;
  fssaiDecoded?: FssaiDecodedDetails;
  detectedBarcode?: string;
  detectedMrp?: string;
  includesTaxes?: boolean;
  detectedNetQty?: string;
  detectedMfgDate?: string;
  detectedExpiry?: string;
  detectedCarePhone?: string;
  detectedCareEmail?: string;
  detectedManufacturer?: string;
  detectedOrigin?: string;
  detectedLines: string[];
}

export class LiveOcrService {
  private workerPromise: ReturnType<typeof createWorker> | null = null;

  /**
   * Initializes or gets the cached Tesseract worker
   */
  private async getWorker(onProgress?: (update: OcrProgressUpdate) => void) {
    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (onProgress && m.progress !== undefined) {
          const pct = Math.round(m.progress * 100);
          onProgress({
            status: m.status || 'Processing optical frame...',
            progress: pct
          });
        }
      }
    });
    return worker;
  }

  /**
   * Scans an image file, blob, or base64 URL with Tesseract OCR
   */
  public async recognizeImage(
    imageSource: string | File | Blob,
    onProgress?: (update: OcrProgressUpdate) => void
  ): Promise<ExtractedPackagingDetails> {
    const worker = await this.getWorker(onProgress);

    try {
      const result = await worker.recognize(imageSource);
      const rawText = result.data.text || '';
      const confidence = Math.round(result.data.confidence || 0);
      const lines = rawText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      // Extract details with statutory Indian packaging regex rules
      const extracted = this.parseExtractedText(rawText, lines, confidence);
      return extracted;
    } finally {
      await worker.terminate();
    }
  }

  /**
   * Parses optical text to find FSSAI 14-digit number, Barcode, MRP, Net Qty, etc.
   */
  public parseExtractedText(
    rawText: string, 
    lines: string[], 
    confidence: number
  ): ExtractedPackagingDetails {
    // 1. FSSAI 14-Digit Number Detection
    let detectedFssaiNumber: string | undefined;

    // A. Pattern with FSSAI keyword prefix (e.g. "fssai lic no 10014011000263" or "Lic. No. 10014011000263")
    const fssaiKeywordRegex = /(?:fssai|lic(?:en[sc]e)?(?:\s*no\.?)?|issai|tssai)[\s:.-]*([12]\d{13})\b/i;
    const keywordMatch = rawText.match(fssaiKeywordRegex);

    if (keywordMatch && keywordMatch[1]) {
      detectedFssaiNumber = keywordMatch[1];
    } else {
      // B. Fallback: Search for any standalone 14-digit sequence starting with 1 or 2
      const standalone14Regex = /\b([12]\d{13})\b/;
      const standaloneMatch = rawText.match(standalone14Regex);
      if (standaloneMatch && standaloneMatch[1]) {
        detectedFssaiNumber = standaloneMatch[1];
      } else {
        // C. Look for spaced 14 digits (e.g. "100 140 1100 0263" or "100-14-011-000263")
        const spacedRegex = /(?:fssai[\s:.-]*)?([12]\d{2}[\s-]\d{2}[\s-]\d{3}[\s-]\d{6})/i;
        const spacedMatch = rawText.match(spacedRegex);
        if (spacedMatch && spacedMatch[1]) {
          detectedFssaiNumber = spacedMatch[1].replace(/[\s-]/g, '');
        }
      }
    }

    let fssaiDecoded: FssaiDecodedDetails | undefined;
    if (detectedFssaiNumber) {
      fssaiDecoded = fssaiVerificationService.decodeFssaiNumber(detectedFssaiNumber);
    }

    // 2. Barcode Detection (Indian barcodes begin with 890, 13 digits)
    let detectedBarcode: string | undefined;
    const indianBarcodeRegex = /\b(890\d{10})\b/;
    const barcodeMatch = rawText.match(indianBarcodeRegex);
    if (barcodeMatch && barcodeMatch[1]) {
      detectedBarcode = barcodeMatch[1];
    } else {
      // General 12-14 digit barcode
      const generalBarcodeMatch = rawText.match(/\b(\d{12,14})\b/);
      if (generalBarcodeMatch && generalBarcodeMatch[1] && generalBarcodeMatch[1] !== detectedFssaiNumber) {
        detectedBarcode = generalBarcodeMatch[1];
      }
    }

    // 3. MRP Detection (Rs., ₹, or MRP keywords)
    let detectedMrp: string | undefined;
    let includesTaxes = false;
    const mrpRegex = /(?:m\.?r\.?p\.?|max(?:imum)?\s*retail\s*price|rs\.?|₹)\s*[:.-]?\s*([0-9]{1,5}(?:\.[0-9]{1,2})?)/i;
    const mrpMatch = rawText.match(mrpRegex);
    if (mrpMatch && mrpMatch[1]) {
      detectedMrp = mrpMatch[1];
    }

    if (/incl(?:usive)?(?:\s*of)?\s*all\s*taxes/i.test(rawText)) {
      includesTaxes = true;
    }

    // 4. Net Quantity Detection (g, kg, ml, l, etc.)
    let detectedNetQty: string | undefined;
    const netQtyRegex = /(?:net\s*(?:wt\.?|weight|qty\.?|quantity)?[\s:.-]*)?(\b\d+(?:\.\d+)?\s*(?:kg|g|gm|gms|grams|l|ml|litres|litres|millilitres)\b)/i;
    const netQtyMatch = rawText.match(netQtyRegex);
    if (netQtyMatch && netQtyMatch[1]) {
      detectedNetQty = netQtyMatch[1].trim();
    }

    // 5. Mfg Date / Expiry Detection
    let detectedMfgDate: string | undefined;
    const mfgDateRegex = /(?:mfd|mfg|manufactured|pkd|packed|pkg\s*date)[\s:.-]*([0-9]{1,2}[\/\.-][0-9]{2,4}|\w{3,9}\s*[0-9]{4})/i;
    const mfgMatch = rawText.match(mfgDateRegex);
    if (mfgMatch && mfgMatch[1]) {
      detectedMfgDate = mfgMatch[1].trim();
    }

    let detectedExpiry: string | undefined;
    const expiryRegex = /(?:best\s*before|expiry|use\s*by|exp)[\s:.-]*([^\n,]{3,25})/i;
    const expMatch = rawText.match(expiryRegex);
    if (expMatch && expMatch[1]) {
      detectedExpiry = expMatch[1].trim();
    }

    // 6. Consumer Care details (Phone / Email)
    let detectedCarePhone: string | undefined;
    const phoneRegex = /\b(1800[- ]?\d{3}[- ]?\d{3,4}|0\d{2,4}[- ]?\d{6,8})\b/;
    const phoneMatch = rawText.match(phoneRegex);
    if (phoneMatch && phoneMatch[1]) {
      detectedCarePhone = phoneMatch[1];
    }

    let detectedCareEmail: string | undefined;
    const emailRegex = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/;
    const emailMatch = rawText.match(emailRegex);
    if (emailMatch && emailMatch[1]) {
      detectedCareEmail = emailMatch[1];
    }

    // 7. Country of Origin
    let detectedOrigin = 'India';
    if (/made\s*in\s*([a-zA-Z]+)|country\s*of\s*origin[\s:.-]*([a-zA-Z]+)/i.test(rawText)) {
      const match = rawText.match(/made\s*in\s*([a-zA-Z]+)|country\s*of\s*origin[\s:.-]*([a-zA-Z]+)/i);
      if (match) detectedOrigin = match[1] || match[2] || 'India';
    }

    // 8. Brand identification (if matched with known national FBO or prominent header lines)
    let detectedBrand = fssaiDecoded?.verifiedOperator ? fssaiDecoded.verifiedOperator.split(' ')[0] : undefined;
    let detectedProductName = lines[0] || 'Packaged Commodity';

    // If FSSAI operator known, prioritize it
    if (fssaiDecoded?.verifiedOperator) {
      detectedBrand = fssaiDecoded.verifiedOperator;
    }

    return {
      rawText,
      confidence,
      detectedBrand,
      detectedProductName,
      detectedFssaiNumber,
      fssaiDecoded,
      detectedBarcode,
      detectedMrp,
      includesTaxes,
      detectedNetQty,
      detectedMfgDate,
      detectedExpiry,
      detectedCarePhone,
      detectedCareEmail,
      detectedOrigin,
      detectedLines: lines
    };
  }
}

export const liveOcrService = new LiveOcrService();
