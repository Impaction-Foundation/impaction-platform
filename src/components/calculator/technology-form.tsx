
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';

interface TechnologyFormData {
  numComputers: number;
  numLaptops: number;
  numTablets: number;
  numSmartphones: number;
  numRouters: number;
  leisureHoursPerDay: number;
  workHoursPerDay: number;
}

interface TechnologyFormProps {
  onUpdate: (data: TechnologyFormData) => void;
}

const defaultTechnologyFormData: TechnologyFormData = {
  numComputers: 0,
  numLaptops: 0,
  numTablets: 0,
  numSmartphones: 0,
  numRouters: 0,
  leisureHoursPerDay: 0,
  workHoursPerDay: 0,
};

export default function TechnologyForm({ onUpdate }: TechnologyFormProps) {
  const [formData, setFormData] = useState<TechnologyFormData>(defaultTechnologyFormData);

  useEffect(() => {
    onUpdate(formData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (field: keyof TechnologyFormData, value: string) => {
    const numericValue = Math.max(0, parseInt(value, 10) || 0);
    setFormData(prev => {
      const newData = { ...prev, [field]: numericValue };
      return newData;
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Technology Usage</CardTitle>
        <CardDescription>Estimate the impact of your devices and internet consumption.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-lg font-medium text-foreground mb-2">Internet Usage</legend>
          <p className="text-sm text-muted-foreground -mt-2 mb-3">Introduce your internet usage per day.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-2">
              <Label htmlFor="leisureHoursPerDay" className="text-base font-normal">
                Daily hours for leisure (hours)
              </Label>
              <Input
                id="leisureHoursPerDay"
                name="leisureHoursPerDay"
                type="number"
                min="0"
                value={formData.leisureHoursPerDay}
                onChange={(e) => handleChange('leisureHoursPerDay', e.target.value)}
                placeholder="e.g., 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workHoursPerDay" className="text-base font-normal">
                Daily hours for work (hours)
              </Label>
              <Input
                id="workHoursPerDay"
                name="workHoursPerDay"
                type="number"
                min="0"
                value={formData.workHoursPerDay}
                onChange={(e) => handleChange('workHoursPerDay', e.target.value)}
                placeholder="e.g., 8"
              />
            </div>
          </div>
        </fieldset>

        <Separator />

        <fieldset className="space-y-4">
          <legend className="text-lg font-medium text-foreground mb-2">Device Ownership</legend>
          <p className="text-sm text-muted-foreground -mt-2 mb-3">Enter the number of electronic devices you commonly use.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-2">
              <Label htmlFor="numComputers" className="text-base font-normal">
                Number of computers (desktops)
              </Label>
              <Input
                id="numComputers"
                name="numComputers"
                type="number"
                min="0"
                value={formData.numComputers}
                onChange={(e) => handleChange('numComputers', e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numLaptops" className="text-base font-normal">
                Number of laptops/notebooks
              </Label>
              <Input
                id="numLaptops"
                name="numLaptops"
                type="number"
                min="0"
                value={formData.numLaptops}
                onChange={(e) => handleChange('numLaptops', e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numTablets" className="text-base font-normal">
                Number of tablets
              </Label>
              <Input
                id="numTablets"
                name="numTablets"
                type="number"
                min="0"
                value={formData.numTablets}
                onChange={(e) => handleChange('numTablets', e.target.value)}
                placeholder="e.g., 0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numSmartphones" className="text-base font-normal">
                Number of smartphones
              </Label>
              <Input
                id="numSmartphones"
                name="numSmartphones"
                type="number"
                min="0"
                value={formData.numSmartphones}
                onChange={(e) => handleChange('numSmartphones', e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="numRouters" className="text-base font-normal">
                Number of routers
              </Label>
              <Input
                id="numRouters"
                name="numRouters"
                type="number"
                min="0"
                value={formData.numRouters}
                onChange={(e) => handleChange('numRouters', e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}
