---
name: form-validation-data-integrity
description: Best practices for form validation using React Hook Form, Zod schemas, and data integrity patterns
metadata:
  tags: react-hook-form, zod, validation, forms, typescript, data-integrity
---

# Form Validation & Data Integrity

## When to Use

Use this skill when implementing forms with:
- **Complex multi-step forms** (Agent onboarding, lead submission)
- **Real-time validation feedback**
- **Schema-based validation** with TypeScript type safety
- **Conditional validation rules**
- **Data integrity checks** before database operations
- **Cross-field validation** (e.g., password confirmation)

## Core Concepts

### Validation Architecture

```
User Input
    ↓
React Hook Form (form state management)
    ↓
Zod Schema (validation rules)
    ↓
Error Messages (user feedback)
    ↓
API/Database (data submission)
```

### Why React Hook Form + Zod?

- ✅ **Type-safe** - Full TypeScript support
- ✅ **Performance** - Minimal re-renders
- ✅ **DX** - Simple API, less boilerplate
- ✅ **Flexible** - Works with controlled/uncontrolled inputs
- ✅ **Validation** - Built-in validation with custom rules
- ✅ **Schema reuse** - Same schema for frontend & backend

---

## Basic Form Setup

### 1. Define Zod Schema

```typescript
// src/schemas/leadSchema.ts
import { z } from 'zod';

export const leadSchema = z.object({
  // Personal Information
  full_name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Invalid Indonesian phone number')
    .transform(val => {
      // Normalize phone number to E.164 format
      if (val.startsWith('0')) return '+62' + val.slice(1);
      if (val.startsWith('62')) return '+' + val;
      return val;
    }),

  nik: z
    .string()
    .length(16, 'NIK must be exactly 16 digits')
    .regex(/^[0-9]+$/, 'NIK must contain only numbers'),

  // Address
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address too long'),

  province: z.string().min(1, 'Province is required'),
  city: z.string().min(1, 'City is required'),
  
  postal_code: z
    .string()
    .length(5, 'Postal code must be 5 digits')
    .regex(/^[0-9]+$/, 'Postal code must be numeric'),

  // Occupation
  occupation_type: z.enum(['pns', 'swasta', 'wiraswasta', 'lainnya'], {
    errorMap: () => ({ message: 'Please select occupation type' }),
  }),

  monthly_income: z
    .number()
    .min(1000000, 'Minimum income is Rp 1,000,000')
    .max(1000000000, 'Income seems unrealistic'),

  // Product
  product_id: z.string().uuid('Invalid product selection'),

  requested_amount: z
    .number()
    .min(1000000, 'Minimum amount is Rp 1,000,000')
    .max(5000000000, 'Amount exceeds maximum limit'),

  tenor_months: z
    .number()
    .int('Tenor must be a whole number')
    .min(6, 'Minimum tenor is 6 months')
    .max(240, 'Maximum tenor is 240 months'),

  // Documents (URLs from upload)
  documents: z.object({
    ktp: z.string().url('KTP document is required'),
    kk: z.string().url('Kartu Keluarga is required'),
    slip_gaji: z.string().url('Slip Gaji is required'),
    selfie_ktp: z.string().url('Selfie with KTP is required'),
  }),
});

// Export TypeScript type
export type LeadFormData = z.infer<typeof leadSchema>;
```

### 2. Create Form Component

```typescript
// src/pages/leads/NewLeadPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, LeadFormData } from '../../schemas/leadSchema';
import { createLead } from '../../services/leadsService';
import toast from 'react-hot-toast';

export function NewLeadPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur', // Validate on blur
    defaultValues: {
      documents: {
        ktp: '',
        kk: '',
        slip_gaji: '',
        selfie_ktp: '',
      },
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      await createLead(data);
      toast.success('Lead submitted successfully');
      // Navigate or reset form
    } catch (error) {
      toast.error('Failed to submit lead');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('full_name')}
          className={`mt-1 block w-full rounded-md border ${
            errors.full_name ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:border-blue-500 focus:ring-blue-500`}
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          {...register('phone')}
          placeholder="08123456789"
          className={`mt-1 block w-full rounded-md border ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Income (numeric) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Monthly Income <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register('monthly_income', { valueAsNumber: true })}
          placeholder="5000000"
          className={`mt-1 block w-full rounded-md border ${
            errors.monthly_income ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
        />
        {errors.monthly_income && (
          <p className="mt-1 text-sm text-red-600">
            {errors.monthly_income.message}
          </p>
        )}
      </div>

      {/* Select dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Occupation Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register('occupation_type')}
          className={`mt-1 block w-full rounded-md border ${
            errors.occupation_type ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
        >
          <option value="">Select occupation</option>
          <option value="pns">PNS</option>
          <option value="swasta">Karyawan Swasta</option>
          <option value="wiraswasta">Wiraswasta</option>
          <option value="lainnya">Lainnya</option>
        </select>
        {errors.occupation_type && (
          <p className="mt-1 text-sm text-red-600">
            {errors.occupation_type.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Lead'}
      </button>
    </form>
  );
}
```

---

## Advanced Patterns

### Pattern 1: Conditional Validation

```typescript
// Validate based on other field values
const agentSchema = z
  .object({
    employment_status: z.enum(['employed', 'self-employed', 'retired']),
    employer_name: z.string().optional(),
    business_name: z.string().optional(),
    monthly_income: z.number().min(0),
    retirement_income: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      if (data.employment_status === 'employed') {
        return !!data.employer_name && data.monthly_income > 0;
      }
      return true;
    },
    {
      message: 'Employer name and income required for employed status',
      path: ['employer_name'],
    }
  )
  .refine(
    (data) => {
      if (data.employment_status === 'self-employed') {
        return !!data.business_name && data.monthly_income > 0;
      }
      return true;
    },
    {
      message: 'Business name and income required for self-employed',
      path: ['business_name'],
    }
  );
```

### Pattern 2: Password Confirmation

```typescript
const registerSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });
```

### Pattern 3: Date Validation

```typescript
const dateSchema = z.object({
  date_of_birth: z
    .string()
    .refine((date) => {
      const dob = new Date(date);
      const age = new Date().getFullYear() - dob.getFullYear();
      return age >= 21 && age <= 65;
    }, 'Age must be between 21 and 65 years'),

  loan_start_date: z.string(),
  loan_end_date: z.string(),
}).refine(
  (data) => {
    return new Date(data.loan_end_date) > new Date(data.loan_start_date);
  },
  {
    message: 'End date must be after start date',
    path: ['loan_end_date'],
  }
);
```

### Pattern 4: Async Validation (Check Uniqueness)

```typescript
const emailSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      async (email) => {
        // Check if email exists in database
        const { data } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();
        
        return !data; // Return false if email exists
      },
      { message: 'Email already registered' }
    ),
});

// Use with React Hook Form
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(emailSchema),
  mode: 'onBlur', // Validate on blur for async
});
```

### Pattern 5: Multi-Step Form Validation

```typescript
// Step 1 schema
const step1Schema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/),
});

// Step 2 schema
const step2Schema = z.object({
  nik: z.string().length(16),
  address: z.string().min(10),
  city: z.string().min(1),
});

// Step 3 schema
const step3Schema = z.object({
  occupation_type: z.enum(['pns', 'swasta', 'wiraswasta', 'lainnya']),
  monthly_income: z.number().min(1000000),
});

// Combined schema for final submission
const fullFormSchema = z.intersection(
  z.intersection(step1Schema, step2Schema),
  step3Schema
);

// Multi-step form component
function MultiStepForm() {
  const [step, setStep] = useState(1);
  
  // Use appropriate schema for current step
  const currentSchema = 
    step === 1 ? step1Schema :
    step === 2 ? step2Schema :
    step3Schema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger, // For manual validation
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
  });

  const handleNext = async () => {
    const isValid = await trigger(); // Validate current step
    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data) => {
    // Validate with full schema before submission
    const result = fullFormSchema.safeParse(data);
    if (result.success) {
      await submitApplication(result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Render fields based on current step */}
      {step === 1 && <Step1Fields register={register} errors={errors} />}
      {step === 2 && <Step2Fields register={register} errors={errors} />}
      {step === 3 && <Step3Fields register={register} errors={errors} />}

      <div className="flex gap-4">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)}>
            Previous
          </button>
        )}
        {step < 3 ? (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </div>
    </form>
  );
}
```

---

## Reusable Components

### Input Field with Validation

```typescript
// src/components/common/FormInput.tsx
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';

interface FormInputProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  className?: string;
}

export function FormInput<T extends Record<string, any>>({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  register,
  errors,
  className = '',
}: FormInputProps<T>) {
  const error = errors[name];

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        {...register(name, {
          valueAsNumber: type === 'number',
        })}
        placeholder={placeholder}
        className={`mt-1 block w-full rounded-md border ${
          error ? 'border-red-500' : 'border-gray-300'
        } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}

// Usage
<FormInput
  name="full_name"
  label="Full Name"
  required
  register={register}
  errors={errors}
/>
```

### Select Field with Validation

```typescript
// src/components/common/FormSelect.tsx
interface FormSelectProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export function FormSelect<T extends Record<string, any>>({
  name,
  label,
  options,
  required = false,
  register,
  errors,
}: FormSelectProps<T>) {
  const error = errors[name];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...register(name)}
        className={`mt-1 block w-full rounded-md border ${
          error ? 'border-red-500' : 'border-gray-300'
        } px-3 py-2`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}
```

---

## Data Integrity Patterns

### 1. Database Constraint Validation

Before inserting, validate against database constraints:

```typescript
async function createAgent(data: AgentFormData) {
  // Check for duplicate NIK
  const { data: existing } = await supabase
    .from('agents')
    .select('id')
    .eq('nik', data.nik)
    .single();

  if (existing) {
    throw new Error('Agent with this NIK already exists');
  }

  // Check for duplicate email
  const { data: existingEmail } = await supabase
    .from('users')
    .select('id')
    .eq('email', data.email)
    .single();

  if (existingEmail) {
    throw new Error('Email already registered');
  }

  // Proceed with insertion
  const { data: agent, error } = await supabase
    .from('agents')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return agent;
}
```

### 2. Transaction Safety

Use transactions for multi-table operations:

```typescript
async function approveAgent(applicationId: string) {
  const { data: application, error: fetchError } = await supabase
    .from('agent_applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (fetchError) throw fetchError;

  // Start transaction-like operation with RPC
  const { data, error } = await supabase.rpc('approve_agent_application', {
    p_application_id: applicationId,
    p_approved_by: currentUserId,
  });

  if (error) throw error;
  return data;
}

// In Supabase RPC function (SQL)
/*
CREATE OR REPLACE FUNCTION approve_agent_application(
  p_application_id UUID,
  p_approved_by UUID
)
RETURNS TABLE(agent_id UUID, user_id UUID)
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_agent_id UUID;
BEGIN
  -- Create user account
  -- Create agent record
  -- Update application status
  -- All in a transaction (automatic in PL/pgSQL)
  
  RETURN QUERY SELECT v_agent_id, v_user_id;
END;
$$;
*/
```

### 3. Optimistic Locking

Prevent concurrent update conflicts:

```typescript
async function updateLead(leadId: string, updates: Partial<Lead>) {
  // Fetch current version
  const { data: current, error: fetchError } = await supabase
    .from('leads')
    .select('*, version')
    .eq('id', leadId)
    .single();

  if (fetchError) throw fetchError;

  // Update with version check
  const { data, error } = await supabase
    .from('leads')
    .update({
      ...updates,
      version: current.version + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)
    .eq('version', current.version) // Only update if version matches
    .select()
    .single();

  if (!data) {
    throw new Error('Lead was modified by another user. Please refresh.');
  }

  if (error) throw error;
  return data;
}
```

---

## Troubleshooting

### Issue 1: Validation not triggering

**Cause:** Wrong validation mode or missing resolver.

**Solution:**
```typescript
const { register } = useForm({
  resolver: zodResolver(schema), // Make sure resolver is set
  mode: 'onBlur', // or 'onChange', 'onSubmit'
});
```

### Issue 2: TypeScript errors with nested objects

**Cause:** Incorrect path for nested fields.

**Solution:**
```typescript
// For documents.ktp
<input {...register('documents.ktp')} />

// Error access
{errors.documents?.ktp && (
  <p>{errors.documents.ktp.message}</p>
)}
```

### Issue 3: Number inputs returning strings

**Cause:** HTML inputs always return strings.

**Solution:**
```typescript
<input
  type="number"
  {...register('monthly_income', {
    valueAsNumber: true, // <-- Convert to number
  })}
/>
```

### Issue 4: Async validation not working

**Cause:** Zod doesn't support async refinements in browser.

**Solution:** Use manual validation with `trigger`:
```typescript
const checkEmailUnique = async (email: string) => {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  return !data;
};

// In component
const handleEmailBlur = async () => {
  const email = watch('email');
  const isUnique = await checkEmailUnique(email);
  if (!isUnique) {
    setError('email', {
      type: 'manual',
      message: 'Email already exists',
    });
  }
};
```

---

## Best Practices

### ✅ DO

- **Use Zod schemas** for type-safe validation
- **Validate on blur** for better UX (not every keystroke)
- **Show clear error messages** in Indonesian/English
- **Disable submit** button while submitting
- **Reset form** after successful submission
- **Use default values** to avoid undefined errors
- **Validate file uploads** before submission
- **Handle server errors** gracefully
- **Check data integrity** before database operations

### ❌ DON'T

- **Don't validate every keystroke** (annoying UX)
- **Don't rely only on frontend validation** (security risk)
- **Don't show technical errors** to users
- **Don't forget to handle async errors**
- **Don't skip database constraint checks**
- **Don't allow partial data** in database

---

## Security Checklist

- [ ] Input sanitization implemented
- [ ] XSS prevention (escape user inputs)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] CSRF protection enabled
- [ ] Rate limiting on form submissions
- [ ] Server-side validation matches frontend
- [ ] Sensitive data not exposed in errors
- [ ] File upload validation enforced

---

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Form Validation Best Practices](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/)
