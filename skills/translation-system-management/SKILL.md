---
name: translation-system-management
description: Best practices for i18n implementation, bilingual content management, and translation key organization
metadata:
  tags: i18n, internationalization, translation, indonesian, english, localization
---

# Translation System Management

## When to Use

Use this skill when:
- **Adding new UI features** that need bilingual support
- **Managing translation keys** for Indonesian/English
- **Implementing dynamic content** translation
- **Handling translation errors** or missing keys
- **Organizing translation files** for maintainability
- **Testing bilingual functionality**

## Core Concepts

### BFAAS i18n Architecture

```
User Language Preference (localStorage)
    ↓
Language Context (React)
    ↓
Translation Function (t)
    ↓
Translation Files (en.ts, id.ts)
    ↓
Rendered UI in Selected Language
```

### Project Structure

```
src/
├── lib/
│   └── i18n.ts                  # Core i18n implementation
├── locales/
│   ├── en.ts                    # English translations
│   └── id.ts                    # Indonesian translations
└── components/
    └── LanguageToggle.tsx       # Language switcher
```

---

## Implementation Guide

### 1. Core i18n Module

Your project uses a custom i18n implementation (not react-i18next):

```typescript
// src/lib/i18n.ts
import { en } from '../locales/en';
import { id } from '../locales/id';

export type Language = 'en' | 'id';
export type TranslationKey = keyof typeof en;

const translations = { en, id };

let currentLanguage: Language = 
  (localStorage.getItem('language') as Language) || 'id';

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  window.dispatchEvent(new Event('languagechange'));
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: TranslationKey): string {
  return translations[currentLanguage][key] || key;
}

// For nested translations
export function getTranslations() {
  return translations[currentLanguage];
}
```

### 2. Translation Files Structure

**English translations (`src/locales/en.ts`):**

```typescript
export const en = {
  // Common
  app_name: 'BFAAS',
  welcome: 'Welcome',
  loading: 'Loading...',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  search: 'Search',
  filter: 'Filter',
  export: 'Export',
  
  // Navigation
  nav_dashboard: 'Dashboard',
  nav_leads: 'Leads',
  nav_agents: 'Agents',
  nav_products: 'Products',
  nav_reports: 'Reports',
  nav_settings: 'Settings',
  
  // Auth
  login: 'Login',
  logout: 'Logout',
  email: 'Email',
  password: 'Password',
  forgot_password: 'Forgot Password?',
  
  // User Roles
  role_super_admin: 'Super Admin',
  role_admin: 'Admin',
  role_manager: 'Manager',
  role_supervisor: 'Supervisor',
  role_agent: 'Agent',
  role_candidate: 'Candidate',
  
  // Lead Management
  lead_new: 'New Lead',
  lead_status: 'Status',
  lead_customer_name: 'Customer Name',
  lead_phone: 'Phone Number',
  lead_email: 'Email Address',
  lead_product: 'Product',
  lead_amount: 'Requested Amount',
  lead_tenor: 'Tenor (months)',
  
  // Lead Statuses
  status_draft: 'Draft',
  status_submitted: 'Submitted',
  status_reviewing: 'Under Review',
  status_approved: 'Approved',
  status_rejected: 'Rejected',
  status_processing: 'Processing',
  status_disbursed: 'Disbursed',
  status_cancelled: 'Cancelled',
  
  // Form Fields
  field_full_name: 'Full Name',
  field_nik: 'NIK (ID Number)',
  field_phone: 'Phone Number',
  field_address: 'Address',
  field_city: 'City',
  field_province: 'Province',
  field_postal_code: 'Postal Code',
  
  // Documents
  doc_ktp: 'KTP (ID Card)',
  doc_kk: 'Kartu Keluarga (Family Card)',
  doc_slip_gaji: 'Salary Slip',
  doc_selfie_ktp: 'Selfie with KTP',
  doc_npwp: 'NPWP (Tax ID)',
  
  // Marketing Materials
  marketing_materials: 'Marketing Materials',
  marketing_category: 'Category',
  marketing_purpose: 'Purpose',
  marketing_upload: 'Upload Material',
  
  // Categories
  category_brochure: 'Brochure',
  category_presentation: 'Presentation',
  category_video: 'Video',
  category_infographic: 'Infographic',
  category_social_media: 'Social Media',
  
  // Purposes
  purpose_training: 'Training',
  purpose_customer_presentation: 'Customer Presentation',
  purpose_social_media: 'Social Media',
  purpose_event: 'Event',
  purpose_internal: 'Internal Use',
  
  // Validation Messages
  error_required: 'This field is required',
  error_invalid_email: 'Invalid email address',
  error_invalid_phone: 'Invalid phone number',
  error_min_length: 'Minimum {min} characters required',
  error_max_length: 'Maximum {max} characters allowed',
  error_invalid_nik: 'NIK must be 16 digits',
  
  // Success Messages
  success_saved: 'Saved successfully',
  success_updated: 'Updated successfully',
  success_deleted: 'Deleted successfully',
  success_uploaded: 'Uploaded successfully',
  
  // Error Messages
  error_generic: 'An error occurred. Please try again.',
  error_network: 'Network error. Please check your connection.',
  error_unauthorized: 'You are not authorized to perform this action.',
  error_not_found: 'Resource not found.',
  
  // Confirmation
  confirm_delete: 'Are you sure you want to delete this?',
  confirm_cancel: 'Are you sure you want to cancel?',
  
  // Dates
  today: 'Today',
  yesterday: 'Yesterday',
  last_7_days: 'Last 7 days',
  last_30_days: 'Last 30 days',
  this_month: 'This month',
  custom_range: 'Custom range',
} as const;

export type Translations = typeof en;
```

**Indonesian translations (`src/locales/id.ts`):**

```typescript
import { Translations } from './en';

export const id: Translations = {
  // Common
  app_name: 'BFAAS',
  welcome: 'Selamat Datang',
  loading: 'Memuat...',
  save: 'Simpan',
  cancel: 'Batal',
  delete: 'Hapus',
  edit: 'Edit',
  search: 'Cari',
  filter: 'Filter',
  export: 'Ekspor',
  
  // Navigation
  nav_dashboard: 'Dasbor',
  nav_leads: 'Lead',
  nav_agents: 'Agen',
  nav_products: 'Produk',
  nav_reports: 'Laporan',
  nav_settings: 'Pengaturan',
  
  // Auth
  login: 'Masuk',
  logout: 'Keluar',
  email: 'Email',
  password: 'Kata Sandi',
  forgot_password: 'Lupa Kata Sandi?',
  
  // User Roles
  role_super_admin: 'Super Admin',
  role_admin: 'Admin',
  role_manager: 'Manajer',
  role_supervisor: 'Supervisor',
  role_agent: 'Agen',
  role_candidate: 'Kandidat',
  
  // Lead Management
  lead_new: 'Lead Baru',
  lead_status: 'Status',
  lead_customer_name: 'Nama Nasabah',
  lead_phone: 'Nomor Telepon',
  lead_email: 'Alamat Email',
  lead_product: 'Produk',
  lead_amount: 'Jumlah Pengajuan',
  lead_tenor: 'Tenor (bulan)',
  
  // Lead Statuses
  status_draft: 'Draf',
  status_submitted: 'Diajukan',
  status_reviewing: 'Sedang Ditinjau',
  status_approved: 'Disetujui',
  status_rejected: 'Ditolak',
  status_processing: 'Diproses',
  status_disbursed: 'Dicairkan',
  status_cancelled: 'Dibatalkan',
  
  // Form Fields
  field_full_name: 'Nama Lengkap',
  field_nik: 'NIK',
  field_phone: 'Nomor Telepon',
  field_address: 'Alamat',
  field_city: 'Kota',
  field_province: 'Provinsi',
  field_postal_code: 'Kode Pos',
  
  // Documents
  doc_ktp: 'KTP',
  doc_kk: 'Kartu Keluarga',
  doc_slip_gaji: 'Slip Gaji',
  doc_selfie_ktp: 'Foto Selfie dengan KTP',
  doc_npwp: 'NPWP',
  
  // Marketing Materials
  marketing_materials: 'Materi Pemasaran',
  marketing_category: 'Kategori',
  marketing_purpose: 'Tujuan',
  marketing_upload: 'Unggah Materi',
  
  // Categories
  category_brochure: 'Brosur',
  category_presentation: 'Presentasi',
  category_video: 'Video',
  category_infographic: 'Infografis',
  category_social_media: 'Media Sosial',
  
  // Purposes
  purpose_training: 'Pelatihan',
  purpose_customer_presentation: 'Presentasi Nasabah',
  purpose_social_media: 'Media Sosial',
  purpose_event: 'Acara',
  purpose_internal: 'Penggunaan Internal',
  
  // Validation Messages
  error_required: 'Field ini wajib diisi',
  error_invalid_email: 'Alamat email tidak valid',
  error_invalid_phone: 'Nomor telepon tidak valid',
  error_min_length: 'Minimal {min} karakter diperlukan',
  error_max_length: 'Maksimal {max} karakter diperbolehkan',
  error_invalid_nik: 'NIK harus 16 digit',
  
  // Success Messages
  success_saved: 'Berhasil disimpan',
  success_updated: 'Berhasil diperbarui',
  success_deleted: 'Berhasil dihapus',
  success_uploaded: 'Berhasil diunggah',
  
  // Error Messages
  error_generic: 'Terjadi kesalahan. Silakan coba lagi.',
  error_network: 'Kesalahan jaringan. Periksa koneksi Anda.',
  error_unauthorized: 'Anda tidak berwenang melakukan tindakan ini.',
  error_not_found: 'Sumber tidak ditemukan.',
  
  // Confirmation
  confirm_delete: 'Apakah Anda yakin ingin menghapus ini?',
  confirm_cancel: 'Apakah Anda yakin ingin membatalkan?',
  
  // Dates
  today: 'Hari Ini',
  yesterday: 'Kemarin',
  last_7_days: '7 Hari Terakhir',
  last_30_days: '30 Hari Terakhir',
  this_month: 'Bulan Ini',
  custom_range: 'Rentang Kustom',
};
```

### 3. Using Translations in Components

**Basic usage:**

```typescript
import { t } from '../../lib/i18n';

function MyComponent() {
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('save')}</button>
    </div>
  );
}
```

**With React state (for language switching):**

```typescript
import { useState, useEffect } from 'react';
import { t, getLanguage } from '../../lib/i18n';

function MyComponent() {
  const [lang, setLang] = useState(getLanguage());

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(getLanguage());
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  return (
    <div>
      <h1>{t('welcome')}</h1>
    </div>
  );
}
```

**Nested translations (for complex objects):**

```typescript
import { getTranslations } from '../../lib/i18n';

function LeadStatusBadge({ status }: { status: string }) {
  const translations = getTranslations();
  
  // Access nested translations
  const statusText = translations[`status_${status}` as keyof typeof translations];
  
  return <span>{statusText}</span>;
}
```

### 4. Language Toggle Component

```typescript
// src/components/common/LanguageToggle.tsx
import { useState } from 'react';
import { setLanguage, getLanguage } from '../../lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState(getLanguage());

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'id' : 'en';
    setLanguage(newLang);
    setCurrentLang(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {currentLang === 'en' ? 'EN' : 'ID'}
      </span>
    </button>
  );
}
```

---

## Common Patterns

### Pattern 1: Dynamic Select Options

```typescript
import { t } from '../../lib/i18n';

const categoryOptions = [
  { value: 'brochure', label: t('category_brochure') },
  { value: 'presentation', label: t('category_presentation') },
  { value: 'video', label: t('category_video') },
  { value: 'infographic', label: t('category_infographic') },
  { value: 'social_media', label: t('category_social_media') },
];

function CategorySelect() {
  return (
    <select>
      <option value="">Select {t('marketing_category')}</option>
      {categoryOptions.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
```

### Pattern 2: Bilingual Form Labels

```typescript
import { t } from '../../lib/i18n';

function BilinguFormField() {
  return (
    <div>
      <label className="block text-sm font-medium">
        {t('field_full_name')}
        <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder={t('field_full_name')}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
}
```

### Pattern 3: Status Badges with Translation

```typescript
import { t, getTranslations } from '../../lib/i18n';

interface StatusBadgeProps {
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const translations = getTranslations();
  const statusKey = `status_${status}` as keyof typeof translations;
  
  const colorMap = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colorMap[status]}`}>
      {translations[statusKey]}
    </span>
  );
}
```

### Pattern 4: Error Messages with Variables

For error messages that need dynamic values, use template strings:

```typescript
// In translation file
export const en = {
  error_min_length: 'Minimum {min} characters required',
  error_max_length: 'Maximum {max} characters allowed',
  error_file_size: 'File size must be less than {size}MB',
};

// Helper function to replace placeholders
function translateWithVars(
  key: TranslationKey,
  vars: Record<string, string | number>
): string {
  let text = t(key);
  Object.entries(vars).forEach(([key, value]) => {
    text = text.replace(`{${key}}`, String(value));
  });
  return text;
}

// Usage
const errorMessage = translateWithVars('error_min_length', { min: 8 });
// Output: "Minimum 8 characters required"
```

---

## Troubleshooting

### Issue 1: Missing translation key

**Symptom:** Key appears instead of translated text (e.g., "lead_new" instead of "New Lead").

**Cause:** Key not defined in translation file.

**Solution:**
```typescript
// Add missing key to BOTH en.ts and id.ts
// en.ts
export const en = {
  // ... existing keys
  lead_new: 'New Lead',
};

// id.ts
export const id: Translations = {
  // ... existing keys
  lead_new: 'Lead Baru',
};
```

### Issue 2: Language not switching

**Symptom:** UI doesn't update when language is changed.

**Cause:** Component not listening to language change event.

**Solution:**
```typescript
const [lang, setLang] = useState(getLanguage());

useEffect(() => {
  const handleLanguageChange = () => {
    setLang(getLanguage());
    // Force re-render by updating state
  };

  window.addEventListener('languagechange', handleLanguageChange);
  return () => window.removeEventListener('languagechange', handleLanguageChange);
}, []);
```

### Issue 3: TypeScript errors on translation keys

**Symptom:** `Type 'string' is not assignable to type 'TranslationKey'`

**Cause:** Using dynamic keys that TypeScript can't verify.

**Solution:**
```typescript
// Wrong (TypeScript can't verify)
const key = `status_${status}`;
const text = t(key);

// Right (use type assertion when necessary)
const key = `status_${status}` as TranslationKey;
const text = t(key);

// Or use getTranslations() for dynamic access
const translations = getTranslations();
const text = translations[`status_${status}` as keyof typeof translations];
```

### Issue 4: Inconsistent translations between files

**Symptom:** Some keys work in English but not in Indonesian.

**Cause:** Keys not synchronized between `en.ts` and `id.ts`.

**Solution:**
```typescript
// Use TypeScript to enforce consistency
// id.ts MUST implement all keys from en.ts
import { Translations } from './en';

export const id: Translations = {
  // TypeScript will error if any key is missing
  // or has wrong type
};
```

---

## Best Practices

### ✅ DO

- **Use descriptive key names** (e.g., `lead_customer_name` not `lcn`)
- **Group related keys** with prefixes (e.g., `status_`, `error_`, `field_`)
- **Keep keys consistent** between `en.ts` and `id.ts`
- **Use TypeScript types** to enforce key consistency
- **Test both languages** before deployment
- **Provide default values** for optional translations
- **Use `as const`** in en.ts for better type inference
- **Document translation context** for complex phrases

### ❌ DON'T

- **Don't hardcode text** in components (always use `t()`)
- **Don't use inline conditionals** like `lang === 'en' ? 'English' : 'Indonesian'`
- **Don't forget to update both files** when adding keys
- **Don't concatenate translations** (breaks grammar in different languages)
- **Don't use abbreviations** in translation keys
- **Don't store translations in database** unless user-generated

---

## Maintenance Checklist

When adding new features:

- [ ] Identify all UI text that needs translation
- [ ] Add keys to `en.ts` with English text
- [ ] Add same keys to `id.ts` with Indonesian text
- [ ] Update TypeScript type `Translations` if needed
- [ ] Replace hardcoded text with `t()` calls
- [ ] Test feature in both languages
- [ ] Check for missing keys in console

---

## Common Translation Keys Reference

### Actions
```typescript
save: 'Save'          // Simpan
cancel: 'Cancel'      // Batal
delete: 'Delete'      // Hapus
edit: 'Edit'          // Edit
create: 'Create'      // Buat
update: 'Update'      // Perbarui
submit: 'Submit'      // Kirim
```

### Status
```typescript
active: 'Active'      // Aktif
inactive: 'Inactive'  // Tidak Aktif
pending: 'Pending'    // Tertunda
approved: 'Approved'  // Disetujui
rejected: 'Rejected'  // Ditolak
```

### Time
```typescript
today: 'Today'        // Hari Ini
yesterday: 'Yesterday' // Kemarin
week: 'Week'          // Minggu
month: 'Month'        // Bulan
year: 'Year'          // Tahun
```

---

## Testing Translations

### Manual Testing Checklist

- [ ] Toggle language and verify all text changes
- [ ] Check forms for proper label translation
- [ ] Verify dropdown options are translated
- [ ] Test error messages in both languages
- [ ] Check success/confirmation messages
- [ ] Verify date formatting (if applicable)
- [ ] Test with long text (German/Indonesian can be longer)
- [ ] Check text overflow/truncation issues

### Automated Testing

```typescript
// Test that all keys exist in both files
import { en } from '../locales/en';
import { id } from '../locales/id';

describe('Translation completeness', () => {
  it('should have same keys in en and id', () => {
    const enKeys = Object.keys(en);
    const idKeys = Object.keys(id);
    
    expect(enKeys.sort()).toEqual(idKeys.sort());
  });

  it('should not have empty values', () => {
    Object.values(en).forEach(value => {
      expect(value).toBeTruthy();
    });
    
    Object.values(id).forEach(value => {
      expect(value).toBeTruthy();
    });
  });
});
```

---

## References

- [React i18n Best Practices](https://react.i18next.com/guides/best-practices)
- [Indonesian Language Guidelines](https://ejaan.kemdikbud.go.id/)
- [Web Accessibility i18n](https://www.w3.org/WAI/standards-guidelines/wcag/)
