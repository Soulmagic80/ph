import { RiPieChartLine, RiQuestionLine } from "@remixicon/react"

export const siteConfig = {
  name: "Vibefolio",
  url: "https://vibefolio.com",
  description: "Get feedback on your portfolio from the community",
  author: "Vibefolio Team",
  baseLinks: {
    home: "/",
    login: "/auth/login",
    signup: "/auth/login/register",
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
