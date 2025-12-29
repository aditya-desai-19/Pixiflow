"use client"

import { imagesClient } from "@/api/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GetAllImagesRequest, ImageDetailsResponse } from "@/generated"
import { Delete, Download, Image, Trash } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"

export default function DataTable() {
  const [imageData, setImageData] = useState<ImageDetailsResponse[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)

  const windowSize = 3
  const startPageRef = useRef<number>(0)

  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "-1", 10)
  const pageSize = parseInt(searchParams.get("pageSize") || "-1", 10)

  const startPage = Math.floor(currentPage / windowSize) * windowSize
  const endPage = Math.min(startPage + windowSize, totalPages)

  const fetchData = async (page: number, pageSize: number) => {
    try {
      const body: GetAllImagesRequest = {
        page: page,
        pageSize: pageSize,
      }
      const data = await imagesClient.getAllImages(body)
      setImageData(data.content || [])
      setTotalPages(data.totalPages ?? 0)
    } catch (error) {
      console.log("Some error occured while fetching images ", error)
    }
  }

  useEffect(() => {
    if (currentPage >= 0 && pageSize > 0) {
      fetchData(currentPage, pageSize)
    }
  }, [currentPage, pageSize])

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableHead>
            <Checkbox
              aria-label="select-all"
              className=" data-[state=checked]:bg-brand-primary data-[state=checked]:text-surface-primary data-[state=checked]:border-brand-primary"
            />
          </TableHead>
          <TableHead className="flex-2">{"Image"}</TableHead>
          <TableHead className="flex-1">{"Created at"}</TableHead>
          <TableHead className="flex-1">{"Action"}</TableHead>
        </TableHeader>
        <TableBody>
          {imageData.map((item) => (
            <TableRow key={item.imageId}>
              <TableCell>
                <Checkbox
                  id={`table-checkbox-${item.imageId}`}
                  aria-label={`product-checkbox-${item.imageId}`}
                  className=" data-[state=checked]:bg-brand-primary data-[state=checked]:text-surface-primary data-[state=checked]:border-brand-primary"
                />
              </TableCell>
              <TableCell className="flex gap-2 items-center flex-2">
                <Avatar className="rounded-sm">
                  <AvatarImage src={item.imageUrl} alt={item.imageName} />
                  <AvatarFallback className="text-xs">
                    <Image />
                  </AvatarFallback>
                </Avatar>
                <span>{item.imageName}</span>
              </TableCell>
              <TableCell className="flex-1">
                <span>{dayjs(item.createdAt).format("D MMM YYYY")}</span>
              </TableCell>
              <TableCell className="flex-1 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={`product-${item.imageId}-delete`}
                >
                  <Trash />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={`product-${item.imageId}-delete`}
                >
                  <Download />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/my-images?page=${currentPage - 1}&pageSize=${pageSize}`}
            />
          </PaginationItem>
          {Array.from({ length: endPage - startPage }, (_, i) => {
            const page = startPageRef.current + i

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/my-images?page=${page}&pageSize=${pageSize}`}
                  isActive={page === currentPage}
                  onClick={() => {
                    if (i === windowSize - 1) {
                      startPageRef.current =
                        startPageRef.current + windowSize - 1
                    }
                  }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          {startPageRef.current + windowSize < totalPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href={`/my-images?page=${currentPage + 1}&pageSize=${pageSize}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
