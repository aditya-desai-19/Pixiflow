import {
  Heart,
  ImageUpscale,
  Lightbulb,
  Pencil,
  Shield,
  Zap,
} from "lucide-react"
import { ReactNode } from "react"

interface CardItem {
  logo: ReactNode
  title: string
  description: string
}

const cardItems: CardItem[] = [
  {
    logo: <ImageUpscale size={30} strokeWidth={1} strokeOpacity={1} />,
    title: "Perfect Quality",
    description:
      "The best online image resizer to resize your images at the highest quality.",
  },
  {
    logo: <Zap size={30} strokeWidth={1} strokeOpacity={1} />,
    title: "Lightning Fast",
    description:
      "This cloud-hosted, highly scalable tool can resize your images within seconds!",
  },
  {
    logo: <Pencil size={30} strokeWidth={1} strokeOpacity={1} />,
    title: "Easy to use",
    description:
      "Simply upload your image and enter a target size. It's as easy as that!",
  },
  {
    logo: <Lightbulb size={30} strokeWidth={1} strokeOpacity={1} />,
    title: "Works Anywhere",
    description:
      "Pixiflow.com is browser-based (no software to install). It works on any platform (Windows, Linux, Mac).",
  },
  {
    logo: <Shield size={30} strokeWidth={1} strokeOpacity={1} />,
    title: "Privacy Guaranteed",
    description:
      "Your images are uploaded via a secure 256-bit encrypted SSL connection and deleted automatically within 6 hours.",
  },
  {
    logo: <Heart size={30} strokeWidth={1} strokeOpacity={1} />,
    title: "It's Free",
    description:
      "Since 2012 we have resized millions of images for free! There is no software to install, registrations, or watermarks.",
  },
]

function GridItem({ logo, title, description }: CardItem) {
  return (
    <div className="flex flex-col items-center w-full gap-2 p-4 text-center">
      <div>{logo}</div>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-base text-wrap">{description}</p>
    </div>
  )
}

export default function FeaturesGrid() {
  return (
    <div className="flex justify-center items-center my-8 p-4">
      <div className="w-3/4">
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-6">
          {cardItems.map((c, i) => {
            return <GridItem key={i} {...c} />
          })}
        </div>
      </div>
    </div>
  )
}
