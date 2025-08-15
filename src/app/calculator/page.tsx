
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NutritionForm from "@/components/calculator/nutrition-form";
import PetsForm from "@/components/calculator/pets-form";
import FamilyForm from "@/components/calculator/family-form";
import PropertyForm from "@/components/calculator/property-form";
import TravelForm from "@/components/calculator/travel-form";
import IndustrialForm from "@/components/calculator/industrial-form";
import TechnologyForm from "@/components/calculator/technology-form";
import ShoppingForm from "@/components/calculator/shopping-form";
import ShippingForm from "@/components/calculator/shipping-form";
import BasicCalculatorForm, { type BasicFormData } from "@/components/calculator/basic-calculator-form";
import ReCaptcha from '@/components/calculator/recaptcha';
import { Leaf, ShieldCheck, Target, Activity, CheckCircle2, UserPlus, Loader2, AlertTriangle, Info, Scaling, Calculator as CalculatorIcon, UserCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import OffsetCard, { type Offset } from '@/components/marketplace/token-card';
import { fetchSuggestedCalculatorOffset, fetchCarbonReductionTips, fetchEcoType } from './actions';
import type { CarbonReductionTipsInput, TipSchema as CarbonReductionTipSchema, EcoTypeInput } from '@/ai/stubs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import AuthDialog from '@/components/auth/auth-dialog';
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { countryOptions, sdgAlignments, personaOptions, personaBasicValues, dynamicOffsetOptions, initialSectionFootprintsState, factors } from './calculator-data';


type UnitSystem = 'metric' | 'imperial';

interface PropertyEntryData {
  id: string;
  propertyType: string;
  squareFootage: number;
  numberOfRooms: number;
  energySource: string;
  recycling: string;
  hotelStarRating: string;
  annualDaysOccupied: number;
}
interface IndustrialFacilityData {
    id:string;
    businessType: string;
    countryOfBusinessOperation: string;
    dataCenterUsage: number;
    otherIndustrialActivity: string;
    primaryEnergySource: string;
    annualEnergyConsumptionKwh: number;
    numberOfEmployees: number;
    cityType: string;
}
interface PetEntryData {
    id: string;
    petType: string;
    numberOfPets: number;
}
interface FlightEntryData {
    id: string;
    flightType: string;
    hours: number;
    passengers: number;
    flightClass: string;
    tripPurpose: string;
}

const ecoTypeEmojis: Record<string, string> = {
  'Techno Optimist': '🚀',
  'Global Citizen': '🌍',
  'Reductive Minimalist': '🌿',
  'Eco-Maximalist': '🌳',
  'Generational Guild': '🏡',
  'Nature-Bound Idealist': '🏞️',
  'Urban Pragmatist': '🏙️',
  'Uncategorized': '❓',
};

const stepperContent = [
    {
        title: "How This Calculator Works",
        image: "https://placehold.co/600x400.png",
        imageHint: "calculator illustration",
        description: "Ready to see your climate impact clearly? This calculator helps you understand your personal carbon story."
    },
    {
        title: "Answer Simple Questions",
        image: "https://placehold.co/600x400.png",
        imageHint: "lifestyle icons collage",
        description: "Answer simple questions about your lifestyle—like nutrition, travel, and energy use—to get a clear estimate of your annual CO₂e (carbon dioxide equivalent)."
    },
    {
        title: "Get Actionable Insights",
        image: "https://placehold.co/600x400.png",
        imageHint: "AI lightbulb idea",
        description: "This insight isn't just a number; it’s your starting point for making impactful changes. Our AI provides actionable tips and suggests relevant offset projects."
    }
];

export default function CalculatorPage() {
  const { toast } = useToast();
  const [totalFootprint, setTotalFootprint] = useState(0);
  const [countryOfResidence, setCountryOfResidence] = useState('US');
  const [preferredSdg, setPreferredSdg] = useState('All');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('custom');
  const [personaValuesForBasicForm, setPersonaValuesForBasicForm] = useState<BasicFormData | undefined>(undefined);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = stepperContent.length;


  const [dynamicallySelectedOffset, setDynamicallySelectedOffset] = useState<Offset>(dynamicOffsetOptions[0]);
  const [isLoadingSuggestedOffset, setIsLoadingSuggestedOffset] = useState(false);
  const [suggestedOffsetError, setSuggestedOffsetError] = useState<string | null>(null);

  const [reductionTips, setReductionTips] = useState<CarbonReductionTipSchema[] | null>(null);
  const [isLoadingReductionTips, setIsLoadingReductionTips] = useState(false);
  const [reductionTipsError, setReductionTipsError] = useState<string | null>(null);

  const [ecoTypeResult, setEcoTypeResult] = useState<{ ecoType: string; rationale: string; } | null>(null);
  const [isLoadingEcoType, setIsLoadingEcoType] = useState(false);
  const [ecoTypeError, setEcoTypeError] = useState<string | null>(null);

  const [currentFormsData, setCurrentFormsData] = useState<Record<string, any>>({});
  const [sectionFootprints, setSectionFootprints] = useState(initialSectionFootprintsState);

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, maxSteps - 1));
  };

  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };


  const getEcoTypeEmoji = (ecoType: string) => {
    return ecoTypeEmojis[ecoType] || '❓';
  };

  useEffect(() => {
    if (countryOfResidence === 'US') {
      setUnitSystem('imperial');
    } else {
      setUnitSystem('metric');
    }
  }, [countryOfResidence]);

  useEffect(() => {
    setPersonaValuesForBasicForm(personaBasicValues[selectedPersona]);
  }, [selectedPersona]);


  useEffect(() => {
    let newTotalFootprint = 0;
    const newCalculatedSectionFootprints: Record<keyof typeof initialSectionFootprintsState, number> = { ...initialSectionFootprintsState };

    for (const sectionKey in currentFormsData) {
        const section = sectionKey as keyof typeof initialSectionFootprintsState;
        const formDataForSection = currentFormsData[section];
        if (formDataForSection && initialSectionFootprintsState.hasOwnProperty(section)) {
            const footprint = calculateSectionFootprint(formDataForSection, section, unitSystem);
            newCalculatedSectionFootprints[section] = footprint;
        }
    }
    
    newTotalFootprint = Object.values(newCalculatedSectionFootprints).reduce((sum, val) => sum + (val || 0), 0);

    if (JSON.stringify(newCalculatedSectionFootprints) !== JSON.stringify(sectionFootprints)) {
        setSectionFootprints(newCalculatedSectionFootprints);
    }
    if (newTotalFootprint !== totalFootprint) {
        setTotalFootprint(newTotalFootprint);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormsData, unitSystem]);


 useEffect(() => {
    if (totalFootprint > 0 && isCaptchaVerified) {
      localStorage.setItem('ecoSwapLastFootprint', totalFootprint.toString());

      // Fetch Suggested Offset
      setIsLoadingSuggestedOffset(true);
      setSuggestedOffsetError(null);
      fetchSuggestedCalculatorOffset(totalFootprint)
        .then(result => {
          if (result.error) {
            setSuggestedOffsetError(result.error);
            if (totalFootprint < 1500) setDynamicallySelectedOffset(dynamicOffsetOptions[0]);
            else if (totalFootprint <= 5000) setDynamicallySelectedOffset(dynamicOffsetOptions[1]);
            else if (totalFootprint <= 10000) setDynamicallySelectedOffset(dynamicOffsetOptions[2]);
            else setDynamicallySelectedOffset(dynamicOffsetOptions[3]);
          } else if (result.data) {
            setDynamicallySelectedOffset(result.data);
          }
        })
        .catch(err => {
          console.error("Error fetching suggested offset:", err);
          setSuggestedOffsetError("Failed to get AI suggestion. Using a default based on your footprint.");
          if (totalFootprint < 1500) setDynamicallySelectedOffset(dynamicOffsetOptions[0]);
          else if (totalFootprint <= 5000) setDynamicallySelectedOffset(dynamicOffsetOptions[1]);
          else if (totalFootprint <= 10000) setDynamicallySelectedOffset(dynamicOffsetOptions[2]);
          else setDynamicallySelectedOffset(dynamicOffsetOptions[3]);
        })
        .finally(() => {
          setIsLoadingSuggestedOffset(false);
        });

      // Fetch Reduction Tips
      setIsLoadingReductionTips(true);
      setReductionTipsError(null);
      setReductionTips(null); 
      const tipsInput: CarbonReductionTipsInput = {
        totalFootprint,
        sectionFootprints, 
        countryOfResidence,
      };
      fetchCarbonReductionTips(tipsInput)
        .then(result => {
            if (result.error) {
                setReductionTipsError(result.error);
            } else if (result.data) {
                setReductionTips(result.data);
                 try {
                    localStorage.setItem('ecoExchangeRawTips', JSON.stringify(result.data));
                    toast({
                        title: "AI Tips Generated!",
                        description: "View and manage them in your Impact Monitor's Action Plan.",
                    });
                } catch (e) {
                    console.error("Failed to save tips to localStorage", e);
                    toast({
                        title: "Error Saving Tips",
                        description: "Could not save tips for your Action Plan.",
                        variant: "destructive"
                    });
                }
            }
        })
        .catch(err => {
            console.error("Error fetching reduction tips:", err);
            setReductionTipsError("Failed to get AI-powered reduction tips. Using default suggestions.");
        })
        .finally(() => {
            setIsLoadingReductionTips(false);
        });
      
      // Fetch Eco Type
      setIsLoadingEcoType(true);
      setEcoTypeError(null);
      setEcoTypeResult(null);
      const ecoTypeInput: EcoTypeInput = { ...currentFormsData };
      fetchEcoType(ecoTypeInput)
        .then(result => {
            if (result.error) {
                setEcoTypeError(result.error);
            } else if (result.data) {
                setEcoTypeResult(result.data);
            }
        })
        .catch(err => {
            console.error("Error fetching eco type:", err);
            setEcoTypeError("Failed to get AI-powered Eco-Type analysis.");
        })
        .finally(() => {
            setIsLoadingEcoType(false);
        });


    } else if (!isCaptchaVerified && totalFootprint > 0) {
        setSuggestedOffsetError("Please complete the verification to see suggestions.");
        setReductionTipsError("Please complete the verification to get reduction tips.");
        setEcoTypeError("Please complete the verification for an Eco-Type analysis.");
        setDynamicallySelectedOffset(dynamicOffsetOptions[0]); 
        setReductionTips(null);
        setEcoTypeResult(null);
    } else { 
      setDynamicallySelectedOffset(dynamicOffsetOptions[0]);
      setSuggestedOffsetError(null);
      setReductionTips(null); 
      setEcoTypeResult(null);
      setEcoTypeError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFootprint, isCaptchaVerified]); 


  const calculateSectionFootprint = (data: any, section: string, currentUnitSystem: UnitSystem): number => {
    let footprint = 0;
    const f = factors[section];

    if (!f || !data) return 0;

    switch (section) {
      case 'nutrition':
        footprint = (f.base || 0) + (f[data.dietType] || f.omnivore);
        const wasteKey = `waste_${data.foodWaste}`;
        const wasteMultiplier = f[wasteKey] || f.waste_medium;
        footprint *= wasteMultiplier;
        break;
      case 'pets':
        if (data.pets && Array.isArray(data.pets)) {
            data.pets.forEach((pet: PetEntryData) => {
                footprint += (f[pet.petType] || 0) * (pet.numberOfPets || 0);
            });
        }
        break;
      case 'family':
        footprint = (data.numberOfMembers || 0) * (f.additional_member_factor || 0);
        break;
      case 'property':
        if (data.properties && Array.isArray(data.properties)) {
            data.properties.forEach((prop: PropertyEntryData) => {
                let singlePropertyFootprint = 0;
                if (prop.propertyType === 'hotel_room') {
                    const dailyBase = f.hotel_room_base || 10;
                    const starMultiplierKey = `hotel_star_${prop.hotelStarRating || '3'}_multiplier`;
                    const starMultiplier = f[starMultiplierKey] || f.hotel_star_3_multiplier;
                    const days = prop.annualDaysOccupied ? Math.min(365, Math.max(1, prop.annualDaysOccupied)) : 365;
                    singlePropertyFootprint = dailyBase * starMultiplier * days;
                } else {
                    let base = 0;
                    if (prop.propertyType === 'apartment') base = f.apartment_base;
                    else if (prop.propertyType === 'home') base = f.home_base;
                    else if (prop.propertyType === 'villa') base = f.villa_base;
                    else if (prop.propertyType === 'island_property') base = f.island_property_base;

                    let propertyArea = prop.squareFootage || 0;
                    if (currentUnitSystem === 'metric' && prop.propertyType !== 'hotel_room') {
                        propertyArea = propertyArea * 10.7639;
                    }
                    singlePropertyFootprint = base + (propertyArea * f.sqft_factor) + ((prop.numberOfRooms || 0) * f.room_factor);
                }

                const energyMultiplier = f[`energy_${prop.energySource}`] || f.energy_none;
                singlePropertyFootprint *= Math.max(0.2, energyMultiplier);
                const recyclingMultiplier = f[`recycling_${prop.recycling}`] || f.recycling_no;
                singlePropertyFootprint *= recyclingMultiplier;
                footprint += singlePropertyFootprint;
            });
        }
        break;
      case 'travel':
        let carDist = data.carKmsPerYear || 0;
        if (currentUnitSystem === 'imperial') {
            carDist = carDist * 1.60934;
        }
        const carEmissionFactor = f[`car_${data.carFuelType}`] || (data.carFuelType === 'electric' ? f.car_electric_grid_charged : f.car_gasoline);
        const carTotalEmissions = carDist * carEmissionFactor;
        const carPassengers = Math.max(1, data.carPassengers || 1);
        footprint += carTotalEmissions / carPassengers;

        let bikeDist = data.bikeKmsPerYear || 0;
        if (currentUnitSystem === 'imperial') {
            bikeDist = bikeDist * 1.60934;
        }
        footprint += bikeDist * (f.bike_motorcycle || 0.01);

        if (data.flights && Array.isArray(data.flights)) {
          data.flights.forEach((flight: FlightEntryData) => {
            const baseRatePerHour = f[flight.flightType] || 0;
            const hours = flight.hours || 0;
            const passengersInParty = Math.max(1, flight.passengers || 1);
            const classMultiplier = f.flightClassMultipliers[flight.flightClass] || 1.0;

            if (flight.flightType === 'jet') {
              footprint += (baseRatePerHour * hours) / passengersInParty;
            } else if (flight.flightType === 'plane_short_haul' || flight.flightType === 'plane_long_haul') {
              footprint += (baseRatePerHour * hours * classMultiplier) * passengersInParty;
            }
          });
        }

        const hotelStarMultiplierKey = `hotel_star_${data.hotelStarRating}_multiplier`;
        const hotelMultiplier = f[hotelStarMultiplierKey] || f.hotel_star_3_multiplier;
        footprint += (data.hotelNightsPerYear || 0) * (f.hotel_base_night || 0) * hotelMultiplier;

        let publicTransportDist = data.publicTransportKmsPerYear || 0;
        if (currentUnitSystem === 'imperial') {
            publicTransportDist = publicTransportDist * 1.60934;
        }
        footprint += publicTransportDist * (f[data.publicTransportType] || f.none);
        break;
      case 'industrial':
         if (data.facilities && Array.isArray(data.facilities)) {
          data.facilities.forEach((facility: IndustrialFacilityData) => {
            let facilityFootprint = 0;
            facilityFootprint += (f[facility.businessType] || f.none);

            if (facility.dataCenterUsage > 100) {
              facilityFootprint += (facility.dataCenterUsage || 0) * (f.data_center_kwh_factor || 0.5);
            } else if (facility.dataCenterUsage > 0) {
              facilityFootprint += (facility.dataCenterUsage || 0) * (f.data_center_server_factor || 200);
            }

            facilityFootprint += (facility.annualEnergyConsumptionKwh || 0) * (f.kwh_factor || 0.4);
            facilityFootprint += (facility.numberOfEmployees || 0) * (f.employee_factor || 100);

            if (facility.otherIndustrialActivity && facility.otherIndustrialActivity.length > 5) {
              facilityFootprint += (f.other_base || 100) + facility.otherIndustrialActivity.length * 10;
            }

            const energySrcMultiplier = f[`energy_${facility.primaryEnergySource}_multiplier`] || f.energy_none_multiplier || 1.0;
            facilityFootprint *= energySrcMultiplier;

            const cityMultiplier = f[`city_${facility.cityType}_multiplier`] || f.city_medium_multiplier || 1.0;
            facilityFootprint *= cityMultiplier;

            footprint += facilityFootprint;
          });
        }
        break;
      case 'technology':
        let deviceFootprint = ((data.numComputers || 0) * (f.computer_annual || 0)) +
                              ((data.numLaptops || 0) * (f.laptop_annual || 0)) +
                              ((data.numTablets || 0) * (f.tablet_annual || 0)) +
                              ((data.numSmartphones || 0) * (f.smartphone_annual || 0)) +
                              ((data.numRouters || 0) * (f.router_annual || 0));
        let internetFootprint = ((data.leisureHoursPerDay || 0) * (f.internet_leisure_hourly || 0) * 365) +
                                ((data.workHoursPerDay || 0) * (f.internet_work_hourly || 0) * 365);
        footprint = deviceFootprint + internetFootprint;
        break;
      case 'shopping':
        let itemFootprint = (f.base || 0);
        itemFootprint += (data.shoes || 0) * (f.shoes || 0);
        itemFootprint += (data.pants || 0) * (f.pants || 0);
        itemFootprint += (data.tshirts || 0) * (f.tshirts || 0);
        itemFootprint += (data.shirts || 0) * (f.shirts || 0);
        itemFootprint += (data.other_clothes || 0) * (f.other_clothes || 0);
        const secondHandReduction = 1 - ((data.secondHandPercentage || 0) / 100);
        footprint = itemFootprint * secondHandReduction;
        break;
      case 'shipping':
        const domesticImpact = (data.domesticPackagesPerMonth || 0) * (f.domestic_package || 0);
        const internationalImpact = (data.internationalPackagesPerMonth || 0) * (f.international_package || 0);
        const speedMultiplier = f[`speed_${data.shippingSpeed}`] || f.speed_standard;
        footprint = (domesticImpact + internationalImpact) * speedMultiplier * 12;
        break;
      default:
        footprint = 0;
    }
    return Math.max(0, footprint);
  };

  const handleFormChange = (section: keyof typeof initialSectionFootprintsState, formDataFromChild: any) => {
    setCurrentFormsData(prev => ({ ...prev, [section]: formDataFromChild }));
  };


  const handleUnitSystemChange = (value: UnitSystem) => {
    setUnitSystem(value);
  };


  return (
    <div>
      <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle className="text-xl flex items-center justify-center font-headline text-center text-primary">
                      {stepperContent[activeStep].title}
                  </DialogTitle>
              </DialogHeader>
              <div className="relative w-full h-40 rounded-lg overflow-hidden my-4">
                  <Image
                      src={stepperContent[activeStep].image}
                      alt={stepperContent[activeStep].title}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={stepperContent[activeStep].imageHint}
                  />
              </div>
              <div className="py-4 text-sm text-center text-muted-foreground min-h-[60px]">
                  {stepperContent[activeStep].description}
              </div>
              <div className="flex items-center justify-center space-x-2 my-4">
                  {Array.from({ length: maxSteps }).map((_, index) => (
                      <div
                          key={index}
                          className={`h-2 w-2 rounded-full transition-colors ${
                              index === activeStep ? 'bg-primary' : 'bg-muted'
                          }`}
                      />
                  ))}
              </div>
              <DialogFooter className="flex sm:justify-between w-full">
                  {activeStep > 0 ? (
                      <Button variant="outline" onClick={handleBackStep}>
                          <ChevronLeft className="mr-2 h-4 w-4"/> Back
                      </Button>
                  ) : <div />}
                  {activeStep < maxSteps - 1 ? (
                      <Button onClick={handleNextStep}>
                          Next <ChevronRight className="ml-2 h-4 w-4"/>
                      </Button>
                  ) : (
                      <Button onClick={() => setIsInfoModalOpen(false)}>Get Started</Button>
                  )}
              </DialogFooter>
          </DialogContent>
      </Dialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              className="fixed top-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
              size="icon"
            >
              <Link href="/mission">
                <Info className="h-7 w-7" />
                <span className="sr-only">Our Mission</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Our Mission</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Card className="w-full rounded-b-lg rounded-t-none border-x-0 border-t-0">
        <CardContent className="container mx-auto py-6 px-4 text-center">
          <h1 className="text-4xl font-bold text-primary font-headline">Climate Footprint Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Understand your environmental impact across different aspects of your life.
          </p>
        </CardContent>
      </Card>
      <div className="container mx-auto p-4 md:p-8 mt-8">
        
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="globalCountryOfResidence" className="text-lg font-semibold text-foreground">
                🌍 Country of Residence
              </Label>
              <Select
                name="globalCountryOfResidence"
                value={countryOfResidence}
                onValueChange={(value) => {
                    setCountryOfResidence(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Your primary country of residence. This helps tailor some calculations and default units.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="globalPreferredSdg" className="text-lg font-semibold text-foreground">
                <Target className="inline-block mr-2 h-4 w-4 text-muted-foreground" /> Preferred SDG Alignment
              </Label>
              <Select
                name="globalPreferredSdg"
                value={preferredSdg}
                onValueChange={(value) => setPreferredSdg(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select preferred SDG alignment" />
                </SelectTrigger>
                <SelectContent>
                  {sdgAlignments.map(sdg => (
                    <SelectItem key={sdg.value} value={sdg.value}>
                      {sdg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose a UN Sustainable Development Goal you'd like to focus on for offset recommendations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-stretch">
                <div className="space-y-2 flex flex-col">
                    <Label htmlFor="metric" className="text-lg font-semibold text-foreground">📏 Unit System</Label>
                    <RadioGroup
                        value={unitSystem}
                        onValueChange={(value) => handleUnitSystemChange(value as UnitSystem)}
                        className="flex flex-col sm:flex-row gap-4 pt-2"
                    >
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="metric" id="metric" />
                        <Label htmlFor="metric" className="font-normal">Metric (km, m², kg)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="imperial" id="imperial" />
                        <Label htmlFor="imperial" className="font-normal">Imperial (miles, ft², lbs)</Label>
                        </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground mt-auto">
                        Choose your preferred unit system for inputs.
                    </p>
                </div>
                <div className="flex flex-col">
                  <ReCaptcha onVerify={setIsCaptchaVerified} />
                  <p className="text-xs text-muted-foreground mt-auto">
                    Please verify to help us ensure accurate calculations.
                  </p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
            <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="persona-selector" className="border-b-0">
                        <AccordionTrigger className="p-4 md:p-6 text-lg font-semibold text-foreground hover:no-underline [&[data-state=open]]:pb-4">
                            <div className="flex items-center gap-2">
                                <span>🧑‍🚀</span>
                                <span>Select Profile Persona (Optional)</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 md:px-6 pb-6 pt-0 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Selecting a persona can pre-fill the basic calculator with common values. This is a quick way to get a baseline estimate.
                            </p>
                            <div className="space-y-2">
                                <Label htmlFor="profilePersonaSelect" className="sr-only">Select Persona</Label>
                                <Select
                                    name="profilePersonaSelect"
                                    value={selectedPersona}
                                    onValueChange={(value) => setSelectedPersona(value)}
                                >
                                    <SelectTrigger id="profilePersonaSelect" className="w-full">
                                        <SelectValue placeholder="Select a persona..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {personaOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="basic">Basic</TabsTrigger>
                                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                                </TabsList>
                                <TabsContent value="basic" className="mt-4">
                                    <BasicCalculatorForm unitSystem={unitSystem} initialData={personaValuesForBasicForm} />
                                </TabsContent>
                                <TabsContent value="advanced" className="mt-4">
                                    <CardDescription className="text-center">
                                        For a comprehensive calculation, please use the detailed accordion sections below.
                                        The advanced tab will offer more granular settings in a future update.
                                    </CardDescription>
                                </TabsContent>
                            </Tabs>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-4 md:p-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="nutrition">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="Salad bowl emoji" className="mr-2 text-2xl">🥗</span> Nutrition
                    </AccordionTrigger>
                    <AccordionContent>
                      <NutritionForm onUpdate={(data) => { handleFormChange( "nutrition", data);}} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="pets">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="Paw prints emoji" className="mr-2 text-2xl">🐾</span> Pets
                    </AccordionTrigger>
                    <AccordionContent>
                      <PetsForm onUpdate={(data) => { handleFormChange("pets", data); }} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="family">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="Family emoji" className="mr-2 text-2xl">👨‍👩‍👧‍👦</span> Family
                    </AccordionTrigger>
                    <AccordionContent>
                      <FamilyForm onUpdate={(data) => { handleFormChange("family", data); }} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="property">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="House emoji" className="mr-2 text-2xl">🏠</span> Property
                    </AccordionTrigger>
                    <AccordionContent>
                      <PropertyForm unitSystem={unitSystem} onUpdate={(data) => { handleFormChange("property", data); }} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="technology">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="Laptop emoji" className="mr-2 text-2xl">💻</span> Technology
                    </AccordionTrigger>
                    <AccordionContent>
                      <TechnologyForm onUpdate={(data) => { handleFormChange("technology", data); }} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shopping">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="Shopping bags emoji" className="mr-2 text-2xl">🛍️</span> Shopping
                    </AccordionTrigger>
                    <AccordionContent>
                      <ShoppingForm onUpdate={(data) => { handleFormChange("shopping", data); }} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="travel">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="Airplane emoji" className="mr-2 text-2xl">✈️</span> Travel
                    </AccordionTrigger>
                    <AccordionContent>
                      <TravelForm unitSystem={unitSystem} onUpdate={(data) => { handleFormChange("travel", data);}} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="industrial">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="Factory emoji" className="mr-2 text-2xl">🏭</span> Company
                    </AccordionTrigger>
                    <AccordionContent>
                      <IndustrialForm onUpdate={(data) => { handleFormChange( "industrial", data); }} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shipping">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary [&[data-state=open]]:text-primary">
                      <span role="img" aria-label="Package emoji" className="mr-2 text-2xl">📦</span> Shipping
                    </AccordionTrigger>
                    <AccordionContent>
                      <ShippingForm onUpdate={(data) => { handleFormChange("shipping", data); }} />
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="w-full">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xl text-center text-foreground font-headline flex items-center justify-center">
                        <UserCircle className="mr-2 h-6 w-6 text-primary" />
                        Your Eco-Type
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center flex items-center justify-center p-4 pt-0 min-h-[120px]">
                    {isLoadingEcoType ? (
                        <div className="flex items-center text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span>Analyzing...</span>
                        </div>
                    ) : ecoTypeError ? (
                         <div className="flex flex-col items-center text-destructive">
                            <AlertTriangle className="mr-2 h-5 w-5 mb-1" />
                            <span className="text-sm">{ecoTypeError}</span>
                        </div>
                    ) : ecoTypeResult ? (
                        <div className="w-full text-center">
                            <h3 className="text-xl font-bold text-primary flex items-center justify-center">
                                <span className="mr-2 text-2xl">{getEcoTypeEmoji(ecoTypeResult.ecoType)}</span>
                                {ecoTypeResult.ecoType}
                            </h3>
                            <Accordion type="single" collapsible className="w-full mt-1">
                                <AccordionItem value="rationale" className="border-none">
                                    <AccordionTrigger className="flex justify-center p-1 text-sm font-medium text-muted-foreground hover:no-underline [&>svg]:h-4 [&>svg]:w-4">
                                        View Rationale
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm text-muted-foreground mt-1 px-2">
                                            {ecoTypeResult.rationale}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Fill out the calculator to discover your Eco-Type.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground font-headline flex items-center justify-center">
                  <Scaling className="mr-2 h-6 w-6 text-primary" />
                  Your Estimated Footprint
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-5xl font-bold text-foreground">
                  {totalFootprint.toFixed(2)}
                </p>
                <p className="text-muted-foreground">kg CO₂e per year</p>
                <div className="mt-4 h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (totalFootprint / 20000) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-4 space-y-2">
                <Dialog>
                <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Confirm & Start Tracking
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
                    <AuthDialog />
                </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                <CardTitle className="text-xl text-center text-foreground font-headline flex items-center justify-center">
                    <CheckCircle2 className="mr-2 h-6 w-6 text-primary" />
                    Recommended Offset
                </CardTitle>
                <div className="relative">
                    {dynamicallySelectedOffset && <OffsetCard offset={dynamicallySelectedOffset} />}
                    {isLoadingSuggestedOffset && (
                        <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>
                {suggestedOffsetError && <p className="text-sm text-destructive text-center">{suggestedOffsetError}</p>}
            </div>

          </div>
        </div>

        <Card className="mt-8 w-full">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center text-foreground font-headline">
                    <Info className="mr-2 h-6 w-6" />
                    Climate Reduction AI Tips
                </CardTitle>
                <CardDescription>Personalized suggestions to help you reduce your footprint.</CardDescription>
            </CardHeader>
            <CardContent>
            {isLoadingReductionTips ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="ml-3 text-muted-foreground">Generating your personalized tips...</p>
                </div>
            ) : reductionTipsError ? (
                <div className="flex flex-col items-center justify-center py-8 text-destructive">
                    <AlertTriangle className="h-10 w-10 mb-2" />
                    <p className="font-semibold">Could not load tips</p>
                    <p className="text-sm">{reductionTipsError}</p>
                </div>
            ) : reductionTips && reductionTips.length > 0 ? (
                <ul className="space-y-4">
                    {reductionTips.slice(0, 3).map((tip, index) => {
                        let borderColorClass = 'border-l-4 border-gray-400 dark:border-gray-600'; 
                        let difficultyBadgeBg = 'bg-gray-100 dark:bg-gray-700';
                        let difficultyBadgeText = 'text-gray-700 dark:text-gray-100';

                        if (tip.implementationDifficulty === 'Easy') {
                            borderColorClass = 'border-l-4 border-green-500';
                            difficultyBadgeBg = 'bg-green-100 dark:bg-green-800/30';
                            difficultyBadgeText = 'text-green-700 dark:text-green-300';
                        } else if (tip.implementationDifficulty === 'Medium') {
                            borderColorClass = 'border-l-4 border-yellow-500';
                            difficultyBadgeBg = 'bg-yellow-100 dark:bg-yellow-800/30';
                            difficultyBadgeText = 'text-yellow-700 dark:text-yellow-300';
                        } else if (tip.implementationDifficulty === 'Difficult') {
                            borderColorClass = 'border-l-4 border-red-500';
                            difficultyBadgeBg = 'bg-red-100 dark:bg-red-800/30';
                            difficultyBadgeText = 'text-red-700 dark:text-red-300';
                        }
                        return (
                            <li key={index} className={`p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors ${borderColorClass}`}>
                                <div className="flex items-center mb-2 justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {tip.category}
                                        </span>
                                        <span className="text-xs font-semibold text-accent">
                                            Potential Impact: {tip.potentialImpact}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${difficultyBadgeBg} ${difficultyBadgeText}`}>
                                        {tip.implementationDifficulty}
                                    </span>
                                </div>
                                <p className="text-foreground">{tip.suggestion}</p>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="text-center py-8">
                    <Info className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                        Fill in some calculator sections above to receive personalized AI-powered reduction tips.
                    </p>
                </div>
              )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
