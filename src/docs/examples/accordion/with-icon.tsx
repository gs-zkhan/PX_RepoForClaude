import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function AccordionWithIcon() {
  return (
    <Accordion size={64} defaultValue="security">
      <AccordionItem
        value="security"
        icon="lock"
        title="Security"
        subtitle="SSO, session limits and audit log"
      >
        Configure single sign-on and session expiry for this account.
      </AccordionItem>
    </Accordion>
  )
}
