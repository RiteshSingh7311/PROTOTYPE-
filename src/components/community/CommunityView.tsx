import React, { useState, useRef } from 'react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Share2, 
  ScanLine, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Upload, 
  Send, 
  X, 
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Scale,
  Download
} from 'lucide-react';
import { CommunityPost, CommunityComment, CommunityCategory } from '../../types';
import { DEMO_LABELS } from '../../data/mockData';

interface CommunityViewProps {
  posts: CommunityPost[];
  onAddPost: (post: CommunityPost) => void;
  onToggleUpvote: (postId: string) => void;
  onAddComment: (postId: string, comment: Omit<CommunityComment, 'id' | 'timestamp'>) => void;
  onScanProduct?: (productName: string, image?: string) => void;
  currentUser: {
    name: string;
    role: string;
    zone: string;
  };
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  onAddPost,
  onToggleUpvote,
  onAddComment,
  onScanProduct,
  currentUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [expandedPostIds, setExpandedPostIds] = useState<Set<string>>(new Set(['post-lucknow-101', 'post-lucknow-104']));
  
  // New discussion modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthorName, setNewAuthorName] = useState(currentUser.name);
  const [newAuthorRole, setNewAuthorRole] = useState<'Citizen' | 'Legal Metrology Officer' | 'Retailer / Trader' | 'Consumer Activist'>('Citizen');
  const [newLocation, setNewLocation] = useState('Hazratganj, Lucknow');
  const [newCategory, setNewCategory] = useState<CommunityCategory>('Deceptive Packaging & Slack Fill');
  const [newContent, setNewContent] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newEvidenceImage, setNewEvidenceImage] = useState<string | undefined>(undefined);

  // Reply inputs keyed by postId
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAuthorRoles, setCommentAuthorRoles] = useState<Record<string, 'Citizen' | 'Legal Metrology Officer' | 'Retailer / Trader'>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle thread expansion
  const toggleExpand = (postId: string) => {
    setExpandedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  // Handle comment submit
  const handleCommentSubmit = (postId: string) => {
    const message = commentInputs[postId]?.trim();
    if (!message) return;

    const role = commentAuthorRoles[postId] || (currentUser.name === 'GASLIGHTER' ? 'Legal Metrology Officer' : 'Citizen');
    const isOfficial = role === 'Legal Metrology Officer';

    onAddComment(postId, {
      authorName: isOfficial ? currentUser.name : (newAuthorName || 'Concerned Citizen'),
      authorRole: role,
      isOfficial,
      message,
      likes: 0
    });

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Handle new post submit
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const post: CommunityPost = {
      id: `post-lucknow-${Date.now()}`,
      title: newTitle.trim(),
      authorName: newAuthorName.trim() || 'Anonymous Citizen',
      authorRole: newAuthorRole,
      isVerifiedCitizen: newAuthorRole === 'Citizen',
      isOfficialPost: newAuthorRole === 'Legal Metrology Officer',
      location: newLocation,
      category: newCategory,
      timestamp: 'Just now',
      content: newContent.trim(),
      productName: newProductName.trim() || undefined,
      brand: newBrand.trim() || undefined,
      evidenceImage: newEvidenceImage,
      upvotes: 1,
      hasUpvoted: true,
      statusBadge: newAuthorRole === 'Legal Metrology Officer' ? 'Official Advisory' : 'Under Officer Review',
      comments: []
    };

    onAddPost(post);
    setIsModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewContent('');
    setNewProductName('');
    setNewBrand('');
    setNewEvidenceImage(undefined);
  };

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setNewEvidenceImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.productName && post.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || post.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories: { label: string; value: string }[] = [
    { label: 'All Discussions', value: 'all' },
    { label: 'Deceptive Packaging & Slack Fill', value: 'Deceptive Packaging & Slack Fill' },
    { label: 'MRP Overcharging & Dual Pricing', value: 'MRP Overcharging & Dual Pricing' },
    { label: 'Missing Mandatory Labels', value: 'Missing Mandatory Labels' },
    { label: 'Shrinkflation Alert', value: 'Shrinkflation Alert' },
    { label: 'Officer Advisory', value: 'Officer Advisory' },
    { label: 'General Consumer Discussion', value: 'General Consumer Discussion' }
  ];

  const handleExportCommunityCSV = () => {
    const headers = ['Post ID', 'Date', 'Title', 'Category', 'Author', 'Role', 'Location', 'Product', 'Brand', 'Upvotes', 'Comments Count'];
    const rows = filteredPosts.map(p => [
      p.id,
      `"${p.timestamp}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.authorName}"`,
      `"${p.authorRole}"`,
      `"${p.location}"`,
      `"${(p.productName || '').replace(/"/g, '""')}"`,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      p.upvotes,
      p.comments.length
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LM_Community_Citizen_Reports_Lucknow_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16 w-full max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
              <Users className="w-3 h-3 text-blue-600" />
              <span>Public Citizen Vigilance Forum</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Lucknow Metropolitan Circle, UP</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PCR 2011 Transparency Hub</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Consumer Vigilance Community &amp; Discussion Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            A professional public forum where consumers, traders, and legal metrology officers exchange opinions, report deceptive packaging, flag dual MRP practices, and review verified enforcement advisories.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span><strong>{posts.length}</strong> Active Discussions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span><strong>19</strong> Officer Verified Advisories</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span><strong>1.4k+</strong> Citizen Upvotes</span>
            </div>
          </div>
        </div>

        {/* Start Discussion & Export Buttons */}
        <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <button
            onClick={handleExportCommunityCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all"
            title="Export Citizen Reports as CSV"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opinion / Report Issue</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community opinions, products, deceptive packaging, or locality (e.g. Hazratganj)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Locality Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Circle:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Lucknow Circles</option>
              <option value="Hazratganj">Hazratganj</option>
              <option value="Gomti Nagar">Gomti Nagar</option>
              <option value="Aminabad">Aminabad</option>
              <option value="Alambagh">Alambagh</option>
              <option value="Chowk">Chowk</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Community Feed Stream */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No community discussions found</p>
            <p className="text-xs text-slate-400">Try adjusting your search terms or select another category.</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = expandedPostIds.has(post.id);

            return (
              <div 
                key={post.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        post.isOfficialPost
                          ? 'bg-blue-600 text-white shadow-xs'
                          : post.authorRole === 'Retailer / Trader'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {post.isOfficialPost ? <ShieldCheck className="w-5 h-5" /> : post.authorName.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {post.authorName}
                          </span>

                          {post.isOfficialPost && (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-blue-700" />
                              <span>Enforcement Officer</span>
                            </span>
                          )}

                          {post.isVerifiedCitizen && (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Citizen</span>
                            </span>
                          )}

                          {post.authorRole === 'Retailer / Trader' && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                              Merchant
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{post.location}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{post.timestamp}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start sm:self-auto">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        post.statusBadge === 'Official Advisory'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : post.statusBadge === 'Inspection Scheduled'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : post.statusBadge === 'Resolved / Compounded'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {post.statusBadge || 'Public Discussion'}
                      </span>
                    </div>
                  </div>

                  {/* Category Tag */}
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Title & Content */}
                  <div className="space-y-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Attached Product Packaging Evidence / Pic */}
                  {post.evidenceImage && (
                    <div className="pt-2">
                      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 max-w-sm">
                        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 pb-1.5 mb-1.5 border-b border-slate-800">
                          <span className="flex items-center gap-1 font-bold">
                            <ImageIcon className="w-3 h-3" />
                            <span>CITIZEN EVIDENCE PHOTO</span>
                          </span>
                          <span className="text-slate-400">PCR 2011 SAMPLE</span>
                        </div>

                        <div className="relative h-44 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                          <img
                            src={post.evidenceImage}
                            alt="Packaging evidence"
                            className="max-h-full max-w-full object-contain"
                          />
                          <div className="absolute inset-1 pointer-events-none">
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
                          </div>
                        </div>

                        {onScanProduct && (
                          <button
                            type="button"
                            onClick={() => onScanProduct(post.productName || 'Community Reported Product', post.evidenceImage)}
                            className="mt-2 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ScanLine className="w-3.5 h-3.5" />
                            <span>Scan in LabelCheck AI</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interaction Bar */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Upvote Button */}
                      <button
                        type="button"
                        onClick={() => onToggleUpvote(post.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                          post.hasUpvoted
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-white' : ''}`} />
                        <span>{post.upvotes} {post.hasUpvoted ? 'Agreed' : 'Agree / Me Too'}</span>
                      </button>

                      {/* Discussion Comments Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(post.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>{post.comments.length} Messages</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>Public Record ID:</span>
                      <span className="font-mono text-slate-600 font-bold">{post.id}</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Messages / Discussion Section */}
                {isExpanded && (
                  <div className="bg-slate-50/80 p-5 sm:p-6 border-t border-slate-100 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Community Discussion &amp; Officer Responses ({post.comments.length})</span>
                    </h3>

                    {/* Messages List */}
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div 
                          key={comment.id}
                          className={`p-3.5 rounded-xl text-xs space-y-1.5 border transition-all ${
                            comment.isOfficial
                              ? 'bg-blue-50/90 border-blue-200 text-blue-950 shadow-xs'
                              : 'bg-white border-slate-200/90 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{comment.authorName}</span>
                              {comment.isOfficial ? (
                                <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <ShieldCheck className="w-2.5 h-2.5" />
                                  <span>Official</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">({comment.authorRole})</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                          </div>
                          <p className="leading-relaxed text-slate-700">
                            {comment.message}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add Reply Form */}
                    <div className="pt-2">
                      <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">Add your opinion / reply:</span>
                          <select
                            value={commentAuthorRoles[post.id] || (currentUser.name === 'GASLIGHTER' ? 'Legal Metrology Officer' : 'Citizen')}
                            onChange={(e) => setCommentAuthorRoles(prev => ({ ...prev, [post.id]: e.target.value as any }))}
                            className="text-[11px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700"
                          >
                            <option value="Citizen">As Citizen</option>
                            <option value="Legal Metrology Officer">As Officer (Inspector GASLIGHTER)</option>
                            <option value="Retailer / Trader">As Merchant / Trader</option>
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Type constructive message, market feedback, or official clarification..."
                            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleCommentSubmit(post.id)}
                            className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center transition-colors shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Post Opinion / Report Problem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Start Community Discussion / Report Problem
                  </h3>
                  <p className="text-xs text-slate-500">
                    Post publicly to the Lucknow Legal Metrology Citizen Board
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Discussion Title / Issue Summary *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Potato chips packet 40% empty slack fill in Gomti Nagar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Author Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Posting As</label>
                  <select
                    value={newAuthorRole}
                    onChange={(e) => setNewAuthorRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  >
                    <option value="Citizen">Citizen / Consumer</option>
                    <option value="Legal Metrology Officer">Legal Metrology Officer</option>
                    <option value="Retailer / Trader">Retailer / Merchant</option>
                    <option value="Consumer Activist">Consumer Activist</option>
                  </select>
                </div>
              </div>

              {/* Category & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Topic Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  >
                    <option value="Deceptive Packaging & Slack Fill">Deceptive Packaging &amp; Slack Fill</option>
                    <option value="MRP Overcharging & Dual Pricing">MRP Overcharging &amp; Dual Pricing</option>
                    <option value="Missing Mandatory Labels">Missing Mandatory Labels (Rule 6)</option>
                    <option value="Shrinkflation Alert">Shrinkflation Alert</option>
                    <option value="Officer Advisory">Officer Advisory</option>
                    <option value="General Consumer Discussion">General Consumer Discussion</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Locality / Circle in Lucknow *</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Hazratganj, Lucknow"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Optional Product Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Product Commodity Name</label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g. Almond Kernels 500g"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. NutriSnack Foods"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Detailed Content */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Opinion Details / Problem Description *</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Explain your experience, observations regarding the packaging, MRP, weight discrepancy, or consumer rights question..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Attach Product Packaging Photo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Packaging Pic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewEvidenceImage(DEMO_LABELS.compliantFood)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-blue-700 font-semibold"
                  >
                    Use Sample Product Pic
                  </button>
                  {newEvidenceImage && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Photo Attached</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Community</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
