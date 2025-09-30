import {
    Cloud,
    Code2,
    Database,
    FileJson,
    Github,
    Image as ImageIcon,
    Layout,
    Palette,
    PenTool,
    Server,
    Terminal,
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
    "Figma": Palette,
    "Adobe XD": PenTool,
    "Photoshop": ImageIcon,
    "Illustrator": PenTool,
    "VS Code": Terminal,
    "MongoDB": Database,
    "Docker": Server,
    "GitHub": Github,
    "AWS": Cloud,
    "Sketch": PenTool,
    "Principle": Layout,
    "Lottie": FileJson,
    "Framer": Layout,
    "Vercel": Webhook
} as const;

export type ToolName = keyof typeof toolIcons; 