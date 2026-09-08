import { CommunityPost } from '../types';
import { DEMO_LABELS } from './mockData';

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-lucknow-101',
    title: 'Huge potato chips packet but 45% empty air (slack fill) at Phoenix Palassio mall',
    authorName: 'Pooja Srivastava',
    authorRole: 'Citizen',
    isVerifiedCitizen: true,
    isOfficialPost: false,
    location: 'Gomti Nagar, Lucknow',
    category: 'Deceptive Packaging & Slack Fill',
    timestamp: '2 hours ago',
    content: 'Purchased a jumbo party size snack pack from the supermarket in Gomti Nagar. The packet measures nearly 32cm in height, but upon opening, less than half the volume is actual chips and 45%+ is non-functional air/gas. Is this permissible under Rule 5 of the Legal Metrology (Packaged Commodities) Rules? The declared net weight of 70g is also printed in tiny 1.5mm font in the bottom corner instead of the mandatory font height.',
    productName: 'CrunchMax Jumbo Party Chips',
    brand: 'CrunchMax Foods',
    evidenceImage: DEMO_LABELS.compliantFood,
    upvotes: 42,
    hasUpvoted: false,
    statusBadge: 'Inspection Scheduled',
    comments: [
      {
        id: 'c-1',
        authorName: 'Alok Verma',
        authorRole: 'Citizen',
        timestamp: '1 hour ago',
        message: 'Facing the exact same issue with snack brands across Gomti Nagar. The oversize pouches give a fraudulent impression of larger quantity to children.',
        likes: 12
      },
      {
        id: 'c-2',
        authorName: 'Inspector GASLIGHTER',
        authorRole: 'Legal Metrology Officer',
        isOfficial: true,
        timestamp: '35 mins ago',
        message: 'OFFICIAL NOTICE: Under Rule 5 of PCR 2011, packaging must not be misleading regarding volume, and Rule 7 strictly mandates minimum font height based on net area. A surveillance inspection has been scheduled for hypermarkets in Gomti Nagar circle.',
        likes: 31
      }
    ]
  },
  {
    id: 'post-lucknow-102',
    title: 'Hazratganj confectionery pasting thermal paper sticker quoting ₹250 over printed MRP ₹210',
    authorName: 'Dr. Anurag Dixit',
    authorRole: 'Citizen',
    isVerifiedCitizen: true,
    isOfficialPost: false,
    location: 'Hazratganj, Lucknow',
    category: 'MRP Overcharging & Dual Pricing',
    timestamp: '4 hours ago',
    content: 'Visited a bakery in Hazratganj yesterday. An imported chocolate wafer pack had original manufacturer printed MRP of ₹210 (inclusive of all taxes). The shopkeeper pasted a barcoded paper sticker over it claiming ₹250, arguing it covers chilling and logistics costs. Section 18(2) explicitly forbids selling higher than printed MRP. Other customers should check their bills before paying.',
    productName: 'Deluxe Cocoa Crisps (150g)',
    brand: 'Deluxe Confectioneries',
    evidenceImage: DEMO_LABELS.violationCosmetic,
    upvotes: 68,
    hasUpvoted: false,
    statusBadge: 'Under Officer Review',
    comments: [
      {
        id: 'c-3',
        authorName: 'Rishi Mohan',
        authorRole: 'Consumer Activist',
        timestamp: '3 hours ago',
        message: 'Smudging or overriding MRP with a sticker is a compounding offence under Section 36(1) of the Legal Metrology Act, 2009. Please lodge a formal complaint on the Grievance tab as well!',
        likes: 18
      },
      {
        id: 'c-4',
        authorName: 'Inspector GASLIGHTER',
        authorRole: 'Legal Metrology Officer',
        isOfficial: true,
        timestamp: '2 hours ago',
        message: 'Thank you for reporting. Team dispatched for spot audit under Section 15 inspection powers. Smudging or overriding MRP attracts compounding penalties up to ₹25,000.',
        likes: 44
      }
    ]
  },
  {
    id: 'post-lucknow-103',
    title: 'Shrinkflation Alert: Bath soap reduced from 125g to 105g while price remains ₹45',
    authorName: 'Suresh Chandra Gupta',
    authorRole: 'Retailer / Trader',
    isVerifiedCitizen: false,
    isOfficialPost: false,
    location: 'Aminabad Market, Lucknow',
    category: 'Shrinkflation Alert',
    timestamp: 'Yesterday at 5:15 PM',
    content: 'As retailers in Aminabad Kirana market, we are facing intense arguments from customers every day. Major FMCG brands have quietly reduced the bar soap weight from 125g to 105g while maintaining identical carton packaging and keeping the ₹45 MRP unchanged. Customers think shopkeepers are charging extra! There ought to be a statutory requirement requiring FMCG brands to clearly highlight any net quantity reduction for at least 6 months on the front label.',
    productName: 'Herbal Care Bathing Bar',
    brand: 'PureLife Care',
    upvotes: 89,
    hasUpvoted: true,
    statusBadge: 'Public Discussion',
    comments: [
      {
        id: 'c-5',
        authorName: 'Meena Rastogi',
        authorRole: 'Citizen',
        timestamp: 'Yesterday',
        message: 'Very true! Unit Sale Price (USP) under Rule 6(11) was introduced precisely for this reason so we can compare price per gram, but many brands still print it in unreadable micro font.',
        likes: 24
      }
    ]
  },
  {
    id: 'post-lucknow-104',
    title: 'OFFICIAL ADVISORY: 8 Mandatory Declarations checklist before purchasing festive gift packs',
    authorName: 'Inspector GASLIGHTER',
    authorRole: 'Legal Metrology Officer',
    isVerifiedCitizen: false,
    isOfficialPost: true,
    location: 'Enforcement HQ, Lucknow Zone',
    category: 'Officer Advisory',
    timestamp: '1 day ago',
    content: 'Ahead of the upcoming festival season in Uttar Pradesh, the Department of Legal Metrology advises all consumers in Lucknow Zone to verify the following 8 statutory declarations on all packaged commodities and gift hampers:\n\n1. Complete Name & Address of Manufacturer / Packer / Importer (with State and PIN code).\n2. Country of Origin on imported products.\n3. Common or generic name of the commodity.\n4. Net Quantity in standard metric units (g, kg, ml, l, or number).\n5. Month & Year of manufacture or packing.\n6. Maximum Retail Price (MRP) with explicit phrase "Inclusive of all taxes".\n7. Unit Sale Price (USP) per g/ml for commodities exceeding 1 unit.\n8. Consumer Care Contact: Name, address, telephone number, and valid email of the grievance redressal person.\n\nReport any non-compliant packages directly on this portal.',
    upvotes: 154,
    hasUpvoted: true,
    statusBadge: 'Official Advisory',
    comments: [
      {
        id: 'c-6',
        authorName: 'Sunil Kumar Saxena',
        authorRole: 'Citizen',
        timestamp: '1 day ago',
        message: 'Very helpful summary, Officer. Will keep this checklist handy while purchasing dry fruit hampers in Chowk and Aminabad markets.',
        likes: 19
      }
    ]
  },
  {
    id: 'post-lucknow-105',
    title: 'Beverage can missing consumer care email address in Alambagh retail store',
    authorName: 'Farhan Zaidi',
    authorRole: 'Citizen',
    isVerifiedCitizen: true,
    isOfficialPost: false,
    location: 'Alambagh, Lucknow',
    category: 'Missing Mandatory Labels',
    timestamp: '2 days ago',
    content: 'Found a 300ml sparkling fruit beverage can in Alambagh that only provides a PO Box number and generic website for customer feedback. As per Rule 6(1)(f) of PCR 2011, it is mandatory to provide a working email ID and direct telephone number of the grievance officer. Without an email, how can consumers send damaged can photos or seek replacement?',
    productName: 'FizzBurst Lemon Drink 300ml',
    brand: 'FizzBurst Beverages',
    upvotes: 35,
    hasUpvoted: false,
    statusBadge: 'Resolved / Compounded',
    comments: [
      {
        id: 'c-7',
        authorName: 'Inspector GASLIGHTER',
        authorRole: 'Legal Metrology Officer',
        isOfficial: true,
        timestamp: '1 day ago',
        message: 'CASE RESOLVED: Show cause notice was issued under Rule 6(1)(f) read with Section 36. The manufacturer has admitted the omission, deposited ₹15,000 compounding fees, and submitted an undertaking to correct the printing in the upcoming batch.',
        likes: 38
      }
    ]
  }
];
