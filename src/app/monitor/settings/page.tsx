
// src/app/dashboard/settings/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, KeyRound, Bell, Palette, ShieldCheck, Wallet, Edit3, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ProfileSettingsPage() {
  const [name, setName] = useState("Eco User");
  const [email, setEmail] = useState("user@example.com");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(true); // Mock state
  const [walletAddress, setWalletAddress] = useState("0x123...BEEF"); // Mock address

  const handleSaveChanges = () => {
    console.log("Saved changes:", { name, email, isNotificationsEnabled });
    // In a real app, this would update user data in the backend
    alert("Settings saved! (Demo)");
  };

  return (
    <div>
      <Card className="w-full mb-8 rounded-b-lg rounded-t-none border-x-0 border-t-0 -mt-8">
        <CardContent className="container mx-auto py-6 px-4 text-center">
            <h1 className="text-4xl font-bold text-primary font-headline">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account details, preferences, and connected services.
          </p>
        </CardContent>
      </Card>
      
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <CardDescription>Update your name, email, and profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person nature"/>
                  <AvatarFallback>EU</AvatarFallback>
                </Avatar>
                <Button variant="outline"><Edit3 className="mr-2 h-4 w-4"/>Change Picture</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Separator />
              <div>
                  <h3 className="text-lg font-medium mb-2">Change Password</h3>
                  <div className="space-y-2">
                      <Label htmlFor="current-password"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground inline-block" />Current Password</Label>
                      <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2 mt-3">
                      <Label htmlFor="new-password"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground inline-block" />New Password</Label>
                      <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>

          {/* Preferences & Connected Services */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="flex items-center text-base">
                    <Bell className="mr-2 h-5 w-5 text-muted-foreground"/> Email Notifications
                  </Label>
                  <Switch
                    id="notifications"
                    checked={isNotificationsEnabled}
                    onCheckedChange={setIsNotificationsEnabled}
                  />
                </div>
                 <div className="flex items-center justify-between">
                  <Label htmlFor="theme" className="flex items-center text-base">
                    <Palette className="mr-2 h-5 w-5 text-muted-foreground"/> Dark Mode
                  </Label>
                  <Switch id="theme" disabled defaultChecked/>
                   <span className="text-xs text-muted-foreground">(Theme toggle in nav)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Connected Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                  <div className="flex items-center">
                      <Wallet className={`mr-3 h-6 w-6 ${isWalletConnected ? 'text-green-500' : 'text-muted-foreground'}`}/>
                      <div>
                          <p className="font-medium">{isWalletConnected ? "Wallet Connected" : "No Wallet Connected"}</p>
                          {isWalletConnected && <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{walletAddress}</p>}
                      </div>
                  </div>
                  <Button variant={isWalletConnected ? "destructive" : "default"} size="sm" onClick={() => setIsWalletConnected(!isWalletConnected)}>
                      {isWalletConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
                 <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                  <div className="flex items-center">
                      <ShieldCheck className="mr-3 h-6 w-6 text-muted-foreground"/>
                       <div>
                          <p className="font-medium">Proof of Personhood</p>
                          <p className="text-xs text-muted-foreground">Not Verified</p>
                      </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>Verify (Coming Soon)</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Info className="mr-2 h-5 w-5 text-muted-foreground"/>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>App Version</span>
                  <span className="font-medium text-foreground">1.0.0</span>
                </div>
                <Separator />
                <ul className="space-y-2 text-muted-foreground">
                    <li>
                        <Link href="#" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                        Terms of Service
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                        Privacy Policy
                        </Link>
                    </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
