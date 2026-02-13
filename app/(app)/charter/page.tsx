'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function CharterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Charter Builder</h1>
        <p className="text-muted-foreground">Create and manage project charters</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Charter
          </CardTitle>
          <CardDescription>
            Select a project to build or edit its charter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Charter builder will be available when you select a project
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
