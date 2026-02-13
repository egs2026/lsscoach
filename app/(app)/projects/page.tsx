'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { Plus, Search, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ProjectsPage() {
  const { user } = useStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'completed': return 'bg-blue-500/10 text-blue-500';
      case 'archived': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-yellow-500/10 text-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your Lean Six Sigma projects</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first project'}
            </p>
            {!searchQuery && (
              <Link href="/projects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Phase:</span>
                    <Badge variant="outline">{project.current_phase.toUpperCase()}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
