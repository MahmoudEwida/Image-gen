
import { StyleOption } from './types';

export const ASPECT_RATIOS: StyleOption[] = [
  { id: '1:1', label: 'Square' },
  { id: '16:9', label: 'Widescreen' },
  { id: '9:16', label: 'Vertical' },
  { id: '4:3', label: 'Standard' },
  { id: '3:2', label: 'Classic' },
];

export const LIGHTING_STYLES: StyleOption[] = [
  { id: 'soft studio lighting', label: 'Soft Studio' },
  { id: 'dramatic side lighting', label: 'Dramatic' },
  { id: 'natural sunlight', label: 'Natural Light' },
  { id: 'neon ambient glow', label: 'Neon Glow' },
  { id: 'cinematic moody lighting', label: 'Cinematic' },
];

export const CAMERA_PERSPECTIVES: StyleOption[] = [
  { id: 'front-on eye-level shot', label: 'Eye-Level' },
  { id: 'high-angle shot', label: 'High Angle' },
  { id: 'low-angle shot', label: 'Low Angle' },
  { id: 'dutch angle shot', label: 'Dutch Angle' },
  { id: 'macro close-up shot', label: 'Macro' },
];
