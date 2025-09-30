// Tremor Raw cx [v0.0.0]

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "./supabase";
const supabase = createClient();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-500 focus:dark:ring-blue-400",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-400",
]

// Tremor Raw focusRing [v0.0.1]
export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
]

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
]

export const formatters: { [key: string]: any } = {
  currency: ({
    number,
    maxFractionDigits = 2,
    currency = "USD",
  }: {
    number: number
    maxFractionDigits?: number
    currency?: string
  }) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: maxFractionDigits,
    }).format(number),

  unit: (number: number) => {
    const formattedNumber = new Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(number)
    return `${formattedNumber}`
  },

  percentage: ({
    number,
    decimals = 1,
  }: {
    number: number
    decimals?: number
  }) => {
    const formattedNumber = new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number)
    const symbol = number > 0 && number !== Infinity ? "+" : ""

    return `${symbol}${formattedNumber}`
  },

  million: ({
    number,
    decimals = 1,
  }: {
    number: number
    decimals?: number
  }) => {
    const formattedNumber = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number)
    return `${formattedNumber}M`
  },
}

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Ersetze Leerzeichen durch -
    .replace(/[^\w-]+/g, '') // Entferne alle nicht-Wort-Zeichen (außer -)
    .replace(/--+/g, '-') // Ersetze mehrere -- durch ein einzelnes -
    .replace(/^-+/, '') // Entferne führende -
    .replace(/-+$/, ''); // Entferne abschließende -
}

export async function generateUniqueSlug(title: string, portfolioIdToExclude: string | null = null): Promise<string> {
  let slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = supabase
      .from('portfolios')
      .select('slug')
      .eq('slug', uniqueSlug);

    if (portfolioIdToExclude) {
      query.neq('id', portfolioIdToExclude);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error checking for existing slug:', error);
      return `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    if (!data) {
      return uniqueSlug;
    }

    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
}
