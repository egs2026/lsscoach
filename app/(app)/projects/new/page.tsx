'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          name: formData.name,
          description: formData.description,
          owner_id: user.id,
          status: 'draft',
          current_phase: 'charter',
          deleted_at: null,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('project_members').insert({
        project_id: project.id,
        user_id: user.id,
        role: 'owner',
      });

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'create',
        entity_type: 'project',
        entity_id: project.id,
        changes: { name: formData.name },
      });

      toast({
        title: 'Success',
        description: 'Project created successfully!',
      });

      router.push(`/projects/${project.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground">Start your Lean Six Sigma journey</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Provide basic information about your improvement project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Reduce Customer Wait Time"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief overview of the project goals and scope..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
              <Link href="/projects">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
