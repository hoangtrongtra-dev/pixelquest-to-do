export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface UserStats {
  xp: number;
  level: number;
  xpToNextLevel: number;
}

export interface PixelPetConfig {
  name: string;
  color: string; // e.g., a hex code or Tailwind color class
  accessory?: string; // e.g., 'hat', 'glasses' - for future expansion
}

export const PET_COLORS = [
  { name: 'Blue', value: 'bg-blue-400' },
  { name: 'Green', value: 'bg-green-400' },
  { name: 'Red', value: 'bg-red-400' },
  { name: 'Purple', value: 'bg-purple-400' },
  { name: 'Yellow', value: 'bg-yellow-400' },
];
