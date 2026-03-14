"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, ExternalLink, RefreshCw, AlertCircle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface CalendarData {
  id: string
  calendarNotionId: string
}

export default function CalendarPage() {
  const { selectedCourse, token } = useAuth()
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCalendar() {
      if (!selectedCourse || !token) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/calendar/${selectedCourse.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Failed to fetch calendar")
        }

        const data = await response.json()
        setCalendarData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendar()
  }, [selectedCourse, token])

  const notionEmbedUrl = calendarData?.calendarNotionId
    ? `https://notion.so/${calendarData.calendarNotionId}`
    : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="mt-1 text-muted-foreground">
            {selectedCourse
              ? `Schedule for ${selectedCourse.title}`
              : "Select a course to view its calendar"
            }
          </p>
        </div>
        {notionEmbedUrl && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 border-border hover:bg-secondary"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.open(notionEmbedUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Open in Notion
            </Button>
          </div>
        )}
      </div>

      {/* Calendar Content */}
      {!selectedCourse ? (
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No Course Selected</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Please select a course from the sidebar to view its calendar
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Loading calendar...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-destructive/50 bg-destructive/10 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Unable to Load Calendar</h3>
            <p className="mt-2 text-center text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : calendarData?.calendarNotionId ? (
        <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {selectedCourse.title} - Schedule
            </CardTitle>
            <CardDescription>
              Your course calendar synced from Notion
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video w-full bg-secondary/50">
              <iframe
                src={`https://notion.so/embed/${calendarData.calendarNotionId}?theme=dark`}
                className="h-full w-full border-0"
                title={`${selectedCourse.title} Calendar`}
                allow="fullscreen"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No Calendar Available</h3>
            <p className="mt-2 text-center text-muted-foreground">
              This course does not have a calendar configured yet
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events Preview */}
      {selectedCourse && !error && (
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Events</CardTitle>
            <CardDescription>Next events for {selectedCourse.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <EventItem
                title="Module 6: Advanced Concepts"
                date="Mar 15, 2026"
                time="10:00 AM"
                type="lecture"
              />
              <EventItem
                title="Assignment Due: Project Milestone"
                date="Mar 18, 2026"
                time="11:59 PM"
                type="deadline"
              />
              <EventItem
                title="Live Q&A Session"
                date="Mar 20, 2026"
                time="2:00 PM"
                type="event"
              />
              <EventItem
                title="Mid-term Examination"
                date="Mar 25, 2026"
                time="9:00 AM"
                type="exam"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EventItem({
  title,
  date,
  time,
  type,
}: {
  title: string
  date: string
  time: string
  type: "lecture" | "deadline" | "event" | "exam"
}) {
  const typeStyles = {
    lecture: "bg-primary/10 text-primary",
    deadline: "bg-destructive/10 text-destructive",
    event: "bg-accent/10 text-accent",
    exam: "bg-chart-4/10 text-chart-4",
  }

  const typeLabels = {
    lecture: "Lecture",
    deadline: "Deadline",
    event: "Event",
    exam: "Exam",
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50">
      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-secondary">
        <span className="text-xs text-muted-foreground">{date.split(",")[0].split(" ")[0]}</span>
        <span className="text-lg font-bold text-foreground">{date.split(",")[0].split(" ")[1]}</span>
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${typeStyles[type]}`}>
        {typeLabels[type]}
      </span>
    </div>
  )
}
