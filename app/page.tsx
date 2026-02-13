'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { LoginForm } from '@/components/auth/login-form';

export default function Home() {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <LoginForm />
    </main>
  );
}
