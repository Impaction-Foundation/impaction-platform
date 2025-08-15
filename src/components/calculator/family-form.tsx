
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FamilyFormData {
  numberOfMembers: number;
}

interface FamilyFormProps {
  onUpdate: (data: FamilyFormData) => void;
}

export default function FamilyForm({ onUpdate }: FamilyFormProps) {
  const [formData, setFormData] = useState<FamilyFormData>({
    numberOfMembers: 0,
  });

  useEffect(() => {
    onUpdate(formData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (field: keyof FamilyFormData, value: number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Household Composition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="numberOfMembers" className="text-lg font-normal">
            Additional Household Members (excluding yourself)
          </Label>
          <Input
            id="numberOfMembers"
            name="numberOfMembers"
            type="number"
            min="0"
            value={formData.numberOfMembers}
            onChange={(e) => handleChange('numberOfMembers', parseInt(e.target.value, 10) || 0)}
            placeholder="e.g., 1"
          />
          <p className="text-xs text-muted-foreground">
            Count partners, children, roommates, etc., who share the household.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
