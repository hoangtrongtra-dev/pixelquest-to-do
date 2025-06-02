'use client';

import type { PixelPetConfig } from '@/lib/types';
import { PET_COLORS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Paintbrush } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PixelPetProps {
  petConfig: PixelPetConfig;
  onUpdatePetColor: (color: string) => void;
}

const petPixelGrid = [
  [0,1,1,0],
  [1,1,1,1],
  [1,0,0,1], // Eyes
  [0,1,1,0]
];


export function PixelPet({ petConfig, onUpdatePetColor }: PixelPetProps) {
  return (
    <Card className="!rounded-none border-2 border-foreground shadow-pixel">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-2xl text-center flex items-center justify-center gap-2 uppercase">
          <Paintbrush className="w-6 h-6 text-primary" /> {petConfig.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Pixel Pet Display */}
        <div className="mb-4 p-2 border-2 border-muted bg-background inline-block">
          {petPixelGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((pixel, pixelIndex) => (
                <div
                  key={pixelIndex}
                  className={`w-5 h-5 ${pixel === 1 ? petConfig.color : 'bg-transparent'}`}
                  style={{ imageRendering: 'pixelated' }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        {/* Customization Controls */}
        <div className="w-full max-w-xs">
          <label htmlFor="pet-color-select" className="block text-sm font-medium text-foreground mb-1 font-body">Pet Color:</label>
          <Select value={petConfig.color} onValueChange={onUpdatePetColor}>
            <SelectTrigger id="pet-color-select" className="w-full !rounded-none border-2 border-foreground focus:border-primary shadow-pixel-sm">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent className="!rounded-none border-2 border-foreground bg-background font-body">
              {PET_COLORS.map((color) => (
                <SelectItem key={color.value} value={color.value} className="font-body !rounded-none focus:bg-accent">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 ${color.value} border border-foreground`}></div>
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center font-body">More customizations unlock as you level up!</p>

      </CardContent>
    </Card>
  );
}
