"use client"

import { imagesClient } from "@/api/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DeleteImagesByIdsRequest,
  GetAllImagesRequest,
  ImageDetailsResponse,
} from "@/generated"
import { Download, Image as ImageIcon, Trash } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table"
import Spinner from "@/components/custom/ui/spinner"
import { downloadImage } from "@/utils/download-image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function DataTable() {
  const [imageData, setImageData] = useState<ImageDetailsResponse[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isMultiSelect, setIsMultiSelect] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false)
  const [currentImageDetails, setCurrentImageDetails] = useState({
    imageUrl: "",
    imageName: "",
  })

  const fetchData = async (page: number, pageSize: number) => {
    setIsFetchingData(true)
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
      toast.error("Some error occured while fetching images", {
        className: "text-white! bg-red-500!",
        position: "bottom-left",
      })
    } finally {
      setIsFetchingData(false)
    }
  }

  const onDownload = async (imageUrl: string, imageName: string) => {
    try {
      await downloadImage(imageUrl, imageName)
    } catch (error) {
      console.error("Some error occured while downloading image ", error)
      toast.error("Some error occured while downloading image", {
        className: "text-white! bg-red-500!",
        position: "bottom-left",
      })
    }
  }

  const onView = (imageUrl: string, imageName: string) => {
    setCurrentImageDetails({
      imageName,
      imageUrl,
    })
    setShowViewDialog(true)
  }

  const columns: ColumnDef<ImageDetailsResponse>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "image",
        header: () => <div className="w-[75%] text-center">{"Image"}</div>,
        cell: ({ row }) => {
          const data = row.original
          return (
            <div className="w-[75%] flex gap-2 items-center flex-2">
              <Avatar className="rounded-sm">
                <AvatarImage src={data.imageUrl} alt={data.imageName} />
                <AvatarFallback className="text-xs">
                  <ImageIcon />
                </AvatarFallback>
              </Avatar>
              <span
                className="hover:text-brand-primary hover:cursor-pointer"
                onClick={() =>
                  onView(row.original.imageUrl, row.original.imageName)
                }
              >
                {data.imageName}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <div className="flex-1">
            <span>{dayjs(row.original.createdAt).format("D MMM YYYY")}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex-1 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label={`product-${row.original.imageId}-delete`}
                disabled={!row.getIsSelected()}
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label={`product-${row.original.imageId}-download`}
                disabled={isMultiSelect || !row.getIsSelected()}
                onClick={() =>
                  onDownload(row.original.imageUrl, row.original.imageName)
                }
              >
                <Download />
              </Button>
            </div>
          )
        },
      },
    ],
    [isMultiSelect, onDownload]
  )

  const table = useReactTable({
    columns,
    data: imageData,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: pagination,
    },
    onPaginationChange: setPagination,
  })

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.imageId)

  const selectedImageNames = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.imageName)

  const onDeleteConfirm = async () => {
    if (selectedIds.length == 0) return

    try {
      const body: DeleteImagesByIdsRequest = {
        deleteImagesRequest: {
          imageIds: selectedIds,
        },
      }
      await imagesClient.deleteImagesByIds(body)
      //todo: improve
      if (pagination.pageIndex == 0) {
        await fetchData(0, 10)
      } else {
        setPagination({
          pageIndex: 0,
          pageSize: 10,
        })
      }
    } catch (error) {
      console.error("Some error occured while deleting", error)
      toast.error("Some error occured while deleting", {
        className: "text-white! bg-red-500!",
        position: "bottom-left",
      })
    }
  }

  useEffect(() => {
    const { pageIndex, pageSize } = pagination
    fetchData(pageIndex, pageSize)
  }, [pagination])

  useEffect(() => {
    setIsMultiSelect(selectedIds.length > 1)
  }, [selectedIds])

  return (
    <div className="relative rounded-md border">
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Are you absolutely sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {"This action cannot be undone. This will permanently delete "}
              {selectedImageNames.map((imgName, i) => (
                <b key={imgName + i}>{imgName} </b>
              ))}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{"Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              className="cursor-pointer"
            >
              {"Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl px-4 py-2">
          <DialogTitle
            className="w-8/10 truncate py-4"
            title={currentImageDetails.imageName}
          >
            {currentImageDetails.imageName}
          </DialogTitle>
          <div className="relative w-full h-[60vh] rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={currentImageDetails.imageUrl}
              alt="current-image-url"
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="relative">
          {!isFetchingData &&
            (table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {"No results."}
                </TableCell>
              </TableRow>
            ))}
          {isFetchingData && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Spinner className="h-12 w-12" />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center items-center">
        <div className="flex gap-4 items-center my-4">
          <Button
            variant={"outline"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"Previous"}
          </Button>
          <span>{`${pagination.pageIndex + 1} of ${totalPages}`}</span>
          <Button
            variant={"outline"}
            onClick={() => {
              console.log("clicked")
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}
          >
            {"Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}
