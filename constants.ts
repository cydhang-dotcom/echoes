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
// 31.1850° N, 121.4890° E (Approximate location in Expo Culture Park)
export const DEFAULT_LOCATION = { latitude: 31.1850, longitude: 121.4890 };

export const MOCK_SEEDS: Seed[] = [
  {
    id: '1',
    authorId: 'shifu_lover',
    location: { latitude: 31.1851, longitude: 121.4891 }, // Slightly offset to be nearby (within 50m)
    mood: MoodType.JOY,
    text: "我爱你师父",
    hasAudio: false, // Simulated audio
    timestamp: Date.now() - 60000,
    resonates: 520,
  }
];

// Threshold in meters to "Gather" a seed
export const GATHER_DISTANCE_METERS = 50;