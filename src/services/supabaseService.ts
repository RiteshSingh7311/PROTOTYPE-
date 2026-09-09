import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { InspectionRecord, ConsumerComplaint, CommunityPost } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true },
      realtime: { params: { eventsPerSecond: 10 } }
    })
  : null;

// ==============================================================================
// SUPABASE DATA SERVICE WITH SEAMLESS OFFLINE FALLBACK
// ==============================================================================

export const supabaseService = {
  isConfigured: isSupabaseConfigured,

  /**
   * Test Supabase connection and verify health
   */
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (!supabase) {
      return { ok: false, message: 'Supabase credentials not configured in .env' };
    }
    try {
      const { error } = await supabase.from('inspections').select('id').limit(1);
      if (error) {
        // If table doesn't exist yet, it's still connected to Supabase
        if (error.code === '42P01' || error.message.includes('relation "public.inspections" does not exist')) {
          return { 
            ok: true, 
            message: 'Connected to Supabase! (Tables need to be created via supabase_schema.sql)' 
          };
        }
        return { ok: false, message: error.message };
      }
      return { ok: true, message: 'Successfully connected to Supabase cloud database!' };
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Connection failed' };
    }
  },

  // ----------------------------------------------------------------------------
  // 1. INSPECTIONS
  // ----------------------------------------------------------------------------
  async getInspections(): Promise<InspectionRecord[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Supabase getInspections error/empty:', error?.message);
        return null;
      }

      return data.map(row => ({
        id: row.id,
        timestamp: row.timestamp || new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 16),
        inspectorName: row.inspector_name || 'GASLIGHTER',
        inspectorDesignation: row.inspector_designation || 'Inspector of Legal Metrology',
        inspectorZone: row.inspector_zone || 'Lucknow Zone, Uttar Pradesh',
        productName: row.product_name,
        brand: row.brand,
        category: row.category,
        barcode: row.barcode,
        batchNumber: row.batch_number,
        labelImage: row.label_image,
        fields: row.fields || [],
        ruleResults: row.rule_results || [],
        complianceScore: row.compliance_score || 0,
        overallStatus: row.overall_status,
        officerNotes: row.officer_notes || '',
        isVerified: row.is_verified ?? false,
        verifiedAt: row.verified_at,
        identityEvidence: row.identity_evidence,
        onlineVerification: row.online_verification,
        fssaiResults: row.fssai_results,
        dataConflicts: row.data_conflicts
      }));
    } catch (e) {
      console.warn('Failed to fetch inspections from Supabase:', e);
      return null;
    }
  },

  async saveInspection(record: InspectionRecord): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = {
        id: record.id,
        timestamp: record.timestamp,
        inspector_name: record.inspectorName,
        inspector_designation: record.inspectorDesignation,
        inspector_zone: record.inspectorZone,
        product_name: record.productName,
        brand: record.brand,
        category: record.category,
        barcode: record.barcode || null,
        batch_number: record.batchNumber || null,
        label_image: record.labelImage,
        fields: record.fields,
        rule_results: record.ruleResults,
        compliance_score: record.complianceScore,
        overall_status: record.overallStatus,
        officer_notes: record.officerNotes,
        is_verified: record.isVerified,
        verified_at: record.verifiedAt || null,
        identity_evidence: record.identityEvidence || null,
        online_verification: record.onlineVerification || null,
        fssai_results: record.fssaiResults || null,
        data_conflicts: record.dataConflicts || null
      };

      const { error } = await supabase
        .from('inspections')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase saveInspection error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Failed to save inspection to Supabase:', e);
      return false;
    }
  },

  // ----------------------------------------------------------------------------
  // 2. CONSUMER COMPLAINTS
  // ----------------------------------------------------------------------------
  async getComplaints(): Promise<ConsumerComplaint[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;

      return data.map(row => ({
        id: row.id,
        timestamp: row.timestamp || new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 16),
        complainantName: row.complainant_name,
        complainantContact: row.complainant_contact,
        productName: row.product_name,
        brand: row.brand,
        category: row.category,
        storeOrPlatform: row.store_or_platform,
        location: row.location,
        violationType: row.violation_type,
        description: row.description,
        evidenceImage: row.evidence_image,
        status: row.status,
        priority: row.priority,
        assignedOfficer: row.assigned_officer,
        actionNotes: row.action_notes
      }));
    } catch (e) {
      console.warn('Failed to fetch complaints from Supabase:', e);
      return null;
    }
  },

  async saveComplaint(complaint: ConsumerComplaint): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = {
        id: complaint.id,
        timestamp: complaint.timestamp,
        complainant_name: complaint.complainantName,
        complainant_contact: complaint.complainantContact,
        product_name: complaint.productName,
        brand: complaint.brand,
        category: complaint.category,
        store_or_platform: complaint.storeOrPlatform,
        location: complaint.location,
        violation_type: complaint.violationType,
        description: complaint.description,
        evidence_image: complaint.evidenceImage || null,
        status: complaint.status,
        priority: complaint.priority,
        assigned_officer: complaint.assignedOfficer,
        action_notes: complaint.actionNotes || null
      };

      const { error } = await supabase
        .from('complaints')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase saveComplaint error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Failed to save complaint to Supabase:', e);
      return false;
    }
  },

  async updateComplaintStatus(id: string, status: string, notes?: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload: any = { status };
      if (notes) payload.action_notes = notes;

      const { error } = await supabase
        .from('complaints')
        .update(payload)
        .eq('id', id);

      return !error;
    } catch (e) {
      console.warn('Failed to update complaint in Supabase:', e);
      return false;
    }
  },

  // ----------------------------------------------------------------------------
  // 3. COMMUNITY POSTS
  // ----------------------------------------------------------------------------
  async getCommunityPosts(): Promise<CommunityPost[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;

      return data.map(row => ({
        id: row.id,
        title: row.title,
        authorName: row.author_name,
        authorRole: row.author_role,
        isVerifiedCitizen: row.is_verified_citizen,
        isOfficialPost: row.is_official_post,
        location: row.location,
        category: row.category,
        timestamp: row.timestamp,
        content: row.content,
        productName: row.product_name,
        brand: row.brand,
        evidenceImage: row.evidence_image,
        upvotes: row.upvotes || 0,
        comments: row.comments || [],
        statusBadge: row.status_badge
      }));
    } catch (e) {
      console.warn('Failed to fetch community posts from Supabase:', e);
      return null;
    }
  },

  async saveCommunityPost(post: CommunityPost): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = {
        id: post.id,
        title: post.title,
        author_name: post.authorName,
        author_role: post.authorRole,
        is_verified_citizen: post.isVerifiedCitizen,
        is_official_post: post.isOfficialPost,
        location: post.location,
        category: post.category,
        timestamp: post.timestamp,
        content: post.content,
        product_name: post.productName || null,
        brand: post.brand || null,
        evidence_image: post.evidenceImage || null,
        upvotes: post.upvotes,
        comments: post.comments,
        status_badge: post.statusBadge
      };

      const { error } = await supabase
        .from('community_posts')
        .upsert(payload, { onConflict: 'id' });

      return !error;
    } catch (e) {
      console.warn('Failed to save community post to Supabase:', e);
      return false;
    }
  },

  async updatePostUpvotes(id: string, upvotes: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ upvotes })
        .eq('id', id);

      return !error;
    } catch (e) {
      return false;
    }
  }
};
