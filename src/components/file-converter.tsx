
"use client";

import { useState, useMemo, type ChangeEvent, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText, FileSignature, ArrowRight, Download, X, FileImage, FileSpreadsheet, Presentation } from "lucide-react";

export type ConversionType = 
  | "pdf-to-word" | "word-to-pdf" 
  | "pdf-to-jpg" | "jpg-to-pdf" 
  | "pdf-to-excel" | "excel-to-pdf"
  | "pdf-to-ppt" | "ppt-to-pdf"
  | "html-to-pdf"
  | "merge-pdf" | "split-pdf"
  | "extract-pages" | "delete-pages"
  | "reorder-pages" | "rotate-pages"
  | "watermark-text" | "add-page-numbers"
  | "protect-pdf" | "unlock-pdf"
  | "repair-pdf" | "pdf-to-pdfa"
  | "ocr-pdf" | "edit-pdf";

type ConversionStatus = "idle" | "file-selected" | "uploading" | "converting" | "done" | "error";

interface FileConverterProps {
  conversionType: ConversionType;
  setConversionType: (type: ConversionType) => void;
}

export function FileConverter({ conversionType, setConversionType }: FileConverterProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<{ blob: Blob, name: string } | null>(null);
  const [additionalParams, setAdditionalParams] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const onTabChange = (value: string) => {
    setConversionType(value as ConversionType);
  };
  
  useEffect(() => {
    resetState();
  }, [conversionType]);

  const resetState = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setConvertedFile(null);
    setAdditionalParams({});
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const conversionInfo = useMemo(() => {
    const baseInfo = {
        accept: 'application/pdf',
        multiple: false,
        params: [] as { id: string; label: string; type: string }[],
    };
    switch (conversionType) {
        case "pdf-to-word": return { ...baseInfo, title: "PDF to Word", actionText: "Convert to Word", fromIcon: <FileText className="h-10 w-10 text-destructive" />, toIcon: <FileSignature className="h-10 w-10 text-primary" />, fromType: "PDF", toType: "Word", accept: "application/pdf" };
        case "word-to-pdf": return { ...baseInfo, title: "Word to PDF", actionText: "Convert to PDF", fromIcon: <FileSignature className="h-10 w-10 text-primary" />, toIcon: <FileText className="h-10 w-10 text-destructive" />, fromType: "Word", toType: "PDF", accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
        case "pdf-to-jpg": return { ...baseInfo, title: "PDF to JPG", actionText: "Convert to JPG", fromIcon: <FileText className="h-10 w-10 text-destructive" />, toIcon: <FileImage className="h-10 w-10 text-yellow-500" />, fromType: "PDF", toType: "JPG" };
        case "jpg-to-pdf": return { ...baseInfo, title: "JPG to PDF", actionText: "Convert to PDF", fromIcon: <FileImage className="h-10 w-10 text-yellow-500" />, toIcon: <FileText className="h-10 w-10 text-destructive" />, fromType: "JPG", toType: "PDF", accept: "image/jpeg", multiple: true };
        case "pdf-to-excel": return { ...baseInfo, title: "PDF to Excel", actionText: "Convert to Excel", fromIcon: <FileText className="h-10 w-10 text-destructive" />, toIcon: <FileSpreadsheet className="h-10 w-10 text-green-600" />, fromType: "PDF", toType: "Excel" };
        case "excel-to-pdf": return { ...baseInfo, title: "Excel to PDF", actionText: "Convert to PDF", fromIcon: <FileSpreadsheet className="h-10 w-10 text-green-600" />, toIcon: <FileText className="h-10 w-10 text-destructive" />, fromType: "Excel", toType: "PDF", accept: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        case "pdf-to-ppt": return { ...baseInfo, title: "PDF to PowerPoint", actionText: "Convert to PPT", fromIcon: <FileText className="h-10 w-10 text-destructive" />, toIcon: <Presentation className="h-10 w-10 text-orange-500" />, fromType: "PDF", toType: "PPT" };
        case "ppt-to-pdf": return { ...baseInfo, title: "PowerPoint to PDF", actionText: "Convert to PDF", fromIcon: <Presentation className="h-10 w-10 text-orange-500" />, toIcon: <FileText className="h-10 w-10 text-destructive" />, fromType: "PPT", toType: "PDF", accept: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" };
        case "html-to-pdf": return { ...baseInfo, title: "HTML to PDF", actionText: "Convert to PDF", fromIcon: <FileText className="h-10 w-10 text-blue-500" />, toIcon: <FileText className="h-10 w-10 text-destructive" />, fromType: "HTML", toType: "PDF", accept: ".html" };
        case "merge-pdf": return { ...baseInfo, title: "Merge PDF", actionText: "Merge PDFs", fromIcon: <FileText className="h-10 w-10 text-destructive" />, toIcon: <FileText className="h-10 w-10 text-destructive" />, fromType: "PDFs", toType: "PDF", multiple: true };
        case "split-pdf": return { ...baseInfo, title: "Split PDF", actionText: "Split PDF", fromType: "PDF", toType: "PDFs", params: [{ id: 'ranges', label: 'Page ranges (e.g., 1-3, 5, 7-9)', type: 'text' }] };
        case "extract-pages": return { ...baseInfo, title: "Extract Pages", actionText: "Extract Pages", fromType: "PDF", toType: "PDF", params: [{ id: 'pages', label: 'Pages to extract (e.g., 1, 3, 5-7)', type: 'text' }] };
        case "delete-pages": return { ...baseInfo, title: "Delete Pages", actionText: "Delete Pages", fromType: "PDF", toType: "PDF", params: [{ id: 'pages_to_delete', label: 'Pages to delete (e.g., 2, 4)', type: 'text' }] };
        case "reorder-pages": return { ...baseInfo, title: "Reorder Pages", actionText: "Reorder Pages", fromType: "PDF", toType: "PDF", params: [{ id: 'new_order', label: 'New page order (e.g., 3,1,2,4)', type: 'text' }] };
        case "rotate-pages": return { ...baseInfo, title: "Rotate Pages", actionText: "Rotate Pages", fromType: "PDF", toType: "PDF", params: [{ id: 'rotation_angle', label: 'Rotation Angle (90, 180, 270)', type: 'number' }, { id: 'pages', label: 'Pages to rotate (e.g., 1, 3, all)', type: 'text' }] };
        case "watermark-text": return { ...baseInfo, title: "Add Text Watermark", actionText: "Add Watermark", fromType: "PDF", toType: "PDF", params: [{ id: 'text', label: 'Watermark Text', type: 'text' }] };
        case "add-page-numbers": return { ...baseInfo, title: "Add Page Numbers", actionText: "Add Numbers", fromType: "PDF", toType: "PDF" };
        case "protect-pdf": return { ...baseInfo, title: "Protect PDF", actionText: "Protect PDF", fromType: "PDF", toType: "PDF", params: [{ id: 'password', label: 'Password', type: 'password' }] };
        case "unlock-pdf": return { ...baseInfo, title: "Unlock PDF", actionText: "Unlock PDF", fromType: "PDF", toType: "PDF", params: [{ id: 'password', label: 'Password', type: 'password' }] };
        case "repair-pdf": return { ...baseInfo, title: "Repair PDF", actionText: "Repair PDF", fromType: "PDF", toType: "PDF" };
        case "pdf-to-pdfa": return { ...baseInfo, title: "Convert to PDF/A", actionText: "Convert", fromType: "PDF", toType: "PDF/A" };
        case "ocr-pdf": return { ...baseInfo, title: "OCR PDF", actionText: "Perform OCR", fromType: "PDF", toType: "PDF" };
        case "edit-pdf": return { ...baseInfo, title: "Edit PDF", actionText: "Add Text to PDF", fromType: "PDF", toType: "PDF", params: [{ id: 'text', label: 'Text to add', type: 'text' }, {id: 'x', label: 'X coordinate', type: 'number'}, {id: 'y', label: 'Y coordinate', type: 'number'}] };
        default: return { ...baseInfo, title: "PDF to Word", actionText: "Convert to Word", fromIcon: <FileText className="h-10 w-10 text-destructive" />, toIcon: <FileSignature className="h-10 w-10 text-primary" />, fromType: "PDF", toType: "Word" };
    }
  }, [conversionType]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setStatus("file-selected");
    }
  };
  
  const handleParamChange = (id: string, value: string) => {
    setAdditionalParams(prev => ({...prev, [id]: value}));
  };

  const handleConvert = async () => {
    if (!files.length) return;

    setStatus("converting");
    setProgress(0);

    const animateProgress = () => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      return interval;
    };
    const progressInterval = animateProgress();

    try {
      const formData = new FormData();
      files.forEach((file) => {
          formData.append("files", file);
      });
      formData.append("conversionType", conversionType);

      for (const key in additionalParams) {
        formData.append(key, additionalParams[key]);
      }
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        let errorMessage = `Conversion failed with status: ${response.status}`;
        try {
            const errorData = await response.json();
            if (typeof errorData.message === 'string') {
                errorMessage = errorData.message;
            }
        } catch (e) {
            // response is not json, use text
            const textError = await response.text();
            if (textError && !textError.trim().startsWith('<')) { // check if not html
              errorMessage = textError;
            }
        }
        throw new Error(errorMessage);
      }
      
      setProgress(100);

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = "converted-file";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      
      setConvertedFile({ blob, name: filename });
      setStatus("done");
      toast({
        title: "Conversion Successful!",
        description: "Your file is ready for download.",
      });

    } catch (error) {
      clearInterval(progressInterval);
      setStatus("error");
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error(error);
      toast({
        title: "Conversion Error",
        description: errorMessage,
        variant: "destructive",
      });
      setTimeout(() => {
         if (files.length > 0) {
            setStatus("file-selected");
        } else {
            resetState();
        }
      }, 3000);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    
    const url = URL.createObjectURL(convertedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Downloading ${convertedFile.name}.`,
    });
  };
  
  const isTabbedTool = conversionType === 'pdf-to-word' || conversionType === 'word-to-pdf';

  const MainContent = (
    <div className="pt-6">
      <FileDropZone key={conversionType} />
    </div>
  );

  return (
    <Card className="w-full max-w-2xl shadow-xl border-t-4 border-primary">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">{conversionInfo.title}</CardTitle>
        <CardDescription>The simplest way to convert your documents.</CardDescription>
      </CardHeader>
      <CardContent>
        {isTabbedTool ? (
          <Tabs value={conversionType} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pdf-to-word">PDF to Word</TabsTrigger>
              <TabsTrigger value="word-to-pdf">Word to PDF</TabsTrigger>
            </TabsList>
            <TabsContent value="pdf-to-word" className="pt-6" forceMount={conversionType === 'pdf-to-word'}>
              {conversionType === 'pdf-to-word' && MainContent}
            </TabsContent>
            <TabsContent value="word-to-pdf" className="pt-6" forceMount={conversionType === 'word-to-pdf'}>
              {conversionType === 'word-to-pdf' && MainContent}
            </TabsContent>
          </Tabs>
        ) : (
          MainContent
        )}
      </CardContent>
    </Card>
  );

  function FileDropZone() {
    const { fromIcon, toIcon, fromType, actionText, accept, multiple, params } = conversionInfo;

    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center gap-6">
          {fromIcon}
          <ArrowRight className="h-8 w-8 text-muted-foreground" />
          {toIcon}
        </div>

        {status === "idle" || status === "file-selected" ? (
          <div className="relative border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary transition-colors group">
            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity rounded-lg" />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold text-foreground">
              Drop your {fromType} file{multiple ? 's' : ''} here
            </p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
            <Input
              id="file-upload"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept={accept}
              multiple={multiple}
              aria-label={`Upload ${fromType} file`}
            />
          </div>
        ) : null}

        {files.length > 0 && (status === "file-selected" || status === "converting" || status === "done" || status === 'error') && (
          <div className="border rounded-lg p-4 space-y-2 bg-secondary/50">
             {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    {fromIcon}
                    <span className="font-medium text-sm truncate">{file.name}</span>
                </div>
                 <Button variant="ghost" size="icon" onClick={() => setFiles(files.filter((_, i) => i !== index))} aria-label="Remove file">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
             {files.length > 1 && (
                 <Button variant="ghost" size="sm" onClick={resetState} className="w-full">
                    Remove All
                </Button>
            )}
            {files.length === 1 && !multiple && (
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={resetState} aria-label="Remove file">
                  <X className="h-4 w-4" />
                </Button>
            )}
          </div>
        )}

        {status === "file-selected" && params && params.length > 0 && (
            <div className="grid gap-4">
                {params.map(param => (
                    <div key={param.id} className="grid gap-2">
                        <Label htmlFor={param.id}>{param.label}</Label>
                        <Input 
                            id={param.id} 
                            type={param.type}
                            placeholder={param.label}
                            value={additionalParams[param.id] || ''}
                            onChange={(e) => handleParamChange(param.id, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        )}


        {status === 'converting' && (
          <div className="space-y-2 text-center">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground animate-pulse">Converting... {progress}%</p>
          </div>
        )}
        
        {status === "file-selected" && files.length > 0 && (
          <Button onClick={handleConvert} className="w-full" size="lg">
            {actionText}
          </Button>
        )}

        {status === "done" && (
          <div className="grid gap-4 sm:grid-cols-2">
             <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
            <Button onClick={resetState} className="w-full" size="lg" variant="outline">
              Convert Another File
            </Button>
          </div>
        )}
      </div>
    );
  }
}

    