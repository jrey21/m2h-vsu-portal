-- M2H VSU Portal Database Schema
-- Run these SQL commands in your Supabase SQL editor

-- If you already have an existing users table, run this migration first:
-- ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'occupant' CHECK (role IN ('occupant', 'admin', 'manager'));

-- Users table to store user information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    room_name TEXT NOT NULL,
    role TEXT DEFAULT 'occupant' CHECK (role IN ('occupant', 'admin', 'manager')),
    is_active BOOLEAN DEFAULT false,
    balance DECIMAL(10,2) DEFAULT 0.00,
    fines DECIMAL(10,2) DEFAULT 0.00,
    monthly_payment DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Violations table to store user violations
CREATE TABLE IF NOT EXISTS violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT,
    fine_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cleaning absences table
CREATE TABLE IF NOT EXISTS cleaning_absences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason TEXT,
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    excused BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments table to track payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('monthly', 'fine', 'other')),
    description TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_violations_user_id ON violations(user_id);
CREATE INDEX IF NOT EXISTS idx_violations_date ON violations(date);
CREATE INDEX IF NOT EXISTS idx_cleaning_absences_user_id ON cleaning_absences(user_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_absences_date ON cleaning_absences(date);
CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(date);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own violations
CREATE POLICY "Users can view own violations" ON violations FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own absences
CREATE POLICY "Users can view own absences" ON cleaning_absences FOR SELECT USING (auth.uid() = user_id);

-- All users can view active announcements
CREATE POLICY "Users can view active announcements" ON announcements FOR SELECT USING (is_active = true);

-- Users can only see their own payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Insert sample data (optional - for testing)
INSERT INTO users (id, email, name, room_name, role, is_active, balance, fines, monthly_payment) VALUES
(gen_random_uuid(), 'john.doe@example.com', 'John Doe', 'Room 101', 'occupant', true, 500.00, 150.00, 800.00),
(gen_random_uuid(), 'jane.smith@example.com', 'Jane Smith', 'Room 102', 'occupant', true, -200.00, 300.00, 800.00);

-- Insert sample announcements
INSERT INTO announcements (title, message, priority) VALUES
('Monthly Meeting', 'Monthly dormitory meeting scheduled for this Friday at 7 PM in the common room.', 'high'),
('Maintenance Notice', 'Water will be temporarily shut off on Saturday from 9 AM to 12 PM for maintenance.', 'medium'),
('New Rules', 'Please review the updated dormitory rules posted on the bulletin board.', 'low');
