import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimeProgress(classId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress_entries',
          filter: classId ? `class_id=eq.${classId}` : undefined,
        },
        (payload) => {
          console.log('Progress entry changed:', payload);
          // Invalidate relevant queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['progress'] });
          queryClient.invalidateQueries({ queryKey: ['classAverages'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_averages',
          filter: classId ? `class_id=eq.${classId}` : undefined,
        },
        (payload) => {
          console.log('Class average changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['classAverages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classId, queryClient]);
}
