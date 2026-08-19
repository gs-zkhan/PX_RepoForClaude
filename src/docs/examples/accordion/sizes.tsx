import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function AccordionSizes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <Accordion size={48} defaultValue="a">
        <AccordionItem value="a" title="Compact (48)">
          Header row height is 48px — use in dense panels.
        </AccordionItem>
      </Accordion>
      <Accordion size={56} defaultValue="b">
        <AccordionItem value="b" title="Default (56)">
          56px is the default header row height for most surfaces.
        </AccordionItem>
      </Accordion>
      <Accordion size={64} defaultValue="c">
        <AccordionItem value="c" title="With subtitle (64)" subtitle="Extra room for a subtitle line">
          64px is only for headers that carry a subtitle.
        </AccordionItem>
      </Accordion>
    </div>
  )
}
