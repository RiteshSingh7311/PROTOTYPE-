import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Eye, 
  FileText, 
  ArrowUpDown,
  History,
  Building2,
  Trash2,
  Award,
  Printer
} from 'lucide-react';
import { InspectionRecord } from '../../types';
import { PRODUCT_CATEGORIES } from '../../data/mockData';
import { CertificateModal } from '../common/CertificateModal';

interface HistoryViewProps {
  inspections: InspectionRecord[];
  onViewInspection: (inspection: InspectionRecord) => void;
  onViewReport: (inspection: InspectionRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  inspections,
  onViewInspection,
  onViewReport
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedInspForCertificate, setSelectedInspForCertificate] = useState<InspectionRecord | null>(null);

  // Filter & Search Logic
  const filtered = inspections.filter(item => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inspectorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : item.overallStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' ? true : item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'newest') return b.timestamp.localeCompare(a.timestamp);
    return a.timestamp.localeCompare(b.timestamp);
  });

  const handleExportCSV = () => {
    const headers = ['Inspection ID', 'Timestamp', 'Product Name', 'Brand', 'Category', 'Compliance Score', 'Status', 'Inspector', 'Zone'];
    const rows = filtered.map(i => [
      `"${i.id}"`,
      `"${i.timestamp}"`,
      `"${i.productName}"`,
      `"${i.brand}"`,
      `"${i.category}"`,
      `${i.complianceScore}%`,
      `"${i.overallStatus}"`,
      `"${i.inspectorName}"`,
      `"${i.inspectorZone}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', encodeURI(csvContent));
    downloadLink.setAttribute('download', `Legal_Metrology_Inspections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Statutory Audit Repository</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Inspection History &amp; Enforcement Archive
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and review completed Legal Metrology commodity audits across designated market circles.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export All to CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product, brand, inspector or ID (e.g. INSP-2026)..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Compliant">Compliant Only</option>
              <option value="Needs Manual Verification">Needs Manual Verification</option>
              <option value="Potential Violation">Potential Violations</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="all">All Categories</option>
              {PRODUCT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:col-span-1">
            <button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="w-full h-full text-xs px-2 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Inspection ID / Date</th>
                <th className="px-5 py-3.5">Product &amp; Category</th>
                <th className="px-5 py-3.5">Inspector / Zone</th>
                <th className="px-5 py-3.5 text-center">Score</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900">{insp.id}</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{insp.timestamp}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate">{insp.productName}</p>
                      <p className="text-[11px] text-slate-500">Brand: {insp.brand}</p>
                      <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        {insp.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-medium text-slate-800">{insp.inspectorName}</p>
                      <p className="text-[11px] text-slate-400">{insp.inspectorZone}</p>
                    </td>

                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                        insp.complianceScore >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : insp.complianceScore >= 70
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {insp.complianceScore}%
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        insp.overallStatus === 'Compliant'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : insp.overallStatus === 'Needs Manual Verification'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {insp.overallStatus === 'Compliant' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {insp.overallStatus === 'Needs Manual Verification' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {insp.overallStatus === 'Potential Violation' && <XCircle className="w-3.5 h-3.5" />}
                        <span>{insp.overallStatus}</span>
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                      {insp.overallStatus === 'Compliant' && (
                        <button
                          onClick={() => setSelectedInspForCertificate(insp)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors shadow-2xs"
                          title="Generate & Download Statutory Compliance Certificate (PDF/Print)"
                        >
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Certificate</span>
                        </button>
                      )}
                      <button
                        onClick={() => onViewInspection(insp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Verify</span>
                      </button>
                      <button
                        onClick={() => onViewReport(insp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No inspection records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Compliance Certificate Modal */}
      {selectedInspForCertificate && (
        <CertificateModal
          inspection={selectedInspForCertificate}
          onClose={() => setSelectedInspForCertificate(null)}
        />
      )}
    </div>
  );
};
