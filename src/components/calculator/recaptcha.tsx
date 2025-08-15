"use client";

import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from 'lucide-react';

interface ReCaptchaProps {
  onVerify: (isVerified: boolean) => void;
}

export default function ReCaptcha({ onVerify }: ReCaptchaProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    const newCheckedState = checked === true;
    setIsChecked(newCheckedState);
    onVerify(newCheckedState);
  };

  return (
    <div className="flex items-center space-x-3 p-4 border rounded-md bg-muted/30">
      <Checkbox
        id="recaptcha"
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        aria-label="I am not a robot"
      />
      <Label htmlFor="recaptcha" className="flex items-center text-base font-medium text-foreground cursor-pointer">
        <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
        I am not a robot
      </Label>
    </div>
  );
}
