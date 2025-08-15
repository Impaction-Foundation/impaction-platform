
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, DollarSign, Zap, Leaf, ShieldCheck, Target, ShoppingCart, MapPin } from 'lucide-react';

export interface Offset {
  id: string;
  name: string;
  projectDescription: string;
  price: number;
  units: string;
  environmentalImpact: string;
  imageUrl: string;
  category: string;
  esgRating: string;
  sdgAlignment: string;
  region?: string;
  dataAiHint?: string;
  projectSizeCategory?: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Massive' | string;
}

interface OffsetCardProps {
  offset: Offset;
}

export default function OffsetCard({ offset }: OffsetCardProps) {
  const isPartnershipSdg = offset.sdgAlignment === "Partnerships for the Goals";

  return (
    <Card className="flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={offset.imageUrl}
            alt={offset.name}
            fill
            style={{objectFit: "cover"}}
            className="rounded-t-lg"
            data-ai-hint={offset.dataAiHint}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-semibold text-foreground mb-1">{offset.name}</CardTitle>
          <Badge variant="secondary">{offset.category}</Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {offset.projectDescription}
        </CardDescription>

        <div className="space-y-2 text-sm mb-3">
          <div className="flex items-center text-foreground">
            <DollarSign className="h-4 w-4 mr-2 text-primary shrink-0" />
            <span>Price: ${offset.price.toFixed(2)} / {offset.units}</span>
          </div>
          <div className="flex items-start text-foreground">
            <Leaf className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
            <span>Impact: {offset.environmentalImpact.substring(0,50)}{offset.environmentalImpact.length > 50 ? '...' : ''}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-1">
            <Badge variant="outline" className={isPartnershipSdg ? "border-orange-500 text-orange-600" : "border-blue-500 text-blue-600"}>
                <Target className="h-3 w-3 mr-1" />
                SDG: {offset.sdgAlignment}{isPartnershipSdg ? " (Details Soon)" : ""}
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-600">
                <ShieldCheck className="h-3 w-3 mr-1" />
                ESG: {offset.esgRating}
            </Badge>
            {offset.projectSizeCategory && (
              <Badge variant="outline" className="border-purple-500 text-purple-600">
                <Zap className="h-3 w-3 mr-1" />
                Size: {offset.projectSizeCategory}
              </Badge>
            )}
            {offset.region && (
              <Badge variant="outline" className="border-cyan-500 text-cyan-600">
                <MapPin className="h-3 w-3 mr-1" />
                {offset.region}
              </Badge>
            )}
        </div>

      </CardContent>
      <CardFooter className="p-4 flex gap-2 mt-auto">
        <Button 
          asChild
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={isPartnershipSdg}
        >
          {isPartnershipSdg ? (
            // This content will be inside the disabled button
            <span>Info Coming Soon</span>
          ) : (
            <Link href={`/purchase/${offset.id}`}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Buy Offset
            </Link>
          )}
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/purchase/${offset.id}?view=details`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
    
