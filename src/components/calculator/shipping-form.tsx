
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ShippingFormData {
  domesticPackagesPerMonth: number;
  internationalPackagesPerMonth: number;
  shippingSpeed: 'standard' | 'express' | 'eco';
}

interface ShippingFormProps {
  onUpdate: (data: ShippingFormData) => void;
}

const defaultShippingFormData: ShippingFormData = {
  domesticPackagesPerMonth: 0,
  internationalPackagesPerMonth: 0,
  shippingSpeed: 'standard',
};

export default function ShippingForm({ onUpdate }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingFormData>(defaultShippingFormData);

  useEffect(() => {
    onUpdate(formData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleInputChange = (field: 'domesticPackagesPerMonth' | 'internationalPackagesPerMonth', value: string) => {
    const numericValue = parseInt(value, 10);
    setFormData(prev => {
        const updatedData = { ...prev, [field]: Math.max(0, numericValue || 0) };
        return updatedData;
    });
  };

  const handleSelectChange = (value: ShippingFormData['shippingSpeed']) => {
    setFormData(prev => {
        const updatedData = { ...prev, shippingSpeed: value };
        return updatedData;
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Package Shipping Habits</CardTitle>
        <CardDescription>Estimate the impact of your online shopping deliveries (monthly).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="shippingSpeed" className="text-lg font-normal">Typical Shipping Speed</Label>
          <Select
            name="shippingSpeed"
            value={formData.shippingSpeed}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select shipping speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">🚚 Standard Shipping</SelectItem>
              <SelectItem value="express">🚀 Express Shipping</SelectItem>
              <SelectItem value="eco">🍃 Eco-Friendly Shipping</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="domesticPackagesPerMonth" className="text-lg font-normal">Domestic Packages (per month)</Label>
          <Input
            id="domesticPackagesPerMonth"
            name="domesticPackagesPerMonth"
            type="number"
            min="0"
            value={formData.domesticPackagesPerMonth}
            onChange={(e) => handleInputChange('domesticPackagesPerMonth', e.target.value)}
            placeholder="e.g., 2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="internationalPackagesPerMonth" className="text-lg font-normal">International Packages (per month)</Label>
          <Input
            id="internationalPackagesPerMonth"
            name="internationalPackagesPerMonth"
            type="number"
            min="0"
            value={formData.internationalPackagesPerMonth}
            onChange={(e) => handleInputChange('internationalPackagesPerMonth', e.target.value)}
            placeholder="e.g., 1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
