export type DeclarationStatus = 'pass' | 'violation' | 'review' | 'not_applicable';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface DeclarationField {
  id: string;
  key: string;
  label: string;
  value: string;
  confidence: number; // 0-100
  ruleReference: string; // e.g. "Rule 6(1)(c)"
  status: DeclarationStatus;
  statusExplanation: string;
  boundingBox: BoundingBox;
  isEdited?: boolean;
  notes?: string;
  requiredForCategories?: string[];
}

export interface ComplianceRule {
  id: string;
  code: string;
  title: string;
  legalSection: string;
  description: string;
  category: 'all' | 'food' | 'cosmetics' | 'electronics' | 'general';
  severity: 'critical' | 'high' | 'medium';
  isActive: boolean;
  validationType: 'presence' | 'pattern' | 'numeric' | 'contrast' | 'manual';
  guidelines: string;
}

export interface RuleResult {
  ruleId: string;
  ruleCode: string;
  title: string;
  legalSection: string;
  status: DeclarationStatus;
  explanation: string;
  detectedText?: string;
  evidenceFieldId?: string;
  officerOverride?: {
    status: DeclarationStatus;
    verifiedBy: string;
    verifiedAt: string;
    reason: string;
  };
}

export type VerificationStatus = 
  | 'Verified from source' 
  | 'Partially matched' 
  | 'Conflicting information' 
  | 'Not found' 
  | 'Manual verification required';

export type OverallInspectionStatus = 
  | 'Compliant based on configured checks' 
  | 'Potential violation' 
  | 'Needs manual verification' 
  | 'Product identity not confirmed' 
  | 'Insufficient evidence'
  | 'Compliant'
  | 'Needs Manual Verification'
  | 'Potential Violation';

export interface DataConflict {
  field?: string;
  fieldName?: string;
  labelValue: string;
  onlineValue?: string;
  catalogValue?: string;
  explanation: string;
  severity?: 'warning' | 'critical';
}

export interface ProductIdentityEvidence {
  detectedBrand: string;
  detectedProductName: string;
  detectedManufacturer?: string;
  detectedBarcode?: string;
  detectedMrp?: string;
  detectedMRP?: string;
  detectedNetQty?: string;
  detectedNetQuantity?: string;
  detectedMfgDate?: string;
  detectedOrigin?: string;
  detectedBatchNumber?: string;
  detectedDates?: string;
  detectedFSSAI?: string;
  brand?: string;
  productName?: string;
  mrp?: string;
  netQuantity?: string;
  manufacturer?: string;
  barcode?: string;
  confidenceScore?: number; // 0 - 100
  matchConfidence?: number;
  brandConfidence?: number;
  productNameConfidence?: number;
  manufacturerConfidence?: number;
  barcodeConfidence?: number;
  netQuantityConfidence?: number;
  mrpConfidence?: number;
  isIdentityConfirmed: boolean;
  confirmationMethod?: 'confirmed_by_officer' | 'auto_matched' | 'unconfirmed' | 'manual_override' | 'bypassed';
  confirmationStatus?: 'confirmed' | 'unconfirmed' | 'bypassed';
  confirmedAt?: string;
  identifiedSignals?: string[];
  matchingSignalsCount?: number;
}

export interface OnlineVerificationResult {
  isConfiguredApi?: boolean;
  sourceName: string;
  sourceUrl?: string;
  matchedProductName?: string;
  matchedBrand?: string;
  matchedManufacturer?: string;
  matchedMrp?: string;
  matchedMRP?: string;
  matchedNetQty?: string;
  matchedNetQuantity?: string;
  matchedBarcode?: string;
  matchConfidence: number; // 0 - 100
  status?: VerificationStatus;
  verificationStatus?: VerificationStatus;
  conflicts?: (DataConflict | string)[];
  isDemoMock?: boolean;
  isMockData?: boolean;
  message?: string;
  explanation?: string;
  searchTimestamp?: string;
  matchedAt?: string;
}

export interface FSSAICheckResult {
  id?: string;
  code?: string;
  regulationCode?: string;
  regulationRef?: string;
  title?: string;
  declaration?: string;
  fssaiSection?: string; // e.g. "Regulation 5(1) FSS 2020"
  legalReference?: string;
  status: DeclarationStatus;
  detectedText?: string;
  detectedValue?: string;
  extractedValue?: string;
  explanation: string;
  evidence?: string;
  guideline?: string;
  mandatory?: boolean;
}

export interface InspectionRecord {
  id: string;
  timestamp: string;
  inspectorName: string;
  inspectorDesignation: string;
  inspectorZone: string;
  productName: string;
  brand: string;
  category: string;
  barcode?: string;
  batchNumber?: string;
  labelImage: string;
  fields: DeclarationField[];
  ruleResults: RuleResult[];
  complianceScore: number;
  overallStatus: OverallInspectionStatus;
  officerNotes: string;
  isVerified: boolean;
  verifiedAt?: string;
  isIdentityConfirmed?: boolean;
  identityEvidence?: ProductIdentityEvidence;
  onlineVerification?: OnlineVerificationResult;
  fssaiResults?: FSSAICheckResult[];
  dataConflicts?: DataConflict[];
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
}

export type ComplaintStatus = 'Pending Investigation' | 'Notice Issued' | 'Under Inspection' | 'Resolved / Compounded';
export type ComplaintPriority = 'High' | 'Medium' | 'Low';

export interface ConsumerComplaint {
  id: string;
  timestamp: string;
  complainantName: string;
  complainantContact: string;
  productName: string;
  brand: string;
  category: string;
  storeOrPlatform: string;
  location: string;
  violationType: string;
  description: string;
  evidenceImage?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedOfficer: string;
  actionNotes?: string;
}

export type CommunityCategory = 
  | 'Deceptive Packaging & Slack Fill' 
  | 'MRP Overcharging & Dual Pricing' 
  | 'Missing Mandatory Labels' 
  | 'Shrinkflation Alert' 
  | 'Officer Advisory' 
  | 'General Consumer Discussion';

export interface CommunityComment {
  id: string;
  authorName: string;
  authorRole: 'Citizen' | 'Legal Metrology Officer' | 'Retailer / Trader' | 'Consumer Activist';
  isOfficial?: boolean;
  timestamp: string;
  message: string;
  likes?: number;
}

export interface CommunityPost {
  id: string;
  title: string;
  authorName: string;
  authorRole: 'Citizen' | 'Legal Metrology Officer' | 'Retailer / Trader' | 'Consumer Activist';
  isVerifiedCitizen?: boolean;
  isOfficialPost?: boolean;
  location: string;
  category: CommunityCategory;
  timestamp: string;
  content: string;
  productName?: string;
  brand?: string;
  evidenceImage?: string;
  upvotes: number;
  hasUpvoted?: boolean;
  comments: CommunityComment[];
  statusBadge?: 'Under Officer Review' | 'Inspection Scheduled' | 'Official Advisory' | 'Resolved / Compounded' | 'Public Discussion';
}

