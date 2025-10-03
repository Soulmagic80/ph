"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.7 }}
                transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

