
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NutritionFormData {
  dietType: string;
  foodWaste: string;
}

interface NutritionFormProps {
  onUpdate: (data: NutritionFormData) => void;
}

export default function NutritionForm({ onUpdate }: NutritionFormProps) {
  const [formData, setFormData] = useState<NutritionFormData>({
    dietType: 'omnivore',
    foodWaste: 'medium',
  });

  useEffect(() => {
    onUpdate(formData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (field: keyof NutritionFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Dietary Habits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dietType" className="text-lg font-normal">Primary Diet Type</Label>
          <Select
            name="dietType"
            value={formData.dietType}
            onValueChange={(value) => handleChange('dietType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegan">🌱 Vegan</SelectItem>
              <SelectItem value="vegetarian">🥕 Vegetarian</SelectItem>
              <SelectItem value="pescatarian">🐟 Pescatarian</SelectItem>
              <SelectItem value="omnivore">🥩 Omnivore (eats meat regularly)</SelectItem>
              <SelectItem value="low_meat">🍗 Low Meat Consumption</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-normal">Food Waste Level</Label>
          <RadioGroup
            defaultValue="medium"
            className="flex flex-col sm:flex-row gap-4"
            value={formData.foodWaste}
            onValueChange={(value) => handleChange('foodWaste', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="waste-low" />
              <Label htmlFor="waste-low" className="text-base font-semibold">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="waste-medium" />
              <Label htmlFor="waste-medium" className="text-base font-semibold">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="waste-high" />
              <Label htmlFor="waste-high" className="text-base font-semibold">High</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
