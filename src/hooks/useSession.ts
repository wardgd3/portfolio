import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface State {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useSession(): State {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check(s: Session | null) {
      if (!s) {
        if (mounted) {
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', s.user.id)
        .maybeSingle();
      if (!mounted) return;
      setSession(s);
      setIsAdmin(!error && Boolean(data));
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => check(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      check(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, isAdmin, loading };
}
