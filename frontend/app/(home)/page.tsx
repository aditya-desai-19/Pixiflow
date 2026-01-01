import FeaturesGrid from "@/app/(home)/features-grid"
import FileInput from "@/app/(home)/file-input"
import Footer from "@/app/(home)/footer"
import ResizeGuide from "@/app/(home)/resize-guide"
import Tagline from "@/app/(home)/tag-line"

export default function Home() {
  return (
    <div>
      <Tagline />
      <FileInput />
      <FeaturesGrid />
      <ResizeGuide />
      <Footer />
    </div>
  )
}
