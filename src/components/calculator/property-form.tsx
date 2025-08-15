
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";

type UnitSystem = 'metric' | 'imperial';

const generateNewPropertyId = () => `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;

interface PropertyEntry {
  id: string;
  propertyType: string;
  squareFootage: number;
  numberOfRooms: number;
  energySource: string;
  recycling: string;
  hotelStarRating: string; 
  annualDaysOccupied: number;
}

interface PropertyFormProps {
  unitSystem: UnitSystem;
  onUpdate: (data: { properties: PropertyEntry[] }) => void;
}

const energyOptions = [
  { id: 'grid', label: '⚡️ Grid Electricity' },
  { id: 'solar', label: '☀️ Solar Panels' },
  { id: 'natural_gas', label: '🔥 Natural Gas' },
  { id: 'heating_oil', label: '⛽️ Heating Oil' },
  { id: 'wood', label: '🪵 Wood/Biomass' },
  { id: 'none', label: '🤷 None Predominant' },
];

const recyclingOptions = [
    { value: 'yes', label: '♻️ Yes' },
    { value: 'no', label: '🗑️ No' },
    { value: 'sometimes', label: '🤔 Sometimes/Partially' },
];

const hotelStarOptions = [
    { value: '1', label: '⭐ 1 Star' },
    { value: '2', label: '⭐⭐ 2 Stars' },
    { value: '3', label: '⭐⭐⭐ 3 Stars' },
    { value: '4', label: '⭐⭐⭐⭐ 4 Stars' },
    { value: '5', label: '⭐⭐⭐⭐⭐ 5 Stars' },
];

const getDefaultPropertyEntry = (unitSystem: UnitSystem): PropertyEntry => ({
  id: generateNewPropertyId(),
  propertyType: 'home',
  squareFootage: unitSystem === 'metric' ? 140 : 1500,
  numberOfRooms: 3,
  energySource: 'grid',
  recycling: 'no',
  hotelStarRating: '3',
  annualDaysOccupied: 365,
});


export default function PropertyForm({ unitSystem, onUpdate }: PropertyFormProps) {
  const [properties, setProperties] = useState<PropertyEntry[]>([getDefaultPropertyEntry(unitSystem)]);

  useEffect(() => {
    setProperties(prevProps =>
      prevProps.map(prop => {
        const defaultEntry = getDefaultPropertyEntry(unitSystem);
        // Only update if it's the initial default property or if unit change implies a common default switch
        if (prop.id === prevProps[0].id && prevProps.length === 1) { // If it's the very first default item
             if (unitSystem === 'metric' && prop.squareFootage === 1500) return { ...prop, squareFootage: 140 };
             if (unitSystem === 'imperial' && prop.squareFootage === 140) return { ...prop, squareFootage: 1500 };
        } else if (prop.propertyType !== 'hotel_room') { // For other properties, adjust if they match old defaults
            if (unitSystem === 'metric' && prop.squareFootage === 1500) return { ...prop, squareFootage: 140 };
            if (unitSystem === 'imperial' && prop.squareFootage === 140) return { ...prop, squareFootage: 1500 };
        }
        return prop;
      })
    );
  }, [unitSystem]);
  
  useEffect(() => {
    onUpdate({ properties });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);


  const handlePropertyChange = (id: string, field: keyof Omit<PropertyEntry, 'id'>, value: string | number) => {
     setProperties(prevProperties => 
      prevProperties.map(prop => {
        if (prop.id === id) {
          let processedValue = value;
          if (typeof value === 'string') {
            if (field === 'squareFootage' || field === 'numberOfRooms' || field === 'annualDaysOccupied') {
              processedValue = parseInt(value, 10) || 0;
            }
          }
          return { ...prop, [field]: processedValue };
        }
        return prop;
      })
    );
  };

  const addProperty = () => {
    setProperties(prevProperties => [...prevProperties, getDefaultPropertyEntry(unitSystem)]);
  };

  const removeProperty = (id: string) => {
    setProperties(prevProperties => {
      const newProperties = prevProperties.filter(prop => prop.id !== id);
      if (newProperties.length === 0) {
        return [getDefaultPropertyEntry(unitSystem)];
      }
      return newProperties;
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Home & Property Details</CardTitle>
        <CardDescription>
          Add details for each property you own or primarily reside in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {properties.map((property, index) => (
          <fieldset key={property.id} className="space-y-4 p-4 border rounded-md bg-muted/20 relative">
            <legend className="text-base font-medium px-1 text-foreground mb-2">Property #{index + 1}</legend>
            
            <div className="space-y-2">
              <Label htmlFor={`propertyType-${property.id}`} className="text-lg font-normal">Type of Property</Label>
              <Select
                name={`propertyType-${property.id}`}
                value={property.propertyType}
                onValueChange={(value) => handlePropertyChange(property.id, 'propertyType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">🏢 Apartment/Condo</SelectItem>
                  <SelectItem value="home">🏡 House (Detached/Semi-Detached)</SelectItem>
                  <SelectItem value="villa">🏰 Villa</SelectItem>
                  <SelectItem value="hotel_room">🏨 Hotel Room (Primary Residence)</SelectItem>
                  <SelectItem value="island_property">🏝️ Island Property</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {property.propertyType === 'hotel_room' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`hotelStarRating-${property.id}`} className="text-lg font-normal">Hotel Star Rating</Label>
                    <Select
                      name={`hotelStarRating-${property.id}`}
                      value={property.hotelStarRating}
                      onValueChange={(value) => handlePropertyChange(property.id, 'hotelStarRating', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select star rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotelStarOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`annualDaysOccupied-${property.id}`} className="text-lg font-normal">Annual Days Occupied</Label>
                    <Input
                      id={`annualDaysOccupied-${property.id}`}
                      name={`annualDaysOccupied-${property.id}`}
                      type="number"
                      min="1"
                      max="365"
                      value={property.annualDaysOccupied}
                      onChange={(e) => handlePropertyChange(property.id, 'annualDaysOccupied', parseInt(e.target.value, 10) || 365)}
                      placeholder="e.g., 365"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor={`squareFootage-${property.id}`} className="text-lg font-normal">
                    Area ({unitSystem === 'metric' ? 'sq m' : 'sq ft'})
                </Label>
                <Input
                    id={`squareFootage-${property.id}`}
                    name={`squareFootage-${property.id}`}
                    type="number"
                    min="0"
                    value={property.squareFootage}
                    onChange={(e) => handlePropertyChange(property.id, 'squareFootage', parseInt(e.target.value, 10) || 0)}
                    placeholder={unitSystem === 'metric' ? "e.g., 140" : "e.g., 1500"}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor={`numberOfRooms-${property.id}`} className="text-lg font-normal">Number of Rooms</Label>
                <Input
                    id={`numberOfRooms-${property.id}`}
                    name={`numberOfRooms-${property.id}`}
                    type="number"
                    min="0"
                    value={property.numberOfRooms}
                    onChange={(e) => handlePropertyChange(property.id, 'numberOfRooms', parseInt(e.target.value, 10) || 0)}
                    placeholder="e.g., 3"
                />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`recycling-${property.id}`} className="text-lg font-normal">Do you recycle?</Label>
                    <Select
                        name={`recycling-${property.id}`}
                        value={property.recycling}
                        onValueChange={(value) => handlePropertyChange(property.id, 'recycling', value)}
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your recycling habits" />
                        </SelectTrigger>
                        <SelectContent>
                        {recyclingOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`energySource-${property.id}`} className="text-lg font-normal">Primary Energy Source</Label>
                    <Select
                        name={`energySource-${property.id}`}
                        value={property.energySource}
                        onValueChange={(value) => handlePropertyChange(property.id, 'energySource', value)}
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select primary energy source" />
                        </SelectTrigger>
                        <SelectContent>
                        {energyOptions.map(option => (
                            <SelectItem key={option.id} value={option.id}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {properties.length > 1 && (
              <Button
                type="button" variant="ghost" size="icon"
                className="absolute top-1 right-1 text-destructive hover:text-destructive/80"
                onClick={() => removeProperty(property.id)}
                aria-label="Remove property"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </fieldset>
        ))}
        <Button type="button" variant="outline" onClick={addProperty} className="mt-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add another property
        </Button>
      </CardContent>
    </Card>
  );
}
