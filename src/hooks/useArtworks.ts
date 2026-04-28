import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Artwork } from '../types';

interface State {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
}

export function useArtworks(): State {
  const [state, setState] = useState<State>({ artworks: [], loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!mounted) return;
      if (error) {
        setState({ artworks: [], loading: false, error: error.message });
      } else {
        setState({ artworks: (data ?? []) as Artwork[], loading: false, error: null });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

export function useArtwork(slug: string | undefined) {
  const [state, setState] = useState<{ artwork: Artwork | null; loading: boolean; error: string | null }>({
    artwork: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) {
      setState({ artwork: null, loading: false, error: 'Missing slug' });
      return;
    }
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (!mounted) return;
      if (error) {
        setState({ artwork: null, loading: false, error: error.message });
      } else {
        setState({ artwork: (data as Artwork | null) ?? null, loading: false, error: null });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  return state;
}
