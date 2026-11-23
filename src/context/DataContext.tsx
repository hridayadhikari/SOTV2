import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Photo,
  PhotoStory,
  Photowalk,
  Exhibition,
  Competition,
  CommunityEvent,
  MagazineIssue,
  Collaboration,
  Photographer,
  TeamMember,
  TimelineEvent,
  PressItem,
  SiteEvent,
  HeroPhoto
} from '../types';
import {
  INITIAL_PHOTOS,
  HERO_PHOTOS,
  INITIAL_STORIES,
  INITIAL_PHOTOWALKS,
  INITIAL_EXHIBITIONS,
  INITIAL_COMPETITIONS,
  INITIAL_COMMUNITY_EVENTS,
  INITIAL_MAGAZINES,
  INITIAL_COLLABORATIONS,
  INITIAL_PHOTOGRAPHERS,
  INITIAL_TEAM,
  INITIAL_TIMELINE,
  INITIAL_PRESS,
  INITIAL_EVENTS
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DataContextType {
  photos: Photo[];
  heroPhotos: HeroPhoto[];
  addHeroPhoto: (photo: HeroPhoto) => Promise<void>;
  updateHeroPhoto: (index: number, photo: HeroPhoto) => Promise<void>;
  deleteHeroPhoto: (index: number) => Promise<void>;
  stories: PhotoStory[];
  photowalks: Photowalk[];
  exhibitions: Exhibition[];
  competitions: Competition[];
  communityEvents: CommunityEvent[];
  events: SiteEvent[];
  magazines: MagazineIssue[];
  collaborations: Collaboration[];
  photographers: Photographer[];
  teamMembers: TeamMember[];
  timeline: TimelineEvent[];
  press: PressItem[];
  
  isLiveSupabase: boolean;
  isLoading: boolean;

  activePhoto: Photo | null;
  setActivePhoto: (photo: Photo | null) => void;
  nextPhoto: () => void;
  prevPhoto: () => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  addPhoto: (photo: Omit<Photo, 'id'>) => Promise<void>;
  updatePhoto: (id: string, photo: Partial<Photo>) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;

  addStory: (story: Omit<PhotoStory, 'id'>) => Promise<void>;
  updateStory: (id: string, story: Partial<PhotoStory>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;

  addPhotowalk: (walk: Omit<Photowalk, 'id'>) => Promise<void>;
  updatePhotowalk: (id: string, walk: Partial<Photowalk>) => Promise<void>;
  deletePhotowalk: (id: string) => Promise<void>;

  addExhibition: (exhibition: Omit<Exhibition, 'id'>) => Promise<void>;
  updateExhibition: (id: string, exhibition: Partial<Exhibition>) => Promise<void>;
  deleteExhibition: (id: string) => Promise<void>;

  addMagazine: (issue: Omit<MagazineIssue, 'id'>) => Promise<void>;
  updateMagazine: (id: string, issue: Partial<MagazineIssue>) => Promise<void>;
  deleteMagazine: (id: string) => Promise<void>;
  
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  addPhotographer: (photographer: Omit<Photographer, 'id'>) => Promise<void>;
  updatePhotographer: (id: string, photographer: Partial<Photographer>) => Promise<void>;
  deletePhotographer: (id: string) => Promise<void>;

  exportArchiveJSON: () => string;
  importArchiveJSON: (jsonStr: string) => boolean;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isLiveSupabase = isSupabaseConfigured && Boolean(supabase);

  // Local states initialized from localStorage or defaults
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('sot_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  const [heroPhotos, setHeroPhotos] = useState<HeroPhoto[]>(() => {
    const saved = localStorage.getItem('sot_hero_photos_v1');
    return saved ? JSON.parse(saved) : HERO_PHOTOS;
  });

  const [stories, setStories] = useState<PhotoStory[]>(() => {
    const saved = localStorage.getItem('sot_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [photowalks, setPhotowalks] = useState<Photowalk[]>(() => {
    const saved = localStorage.getItem('sot_photowalks');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOWALKS;
  });

  const [exhibitions, setExhibitions] = useState<Exhibition[]>(() => {
    const saved = localStorage.getItem('sot_exhibitions_v3');
    return saved ? JSON.parse(saved) : INITIAL_EXHIBITIONS;
  });

  const [competitions] = useState<Competition[]>(() => {
    const saved = localStorage.getItem('sot_competitions_v1');
    return saved ? JSON.parse(saved) : INITIAL_COMPETITIONS;
  });

  const [communityEvents] = useState<CommunityEvent[]>(() => {
    const saved = localStorage.getItem('sot_community_events_v1');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_EVENTS;
  });

  const [events] = useState<SiteEvent[]>(() => {
    const saved = localStorage.getItem('sot_real_events_v7');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [magazines, setMagazines] = useState<MagazineIssue[]>(() => {
    const saved = localStorage.getItem('sot_magazines_v2');
    return saved ? JSON.parse(saved) : INITIAL_MAGAZINES;
  });

  const [collaborations] = useState<Collaboration[]>(INITIAL_COLLABORATIONS);
  
  const [photographers, setPhotographers] = useState<Photographer[]>(() => {
    const saved = localStorage.getItem('sot_photographers');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOGRAPHERS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('sot_team_v8');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [timeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [press] = useState<PressItem[]>(INITIAL_PRESS);

  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync with Supabase on mount if configured
  useEffect(() => {
    if (!isLiveSupabase || !supabase) return;

    let isMounted = true;
    const fetchSupabaseData = async () => {
      setIsLoading(true);
      try {
        const [
          photosRes,
          teamRes,
          photographersRes,
          storiesRes,
          walksRes,
          exhibitionsRes,
          magazinesRes,
          heroRes
        ] = await Promise.all([
          supabase.from('photos').select('*').order('created_at', { ascending: false }),
          supabase.from('team_members').select('*').order('created_at', { ascending: true }),
          supabase.from('photographers').select('*').order('created_at', { ascending: true }),
          supabase.from('stories').select('*').order('created_at', { ascending: false }),
          supabase.from('photowalks').select('*').order('created_at', { ascending: false }),
          supabase.from('exhibitions').select('*').order('created_at', { ascending: false }),
          supabase.from('magazines').select('*').order('created_at', { ascending: false }),
          supabase.from('hero_photos').select('*').order('created_at', { ascending: true })
        ]);

        if (!isMounted) return;

        console.log('[Supabase Data Load] heroRes:', heroRes);
        if (heroRes.error) {
          console.error('[Supabase Error] hero_photos:', heroRes.error);
        }

        if (heroRes.data && heroRes.data.length > 0) {
          setHeroPhotos(heroRes.data.map((h: any) => ({
            id: h.id,
            url: h.url || h.image_url || h.photo_url || '',
            title: h.title || 'Untitled',
            location: h.location || 'Agartala, Tripura',
            photographer: h.photographer || h.photographer_name || 'Streets of Tripura',
            year: String(h.year || '2025'),
            alignment: h.alignment || 'bottom-left'
          })));
        } else {
          // If order query returned nothing or failed on created_at, fallback to select('*')
          const fallbackHero = await supabase.from('hero_photos').select('*');
          console.log('[Supabase Data Load] fallbackHero:', fallbackHero);
          if (fallbackHero.data && fallbackHero.data.length > 0) {
            setHeroPhotos(fallbackHero.data.map((h: any) => ({
              id: h.id,
              url: h.url || h.image_url || h.photo_url || '',
              title: h.title || 'Untitled',
              location: h.location || 'Agartala, Tripura',
              photographer: h.photographer || h.photographer_name || 'Streets of Tripura',
              year: String(h.year || '2025'),
              alignment: h.alignment || 'bottom-left'
            })));
          }
        }

        if (photosRes.data && photosRes.data.length > 0) {
          setPhotos(photosRes.data.map(p => ({
            id: p.id,
            title: p.title,
            url: p.url,
            photographer: p.photographer,
            photographerId: p.photographer_id,
            location: p.location,
            year: p.year,
            date: p.date,
            category: p.category,
            caption: p.caption,
            cameraInfo: p.camera_info,
            series: p.series,
            aspectRatio: p.aspect_ratio,
            featured: p.featured
          })));
        }

        if (teamRes.data && teamRes.data.length > 0) {
          setTeamMembers(teamRes.data.map(t => ({
            id: t.id,
            name: t.name,
            role: t.role,
            type: t.type,
            photographySpecialization: t.photography_specialization,
            bio: t.bio,
            photoUrl: t.photo_url,
            socials: t.socials
          })));
        }

        if (photographersRes.data && photographersRes.data.length > 0) {
          setPhotographers(photographersRes.data.map(ph => ({
            id: ph.id,
            name: ph.name,
            location: ph.location,
            genres: ph.genres || [],
            portraitUrl: ph.portrait_url,
            bio: ph.bio,
            instagram: ph.instagram,
            portfolioUrl: ph.portfolio_url,
            selectedPhotos: ph.selected_photos || [],
            featuredStoriesCount: ph.featured_stories_count || 1,
            exhibitionsCount: ph.exhibitions_count || 1,
            roleInCommunity: ph.role_in_community
          })));
        }

        if (storiesRes.data && storiesRes.data.length > 0) {
          setStories(storiesRes.data.map(s => ({
            id: s.id,
            slug: s.slug,
            title: s.title,
            subtitle: s.subtitle,
            photographer: s.photographer,
            photographerId: s.photographer_id,
            photographerAvatar: s.photographer_avatar,
            location: s.location,
            year: s.year,
            date: s.date,
            category: s.category,
            coverImage: s.cover_image,
            summary: s.summary,
            content: s.content || [],
            photos: s.photos || [],
            pullQuote: s.pull_quote
          })));
        }

        if (walksRes.data && walksRes.data.length > 0) {
          setPhotowalks(walksRes.data.map(w => ({
            id: w.id,
            slug: w.slug,
            title: w.title,
            edition: w.edition,
            date: w.date,
            time: w.time,
            location: w.location,
            meetingPoint: w.meeting_point,
            description: w.description,
            status: w.status,
            participantsCount: w.participants_count,
            coverImage: w.cover_image,
            photographers: w.photographers || [],
            routeHighlights: w.route_highlights || [],
            photos: w.photos || [],
            registrationUrl: w.registration_url
          })));
        }

        if (exhibitionsRes.data && exhibitionsRes.data.length > 0) {
          setExhibitions(exhibitionsRes.data.map(e => ({
            id: e.id,
            slug: e.slug,
            title: e.title,
            edition: e.edition,
            dates: e.dates,
            venue: e.venue,
            location: e.location,
            status: e.status,
            curatorStatement: e.curator_statement,
            description: e.description,
            participatingPhotographers: e.participating_photographers || [],
            coverImage: e.cover_image,
            exhibitionPhotos: e.exhibition_photos || []
          })));
        }

        if (magazinesRes.data && magazinesRes.data.length > 0) {
          setMagazines(magazinesRes.data.map(m => ({
            id: m.id,
            issueNumber: m.issue_number,
            title: m.title,
            year: m.year,
            publishDate: m.publish_date,
            theme: m.theme,
            coverImage: m.cover_image,
            editorsNote: m.editors_note,
            contributors: m.contributors || [],
            featuredPhotographers: m.featured_photographers || [],
            pages: m.pages || [],
            pdfDownloadUrl: m.pdf_download_url
          })));
        }
      } catch (err) {
        console.warn('Supabase fetch failed; continuing with local data cache:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSupabaseData();

    return () => {
      isMounted = false;
    };
  }, [isLiveSupabase]);

  // Local storage cache updates
  useEffect(() => {
    localStorage.setItem('sot_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('sot_hero_photos_v1', JSON.stringify(heroPhotos));
  }, [heroPhotos]);

  useEffect(() => {
    localStorage.setItem('sot_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('sot_photowalks', JSON.stringify(photowalks));
  }, [photowalks]);

  useEffect(() => {
    localStorage.setItem('sot_exhibitions_v3', JSON.stringify(exhibitions));
  }, [exhibitions]);

  useEffect(() => {
    localStorage.setItem('sot_magazines_v2', JSON.stringify(magazines));
  }, [magazines]);

  useEffect(() => {
    localStorage.setItem('sot_team_v8', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('sot_photographers', JSON.stringify(photographers));
  }, [photographers]);

  const nextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = photos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex !== -1 && currentIndex < photos.length - 1) {
      setActivePhoto(photos[currentIndex + 1]);
    } else if (photos.length > 0) {
      setActivePhoto(photos[0]);
    }
  };

  const prevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = photos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex > 0) {
      setActivePhoto(photos[currentIndex - 1]);
    } else if (photos.length > 0) {
      setActivePhoto(photos[photos.length - 1]);
    }
  };

  const addHeroPhoto = async (newHero: HeroPhoto) => {
    const id = newHero.id || 'hero_' + Date.now();
    const heroWithId = { ...newHero, id };
    setHeroPhotos(prev => [...prev, heroWithId]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('hero_photos').insert({
          id,
          url: heroWithId.url,
          title: heroWithId.title,
          location: heroWithId.location,
          photographer: heroWithId.photographer,
          year: heroWithId.year,
          alignment: heroWithId.alignment || 'bottom-left'
        });
      } catch (err) {
        console.error('Failed to insert hero photo in Supabase:', err);
      }
    }
  };

  const updateHeroPhoto = async (index: number, updatedHero: HeroPhoto) => {
    const target = heroPhotos[index];
    const heroId = target?.id || updatedHero.id;
    setHeroPhotos(prev => prev.map((h, i) => i === index ? { ...updatedHero, id: heroId } : h));

    if (isLiveSupabase && supabase && heroId) {
      try {
        await supabase.from('hero_photos').update({
          url: updatedHero.url,
          title: updatedHero.title,
          location: updatedHero.location,
          photographer: updatedHero.photographer,
          year: updatedHero.year,
          alignment: updatedHero.alignment || 'bottom-left'
        }).eq('id', heroId);
      } catch (err) {
        console.error('Failed to update hero photo in Supabase:', err);
      }
    }
  };

  const deleteHeroPhoto = async (index: number) => {
    const target = heroPhotos[index];
    setHeroPhotos(prev => prev.filter((_, i) => i !== index));

    if (isLiveSupabase && supabase && target?.id) {
      try {
        await supabase.from('hero_photos').delete().eq('id', target.id);
      } catch (err) {
        console.error('Failed to delete hero photo in Supabase:', err);
      }
    }
  };

  const addPhoto = async (newPhoto: Omit<Photo, 'id'>) => {
    const id = 'p_' + Date.now();
    const created: Photo = { ...newPhoto, id };
    setPhotos(prev => [created, ...prev]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('photos').insert({
          id: created.id,
          title: created.title,
          url: created.url,
          photographer: created.photographer,
          photographer_id: created.photographerId || null,
          location: created.location,
          year: created.year,
          date: created.date || null,
          category: created.category,
          caption: created.caption || null,
          camera_info: created.cameraInfo || {},
          series: created.series || null,
          aspect_ratio: created.aspectRatio || 'landscape',
          featured: created.featured || false
        });
      } catch (err) {
        console.error('Failed to insert photo in Supabase:', err);
      }
    }
  };

  const updatePhoto = async (id: string, updatedFields: Partial<Photo>) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));

    if (isLiveSupabase && supabase) {
      try {
        const payload: Record<string, any> = {};
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.url !== undefined) payload.url = updatedFields.url;
        if (updatedFields.photographer !== undefined) payload.photographer = updatedFields.photographer;
        if (updatedFields.photographerId !== undefined) payload.photographer_id = updatedFields.photographerId || null;
        if (updatedFields.location !== undefined) payload.location = updatedFields.location;
        if (updatedFields.year !== undefined) payload.year = updatedFields.year;
        if (updatedFields.date !== undefined) payload.date = updatedFields.date || null;
        if (updatedFields.category !== undefined) payload.category = updatedFields.category;
        if (updatedFields.caption !== undefined) payload.caption = updatedFields.caption || null;
        if (updatedFields.cameraInfo !== undefined) payload.camera_info = updatedFields.cameraInfo || {};
        if (updatedFields.series !== undefined) payload.series = updatedFields.series || null;
        if (updatedFields.aspectRatio !== undefined) payload.aspect_ratio = updatedFields.aspectRatio || 'landscape';
        if (updatedFields.featured !== undefined) payload.featured = updatedFields.featured;

        await supabase.from('photos').update(payload).eq('id', id);
      } catch (err) {
        console.error('Failed to update photo in Supabase:', err);
      }
    }
  };

  const deletePhoto = async (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('photos').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete photo in Supabase:', err);
      }
    }
  };

  const addStory = async (newStory: Omit<PhotoStory, 'id'>) => {
    const id = 's_' + Date.now();
    const created: PhotoStory = { ...newStory, id };
    setStories(prev => [created, ...prev]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('stories').insert({
          id: created.id,
          slug: created.slug,
          title: created.title,
          subtitle: created.subtitle || null,
          photographer: created.photographer,
          photographer_id: created.photographerId || null,
          photographer_avatar: created.photographerAvatar || null,
          location: created.location,
          year: created.year,
          date: created.date,
          category: created.category,
          cover_image: created.coverImage,
          summary: created.summary || null,
          content: created.content || [],
          photos: created.photos || [],
          pull_quote: created.pullQuote || null
        });
      } catch (err) {
        console.error('Failed to insert story in Supabase:', err);
      }
    }
  };

  const updateStory = async (id: string, updatedFields: Partial<PhotoStory>) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));

    if (isLiveSupabase && supabase) {
      try {
        const payload: Record<string, any> = {};
        if (updatedFields.slug !== undefined) payload.slug = updatedFields.slug;
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.subtitle !== undefined) payload.subtitle = updatedFields.subtitle || null;
        if (updatedFields.photographer !== undefined) payload.photographer = updatedFields.photographer;
        if (updatedFields.photographerId !== undefined) payload.photographer_id = updatedFields.photographerId || null;
        if (updatedFields.photographerAvatar !== undefined) payload.photographer_avatar = updatedFields.photographerAvatar || null;
        if (updatedFields.location !== undefined) payload.location = updatedFields.location;
        if (updatedFields.year !== undefined) payload.year = updatedFields.year;
        if (updatedFields.date !== undefined) payload.date = updatedFields.date;
        if (updatedFields.category !== undefined) payload.category = updatedFields.category;
        if (updatedFields.coverImage !== undefined) payload.cover_image = updatedFields.coverImage;
        if (updatedFields.summary !== undefined) payload.summary = updatedFields.summary || null;
        if (updatedFields.content !== undefined) payload.content = updatedFields.content;
        if (updatedFields.photos !== undefined) payload.photos = updatedFields.photos;
        if (updatedFields.pullQuote !== undefined) payload.pull_quote = updatedFields.pullQuote || null;

        await supabase.from('stories').update(payload).eq('id', id);
      } catch (err) {
        console.error('Failed to update story in Supabase:', err);
      }
    }
  };

  const deleteStory = async (id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('stories').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete story in Supabase:', err);
      }
    }
  };

  const addPhotowalk = async (newWalk: Omit<Photowalk, 'id'>) => {
    const id = 'pw_' + Date.now();
    const created: Photowalk = { ...newWalk, id };
    setPhotowalks(prev => [created, ...prev]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('photowalks').insert({
          id: created.id,
          slug: created.slug,
          title: created.title,
          edition: created.edition,
          date: created.date,
          time: created.time || null,
          location: created.location,
          meeting_point: created.meetingPoint || null,
          description: created.description || null,
          status: created.status || 'upcoming',
          participants_count: created.participantsCount || 0,
          cover_image: created.coverImage,
          photographers: created.photographers || [],
          route_highlights: created.routeHighlights || [],
          photos: created.photos || [],
          registration_url: created.registrationUrl || null
        });
      } catch (err) {
        console.error('Failed to insert photowalk in Supabase:', err);
      }
    }
  };

  const updatePhotowalk = async (id: string, updatedFields: Partial<Photowalk>) => {
    setPhotowalks(prev => prev.map(w => w.id === id ? { ...w, ...updatedFields } : w));

    if (isLiveSupabase && supabase) {
      try {
        const payload: Record<string, any> = {};
        if (updatedFields.slug !== undefined) payload.slug = updatedFields.slug;
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.edition !== undefined) payload.edition = updatedFields.edition;
        if (updatedFields.date !== undefined) payload.date = updatedFields.date;
        if (updatedFields.time !== undefined) payload.time = updatedFields.time || null;
        if (updatedFields.location !== undefined) payload.location = updatedFields.location;
        if (updatedFields.meetingPoint !== undefined) payload.meeting_point = updatedFields.meetingPoint || null;
        if (updatedFields.description !== undefined) payload.description = updatedFields.description || null;
        if (updatedFields.status !== undefined) payload.status = updatedFields.status;
        if (updatedFields.participantsCount !== undefined) payload.participants_count = updatedFields.participantsCount;
        if (updatedFields.coverImage !== undefined) payload.cover_image = updatedFields.coverImage;
        if (updatedFields.photographers !== undefined) payload.photographers = updatedFields.photographers;
        if (updatedFields.routeHighlights !== undefined) payload.route_highlights = updatedFields.routeHighlights;
        if (updatedFields.photos !== undefined) payload.photos = updatedFields.photos;
        if (updatedFields.registrationUrl !== undefined) payload.registration_url = updatedFields.registrationUrl || null;

        await supabase.from('photowalks').update(payload).eq('id', id);
      } catch (err) {
        console.error('Failed to update photowalk in Supabase:', err);
      }
    }
  };

  const deletePhotowalk = async (id: string) => {
    setPhotowalks(prev => prev.filter(w => w.id !== id));
    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('photowalks').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete photowalk in Supabase:', err);
      }
    }
  };

  const addExhibition = async (newEx: Omit<Exhibition, 'id'>) => {
    const id = 'ex_' + Date.now();
    const created: Exhibition = { ...newEx, id };
    setExhibitions(prev => [created, ...prev]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('exhibitions').insert({
          id: created.id,
          slug: created.slug,
          title: created.title,
          edition: created.edition || null,
          dates: created.dates,
          venue: created.venue || null,
          location: created.location,
          status: created.status || 'archived',
          curator_statement: created.curatorStatement || null,
          description: created.description || null,
          participating_photographers: created.participatingPhotographers || [],
          cover_image: created.coverImage,
          exhibition_photos: created.exhibitionPhotos || []
        });
      } catch (err) {
        console.error('Failed to insert exhibition in Supabase:', err);
      }
    }
  };

  const updateExhibition = async (id: string, updatedFields: Partial<Exhibition>) => {
    setExhibitions(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));

    if (isLiveSupabase && supabase) {
      try {
        const payload: Record<string, any> = {};
        if (updatedFields.slug !== undefined) payload.slug = updatedFields.slug;
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.edition !== undefined) payload.edition = updatedFields.edition || null;
        if (updatedFields.dates !== undefined) payload.dates = updatedFields.dates;
        if (updatedFields.venue !== undefined) payload.venue = updatedFields.venue || null;
        if (updatedFields.location !== undefined) payload.location = updatedFields.location;
        if (updatedFields.status !== undefined) payload.status = updatedFields.status;
        if (updatedFields.curatorStatement !== undefined) payload.curator_statement = updatedFields.curatorStatement || null;
        if (updatedFields.description !== undefined) payload.description = updatedFields.description || null;
        if (updatedFields.participatingPhotographers !== undefined) payload.participating_photographers = updatedFields.participatingPhotographers;
        if (updatedFields.coverImage !== undefined) payload.cover_image = updatedFields.coverImage;
        if (updatedFields.exhibitionPhotos !== undefined) payload.exhibition_photos = updatedFields.exhibitionPhotos;

        await supabase.from('exhibitions').update(payload).eq('id', id);
      } catch (err) {
        console.error('Failed to update exhibition in Supabase:', err);
      }
    }
  };

  const deleteExhibition = async (id: string) => {
    setExhibitions(prev => prev.filter(e => e.id !== id));
    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('exhibitions').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete exhibition in Supabase:', err);
      }
    }
  };

  const addMagazine = async (newMag: Omit<MagazineIssue, 'id'>) => {
    const id = 'm_' + Date.now();
    const created: MagazineIssue = { ...newMag, id };
    setMagazines(prev => [created, ...prev]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('magazines').insert({
          id: created.id,
          issue_number: created.issueNumber,
          title: created.title,
          year: created.year,
          publish_date: created.publishDate || null,
          theme: created.theme || null,
          cover_image: created.coverImage,
          editors_note: created.editorsNote || null,
          contributors: created.contributors || [],
          featured_photographers: created.featuredPhotographers || [],
          pages: created.pages || [],
          pdf_download_url: created.pdfDownloadUrl || null
        });
      } catch (err) {
        console.error('Failed to insert magazine in Supabase:', err);
      }
    }
  };

  const updateMagazine = async (id: string, updatedFields: Partial<MagazineIssue>) => {
    setMagazines(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));

    if (isLiveSupabase && supabase) {
      try {
        const payload: Record<string, any> = {};
        if (updatedFields.issueNumber !== undefined) payload.issue_number = updatedFields.issueNumber;
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.year !== undefined) payload.year = updatedFields.year;
        if (updatedFields.publishDate !== undefined) payload.publish_date = updatedFields.publishDate || null;
        if (updatedFields.theme !== undefined) payload.theme = updatedFields.theme || null;
        if (updatedFields.coverImage !== undefined) payload.cover_image = updatedFields.coverImage;
        if (updatedFields.editorsNote !== undefined) payload.editors_note = updatedFields.editorsNote || null;
        if (updatedFields.contributors !== undefined) payload.contributors = updatedFields.contributors;
        if (updatedFields.featuredPhotographers !== undefined) payload.featured_photographers = updatedFields.featuredPhotographers;
        if (updatedFields.pages !== undefined) payload.pages = updatedFields.pages;
        if (updatedFields.pdfDownloadUrl !== undefined) payload.pdf_download_url = updatedFields.pdfDownloadUrl || null;

        await supabase.from('magazines').update(payload).eq('id', id);
      } catch (err) {
        console.error('Failed to update magazine in Supabase:', err);
      }
    }
  };

  const deleteMagazine = async (id: string) => {
    setMagazines(prev => prev.filter(m => m.id !== id));
    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('magazines').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete magazine in Supabase:', err);
      }
    }
  };

  const addTeamMember = async (newMember: Omit<TeamMember, 'id'>) => {
    const id = 'tm_' + Date.now();
    const created: TeamMember = { ...newMember, id };
    setTeamMembers(prev => [...prev, created]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('team_members').insert({
          id: created.id,
          name: created.name,
          role: created.role,
          type: created.type,
          photography_specialization: created.photographySpecialization || null,
          bio: created.bio || null,
          photo_url: created.photoUrl || null,
          socials: created.socials || {}
        });
      } catch (err) {
        console.error('Failed to insert team member in Supabase:', err);
      }
    }
  };

  const updateTeamMember = async (id: string, updatedFields: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));

    if (isLiveSupabase && supabase) {
      try {
        const updatePayload: Record<string, any> = {};
        if (updatedFields.name !== undefined) updatePayload.name = updatedFields.name;
        if (updatedFields.role !== undefined) updatePayload.role = updatedFields.role;
        if (updatedFields.type !== undefined) updatePayload.type = updatedFields.type;
        if (updatedFields.photographySpecialization !== undefined) updatePayload.photography_specialization = updatedFields.photographySpecialization;
        if (updatedFields.bio !== undefined) updatePayload.bio = updatedFields.bio;
        if (updatedFields.photoUrl !== undefined) updatePayload.photo_url = updatedFields.photoUrl;
        if (updatedFields.socials !== undefined) updatePayload.socials = updatedFields.socials;

        await supabase.from('team_members').update(updatePayload).eq('id', id);
      } catch (err) {
        console.error('Failed to update team member in Supabase:', err);
      }
    }
  };

  const deleteTeamMember = async (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('team_members').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete team member in Supabase:', err);
      }
    }
  };

  const addPhotographer = async (newPhotographer: Omit<Photographer, 'id'>) => {
    const id = 'ph_' + Date.now();
    const created: Photographer = { ...newPhotographer, id };
    setPhotographers(prev => [...prev, created]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('photographers').insert({
          id: created.id,
          name: created.name,
          location: created.location || null,
          genres: created.genres || [],
          portrait_url: created.portraitUrl || null,
          bio: created.bio || null,
          instagram: created.instagram || null,
          portfolio_url: created.portfolioUrl || null,
          selected_photos: created.selectedPhotos || [],
          featured_stories_count: created.featuredStoriesCount || 1,
          exhibitions_count: created.exhibitionsCount || 1,
          role_in_community: created.roleInCommunity || null
        });
      } catch (err) {
        console.error('Failed to insert photographer in Supabase:', err);
      }
    }
  };

  const updatePhotographer = async (id: string, updatedFields: Partial<Photographer>) => {
    setPhotographers(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));

    if (isLiveSupabase && supabase) {
      try {
        const updatePayload: Record<string, any> = {};
        if (updatedFields.name !== undefined) updatePayload.name = updatedFields.name;
        if (updatedFields.location !== undefined) updatePayload.location = updatedFields.location;
        if (updatedFields.genres !== undefined) updatePayload.genres = updatedFields.genres;
        if (updatedFields.portraitUrl !== undefined) updatePayload.portrait_url = updatedFields.portraitUrl;
        if (updatedFields.bio !== undefined) updatePayload.bio = updatedFields.bio;
        if (updatedFields.instagram !== undefined) updatePayload.instagram = updatedFields.instagram;
        if (updatedFields.portfolioUrl !== undefined) updatePayload.portfolio_url = updatedFields.portfolioUrl;
        if (updatedFields.selectedPhotos !== undefined) updatePayload.selected_photos = updatedFields.selectedPhotos;
        if (updatedFields.featuredStoriesCount !== undefined) updatePayload.featured_stories_count = updatedFields.featuredStoriesCount;
        if (updatedFields.exhibitionsCount !== undefined) updatePayload.exhibitions_count = updatedFields.exhibitionsCount;
        if (updatedFields.roleInCommunity !== undefined) updatePayload.role_in_community = updatedFields.roleInCommunity;

        await supabase.from('photographers').update(updatePayload).eq('id', id);
      } catch (err) {
        console.error('Failed to update photographer in Supabase:', err);
      }
    }
  };

  const deletePhotographer = async (id: string) => {
    setPhotographers(prev => prev.filter(p => p.id !== id));

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('photographers').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete photographer in Supabase:', err);
      }
    }
  };

  const exportArchiveJSON = (): string => {
    const data = {
      teamMembers,
      photographers,
      photos,
      stories,
      photowalks,
      exhibitions,
      magazines
    };
    return JSON.stringify(data, null, 2);
  };

  const importArchiveJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.teamMembers && Array.isArray(parsed.teamMembers)) setTeamMembers(parsed.teamMembers);
      if (parsed.photographers && Array.isArray(parsed.photographers)) setPhotographers(parsed.photographers);
      if (parsed.photos && Array.isArray(parsed.photos)) setPhotos(parsed.photos);
      if (parsed.stories && Array.isArray(parsed.stories)) setStories(parsed.stories);
      if (parsed.photowalks && Array.isArray(parsed.photowalks)) setPhotowalks(parsed.photowalks);
      if (parsed.exhibitions && Array.isArray(parsed.exhibitions)) setExhibitions(parsed.exhibitions);
      if (parsed.magazines && Array.isArray(parsed.magazines)) setMagazines(parsed.magazines);
      return true;
    } catch (e) {
      console.error('Failed to parse archive JSON:', e);
      return false;
    }
  };

  const resetData = () => {
    localStorage.removeItem('sot_photos');
    localStorage.removeItem('sot_stories');
    localStorage.removeItem('sot_photowalks');
    localStorage.removeItem('sot_exhibitions_v3');
    localStorage.removeItem('sot_magazines_v2');
    localStorage.removeItem('sot_team_v5');
    localStorage.removeItem('sot_photographers');
    localStorage.removeItem('sot_real_events_v7');
    setPhotos(INITIAL_PHOTOS);
    setStories(INITIAL_STORIES);
    setPhotowalks(INITIAL_PHOTOWALKS);
    setExhibitions(INITIAL_EXHIBITIONS);
    setMagazines(INITIAL_MAGAZINES);
    setTeamMembers(INITIAL_TEAM);
    setPhotographers(INITIAL_PHOTOGRAPHERS);
  };

  return (
    <DataContext.Provider
      value={{
        photos,
        heroPhotos,
        addHeroPhoto,
        updateHeroPhoto,
        deleteHeroPhoto,
        stories,
        photowalks,
        exhibitions,
        competitions,
        communityEvents,
        events,
        magazines,
        collaborations,
        photographers,
        teamMembers,
        timeline,
        press,
        isLiveSupabase,
        isLoading,
        activePhoto,
        setActivePhoto,
        nextPhoto,
        prevPhoto,
        isSearchOpen,
        setIsSearchOpen,
        isAdminOpen,
        setIsAdminOpen,
        addPhoto,
        updatePhoto,
        deletePhoto,
        addStory,
        updateStory,
        deleteStory,
        addPhotowalk,
        updatePhotowalk,
        deletePhotowalk,
        addExhibition,
        updateExhibition,
        deleteExhibition,
        addMagazine,
        updateMagazine,
        deleteMagazine,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addPhotographer,
        updatePhotographer,
        deletePhotographer,
        exportArchiveJSON,
        importArchiveJSON,
        resetData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
