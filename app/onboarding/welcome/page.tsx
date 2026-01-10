import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Upload } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Hodlr
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Track Your Investment Journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-2xl">
        <Card className="relative overflow-hidden hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Start tracking your portfolio from scratch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full group">
              <Link href="/onboarding/add-asset">
                Create Portfolio
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>
              Import your data from other platforms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Upload className="ml-2 h-4 w-4" />
              Import CSV (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
