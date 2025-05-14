import {
    Code2,
    Database,
    FileJson,
    GitBranch,
    Layout,
    Server,
    Type,
    Webhook
} from "lucide-react";

export const toolIcons = {
    "React": Code2,
    "Next.js": FileJson,
    "TypeScript": Type,
    "Tailwind CSS": Layout,
    "Node.js": Server,
    "PostgreSQL": Database,
    "Figma": Layout,
    "Git": GitBranch,
    "AWS": Webhook,
} as const;

export type ToolName = keyof typeof toolIcons; 