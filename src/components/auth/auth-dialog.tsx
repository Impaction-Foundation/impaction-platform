'use client';

import { Button } from '@/components/ui/button';

export default function AuthDialog() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <p className="text-muted-foreground mb-4">
        This is a demo version. Authentication is not implemented.
      </p>
      <Button className="w-full" disabled>
        Demo Mode - No Sign In Available
      </Button>
    </div>
  );
}