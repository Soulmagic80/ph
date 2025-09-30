import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

export function Container({ children, className, as: Component = "div" }: ContainerProps) {
    return (
        <Component className={cn("max-w-7xl mx-auto px-5 md:px-10", className)}>
            {children}
        </Component>
    );
} 