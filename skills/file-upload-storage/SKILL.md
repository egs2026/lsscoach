---
name: file-upload-storage
description: Best practices for file uploads, Supabase Storage management, and document handling
metadata:
  tags: supabase, storage, uploads, files, validation, documents, s3
---

# File Upload & Storage Management

## When to Use

Use this skill when implementing file upload features for:
- **Document uploads** (KTP, KK, Slip Gaji, Selfie with KTP)
- **Profile pictures** (Agent avatars, user photos)
- **Marketing materials** (Brochures, presentations, product sheets)
- **Generated documents** (Certificates, reports, agreements)
- **Any file storage operations** in Supabase Storage

## Core Concepts

### Supabase Storage Architecture

```
Supabase Storage
├── Buckets (containers for files)
│   ├── Public buckets (accessible via URL)
│   └── Private buckets (require authentication)
├── Folders (logical organization within buckets)
├── RLS Policies (access control)
└── File metadata (MIME type, size, etc.)
```

### Storage Bucket Setup

**1. Create a Storage Bucket (via Supabase Dashboard or SQL)**

```sql
-- Create bucket via SQL
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-documents', 'lead-documents', false);

-- For public files (like marketing materials)
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-materials', 'marketing-materials', true);

-- For profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

**2. Set Up RLS Policies**

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lead-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lead-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins/managers to read all files
CREATE POLICY "Admins can read all files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lead-documents'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'super_admin')
  )
);

-- Public bucket policy (for marketing materials)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'marketing-materials');

CREATE POLICY "Authenticated upload to marketing"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketing-materials');
```

---

## Frontend Implementation

### 1. File Upload Service

Create a reusable service for file uploads:

```typescript
// src/services/storageService.ts
import { supabase } from '../lib/supabase';

export interface UploadOptions {
  bucket: string;
  folder?: string;
  fileName?: string;
  upsert?: boolean;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate file path
    const fileName = options.fileName || generateFileName(file);
    const filePath = options.folder 
      ? `${options.folder}/${fileName}` 
      : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        upsert: options.upsert || false,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions
): Promise<UploadResult[]> {
  return Promise.all(
    files.map(file => uploadFile(file, options))
  );
}

/**
 * Delete a file from storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get signed URL for private files (expires after specified time)
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      return { error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Generate unique file name
 */
function generateFileName(file: File): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const ext = file.name.split('.').pop();
  return `${timestamp}-${randomStr}.${ext}`;
}

/**
 * Validate file before upload
 */
interface ValidationResult {
  valid: boolean;
  error?: string;
}

function validateFile(file: File): ValidationResult {
  // File size limits (10MB default, adjust based on bucket)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };
  }

  // Validate MIME type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
}
```

### 2. React File Upload Component

Create a reusable file upload component:

```typescript
// src/components/common/FileUpload.tsx
import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadFile, UploadResult } from '../../services/storageService';

interface FileUploadProps {
  bucket: string;
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onUploadComplete?: (results: UploadResult[]) => void;
  onUploadError?: (error: string) => void;
  label?: string;
  required?: boolean;
}

export function FileUpload({
  bucket,
  folder,
  accept = 'image/*,application/pdf',
  maxSize = 10,
  multiple = false,
  onUploadComplete,
  onUploadError,
  label,
  required = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file sizes
    const oversizedFiles = selectedFiles.filter(
      file => file.size > maxSize * 1024 * 1024
    );
    
    if (oversizedFiles.length > 0) {
      onUploadError?.(`Some files exceed ${maxSize}MB limit`);
      return;
    }

    setFiles(selectedFiles);

    // Generate previews for images
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const results: UploadResult[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile(files[i], {
          bucket,
          folder,
          onProgress: (progress) => {
            setUploadProgress(((i + progress) / files.length) * 100);
          },
        });
        
        results.push(result);
      }

      const hasErrors = results.some(r => !r.success);
      
      if (hasErrors) {
        const errorMsg = results
          .filter(r => !r.success)
          .map(r => r.error)
          .join(', ');
        onUploadError?.(errorMsg);
      } else {
        onUploadComplete?.(results);
        // Clear files after successful upload
        setFiles([]);
        setPreviews([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      onUploadError?.(
        error instanceof Error ? error.message : 'Upload failed'
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload-input"
        />
        
        <label
          htmlFor="file-upload-input"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-sm text-gray-600">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Max file size: {maxSize}MB
          </span>
        </label>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon className="w-5 h-5 text-blue-500" />
              ) : (
                <FileText className="w-5 h-5 text-gray-500" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {previews[index] && (
                <img
                  src={previews[index]}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded"
                />
              )}

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded"
                disabled={uploading}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading... {uploadProgress.toFixed(0)}%
              </>
            ) : (
              'Upload Files'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
```

### 3. Usage Example: Lead Documents Upload

```typescript
// In NewLeadPage.tsx or similar
import { FileUpload } from '../../components/common/FileUpload';
import { UploadResult } from '../../services/storageService';

function NewLeadPage() {
  const [documents, setDocuments] = useState({
    ktp: '',
    kk: '',
    slip_gaji: '',
    selfie_ktp: '',
  });

  const handleKTPUpload = (results: UploadResult[]) => {
    if (results[0]?.success) {
      setDocuments(prev => ({
        ...prev,
        ktp: results[0].url!,
      }));
      toast.success('KTP uploaded successfully');
    }
  };

  return (
    <form>
      {/* KTP Upload */}
      <FileUpload
        bucket="lead-documents"
        folder={`${userId}/ktp`}
        accept="image/*"
        maxSize={5}
        label="Upload KTP (ID Card)"
        required
        onUploadComplete={handleKTPUpload}
        onUploadError={(error) => toast.error(error)}
      />

      {/* Similar for other documents */}
    </form>
  );
}
```

---

## Common Patterns

### Pattern 1: Profile Picture Upload

```typescript
async function uploadProfilePicture(file: File, userId: string) {
  const result = await uploadFile(file, {
    bucket: 'avatars',
    folder: userId,
    fileName: 'profile.jpg',
    upsert: true, // Replace existing
  });

  if (result.success) {
    // Update user profile with avatar URL
    await supabase
      .from('users')
      .update({ avatar_url: result.url })
      .eq('id', userId);
  }

  return result;
}
```

### Pattern 2: Document Upload with Database Record

```typescript
async function uploadLeadDocument(
  leadId: string,
  file: File,
  documentType: 'ktp' | 'kk' | 'slip_gaji' | 'selfie_ktp'
) {
  // Upload file
  const result = await uploadFile(file, {
    bucket: 'lead-documents',
    folder: `leads/${leadId}`,
    fileName: `${documentType}.${file.name.split('.').pop()}`,
  });

  if (result.success) {
    // Update lead record with document URL
    await supabase
      .from('leads')
      .update({
        documents: {
          [documentType]: result.url,
        },
      })
      .eq('id', leadId);
  }

  return result;
}
```

### Pattern 3: Batch Upload for Marketing Materials

```typescript
async function uploadMarketingMaterials(
  files: File[],
  category: string,
  purpose: string
) {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadFile(file, {
      bucket: 'marketing-materials',
      folder: category,
    });

    if (result.success) {
      // Create database record
      await supabase.from('marketing_materials').insert({
        title: file.name,
        category,
        purpose,
        file_url: result.url,
        file_path: result.path,
        file_size: file.size,
        mime_type: file.type,
      });

      results.push(result);
    }
  }

  return results;
}
```

---

## Troubleshooting

### Issue 1: "Bucket does not exist"

**Cause:** Storage bucket not created or incorrect bucket name.

**Solution:**
```sql
-- Check existing buckets
SELECT * FROM storage.buckets;

-- Create missing bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('your-bucket-name', 'your-bucket-name', false);
```

### Issue 2: Upload fails with "access denied" or "permission denied"

**Cause:** Missing or incorrect RLS policies.

**Solution:**
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Add appropriate policies (see Storage Bucket Setup section above)
```

### Issue 3: Public URL returns 404

**Причина:** Bucket is private, but trying to access via public URL.

**Solution:**
- For private buckets, use signed URLs:
```typescript
const { url } = await getSignedUrl('lead-documents', filePath, 3600);
```
- Or make bucket public if appropriate:
```sql
UPDATE storage.buckets
SET public = true
WHERE id = 'your-bucket-name';
```

### Issue 4: File size exceeds limit

**Solution:**
- Increase bucket file size limit in Supabase dashboard (Project Settings > Storage)
- Or compress images before upload:

```typescript
import imageCompression from 'browser-image-compression';

async function compressAndUpload(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  };
  
  const compressedFile = await imageCompression(file, options);
  return uploadFile(compressedFile, { bucket: 'avatars' });
}
```

### Issue 5: Duplicate file names cause overwrites

**Solution:** Use unique file names (already implemented in `generateFileName`):
```typescript
// Timestamp + random string ensures uniqueness
const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
```

---

## Best Practices

### ✅ DO

- **Always validate files** before upload (size, type)
- **Use unique file names** to prevent overwrites
- **Organize files in folders** by user/entity ID
- **Set appropriate RLS policies** for security
- **Store file URLs in database** for easy retrieval
- **Handle upload errors gracefully** with user feedback
- **Show upload progress** for better UX
- **Clean up old files** when records are deleted
- **Use signed URLs** for private files
- **Compress images** before upload when possible

### ❌ DON'T

- **Don't store sensitive data** in public buckets
- **Don't skip file validation** (security risk)
- **Don't hardcode bucket names** (use constants/config)
- **Don't forget to clean up** orphaned files
- **Don't expose storage errors** directly to users
- **Don't allow unlimited file sizes**
- **Don't forget to set CORS** if uploading from different domains

---

## Security Checklist

- [ ] RLS policies configured for all buckets
- [ ] File type validation implemented
- [ ] File size limits enforced
- [ ] Unique file naming to prevent overwrites
- [ ] Private buckets for sensitive documents
- [ ] Signed URLs for temporary access
- [ ] Virus scanning for uploaded files (if required)
- [ ] Rate limiting on upload endpoints
- [ ] Audit logging for file operations

---

## References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [RLS for Storage](https://supabase.com/docs/guides/storage/security/access-control)
- [Storage Helper Functions](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
