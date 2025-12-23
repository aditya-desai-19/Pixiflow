import FeaturesGrid from "@/components/custom/home/features-grid"
import FileInput from "@/components/custom/home/file-input"
import Footer from "@/components/custom/home/footer"
import ResizeGuide from "@/components/custom/home/resize-guide"
import Tagline from "@/components/custom/home/tag-line"

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
