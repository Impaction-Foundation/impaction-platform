
// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Leaf, ShieldCheck, Target, Activity, CheckCircle2, Medal, Trophy, Settings, Wallet, Calculator as CalculatorIcon, ArrowRight, ShoppingBag, ListChecks, AlertTriangle, Loader2, Edit3, Trash2, Share2, Info, Scaling, Send, Sparkles, ShoppingCart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReductionTipItem, { type ActionableReductionTip } from "@/components/dashboard/reduction-tip-item";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import GiftCard from "@/components/dashboard/gift-card";


const LOCAL_STORAGE_PURCHASES_KEY = 'ecoSwapUserPurchases';
const LOCAL_STORAGE_LAST_FOOTPRINT_KEY = 'ecoSwapLastFootprint';
const LOCAL_STORAGE_ACTION_PLAN_TIPS_KEY = 'ecoExchangeActionPlanTips'; // New key for action plan
const RAW_TIPS_KEY = 'ecoExchangeRawTips';


interface UserPurchasedProject {
  id: string;
  offsetId: string;
  name: string;
  quantity: number;
  purchaseDate: string;
  imageUrl: string;
  dataAiHint?: string;
  status: 'Active' | 'Retired';
  priceAtPurchase: number;
  totalCost: number;
  offsetUnits: string;
}

const mockDashboardProfileData = {
    name: "Eco User",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarFallback: "EU",
    avatarAiHint: "person smiling",
    impactScore: 780, // Mock value
    sdgScore: "High Alignment (💡7, 🌍13, 🌳15)", // Mock value
    esgScore: "AA (Leader)", // Mock value
};

const mockFeaturedAchievement = {
    icon: Medal,
    iconColor: "text-yellow-500",
    title: "Eco-Pioneer",
    description: "Achieved Carbon Neutrality for the first time!",
};

const mockProjectData = {
    id: "cause-indigenous-friends",
    title: "Indigenous Friends Association",
};


export default function DashboardPage() {
  const { toast } = useToast();
  const [lastTotalFootprint, setLastTotalFootprint] = useState<number | null>(null);
  const [totalPurchasedOffsetAmount, setTotalPurchasedOffsetAmount] = useState(0);
  const [monthlyFootprintData, setMonthlyFootprintData] = useState<any[]>([]);
  const [purchasedProjects, setPurchasedProjects] = useState<UserPurchasedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const [actionableTips, setActionableTips] = useState<ActionableReductionTip[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState(true);
  const [tipsError, setTipsError] = useState<string | null>(null);
  const [friendEmail, setFriendEmail] = useState("");


  useEffect(() => {
    // Load purchased projects
    const storedPurchases = localStorage.getItem(LOCAL_STORAGE_PURCHASES_KEY);
    let currentPurchasedProjects: UserPurchasedProject[] = [];
    if (storedPurchases) {
      try {
        currentPurchasedProjects = JSON.parse(storedPurchases);
      } catch (e) {
        console.error("Failed to parse purchased projects from localStorage", e);
      }
    }
    setPurchasedProjects(currentPurchasedProjects);
    setIsLoadingProjects(false);

    let totalKgOffset = 0;
    currentPurchasedProjects.forEach(p => {
      const unitValueMatch = p.offsetUnits.match(/[\d.]+/);
      const unitValue = unitValueMatch ? parseFloat(unitValueMatch[0]) : 0;
      let multiplier = 1;
      if (p.offsetUnits.toLowerCase().includes('ton')) {
        multiplier = 1000;
      }
      totalKgOffset += p.quantity * unitValue * multiplier;
    });
    setTotalPurchasedOffsetAmount(totalKgOffset);

    // Load last footprint
    const storedFootprint = localStorage.getItem(LOCAL_STORAGE_LAST_FOOTPRINT_KEY);
    const currentFootprint = storedFootprint ? parseFloat(storedFootprint) : 0.80; 
    setLastTotalFootprint(currentFootprint);

    const footprintForChart = currentFootprint > 0 ? currentFootprint : 800;
    setMonthlyFootprintData([
      { month: "Apr", footprint: footprintForChart * 0.5 },
      { month: "May", footprint: footprintForChart * 0.875 },
      { month: "Jun", footprint: footprintForChart },
    ]);

    // Load or initialize action plan tips
    setIsLoadingTips(true);
    setTipsError(null);
    const storedActionPlanTips = localStorage.getItem(LOCAL_STORAGE_ACTION_PLAN_TIPS_KEY);
    if (storedActionPlanTips) {
        try {
            setActionableTips(JSON.parse(storedActionPlanTips));
        } catch (e) {
            console.error("Failed to parse action plan tips from localStorage", e);
            setTipsError("Could not load your saved action plan. Default tips may be shown.");
            // Fallback to raw tips if parsing fails
            initializeFromRawTips();
        }
    } else {
        // If no action plan, try to initialize from raw tips (from calculator)
        initializeFromRawTips();
    }
    setIsLoadingTips(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeFromRawTips = () => {
    const rawTipsString = localStorage.getItem(RAW_TIPS_KEY);
    if (rawTipsString) {
        try {
            const rawTips = JSON.parse(rawTipsString);
            if (Array.isArray(rawTips)) {
                const newActionableTips = rawTips.map((tip: any, index: number) => ({
                    ...tip,
                    id: `tip-${Date.now()}-${index}`,
                    isCompleted: false,
                }));
                setActionableTips(newActionableTips);
                localStorage.setItem(LOCAL_STORAGE_ACTION_PLAN_TIPS_KEY, JSON.stringify(newActionableTips));
                // Optionally clear raw tips after processing to avoid re-processing
                // localStorage.removeItem(RAW_TIPS_KEY); 
            }
        } catch (e) {
            console.error("Failed to parse raw tips from localStorage", e);
            setTipsError("Could not initialize your action plan from recent calculator results.");
        }
    } else {
        setTipsError(null); // No error if no raw tips either, just an empty plan
        setActionableTips([]);
    }
  };


  const handleToggleCompleteTip = (tipId: string) => {
    setActionableTips(prevTips => {
      const updatedTips = prevTips.map(tip =>
        tip.id === tipId ? { ...tip, isCompleted: !tip.isCompleted } : tip
      );
      localStorage.setItem(LOCAL_STORAGE_ACTION_PLAN_TIPS_KEY, JSON.stringify(updatedTips));
      toast({ title: "Action Plan Updated", description: `Tip status changed.` });
      return updatedTips;
    });
  };

  const handleDeleteTip = (tipId: string) => {
    setActionableTips(prevTips => {
      const updatedTips = prevTips.filter(tip => tip.id !== tipId);
      localStorage.setItem(LOCAL_STORAGE_ACTION_PLAN_TIPS_KEY, JSON.stringify(updatedTips));
      toast({ title: "Tip Removed", description: "The tip has been removed from your action plan." });
      return updatedTips;
    });
  };

  const handleShareTip = (tipSuggestion: string) => {
    toast({ title: "Shared Tip!", description: `You've shared: "${tipSuggestion}" (Demo)` });
  };

  const handleShare = (platform: string) => {
    toast({
      "title": "Shared Successfully!",
      "description": `Your impact has been shared on ${platform}. (This is a demo)`,
      "variant": "default",
    });
  };

  const handleShareWithFriend = () => {
    if (!friendEmail) {
      toast({
        "title": "Error",
        "description": "Please enter your friend's email.",
        "variant": "destructive",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(friendEmail)) {
        toast({
            "title": "Invalid Email",
            "description": "Please enter a valid email address.",
            "variant": "destructive",
        });
        return;
    }
    toast({
      "title": "Shared with Friend!",
      "description": `Impact report sent to ${friendEmail}. (This is a demo)`,
      "variant": "default",
    });
    setFriendEmail("");
  };


  const netImpact = lastTotalFootprint !== null ? lastTotalFootprint - totalPurchasedOffsetAmount : 0;
  const percentageOffset = lastTotalFootprint && lastTotalFootprint > 0 ? Math.min(100, (totalPurchasedOffsetAmount / lastTotalFootprint) * 100) : (totalPurchasedOffsetAmount > 0 ? 100 : 0);

  const chartConfig = {
    footprint: {
      label: "Footprint (kg CO₂e)",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div>
      <Card className="w-full mb-8 rounded-b-lg rounded-t-none border-x-0 border-t-0 shadow-lg">
        <CardContent className="container mx-auto py-6 px-4 text-center">
          <h1 className="text-4xl font-bold text-primary font-headline">My Impact Monitor</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your climate action journey.
          </p>
        </CardContent>
      </Card>
      <div className="container mx-auto p-4 md:p-8">

      {/* Top Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl"><Settings className="mr-2 h-5 w-5 text-primary"/> Profile Settings</CardTitle>
            <CardDescription>Manage your account details and preferences.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/settings">Go to Settings <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl"><Wallet className="mr-2 h-5 w-5 text-primary"/> Connect Web3 Wallet</CardTitle>
            <CardDescription>secure your assets and support tokenized Impact</CardDescription>
          </CardHeader>
          <CardFooter>
             <Button className="w-full" disabled>Connect Wallet</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl"><CalculatorIcon className="mr-2 h-5 w-5 text-primary"/> Calculate Your Footprint</CardTitle>
            <CardDescription>Recalculate or update your carbon footprint.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/calculator">Open Calculator <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Past Impact Score Card */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-foreground font-headline flex items-center justify-center">
              <FileText className="mr-2 h-6 w-6 text-primary" />
              Past Impact Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {lastTotalFootprint !== null ? (
              <>
                <p className="text-5xl font-bold text-foreground">
                  {lastTotalFootprint.toFixed(2)}
                </p>
                <p className="text-muted-foreground">kg CO₂e per year</p>
                <div className="mt-4 h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (lastTotalFootprint / 20000) * 100)}%` }}
                  />
                </div>
                <CardDescription className="mt-4 text-sm text-muted-foreground">Monthly Trend (Demo)</CardDescription>
                <div className="h-[150px] mt-2">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <LineChart
                      data={monthlyFootprintData}
                      margin={{ top: 5, right: 20, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={5} 
                        fontSize={12} 
                        tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`} 
                        domain={['dataMin - 100', 'dataMax + 100']}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel className="bg-background/80 backdrop-blur-sm" />}
                      />
                      <Line
                        type="monotone"
                        dataKey="footprint"
                        stroke="var(--color-footprint)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "var(--color-footprint)", strokeWidth:1, stroke: "hsl(var(--background))" }}
                        name="Footprint"
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">Loading footprint data...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Eco-Profile Card */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mockDashboardProfileData.avatarUrl} alt={mockDashboardProfileData.name} data-ai-hint={mockDashboardProfileData.avatarAiHint} />
              <AvatarFallback>{mockDashboardProfileData.avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl text-foreground font-headline">Your Eco-Profile</CardTitle>
              <CardDescription>Overview of your impact stats and progress.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm pt-3">
            {lastTotalFootprint !== null ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-muted-foreground">
                    <Leaf className="mr-2 h-4 w-4 text-primary" />
                    Last Calculated Footprint:
                  </span>
                  <span className="font-semibold text-foreground">{lastTotalFootprint.toFixed(2)} kg CO₂e</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-muted-foreground">
                    <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                    Total Offsets Purchased:
                  </span>
                  <span className="font-semibold text-primary">{totalPurchasedOffsetAmount.toFixed(2)} kg CO₂e</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-muted-foreground">
                    <Target className={`mr-2 h-4 w-4 ${netImpact > 0 ? 'text-destructive' : 'text-primary'}`} />
                    Net Impact:
                  </span>
                  <span className={`font-semibold ${netImpact > 0 ? 'text-destructive' : 'text-primary'}`}>
                    {netImpact.toFixed(2)} kg CO₂e
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center text-muted-foreground">
                      <Activity className="mr-2 h-4 w-4 text-primary" />
                      Offset Progress:
                    </span>
                    <span className="font-semibold text-primary">{percentageOffset.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentageOffset} className="h-2 [&>div]:bg-primary" />
                  {netImpact <= 0 && totalPurchasedOffsetAmount > 0 && (
                    <p className="text-xs text-primary mt-1 text-center flex items-center justify-center">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Carbon Neutral/Positive on record!
                    </p>
                  )}
                </div>
                <div className="pt-2 space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Impact Score:</span>
                        <span className="font-bold text-primary">{mockDashboardProfileData.impactScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">SDG Alignment:</span>
                        <span className="font-medium text-foreground">{mockDashboardProfileData.sdgScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">ESG Rating:</span>
                        <Badge variant="default" className="text-xs bg-primary/80">{mockDashboardProfileData.esgScore}</Badge>
                    </div>
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">Loading profile data...</p>
              </div>
            )}
          </CardContent>
           <CardFooter className="flex flex-col gap-3 pt-4">
               <div className="flex w-full gap-2">
                  <Button onClick={() => handleShare('Twitter')} variant="outline" className="flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                      Share
                  </Button>
                   <Button onClick={() => handleShare('LinkedIn')} variant="outline" className="flex-1">
                      <LinkedinIcon className="mr-2 h-4 w-4" /> Share
                  </Button>
              </div>
              <div className="flex w-full items-center gap-2">
                  <Input 
                      type="email" 
                      placeholder="Friend's email" 
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                      className="flex-grow"
                  />
                  <Button onClick={handleShareWithFriend} size="icon" aria-label="Send to friend">
                      <Send className="h-4 w-4" />
                  </Button>
              </div>
            </CardFooter>
        </Card>
      </div>

      {/* Featured Achievement Card */}
      <Card className="w-full mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground font-headline flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-primary" />
            Featured Achievement
          </CardTitle>
          <CardDescription>Your latest or most prominent accomplishment.</CardDescription>
        </CardHeader>
        <CardContent className="bg-muted/30 p-6 rounded-b-lg">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-primary/10 ${mockFeaturedAchievement.iconColor}`}>
              <mockFeaturedAchievement.icon className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">{mockFeaturedAchievement.title}</h4>
              <p className="text-sm text-muted-foreground">{mockFeaturedAchievement.description}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-muted/30 rounded-b-lg border-t border-border">
             <Button variant="outline" className="w-full" disabled>
                View All Achievements (Soon)
            </Button>
        </CardFooter>
      </Card>

      {/* My Climate Action Plan */}
       <Card className="w-full mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground font-headline flex items-center">
            <ListChecks className="mr-2 h-6 w-6 text-primary" /> My Climate Action Plan
          </CardTitle>
          <CardDescription>Track and manage your personalized carbon reduction tips.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTips && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading your action plan...</p>
            </div>
          )}
          {tipsError && !isLoadingTips && (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertTriangle className="h-10 w-10 mb-2" />
              <p className="font-semibold">Could not load action plan</p>
              <p className="text-sm text-center">{tipsError}</p>
            </div>
          )}
          {!isLoadingTips && !tipsError && actionableTips.length === 0 && (
            <div className="text-center py-8">
              <Info className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">Your action plan is currently empty.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Use the <Link href="/calculator" className="text-primary underline hover:text-primary/80">Climate Footprint Calculator</Link> to get personalized tips.
              </p>
              <Button onClick={initializeFromRawTips} variant="outline">
                Load Tips from Last Calculation
              </Button>
            </div>
          )}
          {!isLoadingTips && !tipsError && actionableTips.length > 0 && (
            <div className="space-y-4">
              {actionableTips.map(tip => (
                <ReductionTipItem
                  key={tip.id}
                  tip={tip}
                  onToggleComplete={() => handleToggleCompleteTip(tip.id)}
                  onShare={() => handleShareTip(tip.suggestion)}
                  onDelete={() => handleDeleteTip(tip.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Past Purchased Projects */}
      <Card className="w-full mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground font-headline flex items-center">
            <ShoppingBag className="mr-2 h-6 w-6 text-primary" /> Past Purchased Projects
          </CardTitle>
          <CardDescription>A record of your carbon offset purchases.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProjects && <p className="text-muted-foreground">Loading project history...</p>}
          {!isLoadingProjects && purchasedProjects.length === 0 && (
            <p className="text-muted-foreground">You haven't purchased any offset projects yet. Visit the <Link href="/marketplace" className="text-primary underline">Marketplace</Link> to get started.</p>
          )}
          {!isLoadingProjects && purchasedProjects.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              {purchasedProjects.map((project, index) => (
                <AccordionItem value={`project-${index}`} key={project.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 flex-grow">
                      <Image src={project.imageUrl || "https://placehold.co/60x60.png"} alt={project.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={project.dataAiHint || "project image"}/>
                      <div className="text-left">
                        <span className="font-semibold text-foreground text-base">{project.name}</span>
                        <p className="text-xs text-muted-foreground">Purchased: {new Date(project.purchaseDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    <p><strong>Quantity:</strong> {project.quantity} {project.offsetUnits}</p>
                    <p><strong>Price at Purchase:</strong> ${project.priceAtPurchase.toFixed(2)} per unit</p>
                    <p><strong>Total Cost:</strong> ${project.totalCost.toFixed(2)}</p>
                    <p><strong>Status:</strong> <Badge variant={project.status === 'Active' ? "default" : "secondary"}>{project.status}</Badge></p>
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2" asChild>
                      <Link href={`/purchase/${project.offsetId}?view=details`}>View Original Project</Link>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
      
      {/* Collectables Section */}
      <Card className="w-full mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground font-headline flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-primary" /> Collectables
          </CardTitle>
          <CardDescription>Showcase your unique badges and rewards.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold leading-none tracking-tight text-primary flex items-center justify-center">
                             <Sparkles className="mr-2 h-5 w-5" />
                            Featured Cause
                        </h3>
                        <p className="text-sm text-muted-foreground">{mockProjectData.title}</p>
                    </div>
                    
                    <GiftCard variant="collectable" />

                    <div className="flex items-center pt-4 gap-2 w-full max-w-xs">
                         <Button asChild className="w-full bg-primary hover:bg-primary/90">
                            <Link href={`/purchase/${mockProjectData.id}`}>
                                <ShoppingCart className="mr-2 h-4 w-4" /> Buy Offset
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={`/purchase/${mockProjectData.id}?view=details`}>
                                Details
                            </Link>
                        </Button>
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

// Helper component for LinkedIn Icon
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
