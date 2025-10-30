"use client";

import { useState, useMemo, useEffect, type ChangeEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText, FileSignature, ArrowRight, Download, X } from "lucide-react";

type ConversionType = "pdf-to-word" | "word-to-pdf";
type ConversionStatus = "idle" | "uploading" | "converting" | "done" | "error";

export function FileConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>("pdf-to-word");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onTabChange = (value: string) => {
    setConversionType(value as ConversionType);
    resetState();
  };

  const resetState = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
  };

  const conversionInfo = useMemo(() => {
    if (conversionType === "pdf-to-word") {
      return {
        title: "PDF to Word",
        fromIcon: <FileText className="h-10 w-10 text-destructive" />,
        toIcon: <FileSignature className="h-10 w-10 text-primary" />,
        fromType: "PDF",
        toType: "Word",
        accept: "application/pdf",
      };
    }
    return {
      title: "Word to PDF",
      fromIcon: <FileSignature className="h-10 w-10 text-primary" />,
      toIcon: <FileText className="h-10 w-10 text-destructive" />,
      fromType: "Word",
      toType: "PDF",
      accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword",
    };
  }, [conversionType]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const allowedTypes = conversionInfo.accept.split(',');

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setStatus("uploading");
      } else {
        toast({
          title: "Invalid file type",
          description: `Please upload a file of type: ${conversionInfo.fromType}`,
          variant: "destructive",
        });
        e.target.value = '';
      }
    }
  };

  const handleConvert = () => {
    if (!file) return;

    setStatus("converting");
    setProgress(0);
  };
  
  useEffect(() => {
    if (status !== 'converting') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    const conversionTimeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setStatus("done");
      toast({
        title: "Conversion Successful!",
        description: "Your file is ready for download.",
      });
    }, 2500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(conversionTimeout);
    };

  }, [status, toast]);

  const handleDownload = () => {
    if (!file) return;
    const newExtension = conversionType === "pdf-to-word" ? ".docx" : ".pdf";
    const newFileName = file.name.replace(/\.[^/.]+$/, "") + newExtension;
    
    // Simulate file download
    const blob = new Blob(["This is a simulated converted file."], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Downloading ${newFileName}.`,
    });
  };

  const { title, fromIcon, toIcon, fromType, toType, accept } = conversionInfo;

  return (
    <Card className="w-full max-w-2xl shadow-xl border-t-4 border-primary">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">FileFlipper</CardTitle>
        <CardDescription>The simplest way to convert your documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={conversionType} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf-to-word">PDF to Word</TabsTrigger>
            <TabsTrigger value="word-to-pdf">Word to PDF</TabsTrigger>
          </TabsList>
          <TabsContent value={conversionType} className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-center items-center gap-6">
                {fromIcon}
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
                {toIcon}
              </div>

              {status === "idle" || status === "uploading" ? (
                <div className="relative border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary transition-colors group">
                  <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity rounded-lg" />
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-semibold text-foreground">
                    Drop your {fromType} file here
                  </p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                  <Input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept={accept}
                    aria-label={`Upload ${fromType} file`}
                  />
                </div>
              ) : null}

              {file && (status === "uploading" || status === "converting" || status === "done") && (
                <div className="border rounded-lg p-4 flex items-center justify-between bg-secondary/50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {fromIcon}
                    <span className="font-medium text-sm truncate">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={resetState} aria-label="Remove file">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {status === 'converting' && (
                <div className="space-y-2 text-center">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground animate-pulse">Converting... {progress}%</p>
                </div>
              )}

              {status === "uploading" && (
                <Button onClick={handleConvert} className="w-full" size="lg">
                  Convert to {toType}
                </Button>
              )}

              {status === "done" && (
                <div className="grid gap-4 sm:grid-cols-2">
                   <Button onClick={handleDownload} className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download {toType}
                  </Button>
                  <Button onClick={resetState} className="w-full" size="lg" variant="outline">
                    Convert Another File
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
