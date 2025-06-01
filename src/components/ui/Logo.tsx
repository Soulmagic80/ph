import Image from "next/image"
import type { SVGProps } from "react"

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <div className="relative w-7 h-7">
    <Image
      src="/logo-light.svg"
      alt="Logo"
      width={28}
      height={28}
      className="block dark:hidden"
    />
    <Image
      src="/logo-dark.svg"
      alt="Logo"
      width={28}
      height={28}
      className="hidden dark:block"
    />
  </div>
)

export { Logo }
