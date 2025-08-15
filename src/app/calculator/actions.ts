
"use server";

import { 
  suggestCalculatorOffset, 
  getCarbonReductionTips, 
  getEcoType,
  type SuggestedCalculatorOffsetInput, 
  type SuggestedCalculatorOffsetOutput,
  type CarbonReductionTipsInput, 
  type CarbonReductionTipsOutput,
  type EcoTypeInput, 
  type EcoTypeOutput 
} from '@/ai/stubs';
import type { Offset } from '@/components/marketplace/token-card';

interface SuggestedOffsetActionResult {
  data?: Offset | null;
  error?: string | null;
}

export async function fetchSuggestedCalculatorOffset(footprint: number): Promise<SuggestedOffsetActionResult> {
  try {
    const input: SuggestedCalculatorOffsetInput = { carbonFootprint: footprint };
    const result: SuggestedCalculatorOffsetOutput = await suggestCalculatorOffset(input); 
    
    if (!result || !result.id) {
        return { error: "AI failed to generate a valid suggested offset. The response was empty or invalid." };
    }
    return { data: result, error: null };
  } catch (error) {
    console.error("Error fetching suggested calculator offset:", error);
    let errorMessage = "An unexpected error occurred while fetching the suggested offset.";
    if (error instanceof Error) {
        if (error.message.includes("deadline")) {
            errorMessage = "The request to the AI service for offset suggestion timed out. Please try again later.";
        } else if (error.message.includes("quota")) {
            errorMessage = "We've reached our current limit for AI suggestions. Please try again later.";
        }
    }
    return { error: errorMessage };
  }
}

interface CarbonReductionTipsResult {
    data?: CarbonReductionTipsOutput['tips'] | null;
    error?: string | null;
}

export async function fetchCarbonReductionTips(input: CarbonReductionTipsInput): Promise<CarbonReductionTipsResult> {
    const result = await getCarbonReductionTips(input);
    return { data: result.tips, error: null };
}


interface EcoTypeResult {
    data?: EcoTypeOutput | null;
    error?: string | null;
}

export async function fetchEcoType(input: EcoTypeInput): Promise<EcoTypeResult> {
    const result = await getEcoType(input);
    return { data: result, error: null };
}
