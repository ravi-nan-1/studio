
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { ConversionType } from '@/components/file-converter';

// This is a simplified, in-memory representation of a DOCX file.
// In a real application, a library like 'docx' would be used to generate this.
// This buffer creates a minimal but valid DOCX file containing the text "Hello World".
const createMockDocx = (): Buffer => {
  const content = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>Hello World from your converted file!</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;
  
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
  
  // A real DOCX is a zip file. We'll simulate this with a simple text file for now
  // to prove the concept, but a real implementation would use a ZIP library.
  // For the purpose of this mock, we'll just return a simple text-like blob
  // that pretends to be a docx. A proper solution requires a zip library.
  // Let's create a placeholder text instead of a complex docx buffer.
  const mockContent = "This is a mock converted file. In a real environment, this would be a valid DOCX.";
  return Buffer.from(mockContent);
};

const getTargetExtension = (conversionType: ConversionType): string => {
    switch(conversionType) {
        case "pdf-to-word": return ".docx";
        case "word-to-pdf": return ".pdf";
        case "pdf-to-jpg": return ".jpg";
        case "jpg-to-pdf": return ".pdf";
        case "pdf-to-excel": return ".xlsx";
        default: throw new Error("Invalid conversion type");
    }
}

const getMimeType = (extension: string): string => {
    switch(extension) {
        case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case ".pdf": return "application/pdf";
        case ".jpg": return "image/jpeg";
        case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        default: return "application/octet-stream";
    }
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const conversionType = formData.get('conversionType') as ConversionType | null;

    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }
    if (!conversionType) {
      return new NextResponse('No conversion type specified', { status: 400 });
    }

    // In a real application, this is where you would use the tools from the user's guide.
    // For example, for 'pdf-to-word', you would execute:
    // `exec('soffice --headless --convert-to docx ...')`
    console.log(`Simulating conversion for: ${conversionType}`);
    console.log(`Uploaded file: ${file.name}, size: ${file.size}`);
    console.log("This would be the place to call a command-line tool like LibreOffice or Ghostscript.");

    // Simulate a delay for conversion
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate file conversion by creating a mock file buffer
    // For now, we'll just return a mock DOCX for any conversion to prove the flow.
    const mockFileBuffer = createMockDocx(); 
    const targetExtension = getTargetExtension(conversionType);
    const newFileName = file.name.replace(/\.[^/.]+$/, "") + targetExtension;
    const mimeType = getMimeType(targetExtension);

    return new NextResponse(mockFileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${newFileName}"`,
      },
    });

  } catch (error) {
    console.error('Conversion API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ message: `Server error: ${errorMessage}` }), { status: 500 });
  }
}

    