import { FileConverter } from "@/components/file-converter";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-black">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <FileConverter />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FileFlipper. All Rights Reserved.
      </footer>
    </div>
  );
}
