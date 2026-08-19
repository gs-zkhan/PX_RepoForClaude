import { Letter } from "@/components/ui/letter"

// In FilterConfigModal, each criterion row gets the next letter by position
// (A, B, C…), so the sequence stays correct as rows are added or removed.
export default function LetterSequence() {
  return (
    <div className="flex items-center gap-[var(--p-space-100)]">
      {["A", "B", "C", "D"].map((letter) => (
        <Letter key={letter} letter={letter} />
      ))}
    </div>
  )
}
