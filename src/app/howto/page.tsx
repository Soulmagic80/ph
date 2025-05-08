"use client"

import * as RadixSelect from "@radix-ui/react-select"

export default function MinimalSelectTest() {
    return (
        <div style={{ minHeight: 2000, padding: 40 }}>
            <h1>Minimal Select Test (Direct Radix)</h1>
            <RadixSelect.Root onOpenAutoFocus={e => e.preventDefault()}>
                <RadixSelect.Trigger className="w-[180px] border px-3 py-2 rounded">
                    <RadixSelect.Value placeholder="Wähle etwas" />
                </RadixSelect.Trigger>
                <RadixSelect.Content>
                    <RadixSelect.Item value="eins">Eins</RadixSelect.Item>
                    <RadixSelect.Item value="zwei">Zwei</RadixSelect.Item>
                </RadixSelect.Content>
            </RadixSelect.Root>
            <p style={{ marginTop: 1000 }}>Scroll nach unten und öffne das Dropdown. Springt die Seite nach oben?</p>
        </div>
    )
} 