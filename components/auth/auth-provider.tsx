'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { User } from '@supabase/supabase-js';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
