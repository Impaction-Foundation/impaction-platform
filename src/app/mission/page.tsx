"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Info,
  X,
  Users,
  Globe,
  Building,
  GitCommitHorizontal,
  Check,
  ArrowUpRight,
  ArrowDownCircle,
  Menu as MenuIcon,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  Settings,
  Sparkles,
  Send,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthDialog from "@/components/auth/auth-dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingPercentage from "@/components/mission/loading-percentage";
import { ThemeToggleSwitch } from "@/components/mission/theme-toggle-switch";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import AnimatedText from "@/components/mission/animated-text";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { SplitText } from 'gsap/SplitText'; // Premium plugin - not included in demo
import ParallaxText from "@/components/mission/parallax-text";
import FluidBackground from "@/components/mission/fluid-background";
import OffsetCard, { type Offset } from "@/components/marketplace/token-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GiftCard from "@/components/dashboard/gift-card";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const onMouseOver = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("a, button")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.body.style.cursor = "none";
    const interactiveElements = document.querySelectorAll("a, button");
    interactiveElements.forEach((el) => {
      (el as HTMLElement).style.cursor = "none";
    });

    document.addEventListener("mouseover", onMouseOver);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.body.style.cursor = "auto";
      interactiveElements.forEach((el) => {
        (el as HTMLElement).style.cursor = "auto";
      });
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed z-[9999] pointer-events-none rounded-full transition-transform duration-200 ease-in-out flex items-center justify-center",
        "w-8 h-8 border-2 border-foreground",
        isHovering ? "scale-125 bg-foreground/20" : "bg-black/20"
      )}
      style={{
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="w-1 h-1 bg-foreground rounded-full"></div>
    </div>
  );
};

const HeroNav = ({ onLogout }: { onLogout: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <Dialog>
      <header className="sticky top-0 left-0 right-0 z-[150] px-4 md:px-8 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center"></div>

        {/* Mobile Menu Panel (Fullscreen Overlay) */}
        <div
          className={cn(
            "md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-300 ease-in-out z-[200]",
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col items-center justify-between h-full w-full p-4">
            {/* Top Centered X */}
            <div className="w-full flex justify-center flex-shrink-0 py-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground p-2"
              >
                <X className="h-8 w-8" />
              </button>
            </div>

            {/* Scrollable Links Area */}
            <div className="flex-grow flex flex-col items-center justify-center gap-4 text-lg font-mono tracking-widest text-foreground uppercase overflow-y-auto w-full">
              <a
                href="#mission-statement"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-foreground/90 hover:text-primary transition-colors"
              >
                MISSION
              </a>
              <a
                href="#mapbox-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-foreground/90 hover:text-primary transition-colors"
              >
                TWIN
              </a>
              <a
                href="#web3"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-foreground/90 hover:text-primary transition-colors"
              >
                WEB3
              </a>
              <a
                href="#invest"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-foreground/90 hover:text-primary transition-colors"
              >
                INVEST
              </a>
              <a
                href="#privacy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-foreground/90 hover:text-primary transition-colors"
              >
                PRIVACY
              </a>
              <a
                href="#tools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-foreground/90 hover:text-primary transition-colors"
              >
                TOOLS
              </a>
              <Separator className="w-2/3 my-2 bg-foreground/50" />
              <div className="flex flex-col items-center justify-center gap-4">
                <a
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 opacity-20 hover:opacity-100 text-foreground/90 hover:text-primary transition-all"
                >
                  MERCH
                </a>
                <a
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 opacity-20 hover:opacity-100 text-foreground/90 hover:text-primary transition-all"
                >
                  DISCORD
                </a>
                <a
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 opacity-20 hover:opacity-100 text-foreground/90 hover:text-primary transition-all"
                >
                  LITEPAPER
                </a>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer mt-2">
                      <AvatarImage
                        src="https://placehold.co/40x40.png"
                        data-ai-hint="user icon"
                      />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Sign In</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem onClick={handleLogoutClick}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Bottom Theme Toggle */}
            <div className="flex-shrink-0 py-4">
              <ThemeToggleSwitch />
            </div>
          </div>
        </div>
      </header>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
        <AuthDialog />
      </DialogContent>
    </Dialog>
  );
};

const ScrollIndicator = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const indicatorRef = useRef<HTMLAnchorElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const fadeOutTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "200px top",
        end: "400px top",
        scrub: true,
      },
    });

    if (indicatorRef.current) {
      fadeOutTl.to(indicatorRef.current, { autoAlpha: 0, ease: "none" });
    }

    const ballAnimateTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "200px top",
        scrub: 1,
      },
    });

    if (ballRef.current) {
      ballAnimateTl.to(ballRef.current, {
        y: "88px", // Animate to just before the end of the line (h-24 is 96px)
        ease: "none",
      });
    }

    return () => {
      fadeOutTl.kill();
      ballAnimateTl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <a
      ref={indicatorRef}
      href="#mission-statement"
      onClick={onClick}
      aria-label="Scroll to next section"
      className="fixed left-8 md:left-12 top-1/2 -translate-y-1/2 z-[9000] flex flex-col items-center gap-3 text-foreground/80 font-mono text-xs tracking-widest hover:text-foreground transition-colors group"
    >
      <div className="relative h-24 w-px bg-foreground/50 group-hover:bg-foreground transition-colors">
        <div
          ref={ballRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 h-2 w-2 rounded-full bg-foreground scale-100 group-hover:scale-125 transition-transform"
        ></div>
      </div>
      <span>Scroll</span>
    </a>
  );
};

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SocialIcons = () => (
  <ul className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-[9000] flex flex-col gap-3">
    <li>
      <a
        href="#"
        aria-label="Facebook"
        className="group relative flex items-center justify-center w-7 h-7 bg-background text-center rounded-full overflow-hidden border-2 border-foreground/50 z-10"
      >
        <span className="absolute top-full left-0 w-full h-full bg-[#3b5999] transition-all duration-500 z-[-1] group-hover:top-0"></span>
        <FacebookIcon className="h-3 w-3 text-foreground/80 transition-all duration-500 relative z-10 group-hover:text-white group-hover:[transform:rotateY(360deg)]" />
      </a>
    </li>
    <li>
      <a
        href="#"
        aria-label="X/Twitter"
        className="group relative flex items-center justify-center w-7 h-7 bg-background text-center rounded-full overflow-hidden border-2 border-foreground/50 z-10"
      >
        <span className="absolute top-full left-0 w-full h-full bg-[#55acee] transition-all duration-500 z-[-1] group-hover:top-0"></span>
        <XIcon className="h-3 w-3 text-foreground/80 transition-all duration-500 relative z-10 group-hover:text-white group-hover:[transform:rotateY(360deg)]" />
      </a>
    </li>
    <li>
      <a
        href="#"
        aria-label="LinkedIn"
        className="group relative flex items-center justify-center w-7 h-7 bg-background text-center rounded-full overflow-hidden border-2 border-foreground/50 z-10"
      >
        <span className="absolute top-full left-0 w-full h-full bg-[#0077b5] transition-all duration-500 z-[-1] group-hover:top-0"></span>
        <LinkedinIcon className="h-3 w-3 text-foreground/80 transition-all duration-500 relative z-10 group-hover:text-white group-hover:[transform:rotateY(360deg)]" />
      </a>
    </li>
  </ul>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date("2030-01-01") - +new Date();
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    // Set the initial time on the client, and then update it every second.
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup the interval when the component unmounts.
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <div className="text-center font-mono">
      <p className="text-sm text-green-400 tracking-widest">
        {timeLeft.days > 0 ? timeLeft.days : "..."} DAYS TILL 2030
      </p>
      <p className="text-4xl md:text-5xl font-light text-foreground/60">
        {timeLeft.days > 0
          ? `${formatTime(timeLeft.hours)}.${formatTime(
              timeLeft.minutes
            )}.${formatTime(timeLeft.seconds)}`
          : "00.00.00"}
      </p>
    </div>
  );
};

const CustomAccordionTrigger = ({
  children,
  value,
  openValue,
}: {
  children: React.ReactNode;
  value: string;
  openValue: string[];
}) => {
  const isOpen = openValue.includes(value);
  return (
    <AccordionTrigger className="hover:no-underline [&_svg.lucide-chevron-down]:hidden">
      <div className="flex w-full items-center justify-between">
        <span className="text-3xl font-thin tracking-widest uppercase underline text-foreground">
          {children}
        </span>
        <div className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-transparent border border-foreground/50 text-foreground/80">
          {isOpen ? (
            <ArrowDownCircle className="h-5 w-5 text-primary" />
          ) : (
            <ArrowUpRight className="h-5 w-5" />
          )}
        </div>
      </div>
    </AccordionTrigger>
  );
};

const calculatorButtons = [
  { label: "TRAVEL", emoji: "✈️" },
  { label: "PROPERTY", emoji: "🏡" },
  { label: "NUTRITION", emoji: "🍲" },
  { label: "PETS", emoji: "🐴" },
  { label: "SOFTWARE", emoji: "💻" },
  { label: "BUSINESS", emoji: "💼" },
];

const monitorPanelOffsets: Offset[] = [
  {
    id: "1",
    name: "Rimba Raya REDD+",
    projectDescription:
      "Protects 64,000 hectares of peat swamp forest in Borneo, Indonesia.",
    price: 15.5,
    units: "1 ton CO₂e",
    environmentalImpact:
      "High biodiversity protection, orangutan sanctuary support.",
    imageUrl: "https://placehold.co/600x400.png",
    category: "Forestry",
    esgRating: "AA",
    sdgAlignment: "Climate Action",
    region: "Indonesia (Borneo)",
    dataAiHint: "forest conservation",
    projectSizeCategory: "Large",
  },
  {
    id: "2",
    name: "Meru Nanyuki Community Reforestation",
    projectDescription:
      "Reforestation project in Kenya, planting native trees to restore degraded land.",
    price: 12.0,
    units: "1 ton CO₂e",
    environmentalImpact:
      "Improved soil health, water retention, and local employment.",
    imageUrl: "https://placehold.co/600x400.png",
    category: "Forestry",
    esgRating: "A",
    sdgAlignment: "Life on Land",
    region: "Kenya (Meru County)",
    dataAiHint: "tree planting",
    projectSizeCategory: "Medium",
  },
  {
    id: "3",
    name: "Gujarat Solar Power Project",
    projectDescription:
      "Large-scale solar power plant in India, displacing fossil fuel-based electricity.",
    price: 18.75,
    units: "1 ton CO₂e",
    environmentalImpact: "Reduces greenhouse gas emissions from energy sector.",
    imageUrl: "https://placehold.co/600x400.png",
    category: "Renewable Energy",
    esgRating: "AA",
    sdgAlignment: "Affordable and Clean Energy",
    region: "India (Gujarat)",
    dataAiHint: "solar panels",
    projectSizeCategory: "Large",
  },
  {
    id: "4",
    name: "Efficient Cookstoves Uganda",
    projectDescription:
      "Distributes fuel-efficient cookstoves to households in Uganda, reducing wood consumption.",
    price: 9.2,
    units: "1 ton CO₂e",
    environmentalImpact:
      "Reduced deforestation, improved health for women and children.",
    imageUrl: "https://placehold.co/600x400.png",
    category: "Community",
    esgRating: "BBB",
    sdgAlignment: "Good Health and Well-being",
    region: "Uganda (Various Districts)",
    dataAiHint: "cookstove africa",
    projectSizeCategory: "Tiny",
  },
];

const sdgAlignments = [
  { value: "All", label: "🌐 UNSDG Impact" },
  { value: "Climate Action", label: "🌍 Climate Action" },
  { value: "Life on Land", label: "🌳 Life on Land" },
  {
    value: "Affordable and Clean Energy",
    label: "💡 Affordable and Clean Energy",
  },
  {
    value: "Good Health and Well-being",
    label: "❤️ Good Health and Well-being",
  },
  { value: "Life Below Water", label: "🐠 Life Below Water" },
];

export default function MissionPage() {
  const { theme } = useTheme();
  const [showAbout, setShowAbout] = useState(true);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [isMarketPanelOpen, setIsMarketPanelOpen] = useState(false);
  const { toast } = useToast();

  const mockProjectData = {
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "indigenous people ceremony",
    fundingStatus: "2 Months Left - 8% Funded",
    title: "Indigenous Friends Association",
    description:
      "Bridge the digital divide for Indigenous communities with our Indigi-DAO. This initiative focuses on providing access to technology and education, fostering economic opportunities and preserving cultural heritage for future generations.",
    location: "Toronto, CA",
    fundingProgress: "$0 raised of $1,500",
  };

  const web3Ref = useRef<HTMLDivElement>(null);
  const investRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLDivElement>(null);
  const missionStatementRef = useRef<HTMLDivElement>(null);
  const icebergRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out. (Demo)",
    });
  };

  const handleScrollToMission = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const missionElement = document.getElementById("mission-statement");
    if (missionElement) {
      missionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScroll = useRef(() => {});

  useEffect(() => {
    handleScroll.current = () => {
      const refs = [
        { key: "privacy", ref: privacyRef },
        { key: "invest", ref: investRef },
        { key: "web3", ref: web3Ref },
      ];

      const viewportTop = 0;
      let newOpenKeys: string[] = [];

      for (const { key, ref } of refs) {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top > viewportTop) {
            newOpenKeys.push(key);
          }
        }
      }

      setOpenAccordions((currentOpenAccordions) => {
        if (
          JSON.stringify(newOpenKeys.sort()) !==
          JSON.stringify(currentOpenAccordions.sort())
        ) {
          return newOpenKeys;
        }
        return currentOpenAccordions;
      });
    };
  }, []);

  useEffect(() => {
    const onScroll = () => handleScroll.current();
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (icebergRef.current) {
        gsap.to(icebergRef.current, {
          y: "40vh", // Move down by 40% of viewport height to sink
          ease: "none",
          scrollTrigger: {
            trigger: icebergRef.current.parentElement, // Hero section is the trigger
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    });

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <div className="text-foreground/90 font-mono">
      <CustomCursor />
      <HeroNav onLogout={handleLogout} />
      <div className="fixed left-0 top-0 h-full w-full pointer-events-none z-[9000]">
        <ScrollIndicator onClick={handleScrollToMission} />
        <SocialIcons />
      </div>

      {/* New Hero Section */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-[calc(theme(spacing.12)_+_20px)] left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <div className="w-64 bg-background/30 backdrop-blur-sm p-1 border border-foreground/20 pointer-events-auto">
            <Countdown />
          </div>
        </div>
        <div className="absolute inset-0 z-[5]">
          <FluidBackground />
        </div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backdrop.jpg"
            fill
            style={{ objectFit: "cover" }}
            alt="Abstract nebula background"
            data-ai-hint="nebula stars"
            className="opacity-40"
            priority
            sizes="100vw"
          />
        </div>
        <div
          ref={icebergRef}
          className="absolute bottom-0 left-0 right-0 h-3/5 z-10"
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/iceberg.png"
              fill
              style={{ objectFit: "cover" }}
              alt="Iceberg landscape"
              data-ai-hint="iceberg landscape"
              className="object-top"
              priority
              sizes="100vw"
            />
          </div>
        </div>

        <div className="absolute z-20 flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
          <LoadingPercentage />
        </div>

        {showCookieBanner && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 w-full px-4">
            <div className="mx-auto bg-background/80 text-foreground backdrop-blur-sm p-2 px-4 flex items-center justify-between gap-4 rounded whitespace-nowrap max-w-fit">
              <span className="text-foreground/80">
                TO ENSURE THE BEST EXPERIENCE WE USE COOKIES TO HELP RUN THE
                WEBSITE
              </span>
              <button
                onClick={() => setShowCookieBanner(false)}
                className="border-l border-foreground/20 pl-4 font-bold tracking-widest text-foreground/90 hover:text-foreground transition-colors"
              >
                OKAY
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 z-[52] bg-background/80 backdrop-blur-sm pointer-events-none">
          <div className="overflow-hidden whitespace-nowrap">
            <div className="flex animate-marquee-seamless">
              <p className="flex-shrink-0 whitespace-nowrap p-2 text-xs text-foreground/60 mx-4">
                "We have a choice: We can enhance life and come to know the
                universe that made us, or we can squander our 15 billion-year
                heritage in meaningless self-destruction."
              </p>
              <p
                aria-hidden="true"
                className="flex-shrink-0 whitespace-nowrap p-2 text-xs text-foreground/60 mx-4"
              >
                "We have a choice: We can enhance life and come to know the
                universe that made us, or we can squander our 15 billion-year
                heritage in meaningless self-destruction."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Mission Statement */}
      <div
        id="mission-statement"
        ref={missionStatementRef}
        className="relative flex min-h-screen w-full flex-col items-center bg-transparent overflow-hidden"
      >
        <FluidBackground />
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-grow pt-24 p-4 md:p-8">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-thin tracking-widest uppercase underline text-foreground">
              Mission
            </h2>
          </header>

          <div className="grid w-full max-w-7xl mx-auto grid-cols-1 md:grid-cols-5 gap-x-12 gap-y-8 items-center flex-grow">
            <div className="md:col-span-5">
              <h1 className="text-[48px] md:text-5xl lg:text-[84px] leading-[1.4] font-headline headline-text-mask-container">
                <span className="headline-text-mask">
                  We're on a mission to accelerate a sustainable future by
                  propelling environmental, and social impact across borders.
                </span>
              </h1>
            </div>
            <div className="md:col-start-3 md:col-span-3 space-y-4">
              <AnimatedText
                as="p"
                splitType="words"
                stagger={0.01}
                className="text-base leading-relaxed text-foreground/70 md:leading-relaxed"
              >
                An Earth exchange dApp to support truly sustainable causes and
                high value climate credits through impact offsetting.
              </AnimatedText>
              <AnimatedText
                as="p"
                splitType="words"
                stagger={0.01}
                className="text-base leading-relaxed text-foreground/70 md:leading-relaxed"
              >
                By gamifying philanthropy and corporate good, our platform
                monitors the climate ecosystem. With enterprise-grade AI trained
                data, enables greater visibility for impact claims and the state
                of the planet.
              </AnimatedText>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full mt-auto overflow-hidden flex pointer-events-none">
          <div className="flex animate-marquee-seamless">
            <p className="flex-shrink-0 whitespace-nowrap py-2 font-headline text-8xl uppercase text-foreground/20 select-none">
              <span className="tracking-[0.2em] mx-8">
                EARTH EXCHANGE & CLIMATE CREDIT IMPACT
              </span>
              <span className="font-sans mx-8">•</span>
            </p>
            <p
              aria-hidden="true"
              className="flex-shrink-0 whitespace-nowrap py-2 font-headline text-8xl uppercase text-foreground/20 select-none"
            >
              <span className="tracking-[0.2em] mx-8">
                EARTH EXCHANGE & CLIMATE CREDIT IMPACT
              </span>
              <span className="font-sans mx-8">•</span>
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Map with HUD */}
      <div
        id="mapbox-section"
        className="relative font-mono bg-black flex justify-center items-center h-screen"
      >
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12.html?title=false&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2xxeTBib3pyMGsxcTJpbXQ3bmo4YXU0ZiJ9.wvqlBMQSxTHgvAh6l9OXXw#2.16/6.48/69.82"
            width="100%"
            height="100%"
            className="w-full h-full object-cover"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            title="Mapbox Background"
          ></iframe>
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              theme === "light" ? "bg-transparent" : "bg-background/50"
            )}
          ></div>
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_50%,var(--background))_90%)] pointer-events-none"></div>
        </div>

        <div className="group relative w-full h-full border border-foreground bg-transparent transition-all duration-400 ease-in-out hover:border-[16px]">
          <div className="relative z-10 w-full h-full p-4 md:p-14 lg:p-16 flex flex-col pointer-events-none">
            <header className="flex justify-between items-start">
              <div className="flex flex-col gap-2 items-start">
                <div className="w-auto bg-background/30 backdrop-blur-sm p-1 border border-foreground/20 pointer-events-auto rounded-full">
                  <div className="w-28 h-28 md:w-36 md:h-36 border-2 rounded-full border-green-400/50 flex items-center justify-center text-center p-2">
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-foreground">
                        5.7
                      </p>
                      <p className="text-sm text-foreground">BILLION</p>
                      <p className="text-xs text-green-400">
                        CREDITS ISSUED <Info className="inline h-3 w-3" />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-56 bg-background/30 backdrop-blur-sm p-1 border border-foreground/20 pointer-events-auto">
                  <p>
                    <Building className="inline mr-2 h-4 w-4 text-green-400" />{" "}
                    3.3 B CORPORATIONS <Info className="inline h-3 w-3" />
                  </p>
                </div>
                <div className="w-56 bg-background/30 backdrop-blur-sm p-1 border border-foreground/20 pointer-events-auto">
                  <p>
                    <Globe className="inline mr-2 h-4 w-4 text-green-400" /> 3.3
                    B VOLUNTARY <Info className="inline h-3 w-3" />
                  </p>
                </div>
                <div className="w-56 bg-background/30 backdrop-blur-sm p-1 border border-foreground/20 pointer-events-auto">
                  <p>
                    <GitCommitHorizontal className="inline mr-2 h-4 w-4 text-green-400" />{" "}
                    450 M GOVERNMENTS <Info className="inline h-3 w-3" />
                  </p>
                </div>
              </div>
              <div className="flex-col gap-2 w-56 space-y-2 text-xs pointer-events-auto hidden md:flex">
                <div className="bg-background/30 backdrop-blur-sm p-1 border border-foreground/20">
                  <div className="flex justify-between items-center bg-background/30 p-1">
                    <span>73%</span>
                    <div className="flex gap-1">
                      {[30, 40, 50].map((v) => (
                        <div
                          key={v}
                          className={`w-6 h-2 ${
                            73 > v ? "bg-green-400" : "bg-gray-600"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-background/30 backdrop-blur-sm p-1 border border-foreground/20">
                  <div className="bg-background/30 p-1">
                    <p className="text-muted-foreground">IN DECLINE</p>
                    <p>
                      ANIMALS & PLANTS EXTINCT{" "}
                      <Info className="inline h-3 w-3" />
                    </p>
                  </div>
                </div>
                <div className="bg-background/30 backdrop-blur-sm p-1 border border-foreground/20">
                  <div className="bg-background/30 p-1">
                    <p className="text-foreground text-base font-bold">
                      +1.5°C
                    </p>
                    <p>
                      GLOBAL AVERAGE TEMP <Info className="inline h-3 w-3" />
                    </p>
                  </div>
                </div>
                <div className="bg-background/30 backdrop-blur-sm p-1 border border-foreground/20">
                  <div className="bg-background/30 p-1">
                    <p className="text-foreground text-base font-bold">
                      +103 MM
                    </p>
                    <p>
                      SEA LEVEL SINCE 1993 <Info className="inline h-3 w-3" />
                    </p>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-grow"></div>

            <footer className="grid grid-cols-1 md:flex md:flex-row md:justify-between md:items-end gap-8">
              <Card className="md:order-last w-64 bg-background/50 border-2 border-purple-400/50 shadow-lg shadow-purple-500/20 backdrop-blur-sm pointer-events-auto aspect-video">
                <CardContent className="p-3 space-y-2">
                  <div className="relative h-32 w-full mb-2">
                    <Image
                      src={mockProjectData.imageUrl}
                      fill
                      style={{ objectFit: "cover" }}
                      alt={mockProjectData.title}
                      data-ai-hint={mockProjectData.dataAiHint}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockProjectData.fundingStatus}
                  </p>
                  <p className="text-sm font-bold text-foreground leading-snug">
                    {mockProjectData.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {mockProjectData.description}
                  </p>
                  <Separator className="my-2 bg-muted" />
                  <div className="flex justify-between items-center">
                    <p className="text-green-400 text-sm">
                      {mockProjectData.fundingProgress}
                    </p>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-foreground" />
                      <Check className="h-4 w-4 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:order-first flex flex-col gap-2">
                <div className="w-64 bg-background/30 backdrop-blur-sm p-1 border border-foreground/20 pointer-events-auto">
                  <Countdown />
                </div>
                <div className="w-64 bg-background/30 backdrop-blur-sm p-1 border border-foreground/20 pointer-events-auto">
                  <h3 className="text-green-400 mb-2 p-1">
                    Recent Countries Contributions
                  </h3>
                  <div className="space-y-1 text-xs p-1">
                    {[
                      {
                        date: "3/1/2025",
                        country: "Indonesia",
                        flag: "https://flagcdn.com/w20/id.png",
                        amount: "16 t",
                      },
                      {
                        date: "3/1/2025",
                        country: "United States",
                        flag: "https://flagcdn.com/w20/us.png",
                        amount: "14 t",
                      },
                      {
                        date: "3/1/2025",
                        country: "Canada",
                        flag: "https://flagcdn.com/w20/ca.png",
                        amount: "14 t",
                      },
                      {
                        date: "3/1/2025",
                        country: "Malaysia",
                        flag: "https://flagcdn.com/w20/my.png",
                        amount: "11 t",
                      },
                      {
                        date: "3/1/2025",
                        country: "Australia",
                        flag: "https://flagcdn.com/w20/au.png",
                        amount: "10 t",
                      },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span>{c.date}</span>
                        <div className="flex items-center gap-2">
                          <Image
                            src={c.flag}
                            alt={c.country}
                            width={20}
                            height={15}
                          />
                          <span>{c.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="text-green-400 text-xs mt-2 inline-block hover:underline p-1"
                  >
                    View All 47
                  </a>
                </div>
              </div>
            </footer>
          </div>

          <div className="absolute top-[30px] left-1/2 -translate-x-1/2 z-30">
            <Button
              // onClick={() => setIsMarketPanelOpen(true)}
              className="bg-foreground text-background px-2 py-1 h-auto transition-colors duration-400 ease-in-out group-hover:bg-foreground/90"
            >
              MARKET
            </Button>
          </div>
          <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 z-30">
            <Button
              asChild
              className="bg-foreground text-background px-2 py-1 h-auto transition-colors duration-400 ease-in-out group-hover:bg-foreground/90"
            >
              {/* <Link href="/calculator">CALCULATOR</Link> */}
            </Button>
          </div>
          <div className="absolute left-[30px] top-1/2 -translate-y-1/2 z-30">
            <Button
              asChild
              className="bg-foreground text-background py-1 h-auto transition-colors duration-400 ease-in-out group-hover:bg-foreground/90 [writing-mode:vertical-rl] rotate-180 px-2"
            >
              {/* <Link href="/game">TRADING</Link> */}
            </Button>
          </div>
          <div className="absolute right-[-1px] top-1/2 -translate-y-1/2 z-30">
            <Button className="bg-foreground text-background py-1 h-auto transition-colors duration-400 ease-in-out group-hover:bg-foreground/90 [writing-mode:vertical-rl] px-2">
              INFO
            </Button>
          </div>
        </div>
      </div>

      {/* Section 3: Accordion */}
      <div
        id="accordion-section"
        className="relative flex w-full flex-col items-center bg-background/30 backdrop-blur-md"
      >
        <FluidBackground />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-1.5 pb-1 md:px-8 md:pt-1.5 md:pb-1">
          <Accordion
            type="multiple"
            value={openAccordions}
            onValueChange={setOpenAccordions}
            className="w-full space-y-4"
          >
            <AccordionItem
              id="web3"
              ref={web3Ref}
              value="web3"
              className="border-b border-foreground/20"
            >
              <CustomAccordionTrigger value="web3" openValue={openAccordions}>
                WEB3
              </CustomAccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pt-4">
                  <div className="md:col-span-3">
                    <AnimatedText
                      as="h3"
                      splitType="words"
                      stagger={0.05}
                      className="text-4xl md:text-6xl font-bold font-headline text-foreground/80 leading-tight"
                    >
                      Technology isn’t a feature but another{" "}
                      <span className="text-accent">invisible system</span> like
                      tree roots that spans the planet -{" "}
                      <span className="text-accent">a sixth sense.</span>
                    </AnimatedText>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <AnimatedText
                      as="p"
                      splitType="words"
                      stagger={0.01}
                      className="text-lg text-foreground/70 leading-relaxed"
                    >
                      Our platform is designed for suppliers of climate/carbon
                      credits, whether you have one or many carbon projects you
                      are involved in.
                    </AnimatedText>
                    <AnimatedText
                      as="p"
                      splitType="words"
                      stagger={0.01}
                      className="text-lg text-foreground/70 leading-relaxed"
                    >
                      In the global voluntary carbon market, is a trusted
                      solution for companies on their path to net-zero
                      emissions.
                    </AnimatedText>
                  </div>
                </div>
                <div className="mt-8">
                  <Image
                    src="/images/invest.png"
                    alt="Abstract technology network"
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-lg"
                    data-ai-hint="technology network"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              id="invest"
              ref={investRef}
              value="invest"
              className="border-b border-foreground/20"
            >
              <CustomAccordionTrigger value="invest" openValue={openAccordions}>
                Invest
              </CustomAccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pt-4">
                  <div className="md:col-span-3">
                    <AnimatedText
                      as="h3"
                      splitType="words"
                      stagger={0.05}
                      className="text-4xl md:text-6xl font-bold font-headline text-foreground/80 leading-tight"
                    >
                      we have put together an{" "}
                      <span className="text-accent">investment</span>{" "}
                      <span className="text-primary">ecosystem</span> that is
                      transparent, liquid and accessible.
                    </AnimatedText>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <AnimatedText
                      as="p"
                      splitType="words"
                      stagger={0.01}
                      className="text-lg text-foreground/70 leading-relaxed"
                    >
                      We connect conscious capital with high-integrity climate
                      projects, creating accessible investment opportunities for
                      all.
                    </AnimatedText>
                    <AnimatedText
                      as="p"
                      splitType="words"
                      stagger={0.01}
                      className="text-lg text-foreground/70 leading-relaxed"
                    >
                      By tokenizing real-world assets, we build a liquid and
                      transparent mission market, ensuring funding directly
                      supports tangible environmental progress.
                    </AnimatedText>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              id="privacy"
              ref={privacyRef}
              value="privacy"
              className="border-b border-foreground/20"
            >
              <CustomAccordionTrigger
                value="privacy"
                openValue={openAccordions}
              >
                Privacy
              </CustomAccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pt-4">
                  <div className="md:col-span-3">
                    <AnimatedText
                      as="h3"
                      splitType="words"
                      stagger={0.05}
                      className="text-4xl md:text-6xl font-bold font-headline text-foreground/80 leading-tight"
                    >
                      we utilize the{" "}
                      <span className="text-accent">blockchain</span> network
                      and <span className="text-accent">AI for good</span> and
                      support <span className="text-primary">impact</span>{" "}
                      <span className="text-primary">clarity</span> for people,
                      planet and prosperity...
                    </AnimatedText>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <AnimatedText
                      as="p"
                      splitType="words"
                      stagger={0.01}
                      className="text-lg text-foreground/70 leading-relaxed"
                    >
                      We’re about democratizing data and empowering users
                      through education and a magnetic experience.
                    </AnimatedText>
                    <AnimatedText
                      as="p"
                      splitType="words"
                      stagger={0.01}
                      className="text-lg text-foreground/70 leading-relaxed"
                    >
                      To this point we use blockchain not to track individuals
                      or encroach on privacy but with consent to build opacity
                      for offsetting to further help build customer clarity on
                      this topic.
                    </AnimatedText>
                  </div>
                </div>
                <div className="mt-8">
                  <Image
                    src="/images/privacy.png"
                    alt="Abstract privacy graphic"
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-lg"
                    data-ai-hint="privacy security"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Section 4: Tools */}
      <div
        id="tools"
        className="relative flex w-full flex-col items-center bg-background/30 backdrop-blur-md font-mono pb-2"
      >
        <FluidBackground />
        <div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 pt-16 pb-1.5 md:pb-1.5">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-thin tracking-widest uppercase underline text-foreground">
              Tools
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (Calculator) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-8">
              <h3 className="text-xl tracking-[0.3em] text-foreground text-center">
                CALCULATE
              </h3>
              <div className="grid grid-cols-2 gap-x-2 gap-y-4 justify-items-center">
                {calculatorButtons.map((btn) => (
                  <div
                    key={btn.label}
                    className="group w-32 h-32 rounded-lg border border-foreground/10 bg-foreground/5 p-1 text-center hover:border-foreground/30 transition-colors flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl block mb-0.5 group-hover:scale-110 transition-transform">
                      {btn.emoji}
                    </span>
                    <span className="text-[10px] tracking-widest text-foreground/70">
                      {btn.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 text-center">
                <Button
                  variant="outline"
                  className="rounded-full bg-gradient-to-br from-teal-400/30 to-blue-500/30 border-teal-400/50 text-foreground font-bold tracking-widest px-8 py-6"
                >
                  COMING SOON
                </Button>
              </div>
            </div>

            {/* Middle Column (Estimated Emissions) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                <div
                  className={cn(
                    "absolute inset-0 rounded-full animate-pulse-slow blur-xl",
                    theme === "light"
                      ? "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 opacity-90"
                      : "bg-gradient-to-br from-teal-400 to-blue-500"
                  )}
                ></div>
                <div className="absolute inset-1 rounded-full bg-background"></div>
                <div className="absolute inset-0 rounded-full border-2 border-teal-400/50"></div>
                <div className="relative z-10 text-center font-cabin-condensed">
                  <p className="font-headline text-8xl text-foreground">900</p>
                  <p className="text-xl tracking-widest text-foreground/80">
                    tonnes C02e
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="font-headline text-xl text-foreground/80">
                  Estimated Emissions
                </p>
                <Button
                  variant="outline"
                  className="rounded-full bg-transparent border-foreground/50 text-foreground/80 font-mono tracking-wider px-6 py-5"
                >
                  Recommend{" "}
                  <span className="ml-4 text-foreground">$15,830.68</span>
                </Button>
              </div>
            </div>

            {/* Right Column (Card) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-8">
              <GiftCard variant="collectable" />
              <Button
                variant="outline"
                className="rounded-full bg-gradient-to-br from-teal-400/30 to-blue-500/30 border-teal-400/50 text-foreground font-bold tracking-widest px-8 py-6"
              >
                COMING SOON
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showAbout && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
          <Card className="w-full max-w-md bg-background/70 border border-gray-600 text-center p-8">
            <CardContent className="space-y-6">
              <h2 className="text-lg font-bold tracking-widest text-foreground">
                ABOUT
              </h2>
              <p className="text-green-400 text-base leading-relaxed">
                Our platform aggregates high value impact credits and carbon
                markets into one place, and democratizes the sustainable economy
                between charity causes, corporate engagement, and philanthropic
                giving.
              </p>
              <div>
                <p className="text-sm text-foreground mb-4">
                  Accept Basic Cookies
                </p>
                <div className="flex justify-center items-center gap-8">
                  <Button
                    variant="link"
                    className="text-foreground text-lg"
                    onClick={() => setShowAbout(false)}
                  >
                    YES
                  </Button>
                  <div
                    className="text-4xl font-thin cursor-pointer"
                    onClick={() => setShowAbout(false)}
                  >
                    <X />
                  </div>
                  <Button
                    variant="link"
                    className="text-foreground text-lg"
                    onClick={() => setShowAbout(false)}
                  >
                    NO
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {isMarketPanelOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-lg flex flex-col p-4 md:p-8">
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mb-4 text-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMarketPanelOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h2 className="text-2xl font-headline text-primary tracking-widest">
              MISSION MARKET
            </h2>
          </div>

          <div className="flex-shrink-0 mb-6">
            <div className="flex flex-wrap gap-2 md:gap-4 items-center p-4 bg-background/30 rounded-lg justify-center">
              <Button variant="outline">Clear</Button>
              <Input
                placeholder="Search..."
                className="w-full md:w-auto md:max-w-xs bg-transparent"
              />
              <Select>
                <SelectTrigger className="w-full md:w-[200px] bg-transparent">
                  <SelectValue placeholder="UNSDG Impact" />
                </SelectTrigger>
                <SelectContent>
                  {sdgAlignments.map((sdg) => (
                    <SelectItem key={sdg.value} value={sdg.value}>
                      {sdg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[150px] bg-transparent">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[150px] bg-transparent">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[150px] bg-transparent">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
              </Select>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            <h3 className="text-xl font-semibold text-foreground mb-4 pl-2">
              Featured Cause Campaigns
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {monitorPanelOffsets.map((offset) => (
                <OffsetCard key={offset.id} offset={offset} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative bg-card text-card-foreground pt-16 pb-6">
        <FluidBackground />
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h4 className="font-bold text-foreground mb-3 tracking-wider">
                  Company
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#mission-statement"
                      className="hover:text-primary transition-colors"
                    >
                      Mission
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#mapbox-section"
                      className="hover:text-primary transition-colors"
                    >
                      Twin
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#web3"
                      className="hover:text-primary transition-colors"
                    >
                      Web3
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#privacy"
                      className="hover:text-primary transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <div>
                        <h4 className="font-bold text-foreground mb-3 tracking-wider">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/calculator" className="hover:text-primary transition-colors">Calculator</Link></li>
                            <li><Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                            <li><Link href="/game" className="hover:text-primary transition-colors">Trading</Link></li>
                            <li><Link href="/social" className="hover:text-primary transition-colors">Community</Link></li>
                        </ul>
                    </div> */}
              <div>
                <h4 className="font-bold text-foreground mb-3 tracking-wider">
                  Resources
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      White Paper
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Eco-System
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Fundamentals
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3 tracking-wider">
                  Community
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Discord
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      X / Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-headline text-primary mb-3 uppercase">
                Join Our Newsletter
              </h3>
              <p className="text-sm mb-4 text-muted-foreground">
                Stay up to date with the latest news, project launches, and
                impact reports.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-background/50 border-foreground/20 text-foreground placeholder:text-sm"
                />
                <Button variant="default" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-foreground/20" />
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Impaction Global. All Rights Reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" aria-label="Facebook">
                <FacebookIcon className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <XIcon className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <LinkedinIcon className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
