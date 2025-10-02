import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting class averages calculation...');

    // Get all classes
    const { data: classes, error: classesError } = await supabaseClient
      .from('classes')
      .select('id, school_id');

    if (classesError) throw classesError;

    console.log(`Found ${classes?.length || 0} classes`);

    // Get all subjects
    const { data: subjects, error: subjectsError } = await supabaseClient
      .from('subjects')
      .select('id, school_id');

    if (subjectsError) throw subjectsError;

    console.log(`Found ${subjects?.length || 0} subjects`);

    const results = [];

    // Calculate averages for each class and subject combination
    for (const classItem of classes || []) {
      for (const subject of subjects || []) {
        // Only calculate if subject belongs to same school as class
        if (classItem.school_id !== subject.school_id) continue;

        const { data: progressEntries, error: progressError } = await supabaseClient
          .from('progress_entries')
          .select('grade')
          .eq('class_id', classItem.id)
          .eq('subject_id', subject.id);

        if (progressError) {
          console.error(`Error fetching progress for class ${classItem.id}, subject ${subject.id}:`, progressError);
          continue;
        }

        if (progressEntries && progressEntries.length > 0) {
          const average = progressEntries.reduce((sum, entry) => sum + Number(entry.grade), 0) / progressEntries.length;

          // Upsert the class average
          const { error: upsertError } = await supabaseClient
            .from('class_averages')
            .upsert({
              class_id: classItem.id,
              subject_id: subject.id,
              average_grade: average,
              calculation_date: new Date().toISOString(),
            }, {
              onConflict: 'class_id,subject_id'
            });

          if (upsertError) {
            console.error(`Error upserting average for class ${classItem.id}, subject ${subject.id}:`, upsertError);
          } else {
            results.push({
              class_id: classItem.id,
              subject_id: subject.id,
              average_grade: average,
              entry_count: progressEntries.length
            });
            console.log(`Updated average for class ${classItem.id}, subject ${subject.id}: ${average.toFixed(2)}`);
          }
        }
      }
    }

    console.log(`Calculation complete. Updated ${results.length} class averages`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${results.length} class averages`,
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in calculate-class-averages function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
