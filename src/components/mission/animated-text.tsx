
'use client';

import React, { useRef, useLayoutEffect, ElementType, ReactNode, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  splitType?: 'chars' | 'words' | 'lines';
  stagger?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  as: Comp = 'div',
  className,
  splitType = 'chars',
  stagger = 0.02,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // This ensures the animation code runs only on the client.
  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    if (!isClient) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const element = containerRef.current;
    if (!element) return;
    
    const split = new SplitText(element, { type: splitType, wordsClass: "split-word" });
    const targets = split[splitType as 'chars' | 'words' | 'lines'];

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
        y: 20,
        opacity: 0,
        ease: 'power2.out',
        stagger: stagger,
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (split.revert) {
        split.revert();
      }
    };
  }, [isClient, children, splitType, stagger]);

  // Render children transparently on the server to avoid flash of unstyled content
  // and ensure the DOM structure is the same for hydration.
  if (!isClient) {
    return (
      <Comp ref={containerRef} className={cn(className, 'opacity-0')}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp ref={containerRef} className={cn(className)}>
      {children}
    </Comp>
  );
};

export default AnimatedText;
