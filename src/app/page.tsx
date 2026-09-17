import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <h1 className="text-3xl font-semibold tracking-tight">
        Real Estate Website
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Scaffolded with Next.js, Tailwind CSS, and shadcn/ui.
      </p>
      <Button>Get Started</Button>
    </div>
  );
}
