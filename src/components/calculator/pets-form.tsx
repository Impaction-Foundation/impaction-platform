
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";

const generateNewPetEntryId = () => `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;

interface PetEntry {
  id: string;
  petType: string;
  numberOfPets: number;
}

interface PetsFormProps {
  onUpdate: (data: { pets: PetEntry[] }) => void;
}

const defaultPetEntry: PetEntry = {
  id: generateNewPetEntryId(),
  petType: 'dog',
  numberOfPets: 1,
};

export default function PetsForm({ onUpdate }: PetsFormProps) {
  const [petEntries, setPetEntries] = useState<PetEntry[]>([{ ...defaultPetEntry }]);

  // This useEffect will call onUpdate whenever petEntries changes.
  // It correctly handles subsequent updates after the initial render.
  useEffect(() => {
    onUpdate({ pets: petEntries });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petEntries]);


  const handlePetEntryChange = (id: string, field: keyof Omit<PetEntry, 'id'>, value: string | number) => {
    setPetEntries(prevEntries => 
      prevEntries.map(entry => {
        if (entry.id === id) {
          let processedValue = value;
          if (field === 'numberOfPets') {
            processedValue = parseInt(value as string, 10) || 0;
          }
          return { ...entry, [field]: processedValue };
        }
        return entry;
      })
    );
  };

  const addPetEntry = () => {
    setPetEntries(prevEntries => 
      [...prevEntries, { ...defaultPetEntry, id: generateNewPetEntryId(), petType: 'cat', numberOfPets: 1 }]
    );
  };

  const removePetEntry = (id: string) => {
    setPetEntries(prevEntries => {
      const newEntries = prevEntries.filter(entry => entry.id !== id);
      return newEntries.length > 0 ? newEntries : [{ ...defaultPetEntry, id: generateNewPetEntryId() }];
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Pet Ownership</CardTitle>
        <CardDescription>
          Add details for each type of pet you own.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {petEntries.map((petEntry, index) => (
          <fieldset key={petEntry.id} className="space-y-4 p-4 border rounded-md bg-muted/20 relative">
            <legend className="text-base font-medium px-1 text-foreground mb-2">Pet Group #{index + 1}</legend>
            
            <div className="space-y-2">
              <Label htmlFor={`petType-${petEntry.id}`} className="text-lg font-normal">Type of Pet</Label>
              <Select
                name={`petType-${petEntry.id}`}
                value={petEntry.petType}
                onValueChange={(value) => handlePetEntryChange(petEntry.id, 'petType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select pet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat">🐈 Cat</SelectItem>
                  <SelectItem value="dog">🐕 Dog</SelectItem>
                  <SelectItem value="horse">🐎 Horse</SelectItem>
                  <SelectItem value="tropical_fish">🐠 Tropical Fish (Tank)</SelectItem>
                  <SelectItem value="small_mammal">🐇 Small Mammal (e.g., Hamster, Rabbit)</SelectItem>
                  <SelectItem value="bird">🐦 Bird</SelectItem>
                  <SelectItem value="reptile">🦎 Reptile</SelectItem>
                  <SelectItem value="none">🤷 No Pets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`numberOfPets-${petEntry.id}`} className="text-lg font-normal">Number of Pets (of this type)</Label>
              <Input
                id={`numberOfPets-${petEntry.id}`}
                name={`numberOfPets-${petEntry.id}`}
                type="number"
                min="0"
                value={petEntry.numberOfPets}
                onChange={(e) => handlePetEntryChange(petEntry.id, 'numberOfPets', parseInt(e.target.value, 10) || 0)}
                placeholder="e.g., 1"
                disabled={petEntry.petType === 'none'}
              />
            </div>

            {petEntries.length > 1 && (
              <Button
                type="button" variant="ghost" size="icon"
                className="absolute top-1 right-1 text-destructive hover:text-destructive/80"
                onClick={() => removePetEntry(petEntry.id)}
                aria-label="Remove pet group"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </fieldset>
        ))}
        <Button type="button" variant="outline" onClick={addPetEntry} className="mt-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add another pet type
        </Button>
      </CardContent>
    </Card>
  );
}
