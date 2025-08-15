
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';

type UnitSystem = 'metric' | 'imperial';

export interface BasicFormData {
  dietType: 'vegan' | 'vegetarian' | 'omnivore' | 'pescatarian' | 'low_meat';
  homeSize: number;
  homeEnergyEfficiency: 'low' | 'average' | 'high';
  carDistance: number;
  carFuelEfficiency: 'low' | 'average' | 'high';
  shortFlights: number;
  longFlights: number;
  shoppingHabits: 'minimalist' | 'average' | 'frequent';
}

interface BasicCalculatorFormProps {
  unitSystem: UnitSystem;
  initialData?: BasicFormData;
}

const defaultBasicFormData: BasicFormData = {
  dietType: 'omnivore',
  homeSize: 0,
  homeEnergyEfficiency: 'average',
  carDistance: 0,
  carFuelEfficiency: 'average',
  shortFlights: 0,
  longFlights: 0,
  shoppingHabits: 'average',
};

export default function BasicCalculatorForm({ unitSystem, initialData }: BasicCalculatorFormProps) {
  const [formData, setFormData] = useState<BasicFormData>(initialData || defaultBasicFormData);
  const [basicFootprint, setBasicFootprint] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultBasicFormData); // This will now use the 0 defaults for numeric fields
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) { 
      setFormData(prev => ({
        ...prev,
        homeSize: 0, 
        carDistance: 0,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitSystem]);

  useEffect(() => {
    let footprint = 0;
    const dietFactors = { vegan: 1000, vegetarian: 1500, omnivore: 2500, pescatarian: 1800, low_meat: 2000 };
    footprint += dietFactors[formData.dietType] || dietFactors.omnivore;

    // Home Calculation
    let homeSizeForCalc = formData.homeSize;
    let homeBaseFootprintPerUnit;
    if (unitSystem === 'metric') {
      if (formData.homeSize > 300 && initialData && initialData.homeSize === formData.homeSize) homeSizeForCalc /= 10.7639; // Convert if persona value was in sqft
      homeBaseFootprintPerUnit = 20; // kg CO2e per sq m
    } else { // imperial
      homeBaseFootprintPerUnit = 1.85; // kg CO2e per sq ft
    }
    let homeFootprint = homeSizeForCalc * homeBaseFootprintPerUnit;
    const homeEfficiencyFactors = { low: 1.2, average: 1.0, high: 0.8 };
    homeFootprint *= (homeEfficiencyFactors[formData.homeEnergyEfficiency] || 1.0);
    footprint += homeFootprint;

    // Car Calculation
    let carDistanceForCalc = formData.carDistance;
    let carBaseFootprintPerUnit;
    if (unitSystem === 'metric') {
      if (formData.carDistance > 2000 && initialData && initialData.carDistance === formData.carDistance) carDistanceForCalc /= 1.60934; // Convert if persona value was in miles
      carBaseFootprintPerUnit = 0.18; // kg CO2e per km
    } else { // imperial
      carBaseFootprintPerUnit = 0.29; // kg CO2e per mile
    }
    let carFootprint = carDistanceForCalc * carBaseFootprintPerUnit;
    const carEfficiencyFactors = { low: 1.2, average: 1.0, high: 0.8 };
    carFootprint *= (carEfficiencyFactors[formData.carFuelEfficiency] || 1.0);
    footprint += carFootprint;
    
    // Flights
    footprint += formData.shortFlights * 200; // kg CO2e per short flight (example)
    footprint += formData.longFlights * 800; // kg CO2e per long flight (example)

    // Shopping Habits
    const shoppingFactors = { minimalist: 200, average: 500, frequent: 1000 };
    footprint += shoppingFactors[formData.shoppingHabits] || shoppingFactors.average;

    setBasicFootprint(Math.max(0, footprint));
  }, [formData, unitSystem, initialData]);

  const handleNumericInputChange = (field: keyof Pick<BasicFormData, 'homeSize' | 'carDistance' | 'shortFlights' | 'longFlights'>, value: string) => {
    const numericValue = parseInt(value, 10);
    setFormData(prev => ({ ...prev, [field]: Math.max(0, numericValue || 0) }));
  };

  const handleSelectChange = (field: keyof Pick<BasicFormData, 'dietType' | 'homeEnergyEfficiency' | 'carFuelEfficiency' | 'shoppingHabits'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value as any }));
  };

  const homeSizeLabel = unitSystem === 'metric' ? 'Home Size (sq m)' : 'Home Size (sq ft)';
  const homeSizePlaceholder = unitSystem === 'metric' ? 'e.g., 120' : 'e.g., 1300';
  const carDistanceLabel = unitSystem === 'metric' ? 'Annual Car Distance (km)' : 'Annual Car Distance (miles)';
  const carDistancePlaceholder = unitSystem === 'metric' ? 'e.g., 10000' : 'e.g., 6200';


  return (
    <div className="space-y-6 p-1">
        <CardDescription className="mb-6 text-center">
            Get a quick estimate of your carbon footprint with these simplified inputs.
            For a more detailed analysis, use the accordion sections.
        </CardDescription>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Row 1 */}
            <div className="space-y-2">
                <Label htmlFor="basicDietType">Diet Type</Label>
                <Select name="basicDietType" value={formData.dietType} onValueChange={(val) => handleSelectChange('dietType', val)}>
                    <SelectTrigger id="basicDietType"><SelectValue placeholder="Select diet type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="vegan">🌱 Vegan</SelectItem>
                        <SelectItem value="vegetarian">🥕 Vegetarian</SelectItem>
                        <SelectItem value="pescatarian">🐟 Pescatarian</SelectItem>
                        <SelectItem value="omnivore">🥩 Omnivore</SelectItem>
                        <SelectItem value="low_meat">🍗 Low Meat</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="basicShoppingHabits">Shopping Habits</Label>
                <Select name="basicShoppingHabits" value={formData.shoppingHabits} onValueChange={(val) => handleSelectChange('shoppingHabits', val)}>
                    <SelectTrigger id="basicShoppingHabits"><SelectValue placeholder="Select shopping habits" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="minimalist">🛍️ Minimalist</SelectItem>
                        <SelectItem value="average">🛍️ Average</SelectItem>
                        <SelectItem value="frequent">🛍️ Frequent</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
                <Label htmlFor="basicHomeSize">{homeSizeLabel}</Label>
                <Input id="basicHomeSize" name="basicHomeSize" type="number" min="0" value={formData.homeSize} onChange={(e) => handleNumericInputChange('homeSize', e.target.value)} placeholder={homeSizePlaceholder}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="basicHomeEnergyEfficiency">Home Energy Efficiency</Label>
                <Select name="basicHomeEnergyEfficiency" value={formData.homeEnergyEfficiency} onValueChange={(val) => handleSelectChange('homeEnergyEfficiency', val)}>
                    <SelectTrigger id="basicHomeEnergyEfficiency"><SelectValue placeholder="Select efficiency" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">📉 Low</SelectItem>
                        <SelectItem value="average">📊 Average</SelectItem>
                        <SelectItem value="high">📈 High</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {/* Row 3 */}
            <div className="space-y-2">
                <Label htmlFor="basicCarDistance">{carDistanceLabel}</Label>
                <Input id="basicCarDistance" name="basicCarDistance" type="number" min="0" value={formData.carDistance} onChange={(e) => handleNumericInputChange('carDistance', e.target.value)} placeholder={carDistancePlaceholder}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="basicCarFuelEfficiency">Car Fuel Efficiency</Label>
                <Select name="basicCarFuelEfficiency" value={formData.carFuelEfficiency} onValueChange={(val) => handleSelectChange('carFuelEfficiency', val)}>
                    <SelectTrigger id="basicCarFuelEfficiency"><SelectValue placeholder="Select efficiency" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">⛽ Low</SelectItem>
                        <SelectItem value="average">⛽ Average</SelectItem>
                        <SelectItem value="high">⛽ High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
                <Label htmlFor="basicShortFlights">Short Haul Flights (per year)</Label>
                <Input id="basicShortFlights" name="basicShortFlights" type="number" min="0" value={formData.shortFlights} onChange={(e) => handleNumericInputChange('shortFlights', e.target.value)} placeholder="e.g., 2"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="basicLongFlights">Long Haul Flights (per year)</Label>
                <Input id="basicLongFlights" name="basicLongFlights" type="number" min="0" value={formData.longFlights} onChange={(e) => handleNumericInputChange('longFlights', e.target.value)} placeholder="e.g., 1"/>
            </div>
        </div>

        <Separator className="my-8" />

        <Card className="mt-6 bg-muted/40">
            <CardHeader>
                <CardTitle className="text-xl text-center text-primary">Basic Estimated Footprint</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-4xl font-bold text-foreground">
                {basicFootprint.toFixed(0)}
                </p>
                <p className="text-muted-foreground">kg CO₂e per year</p>
            </CardContent>
        </Card>
    </div>
  );
}

