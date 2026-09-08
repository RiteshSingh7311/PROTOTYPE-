import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  Scale, 
  Info,
  Edit2,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { ComplianceRule } from '../../types';
import { DEFAULT_PCR_RULES } from '../../data/pcrRules';

export const RuleLibraryView: React.FC = () => {
  const [rules, setRules] = useState<ComplianceRule[]>(DEFAULT_PCR_RULES);
  const [isAddingRule, setIsAddingRule] = useState<boolean>(false);
  const [newRule, setNewRule] = useState<Partial<ComplianceRule>>({
    code: 'PCR-CUSTOM-1',
    title: '',
    legalSection: 'Rule 6(...)',
    description: '',
    category: 'all',
    severity: 'high',
    isActive: true,
    validationType: 'presence',
    guidelines: ''
  });

  const toggleRuleActive = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.title || !newRule.description) return;

    const created: ComplianceRule = {
      id: `rule-custom-${Date.now()}`,
      code: newRule.code || 'PCR-CUSTOM',
      title: newRule.title,
      legalSection: newRule.legalSection || 'Rule 6',
      description: newRule.description,
      category: (newRule.category as any) || 'all',
      severity: (newRule.severity as any) || 'medium',
      isActive: true,
      validationType: (newRule.validationType as any) || 'presence',
      guidelines: newRule.guidelines || ''
    };

    setRules(prev => [created, ...prev]);
    setIsAddingRule(false);
    setNewRule({
      code: 'PCR-CUSTOM-2',
      title: '',
      legalSection: 'Rule 6(...)',
      description: '',
      category: 'all',
      severity: 'high',
      isActive: true,
      validationType: 'presence',
      guidelines: ''
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Statutory Verification Rule Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Rule Library &amp; Mandatory Declarations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure validation checks, severity thresholds, and legal criteria under the Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>

        <button
          onClick={() => setIsAddingRule(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Check</span>
        </button>
      </div>

      {/* Statutory Disclaimer Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Scale className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Institutional Note:</strong> This prototype uses configurable compliance checks based on the 
          <strong> Legal Metrology (Packaged Commodities) Rules, 2011</strong>. Final legal determination, seizure memo 
          issuance, and compounding require verification by an authorized Legal Metrology Inspector.
        </p>
      </div>

      {/* Add Rule Modal */}
      {isAddingRule && (
        <div className="bg-white rounded-xl p-6 border-2 border-blue-500 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Add New Statutory Inspection Check
            </h2>
            <button
              onClick={() => setIsAddingRule(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rule Identifier Code</label>
              <input
                type="text"
                value={newRule.code}
                onChange={e => setNewRule({ ...newRule, code: e.target.value })}
                className="w-full p-2 rounded border border-slate-300 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Legal Section Reference</label>
              <input
                type="text"
                value={newRule.legalSection}
                onChange={e => setNewRule({ ...newRule, legalSection: e.target.value })}
                placeholder="e.g. Rule 6(1)(c)"
                className="w-full p-2 rounded border border-slate-300 font-mono"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Rule Title</label>
              <input
                type="text"
                value={newRule.title}
                onChange={e => setNewRule({ ...newRule, title: e.target.value })}
                placeholder="e.g. E-Commerce Display of Mandatory Declarations"
                className="w-full p-2 rounded border border-slate-300"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Rule Description &amp; Legal Mandate</label>
              <textarea
                value={newRule.description}
                onChange={e => setNewRule({ ...newRule, description: e.target.value })}
                rows={2}
                placeholder="Describe what must be checked on the commodity packaging..."
                className="w-full p-2 rounded border border-slate-300"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Validation Type</label>
              <select
                value={newRule.validationType}
                onChange={e => setNewRule({ ...newRule, validationType: e.target.value as any })}
                className="w-full p-2 rounded border border-slate-300"
              >
                <option value="presence">Text Presence</option>
                <option value="pattern">Pattern &amp; Tax Wording</option>
                <option value="numeric">Numeric Value &amp; Metric Units</option>
                <option value="contrast">Optical Contrast &amp; Legibility</option>
                <option value="manual">Manual Inspector Verification</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Enforcement Severity</label>
              <select
                value={newRule.severity}
                onChange={e => setNewRule({ ...newRule, severity: e.target.value as any })}
                className="w-full p-2 rounded border border-slate-300"
              >
                <option value="critical">Critical (Immediate Section 36 Notice)</option>
                <option value="high">High (Compounding Warning)</option>
                <option value="medium">Medium (Advisory Correction)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold"
              >
                Save Statutory Rule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white rounded-xl p-5 border transition-all shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              rule.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                  {rule.code}
                </span>
                <span className="font-mono text-[11px] font-semibold text-blue-600">
                  {rule.legalSection}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  rule.severity === 'critical'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : rule.severity === 'high'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {rule.severity} Severity
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded capitalize">
                  Type: {rule.validationType}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 font-display">
                {rule.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rule.description}
              </p>
              {rule.guidelines && (
                <p className="text-[11px] text-slate-500 italic">
                  Guideline: {rule.guidelines}
                </p>
              )}
            </div>

            {/* Active Toggle Switch */}
            <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-xs font-medium text-slate-500">
                {rule.isActive ? 'Active Check' : 'Inactive'}
              </span>
              <button
                onClick={() => toggleRuleActive(rule.id)}
                className={`p-1 rounded-full transition-colors ${
                  rule.isActive ? 'text-blue-600 hover:text-blue-700' : 'text-slate-400 hover:text-slate-500'
                }`}
                title={rule.isActive ? 'Disable rule' : 'Enable rule'}
              >
                {rule.isActive ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
