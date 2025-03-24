export const siteConfig = {
  name: "PortfolioHunt",
  url: "http://localhost:3000",
  description: "A platform for designers to showcase their portfolios",
  baseLinks: {
    home: "/",
    settings: {
      audit: "/settings/audit",
      users: "/settings/users",
      billing: "/settings/billing",
    },
    login: "/login",
    onboarding: "/onboarding/products",
  },
}

export type siteConfig = typeof siteConfig
