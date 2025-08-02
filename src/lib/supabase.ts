import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mxpiuzbftgjdbnangvba.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14cGl1emJmdGdqZGJuYW5ndmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDM3NzEsImV4cCI6MjA2NjA3OTc3MX0.9od_678Ai5cVE4OvfjXLURWNBpFAlvcw6KvFv0564yk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})