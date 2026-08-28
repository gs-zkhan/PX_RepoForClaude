import { Textarea } from "@/components/ui/textarea"

export default function TextareaStates() {
  return (
    <div className="flex flex-col gap-6">
      <Textarea label="Default" placeholder="Write message" />
      <Textarea
        label="Error"
        state="error"
        helperText="This field is required."
        defaultValue=""
      />
      <Textarea
        label="Success"
        state="success"
        helperText="Looks good."
        defaultValue="A short, valid description."
      />
      <Textarea label="Disabled" disabled placeholder="Write message" />
    </div>
  )
}
