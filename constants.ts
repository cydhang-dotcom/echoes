import { MoodType, Seed } from './types';

export const COLORS = {
  CANVAS: '#F9F7F2',
  PRIMARY: '#5D8572',
  TEXT: '#4A4A4A',
  MOOD: {
    [MoodType.JOY]: '#E6C79C',     // 枯叶黄
    [MoodType.SADNESS]: '#A3Bebb', // 雾霾蓝
    [MoodType.ANGER]: '#D4A5A5',   // 干玫瑰红
    [MoodType.CALM]: '#B0C4B1',    // 鼠尾草绿
  }
};

// 上海双子山坐标 (模拟中心点)
// 31.1850° N, 121.4890° E
export const DEFAULT_LOCATION = { latitude: 31.1850, longitude: 121.4890 };

// Threshold in meters to "Gather" a seed (Interactable)
export const GATHER_DISTANCE_METERS = 5;

// Threshold in meters to "See" a seed (Visual only)
export const VISIBILITY_DISTANCE_METERS = 50;

// Helper to generate offset coordinates
const offset = (lat: number, lon: number, metersLat: number, metersLon: number) => {
  // Approx: 1 deg lat = 111,000m, 1 deg lon = 96,000m (at 31 deg lat)
  const dLat = metersLat / 111000;
  const dLon = metersLon / 96000;
  return { latitude: lat + dLat, longitude: lon + dLon };
};

export const MOCK_SEEDS: Seed[] = [
  // 1. 非常近，可交互 (< 3m)
  {
    id: '1',
    authorId: 'nearby_soul',
    location: offset(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, 2, 1),
    mood: MoodType.JOY,
    text: "师父我爱你",
    hasAudio: false,
    timestamp: Date.now() - 60000,
    resonates: 12,
  },
  // 2. 稍远，可见但不可交互 (~15m)
  {
    id: '2',
    authorId: 'walker_1',
    location: offset(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, 12, -8),
    mood: MoodType.SADNESS,
    text: "有些事情，走着走着就忘了。",
    hasAudio: true,
    timestamp: Date.now() - 120000,
    resonates: 5,
  },
  // 3. 边缘可见 (~35m)
  {
    id: '3',
    authorId: 'walker_2',
    location: offset(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, -30, 15),
    mood: MoodType.CALM,
    text: "在这里埋下一个秘密。",
    hasAudio: false,
    timestamp: Date.now() - 300000,
    resonates: 0,
  },
  // 4. 边缘可见 (~45m)
  {
    id: '4',
    authorId: 'walker_3',
    location: offset(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, 40, 20),
    mood: MoodType.ANGER,
    text: "呼...",
    hasAudio: false,
    timestamp: Date.now() - 500000,
    resonates: 1,
  },
   // 5. 远方不可见 (> 60m)
   {
    id: '5',
    authorId: 'walker_far',
    location: offset(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, 60, 60),
    mood: MoodType.JOY,
    text: "远方的回响",
    hasAudio: false,
    timestamp: Date.now() - 600000,
    resonates: 0,
  }
];
