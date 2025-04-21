import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is not defined in environment variables.');
}

// Create a regular client without auth context
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create an authenticated client with the user's session
export async function getAuthenticatedClient() {
  const response = await fetch('/api/supabase-token');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get authentication token');
  }
    
  const { token } = await response.json();
  if (!token) {
    throw new Error('No authentication token received');
  }
    
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}
