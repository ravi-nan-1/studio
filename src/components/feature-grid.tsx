
import {
  ArrowRightLeft,
  FileImage,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Shrink,
  Combine,
  Split,
  Grab,
  BookCopy,
  RotateCcw,
  Shield,
  Unlock,
  Wrench,
  FileCheck,
  ScanText,
  PenSquare,
  Layers,
  Link as LinkIcon,
  Cloud,
  Eye,
  Monitor,
  AppWindow,
  Terminal,
  Smartphone,
  Clock,
  Pen,
  Users,
  Infinity,
  Zap,
  BadgeX,
  Gem
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';


const coreTools = [
  { name: "PDF to Word", icon: <ArrowRightLeft /> },
  { name: "Word to PDF", icon: <ArrowRightLeft /> },
  { name: "PDF to JPG", icon: <FileImage /> },
  { name: "JPG to PDF", icon: <FileImage /> },
  { name: "PDF to Excel", icon: <FileSpreadsheet /> },
  { name: "Excel to PDF", icon: <FileSpreadsheet /> },
  { name: "PDF to PowerPoint", icon: <Presentation /> },
  { name: "PPT to PDF", icon: <Presentation /> },
  { name: "HTML to PDF", icon: <FileCode /> },
  { name: "Compress PDF", icon: <Shrink /> },
  { name: "Merge PDF", icon: <Combine /> },
  { name: "Split PDF", icon: <Split /> },
  { name: "Extract pages", icon: <BookCopy /> },
  { name: "Delete pages", icon: <Grab /> },
  { name: "Reorder pages", icon: <Layers /> },
  { name: "Rotate pages", icon: <RotateCcw /> },
  { name: "Add Watermark", icon: <PenSquare /> },
  { name: "Add Page Numbers", icon: <BookCopy /> },
  { name: "Protect PDF", icon: <Shield /> },
  { name: "Unlock PDF", icon: <Unlock /> },
  { name: "Repair PDF", icon: <Wrench /> },
  { name: "Convert to PDF/A", icon: <FileCheck /> },
  { name: "OCR PDF to Word", icon: <ScanText /> },
  { name: "Edit PDF", icon: <PenSquare /> },
];

const advancedFeatures = [
  { name: "Batch processing", icon: <Layers /> },
  { name: "Chained workflows", icon: <LinkIcon /> },
  { name: "Cloud uploads", icon: <Cloud /> },
  { name: "File viewer", icon: <Eye /> },
  { name: "Dark mode UI", icon: <Monitor /> },
  { name: "Desktop app", icon: <AppWindow /> },
  { name: "API endpoint", icon: <Terminal /> },
  { name: "Mobile responsive", icon: <Smartphone /> },
  { name: "File deletion", icon: <Clock /> },
];

const premiumFeatures = [
  { name: "eSignatures", icon: <Pen /> },
  { name: "Team Workspace", icon: <Users /> },
  { name: "Unlimited file size", icon: <Infinity /> },
  { name: "Unlimited batch tools", icon: <Zap /> },
  { name: "Ad-free mode", icon: <BadgeX /> },
];

const FeatureCard = ({ name, icon }: { name: string, icon: React.ReactNode }) => (
  <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer">
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="text-primary">{icon}</div>
      <CardTitle className="text-base font-medium">{name}</CardTitle>
    </CardHeader>
  </Card>
);

const Section = ({ title, children, icon }: { title: string, children: React.ReactNode, icon: React.ReactNode }) => (
  <section className="w-full max-w-6xl mx-auto py-8">
    <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
      {icon}
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {children}
    </div>
  </section>
);

export function FeatureGrid() {
  return (
    <div className="w-full mt-12">
      <Section title="Core PDF Tools" icon={<Wrench className="h-8 w-8 text-primary" />}>
        {coreTools.map((tool) => (
          <FeatureCard key={tool.name} name={tool.name} icon={tool.icon} />
        ))}
      </Section>
      <Section title="Advanced Features" icon={<Zap className="h-8 w-8 text-primary" />}>
        {advancedFeatures.map((feature) => (
          <FeatureCard key={feature.name} name={feature.name} icon={feature.icon} />
        ))}
      </Section>
       <Section title="Premium Features" icon={<Gem className="h-8 w-8 text-primary" />}>
        {premiumFeatures.map((feature) => (
          <FeatureCard key={feature.name} name={feature.name} icon={feature.icon} />
        ))}
      </Section>
    </div>
  );
}
