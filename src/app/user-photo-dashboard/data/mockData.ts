export interface Photo {
  id: string;
  eventId: string;
  eventName: string;
  src: string;
  alt: string;
  capturedAt: string;
  confidence: number;
  photographer: string;
  matchType: 'primary' | 'group' | 'background';
  downloaded: boolean;
  width: number;
  height: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  type: 'wedding' | 'corporate' | 'college' | 'conference' | 'alumni';
  location: string;
}

export const mockEvents: Event[] = [
  { id: 'evt-001', name: 'Ananya & Rohan Wedding', date: '2026-04-12', type: 'wedding', location: 'Udaipur, Rajasthan' },
  { id: 'evt-002', name: 'TechFest 2026 — BITS Pilani', date: '2026-03-28', type: 'college', location: 'Pilani, Rajasthan' },
  { id: 'evt-003', name: 'InnovateCorp Annual Meet', date: '2026-04-05', type: 'corporate', location: 'Bengaluru, Karnataka' },
  { id: 'evt-004', name: 'Alumni Reunion — Class of 2016', date: '2026-02-18', type: 'alumni', location: 'Mumbai, Maharashtra' },
];

const photoSeeds = [
  { eventId: 'evt-001', confidence: 97.4, matchType: 'primary' as const, photographer: 'Kiran Mehta Photography', w: 1200, h: 800 },
  { eventId: 'evt-001', confidence: 94.1, matchType: 'group' as const, photographer: 'Kiran Mehta Photography', w: 1200, h: 900 },
  { eventId: 'evt-001', confidence: 98.8, matchType: 'primary' as const, photographer: 'Kiran Mehta Photography', w: 800, h: 1200 },
  { eventId: 'evt-001', confidence: 91.3, matchType: 'group' as const, photographer: 'Kiran Mehta Photography', w: 1200, h: 800 },
  { eventId: 'evt-002', confidence: 96.2, matchType: 'primary' as const, photographer: 'Campus Clicks Official', w: 1200, h: 800 },
  { eventId: 'evt-002', confidence: 88.7, matchType: 'group' as const, photographer: 'Campus Clicks Official', w: 1600, h: 900 },
  { eventId: 'evt-002', confidence: 93.5, matchType: 'primary' as const, photographer: 'Campus Clicks Official', w: 800, h: 1200 },
  { eventId: 'evt-003', confidence: 99.1, matchType: 'primary' as const, photographer: 'Corporate Lens Studio', w: 1200, h: 800 },
  { eventId: 'evt-003', confidence: 87.4, matchType: 'background' as const, photographer: 'Corporate Lens Studio', w: 1920, h: 1080 },
  { eventId: 'evt-003', confidence: 95.6, matchType: 'group' as const, photographer: 'Corporate Lens Studio', w: 1200, h: 800 },
  { eventId: 'evt-004', confidence: 92.0, matchType: 'primary' as const, photographer: 'Nostalgia Frames', w: 800, h: 1200 },
  { eventId: 'evt-004', confidence: 89.3, matchType: 'group' as const, photographer: 'Nostalgia Frames', w: 1200, h: 800 },
];

const imageUrls = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
  'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
];

const imageAlts = [
  'Bride and groom sharing first dance in elegant ballroom with string lights overhead',
  'Large wedding party group photo on marble staircase in golden evening light',
  'Close-up portrait of bride in white saree with floral jewelry',
  'Wedding guests dancing in circle on outdoor terrace at sunset',
  'College students celebrating at tech fest stage with colorful confetti',
  'Panel discussion on stage at college tech event with banner backdrop',
  'Student presenting project at exhibition booth with laptop display',
  'Corporate team photo in modern office boardroom with city view',
  'Conference keynote speaker addressing large audience in auditorium',
  'Team building activity with colleagues in casual outdoor setting',
  'Alumni group reunion selfie outdoors in university campus courtyard',
  'Formal alumni dinner gathering at hotel banquet hall with centerpieces',
];

const dates = [
  '2026-04-12T14:32:00', '2026-04-12T15:18:00', '2026-04-12T17:45:00', '2026-04-12T19:22:00',
  '2026-03-28T10:15:00', '2026-03-28T13:40:00', '2026-03-28T16:00:00',
  '2026-04-05T09:30:00', '2026-04-05T11:20:00', '2026-04-05T14:55:00',
  '2026-02-18T12:00:00', '2026-02-18T18:30:00',
];

export const mockPhotos: Photo[] = photoSeeds.map((seed, i) => ({
  id: `photo-${String(i + 1).padStart(3, '0')}`,
  eventId: seed.eventId,
  eventName: mockEvents.find(e => e.id === seed.eventId)!.name,
  src: imageUrls[i],
  alt: imageAlts[i],
  capturedAt: dates[i],
  confidence: seed.confidence,
  photographer: seed.photographer,
  matchType: seed.matchType,
  downloaded: i < 3,
  width: seed.w,
  height: seed.h,
}));