'use client'
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "@/components/custom/user-menu";
import { ModeToggle } from "@/components/theme/toggle-mode";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col gap-4 p-4 sm:p-16">
        <div className="absolute top-4 right-4 sm:top-16 sm:right-16">
          <ModeToggle />
        </div>
        <div className="flex flex-col gap-4 sm:gap-8 w-full max-w-[100rem] mx-auto relative min-h-full h-full rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
          <div className="flex justify-between items-center">
            <div className="grid gap-1">
              <h1 className="text-3xl font-semibold text-foreground">
                Transaction dashboard
              </h1>
              <h2 className="text-lg text-muted-foreground">
                <strong>Interactive</strong> transaction <strong>dashboard</strong> with <strong>advanced filters</strong>, <strong>dynamic visualizations</strong>, and <strong>actionable insights</strong> for tracking transaction <strong>trends</strong>, <strong>types</strong>, and <strong>statuses</strong>.
              </h2>
            </div>
            <UserMenu />
          </div>
          <Separator />
          {children}
          <Badge
            variant="outline"
            className="absolute -top-2.5 left-4 bg-background sm:left-8"
          >
            VRV
          </Badge>
        </div>
      </main>
    </>
  );
}
