import { Image, ImageUpscale, MoveRight } from "lucide-react"

interface Instruction {
  start: string
  bold: string
  end: string
}

const instructions: Instruction[] = [
  {
    start: "Click on the",
    bold: "Select Image",
    end: "button to select an image.",
  },
  {
    start: "Enter a new",
    bold: "target",
    end: "size for your image.",
  },
  {
    start: "Click the",
    bold: "Resize Image",
    end: "button to resize the image.",
  },
]

export default function ResizeGuide() {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="flex flex-col-reverse lg:flex-row w-3/4 gap-4 h-auto lg:h-64">
        <div className="bg-gray-300 flex justify-center w-full h-full">
          <div className="flex justify-center items-center gap-2 w-full h-40 sm:h-48 lg:h-full">
            <Image size={55} strokeWidth={1} strokeOpacity={1} />
            <MoveRight size={55} strokeWidth={1} strokeOpacity={1} />
            <ImageUpscale size={55} strokeWidth={1} strokeOpacity={1} />
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col justify-center items-center h-full">
            <h2 className="text-2xl font-semibold text-center my-2">
              {"How to reize an image?"}
            </h2>
            <ol className="list-decimal list-inside my-4 text-base">
              {instructions.map((ins, i) => (
                <li key={i}>
                  <span>{`${ins.start} `} </span>
                  <span className="font-semibold">{`${ins.bold} `} </span>
                  <span>{ins.end}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
