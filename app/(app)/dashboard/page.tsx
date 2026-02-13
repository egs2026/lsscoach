'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { Plus, TrendingUp, CheckCircle2, Clock, Award } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    badges: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .limit(5);

    const { data: badgesData } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', user.id);

    if (projectsData) {
      setProjects(projectsData);
      setStats({
        totalProjects: projectsData.length,
        activeProjects: projectsData.filter(p => p.status === 'active').length,
        completedProjects: projectsData.filter(p => p.status === 'completed').length,
        badges: badgesData?.length || 0,
      });
    }
  };

  const getPhaseProgress = (phase: string) => {
    const phases = ['charter', 'define', 'measure', 'analyze', 'improve', 'control'];
    const index = phases.indexOf(phase);
    return ((index + 1) / phases.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your Lean Six Sigma projects and progress</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.badges}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Your latest Lean Six Sigma initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No projects yet. Create your first project to get started!</p>
              <Link href="/projects/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {project.current_phase.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress value={getPhaseProgress(project.current_phase)} />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {Math.round(getPhaseProgress(project.current_phase))}% Complete
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
