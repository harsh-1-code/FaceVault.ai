export interface AdminEvent {
  id: string;
  name: string;
  type: 'wedding' | 'corporate' | 'college' | 'conference' | 'alumni';
  date: string;
  location: string;
  photosUploaded: number;
  facesDetected: number;
  facesEncoded: number;
  matchesDelivered: number;
  registeredAttendees: number;
  status: 'processing' | 'complete' | 'queued' | 'failed' | 'partial';
  accuracy: number;
  uploadedBy: string;
  storageUsedMb: number;
}

export const adminEvents: AdminEvent[] = [
  {
    id: 'evt-001',
    name: 'Ananya & Rohan Wedding',
    type: 'wedding',
    date: '2026-04-12',
    location: 'Udaipur, Rajasthan',
    photosUploaded: 842,
    facesDetected: 3241,
    facesEncoded: 3241,
    matchesDelivered: 128,
    registeredAttendees: 67,
    status: 'complete',
    accuracy: 98.4,
    uploadedBy: 'Kiran Mehta',
    storageUsedMb: 4820,
  },
  {
    id: 'evt-002',
    name: 'TechFest 2026 — BITS Pilani',
    type: 'college',
    date: '2026-03-28',
    location: 'Pilani, Rajasthan',
    photosUploaded: 1240,
    facesDetected: 5890,
    facesEncoded: 5712,
    matchesDelivered: 312,
    registeredAttendees: 180,
    status: 'partial',
    accuracy: 94.7,
    uploadedBy: 'Priya Nair',
    storageUsedMb: 7200,
  },
  {
    id: 'evt-003',
    name: 'InnovateCorp Annual Meet',
    type: 'corporate',
    date: '2026-04-05',
    location: 'Bengaluru, Karnataka',
    photosUploaded: 380,
    facesDetected: 1420,
    facesEncoded: 1420,
    matchesDelivered: 89,
    registeredAttendees: 45,
    status: 'complete',
    accuracy: 99.1,
    uploadedBy: 'Amit Kulkarni',
    storageUsedMb: 2140,
  },
  {
    id: 'evt-004',
    name: 'Alumni Reunion — Class of 2016',
    type: 'alumni',
    date: '2026-02-18',
    location: 'Mumbai, Maharashtra',
    photosUploaded: 215,
    facesDetected: 890,
    facesEncoded: 890,
    matchesDelivered: 54,
    registeredAttendees: 38,
    status: 'complete',
    accuracy: 97.2,
    uploadedBy: 'Sneha Joshi',
    storageUsedMb: 1240,
  },
  {
    id: 'evt-005',
    name: 'StartupSummit India 2026',
    type: 'conference',
    date: '2026-04-20',
    location: 'Delhi, NCR',
    photosUploaded: 620,
    facesDetected: 0,
    facesEncoded: 0,
    matchesDelivered: 0,
    registeredAttendees: 230,
    status: 'processing',
    accuracy: 0,
    uploadedBy: 'Rahul Mehta',
    storageUsedMb: 3580,
  },
  {
    id: 'evt-006',
    name: 'Meera & Arjun Reception',
    type: 'wedding',
    date: '2026-04-25',
    location: 'Jaipur, Rajasthan',
    photosUploaded: 0,
    facesDetected: 0,
    facesEncoded: 0,
    matchesDelivered: 0,
    registeredAttendees: 90,
    status: 'queued',
    accuracy: 0,
    uploadedBy: 'Deepak Singh',
    storageUsedMb: 0,
  },
  {
    id: 'evt-007',
    name: 'MedTech Conference 2026',
    type: 'conference',
    date: '2026-04-10',
    location: 'Hyderabad, Telangana',
    photosUploaded: 180,
    facesDetected: 210,
    facesEncoded: 38,
    matchesDelivered: 0,
    registeredAttendees: 75,
    status: 'failed',
    accuracy: 0,
    uploadedBy: 'Kavya Reddy',
    storageUsedMb: 1020,
  },
  {
    id: 'evt-008',
    name: 'IIT Bombay Convocation 2026',
    type: 'college',
    date: '2026-04-28',
    location: 'Mumbai, Maharashtra',
    photosUploaded: 2100,
    facesDetected: 4200,
    facesEncoded: 4200,
    matchesDelivered: 0,
    registeredAttendees: 620,
    status: 'processing',
    accuracy: 0,
    uploadedBy: 'Admin System',
    storageUsedMb: 12400,
  },
];

export const encodingThroughputData = [
  { time: '00:00', encoded: 120, queued: 340 },
  { time: '02:00', encoded: 280, queued: 290 },
  { time: '04:00', encoded: 95, queued: 420 },
  { time: '06:00', encoded: 410, queued: 180 },
  { time: '08:00', encoded: 680, queued: 120 },
  { time: '10:00', encoded: 920, queued: 80 },
  { time: '12:00', encoded: 750, queued: 200 },
  { time: '14:00', encoded: 1100, queued: 95 },
  { time: '16:00', encoded: 880, queued: 310 },
  { time: '18:00', encoded: 640, queued: 420 },
  { time: '20:00', encoded: 380, queued: 580 },
  { time: '22:00', encoded: 220, queued: 640 },
];

export const matchesPerEventData = [
  { event: 'Wedding KL', matches: 128, photos: 842, rate: 15.2 },
  { event: 'TechFest', matches: 312, photos: 1240, rate: 25.2 },
  { event: 'Corp Meet', matches: 89, photos: 380, rate: 23.4 },
  { event: 'Alumni', matches: 54, photos: 215, rate: 25.1 },
  { event: 'Summit', matches: 0, photos: 620, rate: 0 },
  { event: 'IIT Conv', matches: 0, photos: 2100, rate: 0 },
];

export const accuracyRadialData = [
  { name: 'Accuracy', value: 97.2, fill: '#7C3AED' },
];