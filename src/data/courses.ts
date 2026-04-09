import { Unit } from "./units"
import { units as grade4Units } from "./units"
import { grade3Units } from "./grade3"

export interface Grade {
  id: string
  title: string
  emoji: string
  description: string
  units: Unit[]
}

export const grades: Grade[] = [
  {
    id: "grade3-2",
    title: "三年级下册",
    emoji: "📗",
    description: "文具、打扫、规则、位置、水果、农场、动物、颜色",
    units: grade3Units,
  },
  {
    id: "grade4-2",
    title: "四年级下册",
    emoji: "📘",
    description: "学校科目、星期、作息、公园自然、季节天气、衣物、情绪、健康语音",
    units: grade4Units,
  },
]

export function getAllUnits(): Unit[] {
  return grades.flatMap(g => g.units)
}

export function getGradeById(gradeId: string): Grade | undefined {
  return grades.find(g => g.id === gradeId)
}

export function getUnitById(unitId: string): { grade: Grade; unit: Unit } | undefined {
  for (const grade of grades) {
    const unit = grade.units.find(u => u.id === unitId)
    if (unit) return { grade, unit }
  }
  return undefined
}

export function getAllWords() {
  return grades.flatMap(g => g.units.flatMap(u => u.words))
}
