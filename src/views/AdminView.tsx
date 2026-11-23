import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  ImageIcon,
  BookOpen,
  MapPin,
  Calendar,
  Database,
  Search,
  ExternalLink,
  Plus,
  CheckCircle2,
  X,
  Filter,
  Download,
  Upload,
  Copy,
  ChevronDown,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { TeamMember, Photo, PhotoStory, Photowalk, Exhibition, PhotoCategory, HeroPhoto } from '../types';
import { CloudinaryUploadWidget } from '../components/CloudinaryUploadWidget';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminViewProps {
  onNavigate?: (path: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const {
    heroPhotos,
    addHeroPhoto,
    updateHeroPhoto,
    deleteHeroPhoto,
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    photos,
    addPhoto,
    updatePhoto,
    deletePhoto,
    stories,
    addStory,
    updateStory,
    deleteStory,
    photowalks,
    addPhotowalk,
    updatePhotowalk,
    deletePhotowalk,
    exhibitions,
    addExhibition,
    updateExhibition,
    deleteExhibition,
    exportArchiveJSON,
    importArchiveJSON
  } = useData();

  // ----------------------------------------------------------------------
  // AUTHENTICATION STATE (SUPABASE AUTH)
  // ----------------------------------------------------------------------
  const [session, setSession] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthChecking(false);
      return;
    }

    // Check existing active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) return;

    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Authentication service is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.');
      return;
    }

    try {
      setAuthLoading(true);
      setAuthError('');

      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword.trim()
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  // ----------------------------------------------------------------------
  // DASHBOARD STATE
  // ----------------------------------------------------------------------
  type TabType = 'hero' | 'staff' | 'photos' | 'stories' | 'photowalks' | 'exhibitions' | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  // ----------------------------------------------------------------------
  // MODAL FORMS STATE
  // ----------------------------------------------------------------------
  // 1. Hero Form
  const [editingHeroIdx, setEditingHeroIdx] = useState<number | null>(null);
  const [heroForm, setHeroForm] = useState<HeroPhoto>({
    url: '',
    title: '',
    location: 'AGARTALA, TRIPURA',
    photographer: '',
    year: '2025',
    alignment: 'bottom-left'
  });

  // 2. Staff Form
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    type: 'core' as 'core' | 'advisory',
    photographySpecialization: 'Street Photography',
    bio: '',
    photoUrl: '',
    instagram: '',
    website: ''
  });

  // 3. Photo Form
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    url: '',
    photographer: '',
    location: 'Agartala, Tripura',
    year: '2025',
    category: 'Street' as PhotoCategory,
    caption: '',
    aspectRatio: 'landscape' as 'portrait' | 'landscape' | 'square',
    featured: false
  });

  // 4. Story Form
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [storyForm, setStoryForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    photographer: 'Streets of Tripura Collective',
    location: 'Agartala, Tripura',
    year: '2025',
    date: 'OCTOBER 2025',
    category: 'Documentary' as PhotoCategory,
    coverImage: '',
    summary: '',
    pullQuote: '',
    contentStr: ''
  });

  // 5. Photowalk Form
  const [editingWalkId, setEditingWalkId] = useState<string | null>(null);
  const [walkForm, setWalkForm] = useState({
    title: '',
    edition: 'EDITION 05',
    slug: '',
    date: 'DECEMBER 15, 2025',
    time: '6:30 AM',
    location: 'Agartala, Tripura',
    meetingPoint: 'Ujjayanta Palace Main Gate',
    description: '',
    status: 'upcoming' as 'upcoming' | 'completed',
    participantsCount: 25,
    coverImage: '',
    routeHighlightsStr: 'Battala Market, Howrah Riverfront'
  });

  // 6. Exhibition Form
  const [editingExhibitionId, setEditingExhibitionId] = useState<string | null>(null);
  const [exhibitionForm, setExhibitionForm] = useState({
    title: '',
    edition: 'LENS 3.0',
    slug: '',
    dates: 'NOVEMBER 20-24, 2025',
    venue: 'Nazrul Kalakshetra, Agartala',
    location: 'Agartala, Tripura',
    status: 'archived' as 'upcoming' | 'ongoing' | 'archived',
    curatorStatement: '',
    description: '',
    coverImage: '',
    photographersStr: 'Abhinaba Das, Snehangshu Roy, Ritwik Debroy'
  });

  const [jsonInput, setJsonInput] = useState('');

  const handleOpenCreateModal = () => {
    setEditingHeroIdx(null);
    setEditingStaffId(null);
    setEditingPhotoId(null);
    setEditingStoryId(null);
    setEditingWalkId(null);
    setEditingExhibitionId(null);
    setIsModalOpen(true);
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.url.trim() || !heroForm.title.trim()) return;
    try {
      setIsSubmitting(true);
      if (editingHeroIdx !== null) {
        await updateHeroPhoto(editingHeroIdx, heroForm);
        notifySuccess('Hero slide updated');
      } else {
        await addHeroPhoto(heroForm);
        notifySuccess('New hero slide added');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      notifyError(err?.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name.trim() || !staffForm.role.trim()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        name: staffForm.name.trim(),
        role: staffForm.role.trim(),
        type: staffForm.type,
        photographySpecialization: staffForm.photographySpecialization,
        bio: staffForm.bio || 'Team Member',
        photoUrl: staffForm.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=400',
        socials: { instagram: staffForm.instagram, website: staffForm.website }
      };
      if (editingStaffId) {
        await updateTeamMember(editingStaffId, payload);
        notifySuccess(`Updated ${staffForm.name}`);
      } else {
        await addTeamMember(payload);
        notifySuccess(`Added ${staffForm.name}`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      notifyError(err?.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title.trim() || !photoForm.url.trim()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        title: photoForm.title,
        url: photoForm.url,
        photographer: photoForm.photographer || 'Streets of Tripura',
        location: photoForm.location,
        year: photoForm.year,
        category: photoForm.category,
        caption: photoForm.caption || photoForm.title,
        aspectRatio: photoForm.aspectRatio,
        featured: photoForm.featured
      };
      if (editingPhotoId) {
        await updatePhoto(editingPhotoId, payload);
        notifySuccess(`Updated photo "${photoForm.title}"`);
      } else {
        await addPhoto(payload);
        notifySuccess(`Added photo "${photoForm.title}"`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      notifyError(err?.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.title.trim() || !storyForm.coverImage.trim()) return;
    try {
      setIsSubmitting(true);
      const slug = storyForm.slug.trim() || storyForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const paras = storyForm.contentStr.split('\n\n').filter(Boolean);
      const payload = {
        slug,
        title: storyForm.title,
        subtitle: storyForm.subtitle,
        photographer: storyForm.photographer,
        photographerId: 'ph_collab',
        location: storyForm.location,
        year: storyForm.year,
        date: storyForm.date,
        category: storyForm.category,
        coverImage: storyForm.coverImage,
        summary: storyForm.summary || storyForm.title,
        content: paras.length > 0 ? paras : [storyForm.summary],
        photos: [{ url: storyForm.coverImage, caption: storyForm.title }],
        pullQuote: storyForm.pullQuote
      };
      if (editingStoryId) {
        await updateStory(editingStoryId, payload);
        notifySuccess(`Updated story "${storyForm.title}"`);
      } else {
        await addStory(payload);
        notifySuccess(`Published story "${storyForm.title}"`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      notifyError(err?.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkForm.title.trim() || !walkForm.coverImage.trim()) return;
    try {
      setIsSubmitting(true);
      const slug = walkForm.slug.trim() || walkForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        slug,
        title: walkForm.title,
        edition: walkForm.edition,
        date: walkForm.date,
        time: walkForm.time,
        location: walkForm.location,
        meetingPoint: walkForm.meetingPoint,
        description: walkForm.description || walkForm.title,
        status: walkForm.status,
        participantsCount: Number(walkForm.participantsCount) || 0,
        coverImage: walkForm.coverImage,
        photographers: [],
        routeHighlights: walkForm.routeHighlightsStr.split(',').map(s => s.trim()).filter(Boolean),
        photos: []
      };
      if (editingWalkId) {
        await updatePhotowalk(editingWalkId, payload);
        notifySuccess(`Updated photowalk "${walkForm.title}"`);
      } else {
        await addPhotowalk(payload);
        notifySuccess(`Scheduled photowalk "${walkForm.title}"`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      notifyError(err?.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExhibitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exhibitionForm.title.trim() || !exhibitionForm.coverImage.trim()) return;
    try {
      setIsSubmitting(true);
      const slug = exhibitionForm.slug.trim() || exhibitionForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        slug,
        title: exhibitionForm.title,
        edition: exhibitionForm.edition,
        dates: exhibitionForm.dates,
        venue: exhibitionForm.venue,
        location: exhibitionForm.location,
        status: exhibitionForm.status,
        curatorStatement: exhibitionForm.curatorStatement,
        description: exhibitionForm.description || exhibitionForm.title,
        participatingPhotographers: exhibitionForm.photographersStr.split(',').map(s => s.trim()).filter(Boolean),
        coverImage: exhibitionForm.coverImage,
        exhibitionPhotos: []
      };
      if (editingExhibitionId) {
        await updateExhibition(editingExhibitionId, payload);
        notifySuccess(`Updated exhibition "${exhibitionForm.title}"`);
      } else {
        await addExhibition(payload);
        notifySuccess(`Created exhibition "${exhibitionForm.title}"`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      notifyError(err?.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { id: 'hero', label: 'Hero Slides', count: (heroPhotos || []).length, icon: Sparkles },
    { id: 'staff', label: 'Team Members', count: teamMembers.length, icon: Users },
    { id: 'photos', label: 'Gallery Archive', count: photos.length, icon: ImageIcon },
    { id: 'stories', label: 'Photo Stories', count: stories.length, icon: BookOpen },
    { id: 'photowalks', label: 'Photowalks', count: photowalks.length, icon: MapPin },
    { id: 'exhibitions', label: 'Exhibitions', count: exhibitions.length, icon: Calendar },
    { id: 'settings', label: 'Backup & Restore', count: null, icon: Database }
  ];

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'hero': return 'Hero Slides';
      case 'staff': return 'Team Members';
      case 'photos': return 'Gallery Archive';
      case 'stories': return 'Photo Stories';
      case 'photowalks': return 'Photowalks';
      case 'exhibitions': return 'Exhibitions';
      case 'settings': return 'Backup & Restore';
    }
  };

  const getCreateButtonLabel = () => {
    switch (activeTab) {
      case 'hero': return 'New Hero Slide';
      case 'staff': return 'New Team Member';
      case 'photos': return 'New Photograph';
      case 'stories': return 'New Story';
      case 'photowalks': return 'New Photowalk';
      case 'exhibitions': return 'New Exhibition';
      default: return 'New Entry';
    }
  };

  // ----------------------------------------------------------------------
  // AUTH GUARD VIEW
  // ----------------------------------------------------------------------
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-sm text-[#64748b] font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-[#4f46e5]" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  // If Supabase is active and user is not signed in -> show login gate
  if (isSupabaseConfigured && !session) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center p-4 font-sans antialiased">
        <div className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#4f46e5] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#0f172a] tracking-tight">
              Streets of Tripura Admin
            </h1>
            <p className="text-xs text-[#64748b]">
              Please sign in with your authorized admin credentials
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#475569] mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="admin@streetsoftripura.org"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#0f172a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4f46e5]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#475569] mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#0f172a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4f46e5]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Workspace</span>
              )}
            </button>
          </form>

          {onNavigate && (
            <div className="pt-2 border-t border-[#f1f5f9] text-center">
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="text-xs text-[#64748b] hover:text-[#0f172a] transition-colors"
              >
                ← Return to Public Site
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------------------------
  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] text-[#1e293b] font-sans antialiased overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Workspace Brand Header */}
          <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
                SOT
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#0f172a] leading-tight">Streets of Tripura</h2>
                <p className="text-[11px] text-[#64748b]">Admin Workspace</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <p className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#94a3b8]">
              Manage Catalog
            </p>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#f1f5f9] text-[#0f172a] font-semibold'
                      : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#4f46e5]' : 'text-[#64748b]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-white text-[#4f46e5] font-bold shadow-2xs' : 'text-[#94a3b8]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User session & Logout */}
        <div className="p-4 border-t border-[#f1f5f9] space-y-2 bg-[#fafbfc]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#e2e8f0] text-[#475569] flex items-center justify-center font-bold text-xs shrink-0">
                AD
              </div>
              <p className="text-xs font-medium text-[#0f172a] truncate">
                {session?.user?.email || 'Authorized Curator'}
              </p>
            </div>
            {isSupabaseConfigured && (
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-[#e2e8f0] px-8 flex items-center justify-between shrink-0">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Search ${getActiveTabTitle().toLowerCase()}...`}
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            {onNavigate && (
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0f172a] transition-colors"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8]" />
              </button>
            )}
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Notifications */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2 shadow-xs">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section Title & Primary Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                {getActiveTabTitle()}
              </h1>
              <p className="text-xs text-[#64748b] mt-0.5">
                Manage, edit, and organize collective visual records.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportArchiveJSON());
                  const a = document.createElement('a');
                  a.href = dataStr;
                  a.download = `sot-archive-${Date.now()}.json`;
                  a.click();
                  notifySuccess('Archive JSON exported');
                }}
                className="px-3.5 py-2 border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] rounded-lg text-xs font-semibold text-[#475569] transition-colors flex items-center gap-2 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#64748b]" />
                <span>Export Data</span>
              </button>

              {activeTab !== 'settings' && (
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{getCreateButtonLabel()}</span>
                </button>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TAB CONTENT: DATA TABLE */}
          {/* ------------------------------------------------------------- */}
          {activeTab !== 'settings' ? (
            <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0f172a]">
                    All {getActiveTabTitle()}
                  </span>
                  <span className="text-xs text-[#94a3b8]">
                    ({
                      activeTab === 'hero' ? (heroPhotos || []).length :
                      activeTab === 'staff' ? teamMembers.length :
                      activeTab === 'photos' ? photos.length :
                      activeTab === 'stories' ? stories.length :
                      activeTab === 'photowalks' ? photowalks.length :
                      exhibitions.length
                    })
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#475569]">
                  <thead className="bg-[#f8fafc] text-[#64748b] font-semibold uppercase text-[10px] tracking-wider border-b border-[#f1f5f9]">
                    <tr>
                      <th className="py-3 px-4">Item / Title</th>
                      <th className="py-3 px-4">Identifier / Tag</th>
                      <th className="py-3 px-4">Attribution</th>
                      <th className="py-3 px-4">Status / Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    
                    {/* 1. HERO SLIDES */}
                    {activeTab === 'hero' && (heroPhotos || [])
                      .filter(h => !searchTerm || h.title.toLowerCase().includes(searchTerm.toLowerCase()) || h.photographer.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((hero, idx) => (
                        <tr key={idx} className="hover:bg-[#f8fafc] transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={hero.url} alt="" className="w-12 h-9 object-cover rounded-md border border-[#e2e8f0] shrink-0 bg-[#f1f5f9]" />
                              <div>
                                <p className="font-semibold text-[#0f172a]">{hero.title}</p>
                                <p className="text-[11px] text-[#94a3b8]">{hero.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748b]">
                            Slide #{idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-[#0f172a]">{hero.photographer}</span>
                            <span className="text-[10px] text-[#94a3b8] block">{hero.year}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active (Align: {hero.alignment})
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingHeroIdx(idx);
                                setHeroForm({ ...hero });
                                setIsModalOpen(true);
                              }}
                              className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete slide "${hero.title}"?`)) {
                                  await deleteHeroPhoto(idx);
                                  notifySuccess('Hero slide deleted');
                                }
                              }}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                    {/* 2. TEAM MEMBERS */}
                    {activeTab === 'staff' && teamMembers
                      .filter(m => !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.role.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(member => (
                        <tr key={member.id} className="hover:bg-[#f8fafc] transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={member.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-[#e2e8f0] shrink-0 bg-[#f1f5f9]" />
                              <div>
                                <p className="font-semibold text-[#0f172a]">{member.name}</p>
                                <p className="text-[11px] text-[#94a3b8]">{member.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748b]">
                            {member.id}
                          </td>
                          <td className="py-3.5 px-4 text-[11px]">
                            {member.photographySpecialization}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              member.type === 'core'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {member.type === 'core' ? 'Core Staff' : 'Advisory'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingStaffId(member.id);
                                setStaffForm({
                                  name: member.name,
                                  role: member.role,
                                  type: member.type,
                                  photographySpecialization: member.photographySpecialization,
                                  bio: member.bio,
                                  photoUrl: member.photoUrl,
                                  instagram: member.socials?.instagram || '',
                                  website: member.socials?.website || ''
                                });
                                setIsModalOpen(true);
                              }}
                              className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete ${member.name}?`)) {
                                  await deleteTeamMember(member.id);
                                  notifySuccess(`Removed ${member.name}`);
                                }
                              }}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                    {/* 3. GALLERY PHOTOS */}
                    {activeTab === 'photos' && photos
                      .filter(p => !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.photographer.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(photo => (
                        <tr key={photo.id} className="hover:bg-[#f8fafc] transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={photo.url} alt="" className="w-12 h-9 object-cover rounded-md border border-[#e2e8f0] shrink-0 bg-[#f1f5f9]" />
                              <div>
                                <p className="font-semibold text-[#0f172a]">{photo.title}</p>
                                <p className="text-[11px] text-[#94a3b8]">{photo.location} ({photo.year})</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748b]">
                            {photo.category}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#0f172a]">
                            {photo.photographer}
                          </td>
                          <td className="py-3.5 px-4">
                            {photo.featured ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Featured
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                                Standard
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingPhotoId(photo.id);
                                setPhotoForm({
                                  title: photo.title,
                                  url: photo.url,
                                  photographer: photo.photographer,
                                  location: photo.location,
                                  year: photo.year,
                                  category: photo.category,
                                  caption: photo.caption || '',
                                  aspectRatio: photo.aspectRatio || 'landscape',
                                  featured: Boolean(photo.featured)
                                });
                                setIsModalOpen(true);
                              }}
                              className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete photo "${photo.title}"?`)) {
                                  await deletePhoto(photo.id);
                                  notifySuccess(`Removed ${photo.title}`);
                                }
                              }}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                    {/* 4. STORIES */}
                    {activeTab === 'stories' && stories
                      .filter(s => !searchTerm || s.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(story => (
                        <tr key={story.id} className="hover:bg-[#f8fafc] transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={story.coverImage} alt="" className="w-12 h-9 object-cover rounded-md border border-[#e2e8f0] shrink-0 bg-[#f1f5f9]" />
                              <div>
                                <p className="font-semibold text-[#0f172a]">{story.title}</p>
                                <p className="text-[11px] text-[#94a3b8]">{story.location} • {story.date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748b]">
                            /{story.slug}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#0f172a]">
                            {story.photographer}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Published
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingStoryId(story.id);
                                setStoryForm({
                                  title: story.title,
                                  subtitle: story.subtitle || '',
                                  slug: story.slug,
                                  photographer: story.photographer,
                                  location: story.location,
                                  year: story.year,
                                  date: story.date,
                                  category: story.category,
                                  coverImage: story.coverImage,
                                  summary: story.summary || '',
                                  pullQuote: story.pullQuote || '',
                                  contentStr: (story.content || []).join('\n\n')
                                });
                                setIsModalOpen(true);
                              }}
                              className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete story "${story.title}"?`)) {
                                  await deleteStory(story.id);
                                  notifySuccess(`Deleted story`);
                                }
                              }}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                    {/* 5. PHOTOWALKS */}
                    {activeTab === 'photowalks' && photowalks
                      .filter(w => !searchTerm || w.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(walk => (
                        <tr key={walk.id} className="hover:bg-[#f8fafc] transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={walk.coverImage} alt="" className="w-12 h-9 object-cover rounded-md border border-[#e2e8f0] shrink-0 bg-[#f1f5f9]" />
                              <div>
                                <p className="font-semibold text-[#0f172a]">{walk.title}</p>
                                <p className="text-[11px] text-[#94a3b8]">{walk.date} at {walk.time}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748b]">
                            {walk.edition}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[#0f172a]">
                            {walk.participantsCount} Photographers
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              walk.status === 'upcoming'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {walk.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingWalkId(walk.id);
                                setWalkForm({
                                  title: walk.title,
                                  edition: walk.edition,
                                  slug: walk.slug,
                                  date: walk.date,
                                  time: walk.time || '6:30 AM',
                                  location: walk.location,
                                  meetingPoint: walk.meetingPoint || '',
                                  description: walk.description || '',
                                  status: walk.status,
                                  participantsCount: walk.participantsCount || 0,
                                  coverImage: walk.coverImage,
                                  routeHighlightsStr: (walk.routeHighlights || []).join(', ')
                                });
                                setIsModalOpen(true);
                              }}
                              className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete walk "${walk.title}"?`)) {
                                  await deletePhotowalk(walk.id);
                                  notifySuccess(`Deleted photowalk`);
                                }
                              }}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                    {/* 6. EXHIBITIONS */}
                    {activeTab === 'exhibitions' && exhibitions
                      .filter(e => !searchTerm || e.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(ex => (
                        <tr key={ex.id} className="hover:bg-[#f8fafc] transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={ex.coverImage} alt="" className="w-12 h-9 object-cover rounded-md border border-[#e2e8f0] shrink-0 bg-[#f1f5f9]" />
                              <div>
                                <p className="font-semibold text-[#0f172a]">{ex.title}</p>
                                <p className="text-[11px] text-[#94a3b8]">{ex.venue} • {ex.dates}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748b]">
                            {ex.edition || 'Showcase'}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[#0f172a]">
                            {(ex.participatingPhotographers || []).length} Artists
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              ex.status === 'ongoing' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              ex.status === 'upcoming' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {ex.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingExhibitionId(ex.id);
                                setExhibitionForm({
                                  title: ex.title,
                                  edition: ex.edition || 'LENS',
                                  slug: ex.slug,
                                  dates: ex.dates,
                                  venue: ex.venue || '',
                                  location: ex.location,
                                  status: ex.status,
                                  curatorStatement: ex.curatorStatement || '',
                                  description: ex.description || '',
                                  coverImage: ex.coverImage,
                                  photographersStr: (ex.participatingPhotographers || []).join(', ')
                                });
                                setIsModalOpen(true);
                              }}
                              className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete exhibition "${ex.title}"?`)) {
                                  await deleteExhibition(ex.id);
                                  notifySuccess(`Deleted exhibition`);
                                }
                              }}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Backup tab */
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-semibold text-[#0f172a]">Archive JSON Backup & Restore</h3>
                <p className="text-xs text-[#64748b]">
                  Export a snapshot of all site data or paste a backup to restore immediately.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportArchiveJSON());
                      const a = document.createElement('a');
                      a.href = dataStr;
                      a.download = `sot-archive-${Date.now()}.json`;
                      a.click();
                      notifySuccess('Exported archive JSON');
                    }}
                    className="px-4 py-2 bg-[#0f172a] text-white hover:bg-[#475569] text-xs font-semibold rounded-lg flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(exportArchiveJSON());
                      notifySuccess('JSON copied to clipboard');
                    }}
                    className="px-4 py-2 border border-[#e2e8f0] hover:bg-[#f8fafc] text-xs font-semibold rounded-lg flex items-center gap-2 text-[#475569]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-[#f1f5f9] space-y-2">
                  <label className="block text-xs font-semibold text-[#475569]">Restore from JSON string</label>
                  <textarea
                    rows={4}
                    value={jsonInput}
                    onChange={e => setJsonInput(e.target.value)}
                    placeholder="Paste valid JSON string here..."
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3 text-xs font-mono outline-none focus:border-[#4f46e5]"
                  />
                  <button
                    onClick={() => {
                      if (!jsonInput.trim()) return;
                      const ok = importArchiveJSON(jsonInput);
                      if (ok) {
                        notifySuccess('Archive JSON imported successfully');
                        setJsonInput('');
                      } else {
                        notifyError('Invalid JSON format');
                      }
                    }}
                    className="px-4 py-2 bg-[#4f46e5] text-white hover:bg-[#4338ca] text-xs font-semibold rounded-lg flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Restore Archive</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* POPUP MODAL FOR CREATE & EDIT */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">
                  {editingHeroIdx !== null || editingStaffId || editingPhotoId || editingStoryId || editingWalkId || editingExhibitionId ? 'Edit Record' : `Create ${getActiveTabTitle()}`}
                </h3>
                <p className="text-xs text-[#64748b]">Fill in details and save changes</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#0f172a] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#0f172a]">
              
              {/* 1. HERO FORM */}
              {activeTab === 'hero' && (
                <form onSubmit={handleHeroSubmit} className="space-y-4">
                  <CloudinaryUploadWidget
                    label="Hero Photograph"
                    currentUrl={heroForm.url}
                    folder="streets-of-tripura/hero"
                    onUploadSuccess={url => setHeroForm({ ...heroForm, url })}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      value={heroForm.title}
                      onChange={e => setHeroForm({ ...heroForm, title: e.target.value })}
                      placeholder="e.g. Evening Rain at Battala Market"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Photographer *</label>
                      <input
                        type="text"
                        required
                        value={heroForm.photographer}
                        onChange={e => setHeroForm({ ...heroForm, photographer: e.target.value })}
                        placeholder="SUJIT ROY"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5] uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Year</label>
                      <input
                        type="text"
                        value={heroForm.year}
                        onChange={e => setHeroForm({ ...heroForm, year: e.target.value })}
                        placeholder="2025"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Location Label</label>
                      <input
                        type="text"
                        value={heroForm.location}
                        onChange={e => setHeroForm({ ...heroForm, location: e.target.value })}
                        placeholder="AGARTALA, TRIPURA"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5] uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Text Alignment</label>
                      <select
                        value={heroForm.alignment}
                        onChange={e => setHeroForm({ ...heroForm, alignment: e.target.value as any })}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      >
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="left">Center Left</option>
                        <option value="right">Center Right</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Hero Slide'}
                  </button>
                </form>
              )}

              {/* 2. STAFF FORM */}
              {activeTab === 'staff' && (
                <form onSubmit={handleStaffSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={staffForm.name}
                      onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                      placeholder="e.g. Abhinaba Das"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Role Title *</label>
                      <input
                        type="text"
                        required
                        value={staffForm.role}
                        onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                        placeholder="Lead Curator"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Member Category</label>
                      <select
                        value={staffForm.type}
                        onChange={e => setStaffForm({ ...staffForm, type: e.target.value as any })}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      >
                        <option value="core">Core Member</option>
                        <option value="advisory">Advisory Member</option>
                      </select>
                    </div>
                  </div>
                  <CloudinaryUploadWidget
                    label="Profile Portrait"
                    currentUrl={staffForm.photoUrl}
                    folder="streets-of-tripura/staff"
                    onUploadSuccess={url => setStaffForm({ ...staffForm, photoUrl: url })}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Specialization</label>
                    <input
                      type="text"
                      value={staffForm.photographySpecialization}
                      onChange={e => setStaffForm({ ...staffForm, photographySpecialization: e.target.value })}
                      placeholder="Street Photography, Visual Storytelling"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Short Bio</label>
                    <textarea
                      rows={3}
                      value={staffForm.bio}
                      onChange={e => setStaffForm({ ...staffForm, bio: e.target.value })}
                      placeholder="Bio notes..."
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Instagram</label>
                      <input
                        type="text"
                        value={staffForm.instagram}
                        onChange={e => setStaffForm({ ...staffForm, instagram: e.target.value })}
                        placeholder="@username"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Portfolio URL</label>
                      <input
                        type="url"
                        value={staffForm.website}
                        onChange={e => setStaffForm({ ...staffForm, website: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Team Member'}
                  </button>
                </form>
              )}

              {/* 3. PHOTO FORM */}
              {activeTab === 'photos' && (
                <form onSubmit={handlePhotoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      value={photoForm.title}
                      onChange={e => setPhotoForm({ ...photoForm, title: e.target.value })}
                      placeholder="e.g. Dawn at Battala"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <CloudinaryUploadWidget
                    label="Photograph"
                    currentUrl={photoForm.url}
                    folder="streets-of-tripura/gallery"
                    onUploadSuccess={url => setPhotoForm({ ...photoForm, url })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Photographer</label>
                      <input
                        type="text"
                        value={photoForm.photographer}
                        onChange={e => setPhotoForm({ ...photoForm, photographer: e.target.value })}
                        placeholder="Ritwik Debroy"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Category</label>
                      <select
                        value={photoForm.category}
                        onChange={e => setPhotoForm({ ...photoForm, category: e.target.value as any })}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      >
                        {['Street', 'Documentary', 'Culture', 'People', 'Landscape', 'Travel', 'Events'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Location</label>
                      <input
                        type="text"
                        value={photoForm.location}
                        onChange={e => setPhotoForm({ ...photoForm, location: e.target.value })}
                        placeholder="Agartala"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Year</label>
                      <input
                        type="text"
                        value={photoForm.year}
                        onChange={e => setPhotoForm({ ...photoForm, year: e.target.value })}
                        placeholder="2025"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="featPhoto"
                      checked={photoForm.featured}
                      onChange={e => setPhotoForm({ ...photoForm, featured: e.target.checked })}
                      className="accent-[#4f46e5] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="featPhoto" className="cursor-pointer font-medium text-xs text-[#475569]">
                      Feature in highlight collections
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Photograph'}
                  </button>
                </form>
              )}

              {/* 4. STORY FORM */}
              {activeTab === 'stories' && (
                <form onSubmit={handleStorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Story Title *</label>
                    <input
                      type="text"
                      required
                      value={storyForm.title}
                      onChange={e => setStoryForm({ ...storyForm, title: e.target.value })}
                      placeholder="Shadows of Old Battala"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <CloudinaryUploadWidget
                    label="Cover Photograph"
                    currentUrl={storyForm.coverImage}
                    folder="streets-of-tripura/stories"
                    onUploadSuccess={url => setStoryForm({ ...storyForm, coverImage: url })}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Summary / Deck</label>
                    <textarea
                      rows={2}
                      value={storyForm.summary}
                      onChange={e => setStoryForm({ ...storyForm, summary: e.target.value })}
                      placeholder="Short editorial summary..."
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Full Article (paragraphs separated by blank line)</label>
                    <textarea
                      rows={4}
                      value={storyForm.contentStr}
                      onChange={e => setStoryForm({ ...storyForm, contentStr: e.target.value })}
                      placeholder="Paragraph 1...&#10;&#10;Paragraph 2..."
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Story'}
                  </button>
                </form>
              )}

              {/* 5. PHOTOWALK FORM */}
              {activeTab === 'photowalks' && (
                <form onSubmit={handleWalkSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Walk Title *</label>
                    <input
                      type="text"
                      required
                      value={walkForm.title}
                      onChange={e => setWalkForm({ ...walkForm, title: e.target.value })}
                      placeholder="Dawn Alleys & Morning Markets"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <CloudinaryUploadWidget
                    label="Walk Cover Image"
                    currentUrl={walkForm.coverImage}
                    folder="streets-of-tripura/photowalks"
                    onUploadSuccess={url => setWalkForm({ ...walkForm, coverImage: url })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Edition Tag</label>
                      <input
                        type="text"
                        value={walkForm.edition}
                        onChange={e => setWalkForm({ ...walkForm, edition: e.target.value })}
                        placeholder="EDITION 05"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Status</label>
                      <select
                        value={walkForm.status}
                        onChange={e => setWalkForm({ ...walkForm, status: e.target.value as any })}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Date</label>
                      <input
                        type="text"
                        value={walkForm.date}
                        onChange={e => setWalkForm({ ...walkForm, date: e.target.value })}
                        placeholder="DECEMBER 15, 2025"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Meeting Point</label>
                      <input
                        type="text"
                        value={walkForm.meetingPoint}
                        onChange={e => setWalkForm({ ...walkForm, meetingPoint: e.target.value })}
                        placeholder="Ujjayanta Palace"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Photowalk'}
                  </button>
                </form>
              )}

              {/* 6. EXHIBITION FORM */}
              {activeTab === 'exhibitions' && (
                <form onSubmit={handleExhibitionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Exhibition Title *</label>
                    <input
                      type="text"
                      required
                      value={exhibitionForm.title}
                      onChange={e => setExhibitionForm({ ...exhibitionForm, title: e.target.value })}
                      placeholder="LENS: Through The Alleys"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <CloudinaryUploadWidget
                    label="Exhibition Poster"
                    currentUrl={exhibitionForm.coverImage}
                    folder="streets-of-tripura/exhibitions"
                    onUploadSuccess={url => setExhibitionForm({ ...exhibitionForm, coverImage: url })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Dates</label>
                      <input
                        type="text"
                        value={exhibitionForm.dates}
                        onChange={e => setExhibitionForm({ ...exhibitionForm, dates: e.target.value })}
                        placeholder="NOVEMBER 20-24, 2025"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">Venue</label>
                      <input
                        type="text"
                        value={exhibitionForm.venue}
                        onChange={e => setExhibitionForm({ ...exhibitionForm, venue: e.target.value })}
                        placeholder="Nazrul Kalakshetra"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Participating Artists</label>
                    <input
                      type="text"
                      value={exhibitionForm.photographersStr}
                      onChange={e => setExhibitionForm({ ...exhibitionForm, photographersStr: e.target.value })}
                      placeholder="Abhinaba Das, Snehangshu Roy, Ritwik Debroy"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Exhibition'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};