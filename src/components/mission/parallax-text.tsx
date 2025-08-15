
'use client';
import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxTextProps {
  children: string;
  className?: string;
  as?: React.ElementType;
}

const ParallaxText: React.FC<ParallaxTextProps> = ({ children, className, as: Comp = 'div' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const characters = children.split('');

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const chars = Array.from(element.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      chars.forEach((char) => {
        // Generate a random speed for each character between -0.1 and -0.6
        const speed = (Math.random() * -0.5) - 0.1;
        gsap.to(char, {
          y: () => ScrollTrigger.maxScroll(window) * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <Comp ref={containerRef} className={cn("flex", className)}>
      {characters.map((char, index) => (
        <span key={index} className="relative inline-block">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Comp>
  );
};

export default ParallaxText;
