"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  X,
  FileText,
  Edit,
  ChevronDown,
  ExternalLink,
  DownloadCloud,
  Share2,
  MessageSquare,
  Link2,
  Users,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  PenTool,
  FilePenLineIcon,
  RotateCcw,
  RotateCw,
  Trash2,
  Move,
  PlusSquare,
  ImageIcon,
  Brush,
  Highlighter,
  Type,
  CaseSensitive,
  HelpCircle,
  Leaf,
} from "lucide-react"

interface DocumentViewerProps {
  documentName: string
  documentUrl: string
  documentType?: string
  totalPages?: number
  onClose: () => void
  isEditMode?: boolean // New prop
  onToggleEditMode?: () => void // New prop
}

export function DocumentViewer({
  documentName,
  documentUrl,
  documentType = "PDF",
  totalPages = 16,
  onClose,
  isEditMode = false, // Default to false
  onToggleEditMode,
}: DocumentViewerProps) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col z-50">
      {/* Top Bar */}
      {isEditMode ? (
        <div className="bg-white h-16 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close viewer">
              <X className="h-5 w-5" />
            </Button>
            <span className="font-medium">{documentName}</span>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground mr-1">Page</span>
            <Input type="number" defaultValue={1} className="w-12 h-8 text-center text-sm" aria-label="Current page" />
            <span className="text-sm text-muted-foreground ml-1">of {totalPages}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" title="Undo">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Redo">
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete Page">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Move Page">
                  <Move className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Move Up</DropdownMenuItem>
                <DropdownMenuItem>Move Down</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" title="Add Page">
              <PlusSquare className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="sm" className="text-sm">
              <ImageIcon className="h-4 w-4 mr-1.5" />
              Insert image
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Brush className="h-4 w-4 mr-1.5" />
              Draw
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Highlighter className="h-4 w-4 mr-1.5" />
              Highlight
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Type className="h-4 w-4 mr-1.5" />
              Add text
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <CaseSensitive className="h-4 w-4 mr-1.5" />
              Edit text
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm">
                  <FilePenLineIcon className="h-4 w-4 mr-1.5" /> Sign <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Add Signature</DropdownMenuItem>
                <DropdownMenuItem>Request Signature</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Help">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-sm" onClick={onToggleEditMode}>
              Cancel
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8 text-sm bg-gray-800 hover:bg-gray-700 text-white">
                  Save <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save</DropdownMenuItem>
                <DropdownMenuItem>Save as New Version</DropdownMenuItem>
                <DropdownMenuItem>Save as Template</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        // Existing Top Bar for non-edit mode
        <div className="bg-white h-16 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close viewer">
              <X className="h-5 w-5" />
            </Button>
            <div className="text-sm">
              <span className="text-muted-foreground">Mark Brown / </span>
              <span className="font-medium">{documentName}</span>
              {documentType && <span className="text-xs text-muted-foreground ml-1">{documentType}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {["File", "Edit", "View", "Help"].map((item) => (
              <DropdownMenu key={item}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm px-2">
                    {item}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Option 1 for {item}</DropdownMenuItem>
                  <DropdownMenuItem>Option 2 for {item}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar (Non-Edit Mode) */}
      {!isEditMode && (
        <div className="bg-gray-50 h-14 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <Input type="number" defaultValue={1} className="w-12 h-8 text-center text-sm" aria-label="Current page" />
            <span className="text-sm text-muted-foreground">of {totalPages}</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-sm">
                  <ExternalLink className="h-4 w-4 mr-2" /> Open in <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Desktop App</DropdownMenuItem>
                <DropdownMenuItem>New Tab</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Updated Edit button to toggle edit mode */}
            <Button variant="outline" size="sm" className="h-8 text-sm" onClick={onToggleEditMode}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-sm">
                  <PenTool className="h-4 w-4 mr-2" /> Mark up <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Add Text</DropdownMenuItem>
                <DropdownMenuItem>Draw</DropdownMenuItem>
                <DropdownMenuItem>Highlight</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-sm">
                  <FilePenLineIcon className="h-4 w-4 mr-2" /> Sign <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Add Signature</DropdownMenuItem>
                <DropdownMenuItem>Request Signature</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 bg-blue-500 text-white text-xs font-semibold"
            >
              N
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-gray-200">
              <Users className="h-4 w-4 text-gray-600" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" title="Comments">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" title="Download">
              <DownloadCloud className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" title="Get link">
              <Link2 className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button size="sm" className="h-8 text-sm bg-gray-800 hover:bg-gray-700 text-white">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </div>
      )}

      {/* Document Content & Zoom Controls */}
      <div className={`flex-1 bg-gray-200 overflow-auto p-4 relative flex ${isEditMode ? "flex-row" : ""}`}>
        {isEditMode && (
          <div className="w-48 bg-white border-r p-2 overflow-y-auto space-y-2 mr-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div key={`thumb-${i}`} className="border rounded p-1 cursor-pointer hover:border-primary">
                <Image
                  src={documentUrl || "/placeholder.svg"} // Use actual thumbnail if available
                  alt={`Page ${i + 1} thumbnail`}
                  width={100}
                  height={129} // Approximate aspect ratio
                  className="object-contain mx-auto"
                />
                <p className="text-xs text-center mt-1">Page {i + 1}</p>
              </div>
            ))}
          </div>
        )}

        {/* Document Display Area */}
        <div className="w-full h-full flex justify-center items-start">
          <div className="max-w-4xl w-full bg-white shadow-lg">
            <Image
              src={documentUrl || "/placeholder.svg"}
              alt={documentName}
              width={850}
              height={1100}
              layout="responsive"
              className="object-contain"
            />
          </div>
        </div>

        {/* Zoom controls remain in the same position relative to the overall content area */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white p-1 rounded-md shadow">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Search className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                100% <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Fit to Page</DropdownMenuItem>
              <DropdownMenuItem>Fit to Width</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>50%</DropdownMenuItem>
              <DropdownMenuItem>75%</DropdownMenuItem>
              <DropdownMenuItem>100%</DropdownMenuItem>
              <DropdownMenuItem>125%</DropdownMenuItem>
              <DropdownMenuItem>150%</DropdownMenuItem>
              <DropdownMenuItem>200%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        {isEditMode && (
          <div className="absolute bottom-4 right-4 z-10">
            <Button variant="link" size="sm" className="text-xs text-muted-foreground">
              Feedback on PDF <Leaf className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
