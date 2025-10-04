"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";
import ThemeSwitch from "./ThemeSwitch";

const navigation = {
    product: [
        { name: "Browse", href: "/", external: false },
        { name: "Upload", href: "/user/upload", external: false },
        { name: "Feedback", href: "/feedback", external: false },
    ],
    resources: [
        { name: "How To", href: "/howto", external: false },
        { name: "Tools", href: "#", external: false },
        { name: "Templates", href: "#", external: false },
    ],
    company: [
        { name: "About", href: "/about", external: false },
        { name: "Contact", href: "/contact", external: false },
    ],
    legal: [
        { name: "Privacy", href: "/privacy", external: false },
        { name: "Terms", href: "/terms", external: false },
    ],
};

export default function Footer() {
    return (
        <footer id="footer" className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-5 md:px-10">
                <div className="pb-2 pt-16 sm:pt-24 lg:pt-16">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-20">
                        <div className="space-y-6">
                            <div className="w-32 sm:w-40">
                                <Logo />
                            </div>
                            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                                Honest feedback. Better portfolios. Good vibes only.
                            </p>
                            <div className="flex space-x-6">
                                <ThemeSwitch />
                            </div>
                            <div></div>
                        </div>
                        <div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                                        Product
                                    </h3>
                                    <ul
                                        role="list"
                                        className="mt-6 space-y-4"
                                        aria-label="Quick links Product"
                                    >
                                        {navigation.product.map((item) => (
                                            <li key={item.name} className="w-fit">
                                                <Link
                                                    className="flex items-center rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                                    href={item.href}
                                                    target={item.external ? "_blank" : undefined}
                                                    rel={item.external ? "noopener noreferrer" : undefined}
                                                >
                                                    <span>{item.name}</span>
                                                    {item.external && (
                                                        <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                                                            <ExternalLink
                                                                aria-hidden="true"
                                                                className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                                                            />
                                                        </div>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                                        Resources
                                    </h3>
                                    <ul
                                        role="list"
                                        className="mt-6 space-y-4"
                                        aria-label="Quick links Resources"
                                    >
                                        {navigation.resources.map((item) => (
                                            <li key={item.name} className="w-fit">
                                                <Link
                                                    className="flex items-center rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                                    href={item.href}
                                                    target={item.external ? "_blank" : undefined}
                                                    rel={item.external ? "noopener noreferrer" : undefined}
                                                >
                                                    <span>{item.name}</span>
                                                    {item.external && (
                                                        <div className="ml-0.5 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                                                            <ExternalLink
                                                                aria-hidden="true"
                                                                className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                                                            />
                                                        </div>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                                        Company
                                    </h3>
                                    <ul
                                        role="list"
                                        className="mt-6 space-y-4"
                                        aria-label="Quick links Company"
                                    >
                                        {navigation.company.map((item) => (
                                            <li key={item.name} className="w-fit">
                                                <Link
                                                    className="flex items-center rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                                    href={item.href}
                                                    target={item.external ? "_blank" : undefined}
                                                    rel={item.external ? "noopener noreferrer" : undefined}
                                                >
                                                    <span>{item.name}</span>
                                                    {item.external && (
                                                        <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                                                            <ExternalLink
                                                                aria-hidden="true"
                                                                className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                                                            />
                                                        </div>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                                        Legal
                                    </h3>
                                    <ul
                                        role="list"
                                        className="mt-6 space-y-4"
                                        aria-label="Quick links Legal"
                                    >
                                        {navigation.legal.map((item) => (
                                            <li key={item.name} className="w-fit">
                                                <Link
                                                    className="flex items-center rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                                    href={item.href}
                                                    target={item.external ? "_blank" : undefined}
                                                    rel={item.external ? "noopener noreferrer" : undefined}
                                                >
                                                    <span>{item.name}</span>
                                                    {item.external && (
                                                        <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
                                                            <ExternalLink
                                                                aria-hidden="true"
                                                                className="size-full shrink-0 text-gray-900 dark:text-gray-300"
                                                            />
                                                        </div>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-8 pb-8 sm:mt-20 lg:mt-24">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <p className="text-sm leading-5 text-gray-500 dark:text-gray-400">
                                &copy; {new Date().getFullYear()} Vibefolio. All rights reserved.
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Link href="/changelog" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">
                                    Changelog
                                </Link>
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <Link href="/support" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">
                                    Support
                                </Link>
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">
                                    Privacy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}





