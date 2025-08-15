
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Check, Gift, ShoppingCart, Shuffle } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const possibleGifts = [
    "100 Bonus Eco-Points!",
    "A limited edition 'Climate Hero' Badge!",
    "x2 Multiplier on next offset purchase!",
    "Free entry to next trading tournament!",
    "A surprise virtual tree planted in your name!",
];

const mockProjectData = {
    id: "cause-indigenous-friends",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "indigenous people ceremony",
    fundingStatus: "2 Months Left - 8% Funded",
    title: "Indigenous Friends Association",
    description: "Bridge the digital divide for Indigenous communities with our Indigi-DAO. This initiative focuses on providing access...",
    location: "Toronto, CA",
    fundingProgress: "$0 raised of $1,500",
};

interface GiftCardProps {
    variant?: 'gift' | 'collectable';
}

export default function GiftCard({ variant = 'gift' }: GiftCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [giftMessage, setGiftMessage] = useState("");

    const handleFlip = () => {
        if (variant === 'gift' && !isFlipped) {
            const randomIndex = Math.floor(Math.random() * possibleGifts.length);
            setGiftMessage(possibleGifts[randomIndex]);
        }
        setIsFlipped(!isFlipped);
    };
    
    const resetGift = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card from flipping back immediately
        setIsFlipped(false);
        // Add a small delay for the card to flip back before clearing the message
        setTimeout(() => {
            setGiftMessage("");
        }, 300);
    };

    const renderFront = () => {
        if (variant === 'gift') {
            return (
                <div className="w-full h-full flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300 bg-accent/20 rounded-lg p-4 text-center items-center justify-center">
                    <div className="flex-grow flex items-center justify-center">
                        <Gift className="h-24 w-24 text-primary/30" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center w-full mt-auto">Click to reveal your daily reward!</p>
                </div>
            );
        }
        // Collectable Front
        return (
            <div className="animated-gradient-card w-full h-full">
                <div className="w-full h-full flex flex-col p-3 bg-background/80 rounded-[calc(var(--radius)-1.5px)] text-card-foreground space-y-2">
                    <div className="relative aspect-[3/2] w-full shrink-0">
                        <Image
                            src={mockProjectData.imageUrl}
                            fill
                            style={{ objectFit: 'cover' }}
                            alt={mockProjectData.title}
                            data-ai-hint={mockProjectData.dataAiHint}
                            className="rounded-md"
                        />
                    </div>
                    <div className="flex flex-col flex-grow p-1 space-y-2 text-left">
                        <p className="text-xs text-muted-foreground">{mockProjectData.fundingStatus}</p>
                        <p className="text-sm font-bold text-foreground leading-snug">{mockProjectData.title}</p>
                        <p className="text-xs text-muted-foreground flex-grow text-left">{mockProjectData.description}</p>
                        <Separator className="my-2 bg-muted"/>
                        <div className="flex justify-between items-center text-sm">
                            <p className="text-green-400 font-semibold">{mockProjectData.fundingProgress}</p>
                            <div className="flex items-center gap-1 text-foreground">
                                <Users className="h-4 w-4"/>
                                <Check className="h-4 w-4"/>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center w-full shrink-0 pt-2">Click to flip for more details</p>
                </div>
            </div>
        );
    };
    
    const renderBack = () => {
        if (variant === 'gift') {
            return (
                 <div className="w-full h-full flex flex-col items-center justify-center p-4 border border-primary/50 bg-background/90 shadow-lg text-center rounded-lg">
                    <div className="p-3 text-4xl">🎁</div>
                    <h3 className="text-2xl font-semibold text-primary mb-2">Congratulations!</h3>
                    <p className="text-base text-foreground mb-4 leading-tight px-1 flex-grow flex items-center justify-center">{giftMessage}</p>
                    <Button onClick={resetGift} variant="outline" size="sm" className="text-xs px-2 py-1 h-auto mt-auto">
                        <Shuffle className="mr-1 h-3 w-3" />
                        Claim Another
                    </Button>
                </div>
            );
        }
        // Collectable Back
        return (
            <div className="animated-gradient-card w-full h-full">
                <div className="w-full h-full flex flex-col p-4 bg-background/80 rounded-[calc(var(--radius)-1.5px)] text-card-foreground">
                    <div className="flex flex-col space-y-1.5 p-2 text-left">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">{mockProjectData.title}</h3>
                        <p className="text-sm text-muted-foreground">Full Details</p>
                    </div>

                    <div className="p-2 flex-grow space-y-3 overflow-y-auto">
                        <p className="text-sm text-muted-foreground">{mockProjectData.description}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="w-full max-w-xs sm:max-w-none sm:w-64 md:w-full aspect-[2.5/3.5] cursor-pointer group"
            onClick={handleFlip}
            style={{ perspective: '1000px' }}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 ease-in-out ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden">
                    {renderFront()}
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)]">
                    {renderBack()}
                </div>
            </div>
        </div>
    );
}
