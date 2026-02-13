'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, FileText, BarChart3, Target } from 'lucide-react';

const tools = [
  {
    name: 'SIPOC Diagram',
    description: 'Suppliers, Inputs, Process, Outputs, Customers',
    icon: BarChart3,
  },
  {
    name: 'Fishbone Diagram',
    description: 'Cause and effect analysis tool',
    icon: Target,
  },
  {
    name: 'Process Map',
    description: 'Visual representation of process flow',
    icon: FileText,
  },
  {
    name: 'Control Chart',
    description: 'Monitor process stability over time',
    icon: BarChart3,
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tools & Templates</h1>
        <p className="text-muted-foreground">Lean Six Sigma tools and templates for your projects</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.name} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{tool.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
