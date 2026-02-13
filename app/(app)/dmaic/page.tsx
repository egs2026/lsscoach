'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DMAICPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">DMAIC Coach</h1>
        <p className="text-muted-foreground">Guided coaching through Define, Measure, Analyze, Improve, Control</p>
      </div>

      <Tabs defaultValue="define" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="define">Define</TabsTrigger>
          <TabsTrigger value="measure">Measure</TabsTrigger>
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
          <TabsTrigger value="improve">Improve</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
        </TabsList>

        <TabsContent value="define">
          <Card>
            <CardHeader>
              <CardTitle>Define Phase</CardTitle>
              <CardDescription>Clearly define the problem and project goals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Define phase content will be available when you select a project
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measure">
          <Card>
            <CardHeader>
              <CardTitle>Measure Phase</CardTitle>
              <CardDescription>Establish baseline metrics and data collection</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Measure phase content will be available when you select a project
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyze">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Phase</CardTitle>
              <CardDescription>Identify root causes and validate hypotheses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analyze phase content will be available when you select a project
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improve">
          <Card>
            <CardHeader>
              <CardTitle>Improve Phase</CardTitle>
              <CardDescription>Develop and implement solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Improve phase content will be available when you select a project
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="control">
          <Card>
            <CardHeader>
              <CardTitle>Control Phase</CardTitle>
              <CardDescription>Sustain improvements and monitor performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Control phase content will be available when you select a project
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
