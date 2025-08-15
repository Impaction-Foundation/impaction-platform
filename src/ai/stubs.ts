// Stub implementations for AI functions

import type { Offset } from '@/components/marketplace/token-card';

// Types
export interface SuggestedCalculatorOffsetInput {
  carbonFootprint: number;
}

export type SuggestedCalculatorOffsetOutput = Offset;

export interface CarbonReductionTipsInput {
  totalFootprint: number;
  sectionFootprints: Record<string, number>;
  countryOfResidence: string;
}

export interface TipSchema {
  category: string;
  suggestion: string;
  potentialImpact: string;
  implementationDifficulty: 'Easy' | 'Medium' | 'Difficult';
}

export interface CarbonReductionTipsOutput {
  tips: TipSchema[];
}

export interface EcoTypeInput {
  [key: string]: any;
}

export interface EcoTypeOutput {
  ecoType: string;
  rationale: string;
}

// Stub implementations
export async function suggestCalculatorOffset(input: SuggestedCalculatorOffsetInput): Promise<SuggestedCalculatorOffsetOutput> {
  // Stub implementation - returns a mock offset based on footprint
  const mockOffsets: Offset[] = [
    {
      id: 'forest-conservation',
      name: 'Forest Conservation Project',
      projectDescription: 'Protecting rainforests in the Amazon',
      price: 15,
      units: '1 ton CO2e',
      environmentalImpact: 'Preserves 1000 hectares of rainforest annually',
      imageUrl: 'https://placehold.co/400x300.png',
      category: 'Nature-Based',
      esgRating: 'AAA',
      sdgAlignment: 'Climate Action',
      region: 'Brazil',
      dataAiHint: 'forest',
      projectSizeCategory: 'Large',
    },
    {
      id: 'renewable-energy',
      name: 'Solar Energy Initiative',
      projectDescription: 'Supporting solar installations in developing regions',
      price: 20,
      units: '1 ton CO2e',
      environmentalImpact: 'Reduces 5000 tons of CO2 emissions per year',
      imageUrl: 'https://placehold.co/400x300.png',
      category: 'Renewable Energy',
      esgRating: 'AA',
      sdgAlignment: 'Affordable and Clean Energy',
      region: 'India',
      dataAiHint: 'solar panels',
      projectSizeCategory: 'Medium',
    },
    {
      id: 'ocean-cleanup',
      name: 'Ocean Cleanup Project',
      projectDescription: 'Removing plastic from oceans and protecting marine life',
      price: 25,
      units: '1 ton CO2e',
      environmentalImpact: 'Removes 10000 kg of plastic from oceans annually',
      imageUrl: 'https://placehold.co/400x300.png',
      category: 'Blue Carbon',
      esgRating: 'AAA',
      sdgAlignment: 'Life Below Water',
      region: 'Pacific Ocean',
      dataAiHint: 'ocean',
      projectSizeCategory: 'Massive',
    },
  ];

  // Simple logic to select offset based on footprint
  if (input.carbonFootprint < 5000) {
    return mockOffsets[0];
  } else if (input.carbonFootprint < 10000) {
    return mockOffsets[1];
  } else {
    return mockOffsets[2];
  }
}

export async function getCarbonReductionTips(input: CarbonReductionTipsInput): Promise<CarbonReductionTipsOutput> {
  // Stub implementation - returns mock tips
  const mockTips: TipSchema[] = [
    {
      category: 'Transportation',
      suggestion: 'Consider using public transportation or carpooling to reduce your carbon footprint from daily commutes.',
      potentialImpact: 'High - Could reduce emissions by 20-30%',
      implementationDifficulty: 'Easy',
    },
    {
      category: 'Energy',
      suggestion: 'Switch to renewable energy sources for your home electricity needs.',
      potentialImpact: 'Very High - Could reduce emissions by 30-40%',
      implementationDifficulty: 'Medium',
    },
    {
      category: 'Diet',
      suggestion: 'Reduce meat consumption and incorporate more plant-based meals into your diet.',
      potentialImpact: 'Medium - Could reduce emissions by 10-15%',
      implementationDifficulty: 'Easy',
    },
    {
      category: 'Home',
      suggestion: 'Improve home insulation to reduce heating and cooling energy consumption.',
      potentialImpact: 'High - Could reduce emissions by 15-25%',
      implementationDifficulty: 'Difficult',
    },
    {
      category: 'Shopping',
      suggestion: 'Buy second-hand clothing and reduce fast fashion purchases.',
      potentialImpact: 'Medium - Could reduce emissions by 5-10%',
      implementationDifficulty: 'Easy',
    },
  ];

  // Return a subset of tips based on the footprint
  const numberOfTips = Math.min(5, Math.max(3, Math.floor(input.totalFootprint / 3000)));
  return {
    tips: mockTips.slice(0, numberOfTips),
  };
}

export async function getEcoType(_input: EcoTypeInput): Promise<EcoTypeOutput> {
  // Stub implementation - returns a mock eco type
  const ecoTypes = [
    {
      ecoType: 'Eco-Conscious Beginner',
      rationale: 'Your responses indicate you are starting your sustainability journey with awareness and good intentions.',
    },
    {
      ecoType: 'Green Enthusiast',
      rationale: 'You show strong commitment to environmental practices and actively seek ways to reduce your impact.',
    },
    {
      ecoType: 'Sustainability Champion',
      rationale: 'You demonstrate exceptional dedication to environmental stewardship across multiple aspects of your lifestyle.',
    },
    {
      ecoType: 'Climate Action Leader',
      rationale: 'Your comprehensive approach to sustainability sets an example for others to follow.',
    },
  ];

  // Simple random selection for stub
  const randomIndex = Math.floor(Math.random() * ecoTypes.length);
  return ecoTypes[randomIndex];
}