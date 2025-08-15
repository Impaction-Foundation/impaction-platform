
"use client";

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";

type UnitSystem = 'metric' | 'imperial';

interface FlightEntry {
  id: string;
  flightType: string;
  hours: number;
  passengers: number;
  flightClass: string;
  tripPurpose: string;
}

interface TravelFormData {
  carKmsPerYear: number; 
  carFuelType: string;
  carPassengers: number;
  bikeKmsPerYear: number; 
  flights: FlightEntry[];
  hotelNightsPerYear: number;
  hotelStarRating: string;
  publicTransportType: string;
  publicTransportKmsPerYear: number; 
}

interface TravelFormProps {
  unitSystem: UnitSystem;
  onUpdate: (data: TravelFormData) => void;
}

const generateNewFlightId = () => `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;

const defaultFlightEntry: FlightEntry = {
  id: generateNewFlightId(),
  flightType: 'plane_short_haul',
  hours: 0,
  passengers: 1,
  flightClass: 'economy',
  tripPurpose: 'personal',
};

const defaultTravelFormData: TravelFormData = {
  carKmsPerYear: 0,
  carFuelType: 'gasoline',
  carPassengers: 1,
  bikeKmsPerYear: 0,
  flights: [{ ...defaultFlightEntry }],
  hotelNightsPerYear: 0,
  hotelStarRating: '3',
  publicTransportType: 'none',
  publicTransportKmsPerYear: 0,
};

const publicTransportOptions = [
    { value: 'none', label: '🚫 None / Not Applicable' },
    { value: 'bus', label: '🚌 Bus' },
    { value: 'train_national', label: '🚆 National Rail / Long-distance Train' },
    { value: 'train_local_metro', label: '🚇 Metro / Subway / Local Train' },
    { value: 'tram', label: '🚊 Tram / Light Rail' },
    { value: 'ferry_foot_passenger', label: '🚢 Ferry (Foot Passenger)' },
];

const flightTypeOptions = [
    { value: 'plane_short_haul', label: '✈️ Short Haul Commercial (<3h)' },
    { value: 'plane_long_haul', label: '✈️ Long Haul Commercial (>3h)' },
    { value: 'jet', label: '🚀 Private Jet' },
];

const flightClassOptions = [
    { value: 'economy', label: '💺 Economy' },
    { value: 'premium_economy', label: '💺 Premium Economy' },
    { value: 'business', label: '💼 Business Class' },
    { value: 'first', label: '🌟 First Class' },
];

const tripPurposeOptions = [
    { value: 'personal', label: '👤 Personal/Leisure' },
    { value: 'family', label: '👨‍👩‍👧‍👦 Family Visit' },
    { value: 'business', label: '💼 Business' },
    { value: 'commute', label: '🔁 Commute' },
    { value: 'other', label: '❓ Other' },
];

export default function TravelForm({ unitSystem, onUpdate }: TravelFormProps) {
  const [formData, setFormData] = useState<TravelFormData>(defaultTravelFormData);

  // This useEffect calls onUpdate whenever formData (including flights array) changes.
  useEffect(() => {
    onUpdate(formData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (field: keyof Omit<TravelFormData, 'flights'>, value: string | number) => {
    setFormData(prev => {
      let numericValue = value;
      if (typeof value === 'string' && 
          (field === 'carKmsPerYear' || field === 'carPassengers' || field === 'bikeKmsPerYear' || 
           field === 'hotelNightsPerYear' || field === 'publicTransportKmsPerYear')) {
        numericValue = parseInt(value, 10) || 0;
      }
      if (field === 'carPassengers' && (numericValue as number) < 1) {
        numericValue = 1;
      }
      return { ...prev, [field]: numericValue };
    });
  };

  const handleFlightChange = (id: string, field: keyof Omit<FlightEntry, 'id'>, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      flights: prev.flights.map(flight => {
        if (flight.id === id) {
          let processedValue = value;
          if (field === 'hours' || field === 'passengers') {
            processedValue = parseInt(value as string, 10) || 0;
            if (field === 'passengers' && (processedValue as number) < 1) {
              processedValue = 1;
            }
          }
          return { ...flight, [field]: processedValue };
        }
        return flight;
      })
    }));
  };

  const addFlight = () => {
    setFormData(prev => ({
      ...prev,
      flights: [...prev.flights, { ...defaultFlightEntry, id: generateNewFlightId() }]
    }));
  };

  const removeFlight = (id: string) => {
    setFormData(prev => {
      const newFlights = prev.flights.filter(flight => flight.id !== id);
      return {
        ...prev,
        flights: newFlights.length > 0 ? newFlights : [{ ...defaultFlightEntry, id: generateNewFlightId()}]
      };
    });
  };


  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Travel Habits</CardTitle>
        <CardDescription>Detail your yearly trips and travel patterns, including leisure and work.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset className="space-y-4 p-4 border rounded-lg shadow-sm bg-card/30">
          <legend className="text-lg font-semibold px-1 text-primary">✈️ Air Travel</legend>
           <p className="text-sm text-muted-foreground px-1 mt-1 mb-3">
            Add each significant flight segment, including class, passengers in your party, and trip purpose.
          </p>
          {formData.flights.map((flight, index) => (
            <div key={flight.id} className="space-y-3 p-4 border rounded-md bg-background/50 shadow-inner relative">
              <Label className="text-base font-semibold text-foreground block mb-2">Flight #{index + 1}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor={`flightType-${flight.id}`} className="text-sm font-normal">Type of Flight</Label>
                  <Select
                    name={`flightType-${flight.id}`}
                    value={flight.flightType}
                    onValueChange={(value) => handleFlightChange(flight.id, 'flightType', value)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {flightTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`hours-${flight.id}`} className="text-sm font-normal">Hours</Label>
                  <Input
                    id={`hours-${flight.id}`}
                    type="number"
                    min="0"
                    value={flight.hours}
                    onChange={(e) => handleFlightChange(flight.id, 'hours', e.target.value)}
                    placeholder="e.g., 5"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`passengers-${flight.id}`} className="text-sm font-normal">Passengers (Your Party)</Label>
                  <Input
                    id={`passengers-${flight.id}`}
                    type="number"
                    min="1"
                    value={flight.passengers}
                    onChange={(e) => handleFlightChange(flight.id, 'passengers', e.target.value)}
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`flightClass-${flight.id}`} className="text-sm font-normal">Flight Class</Label>
                  <Select
                    name={`flightClass-${flight.id}`}
                    value={flight.flightClass}
                    onValueChange={(value) => handleFlightChange(flight.id, 'flightClass', value)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {flightClassOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-1 lg:col-span-1">
                  <Label htmlFor={`tripPurpose-${flight.id}`} className="text-sm font-normal">Trip Purpose</Label>
                  <Select
                    name={`tripPurpose-${flight.id}`}
                    value={flight.tripPurpose}
                    onValueChange={(value) => handleFlightChange(flight.id, 'tripPurpose', value)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {tripPurposeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.flights.length > 0 && ( 
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80 p-1 h-7 w-7"
                  onClick={() => removeFlight(flight.id)}
                  aria-label="Remove flight"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addFlight} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add another flight
          </Button>
        </fieldset>
        
        <fieldset className="space-y-4 p-4 border rounded-lg shadow-sm bg-card/30">
          <legend className="text-lg font-semibold px-1 text-primary">🚗 Car Travel</legend>
          <p className="text-sm text-muted-foreground px-1 mt-1 mb-3">
            Calculate your car trips by introducing the fuel type and distance travelled. The number of passengers will divide the car's emissions. (1 mile = 1.609 km)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="carFuelType" className="text-base font-normal">Car Fuel Type</Label>
              <Select
                name="carFuelType"
                value={formData.carFuelType}
                onValueChange={(value) => handleChange('carFuelType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">⛽️ Gasoline</SelectItem>
                  <SelectItem value="diesel">💨 Diesel</SelectItem>
                  <SelectItem value="hybrid">🔋⚡️ Hybrid</SelectItem>
                  <SelectItem value="electric">🔌 Electric</SelectItem>
                  <SelectItem value="none">🚫🚗 No Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="carKmsPerYear" className="text-base font-normal">Annual Car Distance ({unitSystem === 'metric' ? 'km' : 'miles'})</Label>
              <Input
                id="carKmsPerYear"
                name="carKmsPerYear"
                type="number"
                min="0"
                value={formData.carKmsPerYear}
                onChange={(e) => handleChange('carKmsPerYear', e.target.value)}
                placeholder={unitSystem === 'metric' ? "e.g., 15000" : "e.g., 9300"}
              />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="carPassengers" className="text-base font-normal">Avg. Passengers (incl. driver)</Label>
              <Input
                id="carPassengers"
                name="carPassengers"
                type="number"
                min="1"
                value={formData.carPassengers}
                onChange={(e) => handleChange('carPassengers', e.target.value)}
                placeholder="e.g., 2"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 p-4 border rounded-lg shadow-sm bg-card/30">
          <legend className="text-lg font-semibold px-1 text-primary">🚲 Bike & Motorcycle</legend>
          <p className="text-sm text-muted-foreground px-1 mt-1 mb-3">
            Include travel by bicycle, e-bike, or motorcycle.
          </p>
          <div className="space-y-2">
            <Label htmlFor="bikeKmsPerYear" className="text-base font-normal">Annual Bike/Motorcycle Distance ({unitSystem === 'metric' ? 'km' : 'miles'})</Label>
            <Input
              id="bikeKmsPerYear"
              name="bikeKmsPerYear"
              type="number"
              min="0"
              value={formData.bikeKmsPerYear}
              onChange={(e) => handleChange('bikeKmsPerYear', e.target.value)}
              placeholder={unitSystem === 'metric' ? "e.g., 800" : "e.g., 500"}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 p-4 border rounded-lg shadow-sm bg-card/30">
          <legend className="text-lg font-semibold px-1 text-primary">🚌 Public Transport</legend>
           <p className="text-sm text-muted-foreground px-1 mt-1 mb-3">
            Estimate your yearly travel using various forms of public transit.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicTransportType" className="text-base font-normal">Primary Transport Type</Label>
              <Select
                name="publicTransportType"
                value={formData.publicTransportType}
                onValueChange={(value) => handleChange('publicTransportType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select transport type" />
                </SelectTrigger>
                <SelectContent>
                  {publicTransportOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicTransportKmsPerYear" className="text-base font-normal">Annual Distance ({unitSystem === 'metric' ? 'km' : 'miles'})</Label>
              <Input
                id="publicTransportKmsPerYear"
                name="publicTransportKmsPerYear"
                type="number"
                min="0"
                value={formData.publicTransportKmsPerYear}
                onChange={(e) => handleChange('publicTransportKmsPerYear', e.target.value)}
                placeholder={unitSystem === 'metric' ? "e.g., 1000" : "e.g., 620"}
                disabled={formData.publicTransportType === 'none'}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 p-4 border rounded-lg shadow-sm bg-card/30">
          <legend className="text-lg font-semibold px-1 text-primary">🏨 Hotel Stays</legend>
           <p className="text-sm text-muted-foreground px-1 mt-1 mb-3">
            Include nights spent in hotels or similar paid accommodations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hotelNightsPerYear" className="text-base font-normal">Total Nights Per Year</Label>
              <Input
                id="hotelNightsPerYear"
                name="hotelNightsPerYear"
                type="number"
                min="0"
                value={formData.hotelNightsPerYear}
                onChange={(e) => handleChange('hotelNightsPerYear', e.target.value)}
                placeholder="e.g., 14"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotelStarRating" className="text-base font-normal">Average Hotel Star Rating</Label>
              <Select
                name="hotelStarRating"
                value={formData.hotelStarRating}
                onValueChange={(value) => handleChange('hotelStarRating', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select star rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">⭐ 1 Star</SelectItem>
                  <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}
