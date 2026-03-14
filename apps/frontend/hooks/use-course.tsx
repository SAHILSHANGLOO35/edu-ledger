"use client"

import axios from "axios"
import { useEffect, useState } from "react"

interface Course {
  id: string
  title: string
  slug: string
  calendarNotionId: string
}

export const useCourses = () => {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCourses(res.data.courses)
        setLoading(false)
      })
  }, [])

  return { loading, courses }
}

export const useCourse = () => {
  const { loading, courses } = useCourses()
  const [selectedCourse, setSelectedCourse] = useState<Course>()

  useEffect(() => {
    setSelectedCourse(courses[0])
  }, [courses])

  return { loading, courses, selectedCourse, setSelectedCourse }
}
