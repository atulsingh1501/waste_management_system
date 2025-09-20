import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

export function useSupabaseQuery<T extends keyof Tables>(
  table: T,
  query?: {
    select?: string;
    eq?: [string, any];
    order?: [string, { ascending?: boolean }];
    limit?: number;
  }
) {
  const [data, setData] = useState<Tables[T]['Row'][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let queryBuilder = supabase.from(table).select(query?.select || '*');

        if (query?.eq) {
          queryBuilder = queryBuilder.eq(query.eq[0], query.eq[1]);
        }

        if (query?.order) {
          queryBuilder = queryBuilder.order(query.order[0], query.order[1]);
        }

        if (query?.limit) {
          queryBuilder = queryBuilder.limit(query.limit);
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table, JSON.stringify(query)]);

  return { data, loading, error };
}

export function useSupabaseMutation<T extends keyof Tables>(table: T) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insert = async (data: Tables[T]['Insert']) => {
    try {
      setLoading(true);
      setError(null);
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Tables[T]['Update']) => {
    try {
      setLoading(true);
      setError(null);
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { insert, update, remove, loading, error };
}