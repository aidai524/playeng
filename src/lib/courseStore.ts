"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { grades, getGradeById, type Grade } from "@/data/courses"
import type { Unit, Word } from "@/data/units"

interface CourseState {
  currentGradeId: string | null
  currentGrade: Grade | undefined
  currentUnits: Unit[]
  currentWords: Word[]

  setCurrentGrade: (gradeId: string | null) => void
}

function deriveState(gradeId: string | null) {
  const grade = gradeId ? getGradeById(gradeId) : grades[0]
  return {
    currentGrade: grade,
    currentUnits: grade ? grade.units : [],
    currentWords: grade ? grade.units.flatMap(u => u.words) : [],
  }
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      currentGradeId: null,
      ...deriveState(null),

      setCurrentGrade: (gradeId) => set({
        currentGradeId: gradeId,
        ...deriveState(gradeId),
      }),
    }),
    {
      name: "course-storage",
      // Only persist currentGradeId, derive the rest on hydration
      partialize: (state) => ({ currentGradeId: state.currentGradeId }) as CourseState,
    }
  )
)
