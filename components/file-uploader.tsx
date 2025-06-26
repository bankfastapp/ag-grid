"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { UploadCloud, FileText, XCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
}

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void // Callback when files are "successfully" processed
  acceptedFileTypes?: string // e.g., ".pdf,.doc,.docx"
  maxFileSizeMB?: number
}

export function FileUploader({
  onFilesUploaded,
  acceptedFileTypes = ".pdf,.doc,.docx,.txt",
  maxFileSizeMB = 10,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newFilesToProcess: File[] = []
      const newUploadedFileStates: UploadedFile[] = []

      Array.from(files).forEach((file) => {
        if (file.size > maxFileSizeMB * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: `${file.name} exceeds the ${maxFileSizeMB}MB size limit.`,
            variant: "destructive",
          })
          return
        }
        // Basic type check (relies on browser's interpretation of acceptedFileTypes)
        // More robust checking might be needed for specific MIME types

        const fileId = `${file.name}-${Date.now()}`
        newFilesToProcess.push(file)
        newUploadedFileStates.push({
          id: fileId,
          file,
          status: "uploading",
          progress: 0,
        })
      })

      if (newUploadedFileStates.length > 0) {
        setUploadedFiles((prev) => [...prev, ...newUploadedFileStates])
        // Simulate upload process
        newUploadedFileStates.forEach((ufs) => {
          let progress = 0
          const interval = setInterval(() => {
            progress += 10
            if (progress <= 100) {
              setUploadedFiles((prev) => prev.map((f) => (f.id === ufs.id ? { ...f, progress } : f)))
            } else {
              clearInterval(interval)
              // Simulate success/error
              const isSuccess = Math.random() > 0.1 // 90% success rate
              setUploadedFiles((prev) =>
                prev.map((f) =>
                  f.id === ufs.id
                    ? {
                        ...f,
                        status: isSuccess ? "success" : "error",
                        error: isSuccess ? undefined : "Simulated upload error",
                      }
                    : f,
                ),
              )
              if (isSuccess) {
                // Call onFilesUploaded for successfully "uploaded" files
                // In a real app, this would be after actual successful API response
                const successfulFile = newFilesToProcess.find((nf) => nf.name === ufs.file.name)
                if (successfulFile) onFilesUploaded([successfulFile])
              } else {
                toast({
                  title: "Upload Failed",
                  description: `${ufs.file.name} could not be uploaded.`,
                  variant: "destructive",
                })
              }
            }
          }, 100)
        })
      }
    },
    [maxFileSizeMB, onFilesUploaded, toast],
  )

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      // Reset input value to allow uploading the same file again
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
                    ${dragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}
                    transition-colors duration-200 ease-in-out`}
        onClick={onButtonClick} // Allow click to open file dialog
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleChange}
          accept={acceptedFileTypes}
        />
        <UploadCloud className={`mx-auto h-12 w-12 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
        <p className={`mt-2 text-sm ${dragActive ? "text-primary" : "text-muted-foreground"}`}>
          Drag & drop files here, or click to select files
        </p>
        <p className="text-xs text-muted-foreground/80">
          Supported types: {acceptedFileTypes.replaceAll(",", ", ")}. Max size: {maxFileSizeMB}MB.
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploads</h4>
          {uploadedFiles.map((upFile) => (
            <div key={upFile.id} className="flex items-center space-x-3 p-2 border rounded-md">
              <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-medium truncate" title={upFile.file.name}>
                  {upFile.file.name}
                </p>
                <p className="text-xs text-muted-foreground">{(upFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                {upFile.status === "uploading" && <Progress value={upFile.progress} className="h-1.5 mt-1" />}
                {upFile.status === "error" && <p className="text-xs text-destructive mt-0.5">{upFile.error}</p>}
              </div>
              {upFile.status === "success" && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
              {upFile.status === "error" && <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />}
              {(upFile.status === "uploading" || upFile.status === "error") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(upFile.id)}
                  className="h-7 w-7 flex-shrink-0"
                >
                  <XCircle className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
