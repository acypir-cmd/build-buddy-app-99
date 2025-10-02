-- Phase 5 & 6: Database Schema and Authentication Setup

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'headteacher');

-- Create schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  grade_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  student_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create progress_entries table
CREATE TABLE public.progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  grade NUMERIC(5,2) NOT NULL CHECK (grade >= 0 AND grade <= 100),
  comments TEXT,
  entered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create class_averages table (for computed averages)
CREATE TABLE public.class_averages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  average_grade NUMERIC(5,2) NOT NULL,
  calculation_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (class_id, subject_id)
);

-- Enable Row Level Security
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_averages ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user's school_id
CREATE OR REPLACE FUNCTION public.get_user_school_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM public.profiles WHERE id = _user_id
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, school_id, full_name)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'school_id')::UUID,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Insert role based on metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role);
  
  -- If role is student, create student record
  IF (NEW.raw_user_meta_data->>'role') = 'student' THEN
    INSERT INTO public.students (user_id, school_id)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'school_id')::UUID);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles (read-only for users)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for schools
CREATE POLICY "Users can view their school"
  ON public.schools FOR SELECT
  USING (id = public.get_user_school_id(auth.uid()));

CREATE POLICY "Head teachers can manage their school"
  ON public.schools FOR ALL
  USING (
    public.has_role(auth.uid(), 'headteacher') AND
    id = public.get_user_school_id(auth.uid())
  );

-- RLS Policies for classes
CREATE POLICY "Users can view classes in their school"
  ON public.classes FOR SELECT
  USING (school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "Teachers can manage their classes"
  ON public.classes FOR ALL
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    teacher_id = auth.uid()
  );

CREATE POLICY "Head teachers can manage all classes in their school"
  ON public.classes FOR ALL
  USING (
    public.has_role(auth.uid(), 'headteacher') AND
    school_id = public.get_user_school_id(auth.uid())
  );

-- RLS Policies for students
CREATE POLICY "Students can view their own record"
  ON public.students FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can view students in their classes"
  ON public.students FOR SELECT
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Head teachers can view all students in their school"
  ON public.students FOR SELECT
  USING (
    public.has_role(auth.uid(), 'headteacher') AND
    school_id = public.get_user_school_id(auth.uid())
  );

CREATE POLICY "Teachers and head teachers can manage students"
  ON public.students FOR ALL
  USING (
    (public.has_role(auth.uid(), 'teacher') AND class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())) OR
    (public.has_role(auth.uid(), 'headteacher') AND school_id = public.get_user_school_id(auth.uid()))
  );

-- RLS Policies for subjects
CREATE POLICY "Users can view subjects in their school"
  ON public.subjects FOR SELECT
  USING (school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "Teachers and head teachers can manage subjects"
  ON public.subjects FOR ALL
  USING (
    (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'headteacher')) AND
    school_id = public.get_user_school_id(auth.uid())
  );

-- RLS Policies for progress_entries
CREATE POLICY "Students can view their own progress"
  ON public.progress_entries FOR SELECT
  USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

CREATE POLICY "Teachers can view progress in their classes"
  ON public.progress_entries FOR SELECT
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Head teachers can view all progress in their school"
  ON public.progress_entries FOR SELECT
  USING (
    public.has_role(auth.uid(), 'headteacher') AND
    class_id IN (SELECT id FROM public.classes WHERE school_id = public.get_user_school_id(auth.uid()))
  );

CREATE POLICY "Teachers can manage progress in their classes"
  ON public.progress_entries FOR ALL
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

-- RLS Policies for class_averages
CREATE POLICY "Users can view class averages in their school"
  ON public.class_averages FOR SELECT
  USING (
    class_id IN (SELECT id FROM public.classes WHERE school_id = public.get_user_school_id(auth.uid()))
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_entries_updated_at BEFORE UPDATE ON public.progress_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for progress tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.progress_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_averages;