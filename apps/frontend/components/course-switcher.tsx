"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCourse } from "@/hooks/use-course"

export function CourseSwitcher() {
  const [open, setOpen] = useState(false)
  const { courses, selectedCourse, setSelectedCourse } = useCourse()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-border bg-secondary/50 hover:bg-secondary"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/20">
              <BookOpen className="h-3 w-3 text-primary" />
            </div>
            <span className="truncate">
              {selectedCourse ? selectedCourse.title : "Select a course"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command className="bg-popover">
          <CommandInput
            placeholder="Search courses..."
            className="border-none focus:ring-0"
          />

          <CommandList>
            <CommandEmpty>No courses found.</CommandEmpty>

            <CommandGroup>
              {courses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={course.title}
                  onSelect={() => {
                    setSelectedCourse(course)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/20">
                    <BookOpen className="h-3 w-3 text-primary" />
                  </div>

                  <span className="ml-2 truncate">{course.title}</span>

                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCourse?.id === course.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
