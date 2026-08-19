import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function AccordionDefault() {
  return (
    <Accordion defaultValue="billing">
      <AccordionItem value="billing" title="Billing details">
        Invoices are generated on the first of every month and sent to the
        account owner's email.
      </AccordionItem>
      <AccordionItem value="permissions" title="Permissions">
        Only Admins can change billing plans or remove seats.
      </AccordionItem>
    </Accordion>
  )
}
