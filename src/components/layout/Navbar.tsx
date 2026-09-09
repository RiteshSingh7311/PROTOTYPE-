import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ScanLine, 
  History, 
  BookOpen, 
  Settings, 
  AlertCircle,
  FileText,
  UserCheck,
  Sparkles,
  Users,
  Sun,
  Moon,
  Menu,
  X,
  Award
} from 'lucide-react';
import { SihLogo } from '../common/SihLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveInspection: boolean;
  complaintCount?: number;
  communityCount?: number;
  currentUser: {
    name: string;
    role: string;
    zone: string;
  };
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveInspection,
  complaintCount = 0,
  communityCount = 0,
  currentUser,
  theme = 'light',
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print w-full max-w-full overflow-hidden">
      {/* Sleek Top Announcement Micro-Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-3 sm:px-6 py-1 flex flex-wrap items-center justify-between gap-y-1 border-b border-slate-800 w-full overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-semibold text-slate-200 truncate">Legal Metrology Portal</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 hidden md:inline truncate">Packaged Commodities Rules, 2011</span>
          <span className="bg-orange-500/15 text-orange-300 text-[9px] px-1.5 py-0.2 rounded border border-orange-500/30 font-bold uppercase tracking-wider shrink-0">
            SIH 2026
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-slate-400 shrink-0 ml-auto text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 hidden lg:inline">Zone:</span>
            <span className="font-medium text-slate-200 truncate max-w-[130px] sm:max-w-none">{currentUser.zone}</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1 text-slate-200 font-semibold">
            <UserCheck className="w-3 h-3 text-blue-400 shrink-0" />
            <span>{currentUser.name}</span>
          </div>
          {onToggleTheme && (
            <>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <button
                onClick={onToggleTheme}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-medium transition-all shrink-0"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-blue-400" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Clean Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 w-full">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 w-full min-w-0">
          {/* Left Brand Identity: SIH Logo + Theme Switcher Button + LabelCheck AI */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* SIH Official Emblem */}
            <div 
              className="cursor-pointer transition-opacity hover:opacity-90 shrink-0"
              onClick={() => handleTabClick('dashboard')}
              title="Smart India Hackathon 2026"
            >
              <SihLogo />
            </div>

            {/* Light / Dark Mode Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all border border-slate-200 shrink-0 group cursor-pointer"
                aria-label="Toggle theme mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {/* Subtle Divider */}
            <div className="h-6 w-[1px] bg-slate-200 shrink-0 hidden sm:block"></div>

            {/* PackSURE AI Brand */}
            <div 
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0"
              onClick={() => handleTabClick('dashboard')}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 font-display">
                    Pack<span className="text-blue-600">SURE</span>
                  </span>
                  <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-1 py-0.2 rounded border border-blue-200">
                    AI
                  </span>
                </div>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium tracking-wide uppercase leading-none">
                  Scan &bull; Verify &bull; Enforce
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Visible on XL screens 1280px+ with 0 horizontal overflow) */}
          <nav className="hidden xl:flex items-center gap-1 min-w-0">
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleTabClick('scanner')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'scanner'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Scanner</span>
            </button>

            <button
              onClick={() => handleTabClick('fssai')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'fssai'
                  ? 'bg-orange-50 text-orange-700 shadow-xs ring-1 ring-orange-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-orange-600" />
              <span>FSSAI Verifier</span>
            </button>

            {hasActiveInspection && (
              <button
                onClick={() => handleTabClick('results')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeTab === 'results' || activeTab === 'evidence' || activeTab === 'ocr'
                    ? 'bg-amber-50 text-amber-800 shadow-xs ring-1 ring-amber-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Active Audit</span>
              </button>
            )}

            {hasActiveInspection && (
              <button
                onClick={() => handleTabClick('report')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeTab === 'report'
                    ? 'bg-blue-50 text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Report</span>
              </button>
            )}

            <button
              onClick={() => handleTabClick('history')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'history'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>

            <button
              onClick={() => handleTabClick('complaints')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'complaints'
                  ? 'bg-rose-50 text-rose-700 shadow-xs ring-1 ring-rose-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Complaints</span>
              {complaintCount > 0 && (
                <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {complaintCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('community')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'community'
                  ? 'bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Community</span>
              {communityCount > 0 && (
                <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {communityCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('rules')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'rules'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Rules</span>
            </button>

            <button
              onClick={() => handleTabClick('settings')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Scan CTA Button */}
            <button
              onClick={() => handleTabClick('scanner')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan Product</span>
              <span className="sm:hidden">Scan</span>
            </button>

            {/* Mobile / Tablet Menu Toggle (< 1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer (Active when hamburger toggled, 0 horizontal overflow) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200/90 bg-white/98 backdrop-blur-md px-4 py-3 space-y-1.5 shadow-lg max-h-[80vh] overflow-y-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-semibold">
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleTabClick('scanner')}
              className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                activeTab === 'scanner' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              <span>New Inspection</span>
            </button>

            <button
              onClick={() => handleTabClick('fssai')}
              className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                activeTab === 'fssai' ? 'bg-orange-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>FSSAI License Verifier</span>
            </button>

            {hasActiveInspection && (
              <button
                onClick={() => handleTabClick('results')}
                className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                  activeTab === 'results' || activeTab === 'evidence' || activeTab === 'ocr'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Active Audit</span>
              </button>
            )}

            {hasActiveInspection && (
              <button
                onClick={() => handleTabClick('report')}
                className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                  activeTab === 'report' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Inspection Report</span>
              </button>
            )}

            <button
              onClick={() => handleTabClick('history')}
              className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit Archive</span>
            </button>

            <button
              onClick={() => handleTabClick('complaints')}
              className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${
                activeTab === 'complaints' ? 'bg-rose-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Complaints</span>
              </div>
              {complaintCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {complaintCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('community')}
              className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${
                activeTab === 'community' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </div>
              {communityCount > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {communityCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('rules')}
              className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                activeTab === 'rules' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Rule Library</span>
            </button>

            <button
              onClick={() => handleTabClick('settings')}
              className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
