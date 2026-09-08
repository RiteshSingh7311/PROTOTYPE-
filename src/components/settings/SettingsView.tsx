import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  Check, 
  RotateCcw, 
  Shield, 
  Info,
  Scale,
  Sun,
  Moon
} from 'lucide-react';

interface SettingsViewProps {
  currentUser: {
    name: string;
    role: string;
    zone: string;
  };
  onUpdateUser: (user: { name: string; role: string; zone: string }) => void;
  onResetData: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onUpdateUser,
  onResetData,
  theme = 'light',
  onToggleTheme
}) => {
  const [name, setName] = useState<string>(currentUser.name);
  const [role, setRole] = useState<string>(currentUser.role);
  const [zone, setZone] = useState<string>(currentUser.zone);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(85);
  const [autoFlagViolations, setAutoFlagViolations] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, role, zone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System &amp; Enforcement Configuration</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">
          Officer Profile &amp; Application Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure inspector authorization parameters, threshold sensitivities, theme preferences, and role assignments for statutory reports.
        </p>
      </div>

      {/* Theme Preference Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <h2 className="text-sm font-bold text-slate-900 font-display">
              Portal Theme &amp; Visual Appearance
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
            Current: {theme} Mode
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Switch between crisp statutory Light Mode and high-contrast Dark Mode for night inspections and low-light field auditing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <button
            type="button"
            onClick={() => {
              if (theme !== 'light' && onToggleTheme) onToggleTheme();
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Light Theme</span>
                {theme === 'light' && (
                  <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-full">Active</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Official Government of UP daylight theme with maximum document contrast and crisp print styling.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (theme !== 'dark' && onToggleTheme) onToggleTheme();
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
              theme === 'dark'
                ? 'border-blue-500 bg-slate-900/60 shadow-xs ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Dark Theme</span>
                {theme === 'dark' && (
                  <span className="text-[10px] font-bold bg-blue-500 text-white px-1.5 py-0.2 rounded-full">Active</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sleek dark theme optimized for reduced eye strain during warehouse and night market inspections.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Officer Profile & Role Block */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600" />
            <span>Inspector Authentication &amp; Jurisdiction Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Officer Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Statutory Role / Designation
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Inspector of Legal Metrology (ILM)">Inspector of Legal Metrology (ILM)</option>
                <option value="Assistant Controller, Legal Metrology">Assistant Controller, Legal Metrology</option>
                <option value="Senior Enforcement Reviewer">Senior Enforcement Reviewer</option>
                <option value="Zonal Legal Metrology Administrator">Zonal Legal Metrology Administrator</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Designated Circle / Jurisdictional Zone
              </label>
              <input
                type="text"
                value={zone}
                onChange={e => setZone(e.target.value)}
                placeholder="e.g. North Zone, Delhi Circle II"
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* AI & OCR Engine Sensitivities */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>OCR Extraction &amp; Violation Thresholds</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700">Minimum Optical Confidence Threshold</span>
                <span className="font-mono font-bold text-blue-600">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="99"
                value={confidenceThreshold}
                onChange={e => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Declarations recognized with confidence below {confidenceThreshold}% are automatically routed to "Needs Manual Verification".
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoFlagViolations}
                  onChange={e => setAutoFlagViolations(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-slate-800">Auto-flag missing "incl. of all taxes" on MRP</p>
                  <p className="text-[11px] text-slate-400">Strict adherence mode under Rule 6(1)(c)</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-slate-800">Dispatch weekly summary digest to State Directorate</p>
                  <p className="text-[11px] text-slate-400">Automated notification to zonal controller</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetData}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Records</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
