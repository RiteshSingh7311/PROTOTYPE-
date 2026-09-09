import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScannerView } from './components/scanner/ScannerView';
import { ExtractedDataView } from './components/ocr/ExtractedDataView';
import { EvidenceViewer } from './components/evidence/EvidenceViewer';
import { ComplianceChecklistView } from './components/compliance/ComplianceChecklistView';
import { ReportView } from './components/report/ReportView';
import { HistoryView } from './components/history/HistoryView';
import { RuleLibraryView } from './components/rules/RuleLibraryView';
import { SettingsView } from './components/settings/SettingsView';
import { ComplaintsView } from './components/complaints/ComplaintsView';
import { CommunityView } from './components/community/CommunityView';
import { FssaiVerificationView } from './components/fssai/FssaiVerificationView';

import { InspectionRecord, ConsumerComplaint, ComplaintStatus, CommunityPost, CommunityComment } from './types';
import { INITIAL_INSPECTIONS, DEMO_PRESETS } from './data/mockData';
import { INITIAL_COMPLAINTS } from './data/complaintsData';
import { INITIAL_COMMUNITY_POSTS } from './data/communityData';
import { supabaseService } from './services/supabaseService';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Store inspections list with initial mock data
  const [inspections, setInspections] = useState<InspectionRecord[]>(() => {
    const saved = localStorage.getItem('labelcheck_inspections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_INSPECTIONS;
      }
    }
    return INITIAL_INSPECTIONS;
  });

  // Store consumer complaints list
  const [complaints, setComplaints] = useState<ConsumerComplaint[]>(() => {
    const saved = localStorage.getItem('labelcheck_complaints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COMPLAINTS;
      }
    }
    return INITIAL_COMPLAINTS;
  });

  // Store community posts list
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('labelcheck_community_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COMMUNITY_POSTS;
      }
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  // Current active inspection in review workflow
  const [currentInspection, setCurrentInspection] = useState<InspectionRecord | null>(() => {
    return inspections[0] || null;
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);

  // Inspector Officer Profile
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('labelcheck_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.name !== 'Rajesh Kumar Verma') return parsed;
      } catch (e) {}
    }
    return {
      name: 'GASLIGHTER',
      role: 'Inspector of Legal Metrology (ILM)',
      zone: 'Lucknow Zone, Uttar Pradesh'
    };
  });

  // Theme State (Light / Dark mode toggle)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('labelcheck_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('labelcheck_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Supabase Cloud Connection State
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);

  // Check Supabase Cloud connectivity & hydrate tables on mount
  useEffect(() => {
    if (supabaseService.isConfigured) {
      supabaseService.testConnection().then(res => {
        if (res.ok) {
          setSupabaseConnected(true);
          // Hydrate inspections from Supabase
          supabaseService.getInspections().then(remoteInspections => {
            if (remoteInspections && remoteInspections.length > 0) {
              setInspections(remoteInspections);
            }
          });
          // Hydrate complaints from Supabase
          supabaseService.getComplaints().then(remoteComplaints => {
            if (remoteComplaints && remoteComplaints.length > 0) {
              setComplaints(remoteComplaints);
            }
          });
          // Hydrate community posts from Supabase
          supabaseService.getCommunityPosts().then(remotePosts => {
            if (remotePosts && remotePosts.length > 0) {
              setCommunityPosts(remotePosts);
            }
          });
        }
      });
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('labelcheck_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('labelcheck_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('labelcheck_community_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('labelcheck_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Handle completion of a product scan
  const handleScanComplete = (newInspection: InspectionRecord) => {
    setInspections(prev => [newInspection, ...prev]);
    setCurrentInspection(newInspection);
    setSelectedFieldId(newInspection.fields[0]?.id);

    // Sync scan to Supabase Cloud
    supabaseService.saveInspection(newInspection);

    // If fully compliant, launch celebratory confetti
    if (newInspection.overallStatus === 'Compliant') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Ignore in environments without canvas support
      }
    }

    setActiveTab('results');
  };

  // Handle correction of OCR extracted text
  const handleUpdateField = (fieldId: string, newValue: string) => {
    if (!currentInspection) return;

    const updatedFields = currentInspection.fields.map(f => {
      if (f.id === fieldId) {
        return {
          ...f,
          value: newValue,
          isEdited: true,
          confidence: 100 // Manually validated by officer
        };
      }
      return f;
    });

    const updatedInspection: InspectionRecord = {
      ...currentInspection,
      fields: updatedFields
    };

    setCurrentInspection(updatedInspection);
    setInspections(prev => prev.map(item => item.id === updatedInspection.id ? updatedInspection : item));
    supabaseService.saveInspection(updatedInspection);
  };

  // Handle officer verification sign-off
  const handleVerifyInspection = (notes: string) => {
    if (!currentInspection) return;

    const updatedInspection: InspectionRecord = {
      ...currentInspection,
      isVerified: true,
      officerNotes: notes,
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setCurrentInspection(updatedInspection);
    setInspections(prev => prev.map(item => item.id === updatedInspection.id ? updatedInspection : item));
    supabaseService.saveInspection(updatedInspection);
  };

  // Complaint handlers
  const handleAddComplaint = (newComplaint: ConsumerComplaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
    supabaseService.saveComplaint(newComplaint);
  };

  const handleUpdateComplaintStatus = (id: string, status: ComplaintStatus, notes?: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          actionNotes: notes || c.actionNotes
        };
      }
      return c;
    }));
    supabaseService.updateComplaintStatus(id, status, notes);
  };

  const handleLaunchInspectionForProduct = (productName: string, brand: string, category: string) => {
    // Navigate to scanner
    setActiveTab('scanner');
  };

  // Community action handlers
  const handleAddCommunityPost = (newPost: CommunityPost) => {
    setCommunityPosts(prev => [newPost, ...prev]);
    supabaseService.saveCommunityPost(newPost);
  };

  const handleToggleCommunityUpvote = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasUpvoted = !p.hasUpvoted;
        const upvotes = hasUpvoted ? p.upvotes + 1 : p.upvotes - 1;
        supabaseService.updatePostUpvotes(postId, upvotes);
        return {
          ...p,
          hasUpvoted,
          upvotes
        };
      }
      return p;
    }));
  };

  const handleAddCommunityComment = (postId: string, comment: Omit<CommunityComment, 'id' | 'timestamp'>) => {
    const newComment: CommunityComment = {
      ...comment,
      id: `comm-${Date.now()}`,
      timestamp: 'Just now'
    };

    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  const handleScanFromCommunity = (productName: string, image?: string) => {
    setSelectedScannerPreset('demo-food-compliant');
    setActiveTab('scanner');
  };

  // Reset to demo mock data
  const handleResetData = () => {
    setInspections(INITIAL_INSPECTIONS);
    setComplaints(INITIAL_COMPLAINTS);
    setCommunityPosts(INITIAL_COMMUNITY_POSTS);
    setCurrentInspection(INITIAL_INSPECTIONS[0]);
    localStorage.removeItem('labelcheck_inspections');
    localStorage.removeItem('labelcheck_complaints');
    localStorage.removeItem('labelcheck_community_posts');
  };

  const activeComplaintCount = complaints.filter(c => c.status !== 'Resolved / Compounded').length;

  const [selectedScannerPreset, setSelectedScannerPreset] = useState<string>('demo-food-compliant');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-200 w-full max-w-[100vw] overflow-x-hidden">
      {/* Navigation Topbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveInspection={!!currentInspection}
        complaintCount={activeComplaintCount}
        communityCount={communityPosts.length}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        supabaseConnected={supabaseConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6 min-w-0 overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <DashboardView
            inspections={inspections}
            onStartNewInspection={(presetId) => {
              if (presetId) setSelectedScannerPreset(presetId);
              setActiveTab('scanner');
            }}
            onViewInspection={(insp) => {
              setCurrentInspection(insp);
              setActiveTab('results');
            }}
            onViewReport={(insp) => {
              setCurrentInspection(insp);
              setActiveTab('report');
            }}
            onNavigateToComplaints={() => setActiveTab('complaints')}
            onNavigateToCommunity={() => setActiveTab('community')}
            onNavigateToFssai={() => setActiveTab('fssai')}
          />
        )}

        {activeTab === 'scanner' && (
          <ScannerView
            onScanComplete={handleScanComplete}
            currentUser={currentUser}
            initialPresetId={selectedScannerPreset}
          />
        )}

        {activeTab === 'ocr' && currentInspection && (
          <ExtractedDataView
            inspection={currentInspection}
            onUpdateField={handleUpdateField}
            onNavigateToEvidence={(fieldId) => {
              if (fieldId) setSelectedFieldId(fieldId);
              setActiveTab('evidence');
            }}
            onNavigateToResults={() => setActiveTab('results')}
          />
        )}

        {activeTab === 'evidence' && currentInspection && (
          <EvidenceViewer
            inspection={currentInspection}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onVerifyInspection={handleVerifyInspection}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'results' && currentInspection && (
          <ComplianceChecklistView
            inspection={currentInspection}
            onNavigateToEvidence={(fieldId) => {
              if (fieldId) setSelectedFieldId(fieldId);
              setActiveTab('evidence');
            }}
            onNavigateToOCR={() => setActiveTab('ocr')}
            onNavigateToReport={() => setActiveTab('report')}
            onMarkVerified={() => handleVerifyInspection(currentInspection.officerNotes || 'Verified on-site by officer')}
          />
        )}

        {activeTab === 'report' && currentInspection && (
          <ReportView
            inspection={currentInspection}
            onBack={() => setActiveTab('results')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            inspections={inspections}
            onViewInspection={(insp) => {
              setCurrentInspection(insp);
              setActiveTab('results');
            }}
            onViewReport={(insp) => {
              setCurrentInspection(insp);
              setActiveTab('report');
            }}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsView
            complaints={complaints}
            onAddComplaint={handleAddComplaint}
            onUpdateComplaintStatus={handleUpdateComplaintStatus}
            onLaunchInspectionForProduct={handleLaunchInspectionForProduct}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView
            posts={communityPosts}
            onAddPost={handleAddCommunityPost}
            onToggleUpvote={handleToggleCommunityUpvote}
            onAddComment={handleAddCommunityComment}
            onScanProduct={handleScanFromCommunity}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'fssai' && (
          <FssaiVerificationView
            onStartInspectionWithFssai={(fssaiNum, brand) => {
              setSelectedScannerPreset('demo-food-compliant');
              setActiveTab('scanner');
            }}
          />
        )}

        {activeTab === 'rules' && (
          <RuleLibraryView />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            onResetData={handleResetData}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </main>

      {/* Footer Banner */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>PackSURE AI</strong> &mdash; Legal Metrology (Packaged Commodities) Rules, 2011 Inspection System
          </p>
          <p className="text-slate-400">
            Smart India Hackathon (SIH) Prototype &bull; Officer Console: <strong>GASLIGHTER</strong> &bull; Lucknow Zone
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
