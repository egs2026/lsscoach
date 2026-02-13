import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          status: 'draft' | 'active' | 'completed' | 'archived';
          current_phase: 'charter' | 'define' | 'measure' | 'analyze' | 'improve' | 'control';
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: 'owner' | 'member' | 'viewer';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['project_members']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['project_members']['Insert']>;
      };
      charters: {
        Row: {
          id: string;
          project_id: string;
          problem_statement: string | null;
          goal_statement: string | null;
          scope: string | null;
          team_members: string | null;
          timeline: string | null;
          business_case: string | null;
          is_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['charters']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['charters']['Insert']>;
      };
      phase_progress: {
        Row: {
          id: string;
          project_id: string;
          phase: string;
          status: 'locked' | 'in_progress' | 'completed';
          completion_percentage: number;
          data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['phase_progress']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['phase_progress']['Insert']>;
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          badge_name: string;
          earned_at: string;
        };
        Insert: Omit<Database['public']['Tables']['badges']['Row'], 'id' | 'earned_at'>;
        Update: Partial<Database['public']['Tables']['badges']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          changes: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
};
