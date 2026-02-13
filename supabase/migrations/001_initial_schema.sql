/*
  # Initial Database Schema for Lean Six Sigma Master Coach

  1. New Tables
    - `profiles` - User profiles linked to auth.users
    - `projects` - Six Sigma projects
    - `project_members` - Project membership and roles
    - `charter` - Project charter data
    - `dmaic_phase_status` - DMAIC phase progression tracking
    - `artifacts` - Project artifacts with versioning
    - `conversations` - AI coaching conversations
    - `quizzes` - Quiz templates
    - `quiz_attempts` - User quiz attempts
    - `audit_log` - Comprehensive audit trail

  2. Security
    - Enable RLS on all tables
    - Project-based access control
    - Role-based permissions (owner/editor/viewer)
    - Audit log restricted to service role
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'coach', 'student');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'closed');
CREATE TYPE member_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE dmaic_phase AS ENUM ('define', 'measure', 'analyze', 'improve', 'control');
CREATE TYPE phase_status AS ENUM ('locked', 'in_progress', 'done');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'student',
  created_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sector text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status project_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

-- Project members table
CREATE TABLE IF NOT EXISTS project_members (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role member_role DEFAULT 'viewer',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

-- Charter table
CREATE TABLE IF NOT EXISTS charter (
  project_id uuid PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  fields jsonb DEFAULT '{}'::jsonb,
  readiness_score int DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  approved boolean DEFAULT false,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- DMAIC phase status table
CREATE TABLE IF NOT EXISTS dmaic_phase_status (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  phase dmaic_phase,
  status phase_status DEFAULT 'locked',
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, phase)
);

-- Artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  version int DEFAULT 1,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  phase dmaic_phase,
  messages jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  questions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score int DEFAULT 0,
  answers jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_project_id ON artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(type);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_project_id ON audit_log(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id ON audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE charter ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmaic_phase_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function to check project membership
CREATE OR REPLACE FUNCTION is_project_member(project_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = project_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user can edit project
CREATE OR REPLACE FUNCTION can_edit_project(project_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = project_uuid
    AND user_id = auth.uid()
    AND role IN ('owner', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Users can view projects they are members of"
  ON projects FOR SELECT
  TO authenticated
  USING (is_project_member(id));

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project owners/editors can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (can_edit_project(id));

-- RLS Policies for project_members
CREATE POLICY "Users can view members of their projects"
  ON project_members FOR SELECT
  TO authenticated
  USING (is_project_member(project_id));

CREATE POLICY "Project owners can manage members"
  ON project_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'owner'
    )
  );

-- RLS Policies for charter
CREATE POLICY "Users can view charter of their projects"
  ON charter FOR SELECT
  TO authenticated
  USING (is_project_member(project_id));

CREATE POLICY "Project owners/editors can manage charter"
  ON charter FOR ALL
  TO authenticated
  USING (can_edit_project(project_id));

-- RLS Policies for dmaic_phase_status
CREATE POLICY "Users can view phase status of their projects"
  ON dmaic_phase_status FOR SELECT
  TO authenticated
  USING (is_project_member(project_id));

CREATE POLICY "Project owners/editors can update phase status"
  ON dmaic_phase_status FOR ALL
  TO authenticated
  USING (can_edit_project(project_id));

-- RLS Policies for artifacts
CREATE POLICY "Users can view artifacts of their projects"
  ON artifacts FOR SELECT
  TO authenticated
  USING (is_project_member(project_id));

CREATE POLICY "Project owners/editors can manage artifacts"
  ON artifacts FOR INSERT
  TO authenticated
  WITH CHECK (can_edit_project(project_id));

CREATE POLICY "Project owners/editors can update artifacts"
  ON artifacts FOR UPDATE
  TO authenticated
  USING (can_edit_project(project_id));

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND is_project_member(project_id));

CREATE POLICY "Users can create conversations in their projects"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND is_project_member(project_id));

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND is_project_member(project_id));

-- RLS Policies for quizzes
CREATE POLICY "All authenticated users can view quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for audit_log
CREATE POLICY "Users can view audit logs for their projects"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    project_id IS NULL OR is_project_member(project_id)
  );

-- Audit log inserts are restricted to service role only
-- No INSERT policy for authenticated users

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to automatically add creator as project owner
CREATE OR REPLACE FUNCTION handle_new_project()
RETURNS trigger AS $$
BEGIN
  INSERT INTO project_members (project_id, user_id, role)
  VALUES (new.id, new.created_by, 'owner');
  
  -- Initialize DMAIC phases as locked
  INSERT INTO dmaic_phase_status (project_id, phase, status)
  VALUES
    (new.id, 'define', 'in_progress'),
    (new.id, 'measure', 'locked'),
    (new.id, 'analyze', 'locked'),
    (new.id, 'improve', 'locked'),
    (new.id, 'control', 'locked');
  
  -- Create empty charter
  INSERT INTO charter (project_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to setup project on creation
DROP TRIGGER IF EXISTS on_project_created ON projects;
CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_new_project();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_charter_updated_at ON charter;
CREATE TRIGGER update_charter_updated_at
  BEFORE UPDATE ON charter
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_dmaic_phase_status_updated_at ON dmaic_phase_status;
CREATE TRIGGER update_dmaic_phase_status_updated_at
  BEFORE UPDATE ON dmaic_phase_status
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
