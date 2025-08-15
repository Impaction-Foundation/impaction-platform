
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import ParallaxText from './parallax-text';
import HeroSphere from './hero-sphere';

const LoadingPercentage = () => {
    const { theme } = useTheme();
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = 99;
        let duration = 3000; // 3 seconds for a smoother feel
        let startTime: number | null = null;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentVal = Math.floor(progress * end);
            setPercentage(currentVal);

            if (elapsedTime < duration) {
                requestAnimationFrame(animate);
            } else {
                setPercentage(end);
            }
        };

        const animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);
    
    const clipRectY = 20 - (percentage / 99) * 20;

    return (
        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
            <div className={cn(
                "absolute inset-0 rounded-full animate-pulse-slow blur-xl",
                theme === 'dark' 
                    ? "bg-gradient-to-br from-teal-400 to-blue-500" 
                    : "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 opacity-90"
            )}></div>

            <div className="absolute inset-1 rounded-full bg-white dark:bg-black overflow-hidden">
                <HeroSphere />
            </div>

            <div className="absolute inset-0 rounded-full border-2 border-teal-400/50"></div>
            
            <div className="relative z-10 text-center font-cabin-condensed opacity-40">
                <svg viewBox="0 0 100 20" className="w-auto h-[100px] md:h-[120px] font-bold">
                    <defs>
                        <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--accent))" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" />
                        </linearGradient>
                        
                        <pattern id="wave" x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse">
                            <path d="M-40 9 Q-30 7 -20 9 T0 9 T20 9 T40 9 T60 9 T80 9 T100 9 T120 9 V20 H-40z" fill="url(#liquid-gradient)">
                                <animateTransform
                                    attributeName="transform"
                                    begin="0s"
                                    dur="1.5s"
                                    type="translate"
                                    from="0,0"
                                    to="40,0"
                                    repeatCount="indefinite" />
                            </path>
                        </pattern>
                        
                        <clipPath id="liquid-clip">
                            <rect x="0" y={clipRectY} width="100" height="20" />
                        </clipPath>
                    </defs>
                    
                    <text
                        textAnchor="middle"
                        x="50"
                        y="15"
                        fontSize="17"
                        className={cn("font-cabin-condensed", theme === 'light' ? 'text-black' : 'text-teal-400/20')}
                        fill="currentColor"
                    >
                        {percentage}<tspan fontSize="10" dy="-5">%</tspan>
                    </text>
                    
                    <text
                        textAnchor="middle"
                        x="50"
                        y="15"
                        fontSize="17"
                        className="font-cabin-condensed"
                        fill="url(#wave)"
                        clipPath="url(#liquid-clip)"
                    >
                        {percentage}<tspan fontSize="10" dy="-5">%</tspan>
                    </text>
                </svg>
            </div>
            <ParallaxText
                as="h1"
                className={cn(
                    "absolute z-20 font-headline text-6xl md:text-8xl tracking-[0.2em] md:tracking-[0.3em]",
                    theme === 'light' ? 'text-black' : 'text-white/90'
                )}
            >
                IMPACTION
            </ParallaxText>
        </div>
    );
};

export default LoadingPercentage;
