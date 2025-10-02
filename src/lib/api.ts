import { supabase } from "@/integrations/supabase/client";

// Progress API
export const progressAPI = {
  async getStudentProgress(studentId: string) {
    const { data, error } = await supabase
      .from("progress_entries")
      .select(`
        *,
        subject:subjects(name),
        class:classes(name)
      `)
      .eq("student_id", studentId)
      .order("entry_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getClassProgress(classId: string) {
    const { data, error } = await supabase
      .from("progress_entries")
      .select(`
        *,
        student:students(id, user_id, profiles(full_name)),
        subject:subjects(name)
      `)
      .eq("class_id", classId)
      .order("entry_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  async addProgress(entry: {
    student_id: string;
    subject_id: string;
    class_id: string;
    grade: number;
    comments?: string;
    entered_by: string;
  }) {
    const { data, error } = await supabase
      .from("progress_entries")
      .insert(entry)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProgress(id: string, updates: { grade?: number; comments?: string }) {
    const { data, error } = await supabase
      .from("progress_entries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Student API
export const studentAPI = {
  async getStudentByUserId(userId: string) {
    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        class:classes(name, teacher_id),
        school:schools(name)
      `)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getClassStudents(classId: string) {
    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        profiles(full_name, avatar_url)
      `)
      .eq("class_id", classId);

    if (error) throw error;
    return data;
  },
};

// Teacher API
export const teacherAPI = {
  async getTeacherClasses(teacherId: string) {
    const { data, error } = await supabase
      .from("classes")
      .select(`
        *,
        school:schools(name),
        students(count)
      `)
      .eq("teacher_id", teacherId);

    if (error) throw error;
    return data;
  },
};

// Analytics API
export const analyticsAPI = {
  async getClassAverages(classId: string) {
    const { data, error } = await supabase
      .from("class_averages")
      .select(`
        *,
        subject:subjects(name),
        class:classes(name)
      `)
      .eq("class_id", classId);

    if (error) throw error;
    return data;
  },

  async getSchoolAverages(schoolId: string) {
    const { data, error } = await supabase
      .from("class_averages")
      .select(`
        *,
        subject:subjects(name),
        class:classes(name, school_id)
      `)
      .eq("class.school_id", schoolId);

    if (error) throw error;
    return data;
  },
};

// Subjects API
export const subjectsAPI = {
  async getSchoolSubjects(schoolId: string) {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("school_id", schoolId);

    if (error) throw error;
    return data;
  },
};
