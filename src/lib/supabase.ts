import { createClient } from '@supabase/supabase-js';

// Initialize database client
const supabaseUrl = 'https://rlbhwudztyezkavypiol.supabase.co';
// Using the legacy anon key for better compatibility with storage operations
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsYmh3dWR6dHllemthdnlwaW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNDk2NzUsImV4cCI6MjA4MjcyNTY3NX0.3x0kOJugqjsquWaVDOQtDMh1l2EMYVoA4sUPZzWwbUo';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'apikey': supabaseKey,
    },
  },
});

export { supabase };
