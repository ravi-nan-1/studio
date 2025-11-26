
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { ConversionType } from '@/components/file-converter';

const API_BASE_URL = 'https://pdf-tools-dljh.onrender.com';

const getApiEndpoint = (conversionType: ConversionType): string => {
    const endpointMap: Record<ConversionType, string> = {
        'pdf-to-word': '/convert/pdf-to-word',
        'word-to-pdf': '/convert/word-to-pdf',
        'pdf-to-jpg': '/convert/pdf-to-jpg',
        'jpg-to-pdf': '/convert/jpg-to-pdf',
        'pdf-to-excel': '/convert/pdf-to-excel',
        'excel-to-pdf': '/convert/excel-to-pdf',
        'pdf-to-ppt': '/convert/pdf-to-ppt',
        'ppt-to-pdf': '/convert/ppt-to-pdf',
        'html-to-pdf': '/convert/html-to-pdf',
        'merge-pdf': '/tools/merge',
        'split-pdf': '/tools/split',
        'extract-pages': '/tools/extract',
        'delete-pages': '/tools/delete-pages',
        'reorder-pages': '/tools/reorder',
        'rotate-pages': '/tools/rotate',
        'watermark-text': '/tools/watermark-text',
        'add-page-numbers': '/tools/add-page-numbers',
        'protect-pdf': '/tools/protect',
        'unlock-pdf': '/tools/unlock',
        'repair-pdf': '/tools/repair',
        'pdf-to-pdfa': '/tools/pdfa',
        'ocr-pdf': '/tools/ocr',
        'edit-pdf': '/tools/edit/add-text',
    };

    if (!endpointMap[conversionType]) {
        throw new Error('Invalid conversion type specified');
    }

    return endpointMap[conversionType];
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const conversionType = formData.get('conversionType') as ConversionType | null;

    if (!files || files.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'No files uploaded' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!conversionType) {
      return new NextResponse(JSON.stringify({ message: 'No conversion type specified' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiEndpoint = getApiEndpoint(conversionType);
    const apiUrl = `${API_BASE_URL}${apiEndpoint}`;

    const proxyFormData = new FormData();
    
    // For most endpoints, FastAPI expects the key 'files'
    // For single-file endpoints with parameters, it might expect 'file'
    const fileKey = ['split-pdf', 'extract-pages', 'delete-pages', 'reorder-pages', 'rotate-pages', 'watermark-text', 'protect-pdf', 'unlock-pdf', 'edit-pdf', 'add-page-numbers', 'pdf-to-ppt'].includes(conversionType) ? 'file' : 'files';
    
    files.forEach(file => {
      proxyFormData.append(fileKey, file);
    });

    // Append all other form data fields
    formData.forEach((value, key) => {
        if (key !== 'files' && key !== 'conversionType' && typeof value === 'string') {
             proxyFormData.append(key, value);
        }
    });

    const fetchOptions: RequestInit = {
        method: 'POST',
        body: proxyFormData,
    };

    const apiResponse = await fetch(apiUrl, fetchOptions);

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        let errorMessage = `API request failed with status ${apiResponse.status}`;

        if (apiResponse.status === 502 && errorBody.includes('Web service is not available')) {
             errorMessage = 'The conversion service is starting up. Please try again in a few moments.';
        } else {
            try {
                const errorJson = JSON.parse(errorBody);
                if (errorJson.detail) {
                    if(typeof errorJson.detail === 'string') {
                        errorMessage = errorJson.detail;
                    } else if (Array.isArray(errorJson.detail) && errorJson.detail[0]?.msg) {
                         errorMessage = errorJson.detail.map((d: any) => `${d.loc.join(' -> ')}: ${d.msg}`).join(', ');
                    } else {
                        errorMessage = JSON.stringify(errorJson.detail);
                    }
                }
            } catch (e) {
                if (errorBody && !errorBody.trim().startsWith('<')) {
                    errorMessage = errorBody;
                }
            }
        }
        
        return new NextResponse(JSON.stringify({ message: errorMessage }), { status: apiResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    const headers = new Headers();
    headers.set('Content-Type', apiResponse.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Disposition', apiResponse.headers.get('Content-Disposition') || `attachment; filename="converted-file"`);
    
    if (!apiResponse.body) {
         return new NextResponse(JSON.stringify({ message: 'The conversion service returned an empty response.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(apiResponse.body, {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error('Proxy API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ message: `Server error: ${errorMessage}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
