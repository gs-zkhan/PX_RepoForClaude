import { Accordion, AccordionItem } from "@/components/ui/accordion"

// "on-material" has no background of its own — it sits directly on the
// normal inherited page/surface background, not inside an extra wrapper
// card (design-owner correction, 2026-08-27).
export default function AccordionTypes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <Accordion type="off-material" defaultValue="a">
        <AccordionItem value="a" title="Off-material">
          1px border, radius/150, no shadow. For standalone cards on the page surface.
        </AccordionItem>
      </Accordion>
      <Accordion type="off-material-shadow" defaultValue="b">
        <AccordionItem value="b" title="Off-material shadow">
          shadow/400, no border. For floating cards.
        </AccordionItem>
      </Accordion>
      <Accordion type="on-material" defaultValue="c">
        <AccordionItem value="c" title="On-material">
          Bottom hairline only — no container, inherits the page background as-is.
        </AccordionItem>
      </Accordion>
    </div>
  )
}
