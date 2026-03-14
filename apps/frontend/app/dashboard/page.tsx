"use client"

import { useCourse } from "@/hooks/use-course"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BookOpen,
  Calendar,
  Wallet,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react"

export default function DashboardPage() {
  const { selectedCourse, courses } = useCourse()

  const courseCount = courses?.length ?? 0

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-1 text-muted-foreground">
          {selectedCourse
            ? `Currently viewing: ${selectedCourse.title}`
            : "Select a course to get started"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Enrolled Courses"
          value={courseCount.toString()}
          description="Active enrollments"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatsCard
          title="Upcoming Events"
          value="5"
          description="This week"
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatsCard
          title="Study Hours"
          value="24.5"
          description="This month"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title="Achievements"
          value="12"
          description="Badges earned"
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      {/* Current Course Section */}
      {selectedCourse && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                {selectedCourse.title}
              </CardTitle>
              <CardDescription>Current course overview</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">67%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-2/3 rounded-full bg-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">
                    Lessons completed
                  </p>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-2xl font-bold text-foreground">6</p>
                  <p className="text-xs text-muted-foreground">
                    Lessons remaining
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-accent" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  title="Completed Module 5"
                  description="Introduction to React Hooks"
                  time="2 hours ago"
                />
                <ActivityItem
                  title="Quiz Passed"
                  description="JavaScript Fundamentals - 92%"
                  time="Yesterday"
                />
                <ActivityItem
                  title="New Achievement"
                  description="Earned 'Quick Learner' badge"
                  time="2 days ago"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-foreground">Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Manage your payments and transactions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Calendar className="h-6 w-6 text-accent" />
            </div>

            <div>
              <h3 className="font-semibold text-foreground">Calendar</h3>
              <p className="text-sm text-muted-foreground">
                View your course schedule and events
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />

      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  )
}
