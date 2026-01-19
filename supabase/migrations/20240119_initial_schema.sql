
-- Aura initial schema for Human Data Interface (HDI)

-- Roles: explorer (user), architect (admin), corporate (company), professional (expert)
CREATE TYPE user_role AS ENUM ('explorer', 'architect', 'corporate', 'professional');

-- Users profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'explorer',
  clearance_level INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test definitions (catalog)
CREATE TABLE IF NOT EXISTS test_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'mfc', 'stroop', 'bart', 'gonogo', etc.
  description TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Test sessions
CREATE TABLE IF NOT EXISTS test_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  test_id UUID REFERENCES test_definitions(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'started', -- 'started', 'completed', 'abandoned'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  score_data JSONB DEFAULT '{}'::jsonb -- Summary scores
);

-- Neuro logs (High precision event data)
CREATE TABLE IF NOT EXISTS neuro_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
  events JSONB NOT NULL, -- Array of objects: { timestamp, event, details }
  client_metadata JSONB DEFAULT '{}'::jsonb -- Browser info, etc.
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Tests are viewable by authenticated users" ON test_definitions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage tests" ON test_definitions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'architect')
);

CREATE POLICY "Users can view own sessions" ON test_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON test_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own neuro logs" ON neuro_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM test_sessions WHERE id = neuro_logs.session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create own neuro logs" ON neuro_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM test_sessions WHERE id = neuro_logs.session_id AND user_id = auth.uid())
);
