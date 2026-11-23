import React, { useState } from 'react';
import { X, Plus, RefreshCw, CheckCircle2, Download, Upload, Copy } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PhotoCategory } from '../types';
import { CloudinaryUploadWidget } from './CloudinaryUploadWidget';

export const AdminCMSModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    addPhoto,
    addStory,
    addPhotowalk,
    exportArchiveJSON,
    importArchiveJSON,
    resetData,
    isLiveSupabase
  } = useData();

  const [activeTab, setActiveTab] = useState<'photo' | 'story' | 'photowalk' | 'json'>('photo');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [importedJson, setImportedJson] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [photoForm, setPhotoForm] = useState({
    title: '',
    url: '',
    photographer: '',
    location: 'Agartala, Tripura',
    year: '2026',
    category: 'Street' as PhotoCategory,
    caption: '',
    camera: 'Fujifilm X-T4',
    lens: '35mm f/1.4'
  });

  const [storyForm, setStoryForm] = useState({
    title: '',
    subtitle: '',
    photographer: '',
    location: 'Agartala, Tripura',
    coverImage: '',
    summary: '',
    contentParagraph1: '',
    contentParagraph2: '',
    category: 'Street' as PhotoCategory
  });

  const [walkForm, setWalkForm] = useState({
    title: '',
    edition: 'Walk #44',
    date: 'April 2026',
    time: '06:30 AM IST',
    location: 'Agartala Heritage Corridor',
    meetingPoint: 'Ujjayanta Palace Gate',
    description: '',
    coverImage: ''
  });

  if (!isAdminOpen) return null;

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.url || !photoForm.photographer) return;
    try {
      setIsSubmitting(true);
      await addPhoto({
        title: photoForm.title,
        url: photoForm.url,
        photographer: photoForm.photographer,
        location: photoForm.location,
        year: photoForm.year,
        category: photoForm.category,
        caption: photoForm.caption || photoForm.title,
        cameraInfo: {
          camera: photoForm.camera,
          lens: photoForm.lens
        },
        aspectRatio: 'landscape'
      });
      setSuccessMessage('New photograph published to digital archive!');
      setTimeout(() => setSuccessMessage(''), 3500);
      setPhotoForm({
        title: '',
        url: '',
        photographer: '',
        location: 'Agartala, Tripura',
        year: '2026',
        category: 'Street',
        caption: '',
        camera: 'Fujifilm X-T4',
        lens: '35mm f/1.4'
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save photograph');
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.title || !storyForm.coverImage || !storyForm.photographer) return;
    try {
      setIsSubmitting(true);
      const slug = storyForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await addStory({
        slug,
        title: storyForm.title,
        subtitle: storyForm.subtitle,
        photographer: storyForm.photographer,
        photographerId: 'ph_' + Date.now(),
        location: storyForm.location,
        year: '2026',
        date: '2026',
        category: storyForm.category,
        coverImage: storyForm.coverImage,
        summary: storyForm.summary,
        content: [storyForm.contentParagraph1, storyForm.contentParagraph2].filter(Boolean),
        photos: [
          { url: storyForm.coverImage, caption: storyForm.title }
        ]
      });
      setSuccessMessage('New visual story published!');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save visual story');
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkForm.title || !walkForm.coverImage) return;
    try {
      setIsSubmitting(true);
      const slug = walkForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await addPhotowalk({
        slug,
        title: walkForm.title,
        edition: walkForm.edition,
        date: walkForm.date,
        time: walkForm.time,
        location: walkForm.location,
        meetingPoint: walkForm.meetingPoint,
        description: walkForm.description,
        status: 'upcoming',
        participantsCount: 0,
        coverImage: walkForm.coverImage,
        photographers: ['Streets of Tripura Collective'],
        routeHighlights: ['Heritage Corridor', 'Local Markets'],
        photos: []
      });
      setSuccessMessage('New Photowalk created!');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save photowalk');
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportJSON = () => {
    const json = exportArchiveJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streets-of-tripura-archive-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage('Archive JSON exported to file!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleCopyJSON = () => {
    const json = exportArchiveJSON();
    navigator.clipboard.writeText(json);
    setSuccessMessage('Archive JSON copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleImportJSON = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importedJson.trim()) return;
    const success = importArchiveJSON(importedJson);
    if (success) {
      setSuccessMessage('Archive content successfully imported and synchronized!');
      setErrorMessage('');
      setImportedJson('');
      setTimeout(() => setSuccessMessage(''), 3500);
    } else {
      setErrorMessage('Failed to parse JSON. Please verify syntax.');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportedJson(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1918]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in" id="cms-modal">
      <div className="bg-[#faf8f5] text-[#1a1918] max-w-2xl w-full p-6 sm:p-8 border border-[#e6e1d8] shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e6e1d8] pb-4 mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#b85d38] font-semibold">
              Content Management System
            </span>
            <h3 className="font-serif text-2xl font-light text-[#1a1918]">
              Streets of Tripura Archive CMS
            </h3>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1 text-[#8c8881] hover:text-[#1a1918] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 border-b border-[#e6e1d8] mb-6 overflow-x-auto pb-2 text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('photo')}
            className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'photo' ? 'bg-[#1a1918] text-[#faf8f5]' : 'text-[#8c8881] hover:text-[#1a1918]'
            }`}
          >
            Add Photo
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'story' ? 'bg-[#1a1918] text-[#faf8f5]' : 'text-[#8c8881] hover:text-[#1a1918]'
            }`}
          >
            Add Story
          </button>
          <button
            onClick={() => setActiveTab('photowalk')}
            className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'photowalk' ? 'bg-[#1a1918] text-[#faf8f5]' : 'text-[#8c8881] hover:text-[#1a1918]'
            }`}
          >
            Add Photowalk
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 transition-colors whitespace-nowrap font-medium ${
              activeTab === 'json' ? 'bg-[#b85d38] text-white' : 'text-[#b85d38] hover:bg-[#b85d38]/10'
            }`}
          >
            Backup & JSON
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-[#e8f3ec] text-[#2c6e49] border border-[#a8d5ba] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#fde8e8] text-[#9b1c1c] border border-[#f8b4b4] text-xs">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Photo Form */}
        {activeTab === 'photo' && (
          <form onSubmit={handlePhotoSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Photo Title *</label>
              <input
                type="text"
                required
                value={photoForm.title}
                onChange={e => setPhotoForm({ ...photoForm, title: e.target.value })}
                placeholder="e.g., Morning Mist at Battala Fish Market"
                className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <div>
              <CloudinaryUploadWidget
                label="Photograph Image File *"
                folder="streets-of-tripura/gallery"
                currentUrl={photoForm.url}
                onUploadSuccess={(url) => setPhotoForm({ ...photoForm, url })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Photographer Name *</label>
                <input
                  type="text"
                  required
                  value={photoForm.photographer}
                  onChange={e => setPhotoForm({ ...photoForm, photographer: e.target.value })}
                  placeholder="e.g. Sujit Roy"
                  className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Category</label>
                <select
                  value={photoForm.category}
                  onChange={e => setPhotoForm({ ...photoForm, category: e.target.value as PhotoCategory })}
                  className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                >
                  <option value="Street">Street</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Culture">Culture</option>
                  <option value="People">People</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Travel">Travel</option>
                  <option value="Events">Events</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  value={photoForm.location}
                  onChange={e => setPhotoForm({ ...photoForm, location: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Year</label>
                <input
                  type="text"
                  value={photoForm.year}
                  onChange={e => setPhotoForm({ ...photoForm, year: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Caption / Story Notes</label>
              <textarea
                rows={3}
                value={photoForm.caption}
                onChange={e => setPhotoForm({ ...photoForm, caption: e.target.value })}
                placeholder="Describe the context, light, or human interaction captured..."
                className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a1918] text-[#faf8f5] py-3 uppercase tracking-widest hover:bg-[#2b2a28] transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Publish Photograph
            </button>
          </form>
        )}

        {/* Story Form */}
        {activeTab === 'story' && (
          <form onSubmit={handleStorySubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Story Title</label>
              <input
                type="text"
                required
                value={storyForm.title}
                onChange={e => setStoryForm({ ...storyForm, title: e.target.value })}
                placeholder="e.g. Shadows of the Howrah Embankment"
                className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <div>
              <CloudinaryUploadWidget
                label="Story Cover Image *"
                folder="streets-of-tripura/stories"
                currentUrl={storyForm.coverImage}
                onUploadSuccess={(url) => setStoryForm({ ...storyForm, coverImage: url })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Photographer</label>
                <input
                  type="text"
                  required
                  value={storyForm.photographer}
                  onChange={e => setStoryForm({ ...storyForm, photographer: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Category</label>
                <select
                  value={storyForm.category}
                  onChange={e => setStoryForm({ ...storyForm, category: e.target.value as PhotoCategory })}
                  className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                >
                  <option value="Street">Street</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Culture">Culture</option>
                  <option value="People">People</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Summary</label>
              <textarea
                rows={2}
                value={storyForm.summary}
                onChange={e => setStoryForm({ ...storyForm, summary: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Editorial Text Paragraph 1</label>
              <textarea
                rows={3}
                value={storyForm.contentParagraph1}
                onChange={e => setStoryForm({ ...storyForm, contentParagraph1: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a1918] text-[#faf8f5] py-3 uppercase tracking-widest hover:bg-[#2b2a28] transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Publish Story Essay
            </button>
          </form>
        )}

        {/* Photowalk Form */}
        {activeTab === 'photowalk' && (
          <form onSubmit={handleWalkSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Photowalk Title</label>
              <input
                type="text"
                required
                value={walkForm.title}
                onChange={e => setWalkForm({ ...walkForm, title: e.target.value })}
                placeholder="e.g. Agartala Lake Chowmuhani Morning Walk"
                className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <div>
              <CloudinaryUploadWidget
                label="Cover Image *"
                folder="streets-of-tripura/photowalks"
                currentUrl={walkForm.coverImage}
                onUploadSuccess={(url) => setWalkForm({ ...walkForm, coverImage: url })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Date</label>
                <input
                  type="text"
                  value={walkForm.date}
                  onChange={e => setWalkForm({ ...walkForm, date: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  value={walkForm.location}
                  onChange={e => setWalkForm({ ...walkForm, location: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Description</label>
              <textarea
                rows={3}
                value={walkForm.description}
                onChange={e => setWalkForm({ ...walkForm, description: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a1918] text-[#faf8f5] py-3 uppercase tracking-widest hover:bg-[#2b2a28] transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Create Photowalk Event
            </button>
          </form>
        )}

        {/* JSON Sync & Cloudinary Guide Tab */}
        {activeTab === 'json' && (
          <div className="space-y-6 text-xs">
            {/* JSON Export Controls */}
            <div className="space-y-2">
              <label className="block text-[#8c8881] uppercase tracking-wider font-semibold">
                Export Current Archive State (JSON)
              </label>
              <p className="text-[#a39c90] text-[11px]">
                Export all published photos, stories, photowalks, and exhibitions as a formatted JSON document.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="bg-[#1a1918] text-[#faf8f5] px-4 py-2 hover:bg-[#2b2a28] transition-colors inline-flex items-center gap-2 uppercase tracking-wider text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" /> Download JSON File
                </button>
                <button
                  type="button"
                  onClick={handleCopyJSON}
                  className="border border-[#1a1918] text-[#1a1918] px-4 py-2 hover:bg-[#1a1918] hover:text-white transition-colors inline-flex items-center gap-2 uppercase tracking-wider text-[11px]"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy JSON to Clipboard
                </button>
              </div>
            </div>

            {/* JSON Import Controls */}
            <form onSubmit={handleImportJSON} className="space-y-3 pt-2 border-t border-[#e6e1d8]">
              <div className="flex justify-between items-center">
                <label className="block text-[#8c8881] uppercase tracking-wider font-semibold">
                  Import or Bulk Update JSON Data
                </label>
                <label className="cursor-pointer text-[11px] text-[#b85d38] hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload .json File
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              <textarea
                rows={6}
                value={importedJson}
                onChange={e => setImportedJson(e.target.value)}
                placeholder='Paste your archive JSON structure here (e.g., { "photos": [...], "stories": [...] })'
                className="w-full p-2.5 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none font-mono text-[11px] leading-relaxed"
              />
              <button
                type="submit"
                disabled={!importedJson.trim()}
                className="w-full bg-[#b85d38] text-white py-2.5 uppercase tracking-widest hover:bg-[#9e4c2c] transition-colors disabled:opacity-40 font-medium"
              >
                Sync & Save JSON
              </button>
            </form>
          </div>
        )}

        {/* Reset Data Button */}
        <div className="mt-8 pt-4 border-t border-[#e6e1d8] flex justify-between items-center text-xs text-[#8c8881]">
          <span>Reset content to initial Tripura archive state</span>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset custom publications back to default state?')) {
                resetData();
                setSuccessMessage('Archive reset to original state.');
              }
            }}
            className="flex items-center gap-1 hover:text-[#b85d38] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Archive
          </button>
        </div>
      </div>
    </div>
  );
};
