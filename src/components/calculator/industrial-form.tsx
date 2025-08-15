
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";

const generateNewFacilityId = () => `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;

interface FacilityEntry {
  id: string;
  businessType: string;
  countryOfBusinessOperation: string;
  dataCenterUsage: number;
  otherIndustrialActivity: string;
  primaryEnergySource: string;
  annualEnergyConsumptionKwh: number;
  numberOfEmployees: number;
  cityType: string;
}

interface IndustrialFormProps {
  onUpdate: (data: { facilities: FacilityEntry[] }) => void;
}

const countryOptions = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'GB', label: '🇬🇧 United Kingdom' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'BR', label: '🇧🇷 Brazil' },
  { value: 'ZA', label: '🇿🇦 South Africa' },
  { value: 'CN', label: '🇨🇳 China' },
  { value: 'RU', label: '🇷🇺 Russia' },
  { value: 'MX', label: '🇲🇽 Mexico' },
  { value: 'IT', label: '🇮🇹 Italy' },
  { value: 'ES', label: '🇪🇸 Spain' },
  { value: 'OTHER', label: '🏳️ Other' },
];

const industrialEnergyOptions = [
  { id: 'grid', label: '⚡️ Grid Electricity' },
  { id: 'solar', label: '☀️ On-site Solar' },
  { id: 'natural_gas', label: '🔥 Natural Gas (Direct Use)' },
  { id: 'diesel_generators', label: '⛽️ Diesel Generators' },
  { id: 'other', label: '🏭 Other/Mixed' },
  { id: 'none', label: '🤷 None Predominant' },
];

const cityTypeOptions = [
  { value: 'small', label: '🏡 Small (<10k pop.)' },
  { value: 'medium', label: '🏘️ Medium (10k-100k pop.)' },
  { value: 'large', label: '🏙️ Large (>100k pop.)' },
];

const defaultFacilityEntry: FacilityEntry = {
  id: generateNewFacilityId(),
  businessType: 'none',
  countryOfBusinessOperation: 'US',
  dataCenterUsage: 0,
  otherIndustrialActivity: '',
  primaryEnergySource: 'grid',
  annualEnergyConsumptionKwh: 0,
  numberOfEmployees: 0,
  cityType: 'medium',
};

export default function IndustrialForm({ onUpdate }: IndustrialFormProps) {
  const [facilities, setFacilities] = useState<FacilityEntry[]>([{ ...defaultFacilityEntry }]);

  // This useEffect calls onUpdate whenever facilities changes.
  useEffect(() => {
    onUpdate({ facilities });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilities]);

  const handleFacilityChange = (id: string, field: keyof Omit<FacilityEntry, 'id'>, value: string | number) => {
    setFacilities(prevFacilities => 
      prevFacilities.map(facility => {
        if (facility.id === id) {
          let processedValue = value;
          if (field === 'dataCenterUsage' || field === 'annualEnergyConsumptionKwh' || field === 'numberOfEmployees') {
            processedValue = parseInt(value as string, 10) || 0;
          }
          return { ...facility, [field]: processedValue };
        }
        return facility;
      })
    );
  };

  const addFacility = () => {
    setFacilities(prevFacilities => 
      [...prevFacilities, { ...defaultFacilityEntry, id: generateNewFacilityId() }]
    );
  };

  const removeFacility = (id: string) => {
    setFacilities(prevFacilities => {
      const newFacilities = prevFacilities.filter(facility => facility.id !== id);
      return newFacilities.length > 0 ? newFacilities : [{ ...defaultFacilityEntry, id: generateNewFacilityId() }];
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Company Operations</CardTitle>
        <CardDescription>
          Detail each of your company's operational facilities or significant industrial consumption points.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {facilities.map((facility, index) => (
          <fieldset key={facility.id} className="space-y-4 p-4 border rounded-md bg-muted/20 relative">
            <legend className="text-base font-medium px-1 text-foreground mb-2">Facility #{index + 1}</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor={`businessType-${facility.id}`} className="text-lg font-normal">Type of Business</Label>
                <Select
                    name={`businessType-${facility.id}`}
                    value={facility.businessType}
                    onValueChange={(value) => handleFacilityChange(facility.id, 'businessType', value)}
                >
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="none">🤷‍♀️ None / Not Applicable</SelectItem>
                    <SelectItem value="office_based">💼 Office-Based Service</SelectItem>
                    <SelectItem value="retail">🛍️ Retail (Physical Store)</SelectItem>
                    <SelectItem value="manufacturing_small">🔩 Small Scale Manufacturing</SelectItem>
                    <SelectItem value="agriculture">🌾 Agriculture</SelectItem>
                    <SelectItem value="tech_startup">💻 Tech Startup (with server needs)</SelectItem>
                    <SelectItem value="other">❓ Other</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <Label htmlFor={`countryOfBusinessOperation-${facility.id}`} className="text-lg font-normal">Country of Operation</Label>
                <Select
                    name={`countryOfBusinessOperation-${facility.id}`}
                    value={facility.countryOfBusinessOperation}
                    onValueChange={(value) => handleFacilityChange(facility.id, 'countryOfBusinessOperation', value)}
                >
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country of operation" />
                    </SelectTrigger>
                    <SelectContent>
                    {countryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                        {option.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <Label htmlFor={`primaryEnergySource-${facility.id}`} className="text-lg font-normal">Primary Energy Source</Label>
                <Select
                    name={`primaryEnergySource-${facility.id}`}
                    value={facility.primaryEnergySource}
                    onValueChange={(value) => handleFacilityChange(facility.id, 'primaryEnergySource', value)}
                >
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select energy source" />
                    </SelectTrigger>
                    <SelectContent>
                    {industrialEnergyOptions.map(option => (
                        <SelectItem key={option.id} value={option.id}>
                        {option.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
                
                <div className="space-y-2">
                <Label htmlFor={`cityType-${facility.id}`} className="text-lg font-normal">City Type (Population)</Label>
                <Select
                    name={`cityType-${facility.id}`}
                    value={facility.cityType}
                    onValueChange={(value) => handleFacilityChange(facility.id, 'cityType', value)}
                >
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select city type" />
                    </SelectTrigger>
                    <SelectContent>
                    {cityTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                        {option.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
                
                <div className="space-y-2">
                <Label htmlFor={`annualEnergyConsumptionKwh-${facility.id}`} className="text-lg font-normal">Annual Energy Use (kWh)</Label>
                <Input
                    id={`annualEnergyConsumptionKwh-${facility.id}`}
                    name={`annualEnergyConsumptionKwh-${facility.id}`}
                    type="number"
                    min="0"
                    value={facility.annualEnergyConsumptionKwh}
                    onChange={(e) => handleFacilityChange(facility.id, 'annualEnergyConsumptionKwh', e.target.value)}
                    placeholder="e.g., 100000"
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor={`numberOfEmployees-${facility.id}`} className="text-lg font-normal">Number of Employees</Label>
                <Input
                    id={`numberOfEmployees-${facility.id}`}
                    name={`numberOfEmployees-${facility.id}`}
                    type="number"
                    min="0"
                    value={facility.numberOfEmployees}
                    onChange={(e) => handleFacilityChange(facility.id, 'numberOfEmployees', e.target.value)}
                    placeholder="e.g., 50"
                />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`dataCenterUsage-${facility.id}`} className="text-lg font-normal">Data Center/Server Usage</Label>
              <Input
                id={`dataCenterUsage-${facility.id}`}
                name={`dataCenterUsage-${facility.id}`}
                type="number"
                min="0"
                value={facility.dataCenterUsage}
                onChange={(e) => handleFacilityChange(facility.id, 'dataCenterUsage', e.target.value)}
                placeholder="e.g., 5000 kWh or 5 servers"
              />
              <p className="text-xs text-muted-foreground">Annual kWh or number of servers (if kWh unknown, e.g., for small server counts). If inputting servers, use a small number (e.g. 1-100). If inputting kWh, typically a larger number.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`otherIndustrialActivity-${facility.id}`} className="text-lg font-normal">Other Significant Industrial Activity</Label>
              <Input
                id={`otherIndustrialActivity-${facility.id}`}
                name={`otherIndustrialActivity-${facility.id}`}
                value={facility.otherIndustrialActivity}
                onChange={(e) => handleFacilityChange(facility.id, 'otherIndustrialActivity', e.target.value)}
                placeholder="e.g., Specific machinery usage, chemical processes"
              />
            </div>

            {facilities.length > 1 && (
              <Button
                type="button" variant="ghost" size="icon"
                className="absolute top-1 right-1 text-destructive hover:text-destructive/80"
                onClick={() => removeFacility(facility.id)}
                aria-label="Remove facility"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </fieldset>
        ))}
        <Button type="button" variant="outline" onClick={addFacility} className="mt-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add another facility
        </Button>
      </CardContent>
    </Card>
  );
}
