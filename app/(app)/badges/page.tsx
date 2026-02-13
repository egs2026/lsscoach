'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';

const availableBadges = [
  { id: 'first-project', name: 'First Project', description: 'Created your first project', icon: '🎯' },
  { id: 'charter-complete', name: 'Charter Master', description: 'Completed a project charter', icon: '📋' },
  { id: 'define-complete', name: 'Define Expert', description: 'Completed the Define phase', icon: '🎓' },
  { id: 'measure-complete', name: 'Measurement Pro', description: 'Completed the Measure phase', icon: '📊' },
  { id: 'analyze-complete', name: 'Analysis Guru', description: 'Completed the Analyze phase', icon: '🔍' },
  { id: 'improve-complete', name: 'Improvement Champion', description: 'Completed the Improve phase', icon: '⚡' },
  { id: 'control-complete', name: 'Control Master', description: 'Completed the Control phase', icon: '🎖️' },
  { id: 'project-complete', name: 'Project Finisher', description: 'Completed a full DMAIC project', icon: '🏆' },
];

export default function BadgesPage() {
  const { user } = useStore();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    loadBadges();
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('badges')
      .select('badge_type')
      .eq('user_id', user.id);

    if (data) {
      setEarnedBadges(data.map(b => b.badge_type));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Badges & Achievements</h1>
        <p className="text-muted-foreground">Track your progress and earn badges</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableBadges.map((badge) => {
          const isEarned = earnedBadges.includes(badge.id);
          return (
            <Card key={badge.id} className={isEarned ? 'border-primary' : 'opacity-60'}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{isEarned ? badge.icon : '🔒'}</div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {badge.name}
                      {!isEarned && <Lock className="h-4 w-4" />}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{badge.description}</CardDescription>
                {isEarned && (
                  <p className="text-xs text-primary mt-2">✓ Earned</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
