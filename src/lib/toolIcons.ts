import {
    Camera,
    Code2,
    Eye,
    Figma,
    FileJson,
    Globe,
    Layout,
    Pencil,
    PenTool,
    Image as Photoshop,
    Type,
    Video
} from "lucide-react";

export const toolIcons = {
    figma: Figma,
    sketch: Pencil,
    photoshop: Photoshop,
    illustrator: PenTool,
    xd: Layout,
    invision: Eye,
    code: Code2,
    aftereffects: Video,
    premiere: Video,
    indesign: Type,
    lightroom: Camera,
    webflow: Globe,
    framer: FileJson,
} as const;

export type ToolName = keyof typeof toolIcons; 