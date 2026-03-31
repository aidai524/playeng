import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Unit, Word } from "@/data/units"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 20
const CONTENT_W = PAGE_W - MARGIN * 2

function addHeader(doc: jsPDF, title: string) {
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(title, PAGE_W / 2, 18, { align: "center" })

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(`Name: ____________    Date: ____________`, MARGIN, 25)

  doc.setDrawColor(200)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, 27, PAGE_W - MARGIN, 27)
}

function checkNewPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - MARGIN) {
    doc.addPage()
    return 32
  }
  return y
}

function addTracing(doc: jsPDF, words: Word[], title: string): number {
  addHeader(doc, `Tracing Practice - ${title}`)
  let y = 35

  const selected = shuffle(words).slice(0, 6)

  selected.forEach((word) => {
    y = checkNewPage(doc, y, 35)

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(`${word.emoji}  ${word.cn}`, MARGIN, y)

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(220, 220, 220)
    doc.text(word.en, MARGIN, y + 10)
    doc.setTextColor(0, 0, 0)

    doc.setDrawColor(180)
    doc.setLineWidth(0.2)
    doc.line(MARGIN, y + 13, MARGIN + doc.getTextWidth(word.en) * 1.1, y + 13)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(150)
    doc.text("(write here)", MARGIN + 60, y + 12)
    doc.setTextColor(0, 0, 0)

    y += 35
  })

  return y
}

function addPictureWriting(doc: jsPDF, words: Word[], title: string): number {
  addHeader(doc, `Look and Write - ${title}`)
  let y = 38

  const selected = shuffle(words).filter(w => w.emoji.length <= 2).slice(0, 8)

  const cols = 2
  const colW = CONTENT_W / cols

  selected.forEach((word, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = MARGIN + col * colW
    const thisY = y + row * 55

    if (thisY + 50 > PAGE_H - MARGIN) {
      if (col === 0) {
        doc.addPage()
        addHeader(doc, `Look and Write - ${title} (cont.)`)
        y = 38
      }
    }

    const currentY = y + (row % 4) * 55

    doc.setFontSize(28)
    doc.text(word.emoji, x + 15, currentY + 12)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(120)
    doc.text(word.cn, x + 35, currentY + 8)
    doc.setTextColor(0, 0, 0)

    doc.setDrawColor(180)
    doc.setLineWidth(0.3)
    doc.line(x + 35, currentY + 16, x + colW - 10, currentY + 16)

    doc.setFontSize(7)
    doc.setTextColor(200)
    doc.text("English word", x + 35, currentY + 20)
    doc.setTextColor(0, 0, 0)
  })

  return y + Math.ceil(selected.length / cols) * 55 + 10
}

function addDialogueFill(doc: jsPDF, unit: Unit): number {
  if (!unit.dialogues.length) return 0

  addHeader(doc, `Dialogue Fill-in - ${unit.title}`)
  let y = 35

  unit.dialogues.forEach((dialogue) => {
    y = checkNewPage(doc, y, 30 + dialogue.lines.length * 18)

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(dialogue.title, MARGIN, y)
    y += 8

    dialogue.lines.forEach((line) => {
      y += 4
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(80, 80, 180)
      doc.text(`${line.speaker}:`, MARGIN + 5, y)

      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)

      const words = line.en.split(" ")
      const blankIdx = Math.floor(words.length / 2)
      const blankWord = words[blankIdx]
      const displayLine = words.map((w, i) => i === blankIdx ? "______" : w).join(" ")

      doc.text(displayLine, MARGIN + 18, y)

      doc.setFontSize(7)
      doc.setTextColor(180)
      doc.text(`(${blankWord})`, MARGIN + 18 + doc.getTextWidth(displayLine) + 3, y)
      doc.setTextColor(0, 0, 0)

      doc.setFontSize(8)
      doc.setTextColor(120)
      doc.text(line.cn, MARGIN + 18, y + 5)
      doc.setTextColor(0, 0, 0)

      y += 16
    })

    y += 8
  })

  return y
}

function addMatching(doc: jsPDF, words: Word[], title: string): number {
  addHeader(doc, `Matching - ${title}`)
  let y = 35

  const selected = shuffle(words).slice(0, 6)
  const shuffledCn = shuffle(selected.map(w => ({ id: w.id, cn: w.cn })))

  const leftCol = MARGIN + 5
  const rightCol = PAGE_W - MARGIN - 40

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("English", leftCol, y)
  doc.text("Chinese", rightCol, y)
  y += 6

  doc.setDrawColor(200)
  doc.line(leftCol, y, leftCol + 35, y)
  doc.line(rightCol, y, rightCol + 35, y)
  y += 8

  selected.forEach((word, i) => {
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`${i + 1}. ${word.en}`, leftCol, y)

    const cnIdx = shuffledCn.findIndex(c => c.id === word.id)
    doc.text(`${String.fromCharCode(65 + cnIdx)}. ${shuffledCn[i].cn}`, rightCol, y)

    y += 14
  })

  doc.setFontSize(8)
  doc.setTextColor(150)
  y += 5
  doc.text("Answer: _________________________________________________", MARGIN, y)
  doc.setTextColor(0, 0, 0)

  return y + 15
}

export function generateWorkbook(unit: Unit): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  addTracing(doc, unit.words, unit.title)
  doc.addPage()
  addPictureWriting(doc, unit.words, unit.title)
  doc.addPage()
  addDialogueFill(doc, unit)
  doc.addPage()
  addMatching(doc, unit.words, unit.title)

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(180)
    doc.text(
      `English Practice - ${unit.title}  |  Page ${i} / ${pageCount}`,
      PAGE_W / 2,
      PAGE_H - 10,
      { align: "center" }
    )
    doc.setTextColor(0, 0, 0)
  }

  return doc
}

export function downloadWorkbook(unit: Unit) {
  const doc = generateWorkbook(unit)
  doc.save(`English-Practice-${unit.id}.pdf`)
}
