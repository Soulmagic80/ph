import { RiPieChartLine, RiQuestionLine } from "@remixicon/react"

export const siteConfig = {
  name: "PortfolioHunt",
  url: "http://localhost:3000",
  description: "A platform for designers to showcase their portfolios",
  baseLinks: {
    home: "/",
    login: "/login",
    signup: "/signup",
    user: {
      profile: "/user/profile",
      account: "/user/account",
      social: "/user/social",
    },
    portfolios: {
      root: "/portfolios",
    },
    howto: "/howto",
  },
  navigation: [
    {
      name: "Portfolios",
      href: "/portfolios",
      icon: RiPieChartLine,
    },
    {
      name: "How to",
      href: "/howto",
      icon: RiQuestionLine,
    },
  ],
}

export type siteConfig = typeof siteConfig
