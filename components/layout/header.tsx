'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user } = useStore();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Welcome back!</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Avatar>
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
