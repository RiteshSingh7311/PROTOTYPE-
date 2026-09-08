import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Phone, 
  User, 
  MapPin, 
  ScanLine, 
  ChevronRight, 
  X, 
  ShieldAlert, 
  FileText,
  BadgeAlert,
  HelpCircle,
  Check,
  Download,
  Printer
} from 'lucide-react';
import { ConsumerComplaint, ComplaintStatus, ComplaintPriority } from '../../types';
import { PRODUCT_CATEGORIES } from '../../data/mockData';
import { NoticeModal } from '../common/NoticeModal';

interface ComplaintsViewProps {
  complaints: ConsumerComplaint[];
  onAddComplaint: (newComplaint: ConsumerComplaint) => void;
  onUpdateComplaintStatus: (id: string, status: ComplaintStatus, notes?: string) => void;
  onLaunchInspectionForProduct: (productName: string, brand: string, category: string) => void;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  onAddComplaint,
  onUpdateComplaintStatus,
  onLaunchInspectionForProduct
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ConsumerComplaint | null>(null);
  const [selectedComplaintForNotice, setSelectedComplaintForNotice] = useState<ConsumerComplaint | null>(null);

  // Form State for new complaint
  const [formData, setFormData] = useState({
    complainantName: '',
    complainantContact: '',
    productName: '',
    brand: '',
    category: 'Food & Snacks',
    storeOrPlatform: '',
    location: 'Lucknow, Uttar Pradesh',
    violationType: 'Overcharging Above Printed MRP',
    description: '',
    priority: 'High' as ComplaintPriority
  });

  // Filtered complaints
  const filtered = complaints.filter(c => {
    const matchesSearch = 
      c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.storeOrPlatform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complainantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' ? true : c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = complaints.filter(c => c.status === 'Pending Investigation').length;
  const noticeCount = complaints.filter(c => c.status === 'Notice Issued').length;
  const underInspectionCount = complaints.filter(c => c.status === 'Under Inspection').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved / Compounded').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.complainantName) return;

    const newTicket: ConsumerComplaint = {
      id: `GRV-LKO-2026-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      complainantName: formData.complainantName,
      complainantContact: formData.complainantContact || '+91 9XXXX XXXXX',
      productName: formData.productName,
      brand: formData.brand || 'Unspecified Brand',
      category: formData.category,
      storeOrPlatform: formData.storeOrPlatform || 'Local Retailer, Lucknow',
      location: formData.location,
      violationType: formData.violationType,
      description: formData.description,
      status: 'Pending Investigation',
      priority: formData.priority,
      assignedOfficer: 'GASLIGHTER'
    };

    onAddComplaint(newTicket);
    setIsModalOpen(false);
    setFormData({
      complainantName: '',
      complainantContact: '',
      productName: '',
      brand: '',
      category: 'Food & Snacks',
      storeOrPlatform: '',
      location: 'Lucknow, Uttar Pradesh',
      violationType: 'Overcharging Above Printed MRP',
      description: '',
      priority: 'High'
    });
  };

  const handleExportCSV = () => {
    const headers = ['Complaint ID', 'Date', 'Complainant', 'Contact', 'Product', 'Brand', 'Category', 'Store / Platform', 'Location', 'Violation Type', 'Priority', 'Status', 'Assigned Officer', 'Enforcement Notes'];
    const rows = filtered.map(c => [
      c.id,
      `"${c.timestamp}"`,
      `"${c.complainantName}"`,
      `"${c.complainantContact}"`,
      `"${c.productName}"`,
      `"${c.brand}"`,
      `"${c.category}"`,
      `"${c.storeOrPlatform.replace(/"/g, '""')}"`,
      `"${c.location.replace(/"/g, '""')}"`,
      `"${c.violationType.replace(/"/g, '""')}"`,
      c.priority,
      c.status,
      c.assignedOfficer,
      `"${(c.actionNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LM_Complaints_Register_Lucknow_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 w-full max-w-full overflow-hidden">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
            <BadgeAlert className="w-4 h-4 text-rose-600" />
            <span>Public Grievance Cell &bull; Legal Metrology Act, 2009</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Consumer Complaints &amp; Market Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Citizen complaints filed under Rule 6(1)(f) and Section 36 regarding overcharging, missing declarations, and short quantities across Lucknow Zone.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition-all"
            title="Download Grievance Register as CSV spreadsheet"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Lodge Grievance</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Action</p>
            <p className="text-2xl font-extrabold text-amber-500 font-display mt-0.5">{pendingCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sec 36 Notices</p>
            <p className="text-2xl font-extrabold text-rose-600 font-display mt-0.5">{noticeCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Under Field Inspection</p>
            <p className="text-2xl font-extrabold text-blue-600 font-display mt-0.5">{underInspectionCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ScanLine className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Resolved / Compounded</p>
            <p className="text-2xl font-extrabold text-emerald-600 font-display mt-0.5">{resolvedCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, brand, store, complainant or ID (e.g. GRV-LKO)..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-700"
            >
              <option value="all">All Grievance Statuses</option>
              <option value="Pending Investigation">Pending Investigation</option>
              <option value="Notice Issued">Notice Issued</option>
              <option value="Under Inspection">Under Inspection</option>
              <option value="Resolved / Compounded">Resolved / Compounded</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-700"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-white rounded-xl p-5 border transition-all shadow-xs hover:border-slate-300 space-y-4 ${
                ticket.status === 'Notice Issued'
                  ? 'border-l-4 border-l-rose-600'
                  : ticket.status === 'Pending Investigation'
                  ? 'border-l-4 border-l-amber-500'
                  : ticket.status === 'Under Inspection'
                  ? 'border-l-4 border-l-blue-600'
                  : 'border-l-4 border-l-emerald-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {ticket.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ticket.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : ticket.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ticket.priority} Priority
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-500">{ticket.timestamp}</span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 font-display">
                    {ticket.productName}
                  </h2>
                  <p className="text-xs text-slate-600">
                    Brand: <strong className="text-slate-800">{ticket.brand}</strong> &bull; Category: <span className="text-slate-700">{ticket.category}</span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    ticket.status === 'Resolved / Compounded'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : ticket.status === 'Notice Issued'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : ticket.status === 'Under Inspection'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {ticket.status === 'Resolved / Compounded' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {ticket.status === 'Notice Issued' && <ShieldAlert className="w-3.5 h-3.5" />}
                    {ticket.status === 'Under Inspection' && <ScanLine className="w-3.5 h-3.5" />}
                    {ticket.status === 'Pending Investigation' && <Clock className="w-3.5 h-3.5" />}
                    <span>{ticket.status}</span>
                  </span>
                </div>
              </div>

              {/* Retailer & Complainant Info Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-semibold">Reported Retailer / Location</span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{ticket.storeOrPlatform}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{ticket.location}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-semibold">Citizen / Complainant Details</span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{ticket.complainantName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{ticket.complainantContact}</span>
                  </div>
                </div>
              </div>

              {/* Grievance Statement */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                  Alleged Violation: {ticket.violationType}
                </span>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                  "{ticket.description}"
                </p>
              </div>

              {/* Officer Action Trail */}
              {ticket.actionNotes && (
                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/60 text-xs flex items-start gap-2 text-blue-950">
                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-900">Enforcement Action Log ({ticket.assignedOfficer}): </span>
                    <span>{ticket.actionNotes}</span>
                  </div>
                </div>
              )}

              {/* Card Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Update Status:</span>
                  <select
                    value={ticket.status}
                    onChange={(e) => onUpdateComplaintStatus(ticket.id, e.target.value as ComplaintStatus)}
                    className="p-1 rounded border border-slate-300 bg-slate-50 font-medium text-slate-700"
                  >
                    <option value="Pending Investigation">Pending Investigation</option>
                    <option value="Notice Issued">Notice Issued</option>
                    <option value="Under Inspection">Under Inspection</option>
                    <option value="Resolved / Compounded">Resolved / Compounded</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedComplaintForNotice(ticket)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                    title="Generate, Preview & Download Section 36 Statutory Notice"
                  >
                    <Printer className="w-3.5 h-3.5 text-rose-600" />
                    <span>Download Sec 36 Notice</span>
                  </button>

                  <button
                    onClick={() => onLaunchInspectionForProduct(ticket.productName, ticket.brand, ticket.category)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Launch Audit on Product</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400 border border-slate-200">
            <p>No consumer complaints match your search query or filters.</p>
          </div>
        )}
      </div>

      {/* Lodge New Grievance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    Lodge Consumer Complaint
                  </h2>
                  <p className="text-[11px] text-slate-500">Legal Metrology Directorate &bull; Lucknow Zone</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Complainant Full Name</label>
                  <input
                    type="text"
                    value={formData.complainantName}
                    onChange={e => setFormData({ ...formData, complainantName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.complainantContact}
                    onChange={e => setFormData({ ...formData, complainantContact: e.target.value })}
                    placeholder="+91 98765 XXXXX"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product / Commodity Name</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={e => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. Sparkle Glow Shampoo"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturer / Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Sparkle Cosmetics"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commodity Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    {PRODUCT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity / Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as ComplaintPriority })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="High">High (Immediate Market Raid)</option>
                    <option value="Medium">Medium (Field Audit Notice)</option>
                    <option value="Low">Low (Informational)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Retailer Store / E-Commerce Platform &amp; Location</label>
                <input
                  type="text"
                  value={formData.storeOrPlatform}
                  onChange={e => setFormData({ ...formData, storeOrPlatform: e.target.value })}
                  placeholder="e.g. BigMart Saket / Hazratganj Bazaar, Lucknow"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alleged Statutory Violation</label>
                <select
                  value={formData.violationType}
                  onChange={e => setFormData({ ...formData, violationType: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  <option value="Overcharging Above Printed MRP">Overcharging Above Printed MRP (Rule 6(1)(c))</option>
                  <option value="Sticker Pasting / Dual Pricing on MRP">Sticker Pasting / Dual Pricing on MRP</option>
                  <option value="Short Net Quantity / Weight Discrepancy">Short Net Quantity / Weight Discrepancy (Rule 11)</option>
                  <option value="Missing Consumer Care Contact Details">Missing Consumer Care Details (Rule 6(1)(f))</option>
                  <option value="Illegible Font Size for Net Content">Illegible Font Size for Net Content (Rule 7)</option>
                  <option value="Missing Country of Origin">Missing Country of Origin (Rule 6(1)(aa))</option>
                  <option value="Missing Unit Sale Price">Missing Unit Sale Price (USP) (Rule 6(11))</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Complaint Description &amp; Citizen Observations</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the transaction, discrepancy, store response, or packaging defect observed..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Submit Grievance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statutory Section 36 Notice Modal */}
      {selectedComplaintForNotice && (
        <NoticeModal
          complaint={selectedComplaintForNotice}
          onClose={() => setSelectedComplaintForNotice(null)}
          onNoticeIssued={(notes) => {
            onUpdateComplaintStatus(selectedComplaintForNotice.id, 'Notice Issued', notes);
          }}
        />
      )}
    </div>
  );
};
