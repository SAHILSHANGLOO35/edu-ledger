import Link from "next/link"
import { StarField } from "@/components/star-field"
import { Button } from "@/components/ui/button"
import { Rocket, BookOpen, Calendar, Wallet, ArrowRight, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      
      {/* Navigation */}
      <nav className="glass fixed top-0 right-0 left-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Rocket className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">EduLedger</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              About
            </a>
          </div>
          <Link href="/signin">
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="space-grid absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Welcome to the future of learning</span>
          </div>
          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            Navigate Your{" "}
            <span className="gradient-text">Educational Universe</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Track your courses, manage your schedule, and unlock your potential with EduLedger. 
            Your cosmic companion for academic excellence.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signin">
              <Button size="lg" className="pulse-glow gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                Explore Features
              </Button>
            </a>
          </div>
        </div>

        {/* Floating orbs */}
        <div className="float pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="float pointer-events-none absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-accent/10 blur-3xl" style={{ animationDelay: "2s" }} />
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Powerful Features
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to excel in your educational journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Course Management"
              description="Access all your enrolled courses in one place. Switch between courses effortlessly with our Vercel-style selector."
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Notion Calendar"
              description="Stay on top of deadlines and events with integrated Notion calendar views for each of your courses."
            />
            <FeatureCard
              icon={<Wallet className="h-6 w-6" />}
              title="Wallet Integration"
              description="Manage your educational finances, track payments, and view your transaction history securely."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="relative z-10 px-6 py-24">
        <div className="glass mx-auto max-w-4xl rounded-2xl p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Ready to Begin Your Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join thousands of students who have transformed their learning experience with EduLedger.
          </p>
          <Link href="/signin">
            <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
              Get Started Now
              <Rocket className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Rocket className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">EduLedger</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for the future of education
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
