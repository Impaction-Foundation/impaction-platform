import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Activity, Target } from 'lucide-react';
import MissionPage from './mission/page';

export default function HomePage() {
  return (
    <div>
      <MissionPage />
      
      {/* Quick Access Navigation */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
        <Button asChild className="shadow-lg">
          <Link href="/calculator">
            <Calculator className="mr-2 h-4 w-4" />
            Calculator
          </Link>
        </Button>
        <Button asChild variant="outline" className="shadow-lg">
          <Link href="/monitor">
            <Activity className="mr-2 h-4 w-4" />
            Monitor
          </Link>
        </Button>
      </div>
    </div>
  );
}