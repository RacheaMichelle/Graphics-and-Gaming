import { createClient } from '@supabase/supabase-js'

// Replace with your actual values from Step 3
const supabaseUrl = 'https://eftqmvkviadgxztvaoij.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmdHFtdmt2aWFkZ3h6dHZhb2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjAxMjAsImV4cCI6MjA3NTM5NjEyMH0.kmszKfMTindd2aUk_kaqoLU1K21NXDevt3MAsa8lO30'

export const supabase = createClient(supabaseUrl, supabaseKey)