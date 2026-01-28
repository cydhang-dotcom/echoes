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

export const MOCK_SEEDS: Seed[] = [
  {
    id: '1',
    authorId: 'user_a',
    location: { latitude: 0.0001, longitude: 0.0001 }, // Very close
    mood: MoodType.SADNESS,
    text: "雨停了，水坑里倒映着灰色的天空。",
    hasAudio: true,
    timestamp: Date.now() - 3600000,
    resonates: 3,
  },
  {
    id: '2',
    authorId: 'user_b',
    location: { latitude: -0.0002, longitude: 0.0002 }, // Close
    mood: MoodType.JOY,
    text: "在旧图书馆附近发现了一株四叶草，夹在书里了。",
    hasAudio: false,
    timestamp: Date.now() - 7200000,
    resonates: 12,
  },
  {
    id: '3',
    authorId: 'user_c',
    location: { latitude: 0.001, longitude: -0.001 }, // Farther
    mood: MoodType.ANGER,
    text: "为什么我们总是这么匆忙？我错过了今天的日落。",
    hasAudio: true,
    timestamp: Date.now() - 86400000,
    resonates: 0,
  }
];

// Threshold in meters to "Gather" a seed
export const GATHER_DISTANCE_METERS = 50;