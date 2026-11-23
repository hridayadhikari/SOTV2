export type PhotoCategory = 'Street' | 'Documentary' | 'Culture' | 'People' | 'Landscape' | 'Travel' | 'Events';

export interface HeroPhoto {
  id?: string;
  url: string;
  title: string;
  location: string;
  photographer: string;
  year: string;
  alignment: 'left' | 'right' | 'bottom-left' | 'bottom-right';
}

export interface Photo {
  id: string;
  title: string;
  url: string;
  photographer: string;
  photographerId?: string;
  location: string;
  year: string;
  date?: string;
  category: PhotoCategory;
  caption: string;
  cameraInfo?: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    iso?: string;
    shutterSpeed?: string;
  };
  series?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  featured?: boolean;
}

export interface PhotoStory {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  photographer: string;
  photographerId: string;
  photographerAvatar?: string;
  location: string;
  year: string;
  date: string;
  category: PhotoCategory;
  coverImage: string;
  summary: string;
  content: string[]; // Editorial paragraphs
  photos: {
    url: string;
    caption: string;
    aspectRatio?: 'portrait' | 'landscape' | 'square';
  }[];
  pullQuote?: string;
}

export interface Photowalk {
  id: string;
  slug: string;
  title: string;
  edition: string;
  date: string;
  time: string;
  location: string;
  meetingPoint: string;
  description: string;
  status: 'upcoming' | 'completed';
  participantsCount: number;
  coverImage: string;
  photographers: string[];
  routeHighlights: string[];
  photos: {
    url: string;
    caption: string;
    photographer: string;
  }[];
  registrationUrl?: string;
}

export interface Exhibition {
  id: string;
  slug: string;
  title: string;
  edition: string;
  dates: string;
  venue: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'archived';
  curatorStatement: string;
  description: string;
  participatingPhotographers: string[];
  guestsAndDignitaries?: string[];
  collaborators?: string[];
  sponsors?: string[];
  coverImage: string;
  posterUrl?: string;
  exhibitionPhotos: {
    url: string;
    caption: string;
    photographer: string;
  }[];
  btsPhotos?: {
    url: string;
    caption: string;
  }[];
  visitorCount?: string;
  pressMentionsCount?: number;
}

export interface Competition {
  id: string;
  slug: string;
  title: string;
  edition: string;
  theme: string;
  status: 'open' | 'judging' | 'completed' | 'upcoming';
  category: string;
  deadline: string;
  announcementDate?: string;
  coverImage: string;
  description: string;
  eligibility: string;
  entryFee: string;
  prizes: {
    rank: string;
    reward: string;
    details?: string;
  }[];
  guidelines: string[];
  juryMembers?: string[];
  winners?: {
    rank: string;
    photographer: string;
    photoTitle: string;
    photoUrl: string;
    location?: string;
  }[];
  submissionUrl?: string;
}

export interface CommunityEvent {
  id: string;
  slug: string;
  title: string;
  category: 'workshop' | 'talk' | 'review' | 'meetup' | 'screening';
  date: string;
  time: string;
  venue: string;
  location: string;
  status: 'upcoming' | 'completed';
  coverImage: string;
  description: string;
  mentorOrSpeaker?: string;
  capacity?: string;
  registrationUrl?: string;
  highlights?: string[];
}

export interface MagazineIssue {
  id: string;
  issueNumber: string; // e.g. "ISSUE 04"
  title: string;
  year: string;
  publishDate: string;
  theme: string;
  coverImage: string;
  editorsNote: string;
  contributors: string[];
  featuredPhotographers: string[];
  pages: {
    pageNumber: number;
    title: string;
    photographer?: string;
    imageUrl: string;
    caption?: string;
    text?: string;
    type: 'cover' | 'photo-essay' | 'interview' | 'portfolio' | 'text';
  }[];
  pdfDownloadUrl?: string;
}

export interface Collaboration {
  id: string;
  slug: string;
  partnerName: string;
  partnerLogo?: string;
  projectName: string;
  year: string;
  coverImage: string;
  summary: string;
  fullStory: string;
  outcome: string;
  photos: {
    url: string;
    caption: string;
  }[];
}

export interface Photographer {
  id: string;
  name: string;
  location: string;
  genres: PhotoCategory[];
  portraitUrl: string;
  bio: string;
  instagram?: string;
  portfolioUrl?: string;
  selectedPhotos: string[]; // Photo IDs or image URLs
  featuredStoriesCount: number;
  exhibitionsCount: number;
  roleInCommunity?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: 'core' | 'advisory';
  photographySpecialization: string;
  bio: string;
  photoUrl: string;
  socials?: {
    instagram?: string;
    website?: string;
  };
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  caption?: string;
}

export type EventCategory =
  | 'Photography & Art Exhibitions'
  | 'Photography Exhibition (Collaboration)'
  | 'Anniversary Celebrations + Photography Competition'
  | 'Partnerships & Competitions';

export interface SiteEvent {
  id: string;
  slug: string;
  title: string;
  type?: string;
  category: EventCategory;
  dates: string;
  time?: string;
  description: string;
  location?: string;
  venue?: string;
  status?: 'upcoming' | 'ongoing' | 'archived' | 'completed' | 'open';
  coverImage?: string;
  organizedBy?: string;
  inCollaborationWith?: string;
  highlights?: string[];
  mentors?: { name: string; role: string }[];
  specialGuests?: string[];
  workshopInfo?: string;
  contestInfo?: string;
  guests?: string[];
  theme?: string;
  format?: string;
  winnerAnnouncement?: string;
  prizePool?: string;
  sponsor?: string;
  inMemoryOf?: string[];
  competitionCategories?: string[];
  occasion?: string;
  winners?: { rank: string; name: string; section?: string }[];
}

export interface PressItem {
  id: string;
  publication: string;
  headline: string;
  date: string;
  summary: string;
  url?: string;
  type: 'print' | 'digital' | 'tv';
}

