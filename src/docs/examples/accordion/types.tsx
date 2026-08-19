import { Accordion, AccordionItem } from "@/components/ui/accordion"

// "on-material" requires a distinct parent surface — shown here on a sunken
// wrapper so the bottom hairline is visible against something.
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
      <div className="bg-[var(--s-color-surface-sunken)] p-[var(--p-space-200)]">
        <Accordion type="on-material" defaultValue="c">
          <AccordionItem value="c" title="On-material">
            Bottom hairline only — needs a coloured parent surface to read correctly.
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
