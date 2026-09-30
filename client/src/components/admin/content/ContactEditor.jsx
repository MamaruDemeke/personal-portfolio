import { Card, TextArea, TextInput } from "../fields.jsx";

export default function ContactEditor({ content, update }) {
  const c = content.contact;

  return (
    <Card>
      <TextArea
        label="Intro paragraph"
        rows={4}
        value={c.intro}
        onChange={(v) => update({ intro: v })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Button label"
          value={c.submitLabel}
          onChange={(v) => update({ submitLabel: v })}
        />
        <TextInput
          label="Success message"
          value={c.successMessage}
          onChange={(v) => update({ successMessage: v })}
        />
      </div>
    </Card>
  );
}