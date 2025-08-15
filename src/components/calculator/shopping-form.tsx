
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface ShoppingFormData {
  shoes: number;
  pants: number;
  tshirts: number;
  shirts: number;
  other_clothes: number;
  secondHandPercentage: number;
}

interface ShoppingFormProps {
  onUpdate: (data: ShoppingFormData) => void;
}

export default function ShoppingForm({ onUpdate }: ShoppingFormProps) {
  const [formData, setFormData] = useState<ShoppingFormData>({
    shoes: 0,
    pants: 0,
    tshirts: 0,
    shirts: 0,
    other_clothes: 0,
    secondHandPercentage: 0,
  });

  useEffect(() => {
    onUpdate(formData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (field: keyof Omit<ShoppingFormData, 'secondHandPercentage'>, value: number) => {
    const numericValue = Math.max(0, value); 
    setFormData(prev => {
      const newData = { ...prev, [field]: numericValue };
      return newData;
    });
  };

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => {
      const newData = { ...prev, secondHandPercentage: value[0] };
      return newData;
    });
  };


  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Leisure Shopping Habits</CardTitle>
        <CardDescription>Estimate the impact of your annual clothing purchases.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-2">
            <Label htmlFor="shoes" className="text-lg font-normal">Shoes (pairs)</Label>
            <Input
                id="shoes"
                name="shoes"
                type="number"
                min="0"
                value={formData.shoes}
                onChange={(e) => handleChange('shoes', parseInt(e.target.value, 10) || 0)}
                placeholder="e.g., 2"
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="pants" className="text-lg font-normal">Pants (pairs)</Label>
            <Input
                id="pants"
                name="pants"
                type="number"
                min="0"
                value={formData.pants}
                onChange={(e) => handleChange('pants', parseInt(e.target.value, 10) || 0)}
                placeholder="e.g., 3"
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="tshirts" className="text-lg font-normal">T-Shirts</Label>
            <Input
                id="tshirts"
                name="tshirts"
                type="number"
                min="0"
                value={formData.tshirts}
                onChange={(e) => handleChange('tshirts', parseInt(e.target.value, 10) || 0)}
                placeholder="e.g., 5"
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="shirts" className="text-lg font-normal">Shirts</Label>
            <Input
                id="shirts"
                name="shirts"
                type="number"
                min="0"
                value={formData.shirts}
                onChange={(e) => handleChange('shirts', parseInt(e.target.value, 10) || 0)}
                placeholder="e.g., 3"
            />
            </div>
            <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="other_clothes" className="text-lg font-normal">Other Clothes (e.g., jackets, dresses)</Label>
            <Input
                id="other_clothes"
                name="other_clothes"
                type="number"
                min="0"
                value={formData.other_clothes}
                onChange={(e) => handleChange('other_clothes', parseInt(e.target.value, 10) || 0)}
                placeholder="e.g., 4"
            />
            </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="secondHandPercentage" className="text-lg font-normal">
              What % of your purchases is second-hand?
            </Label>
            <span className="text-lg font-semibold text-primary">{formData.secondHandPercentage}%</span>
          </div>
          <Slider
            id="secondHandPercentage"
            name="secondHandPercentage"
            min={0}
            max={100}
            step={1}
            value={[formData.secondHandPercentage]}
            onValueChange={handleSliderChange}
          />
          <p className="text-xs text-muted-foreground">
            Increasing second-hand purchases significantly reduces your fashion footprint.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
