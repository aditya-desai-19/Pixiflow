import FeaturesGrid from "@/components/custom/pages/home/features-grid"
import FileInput from "@/components/custom/pages/home/file-input"
import Footer from "@/components/custom/pages/home/footer"
import ResizeGuide from "@/components/custom/pages/home/resize-guide"
import Tagline from "@/components/custom/pages/home/tag-line"

export default function Home() {
  return (
    <div className="overflow-auto">
      <Tagline />
      <FileInput />
      <FeaturesGrid />
      <ResizeGuide />
      <Footer />
    </div>
  )
}
