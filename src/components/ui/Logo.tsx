import Image from "next/image"
import type { SVGProps } from "react"

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <div className="relative h-6 w-auto">
    <Image
      src="/logo-light.svg"
      alt="Logo"
      width={24}
      height={24}
      className="h-6 w-auto block dark:hidden"
    />
    <Image
      src="/logo-dark.svg"
      alt="Logo"
      width={24}
      height={24}
      className="h-6 w-auto hidden dark:block"
    />
  </div>
)

export { Logo }
