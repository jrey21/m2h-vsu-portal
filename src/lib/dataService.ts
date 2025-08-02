// Data fetching utilities for M2H VSU Portal
import { supabase } from './supabase'

export interface UserData {
    id: string
    email: string
    role: string
    status: string
    occupant: {
        id: string
        first_name: string
        last_name: string
        middle_name?: string
        email?: string
        contact_number?: string
    }
    room: {
        room_no: number
        room_name: string
        level: string
    }
    school_year_admitted: {
        school_year: {
            semester: string
            year: number
        }
    }
    is_active: boolean
}

export interface ViolationData {
    id: string
    type_of_violation: string
    date: string
    cost: number
    count: number
    total_fine: number
}

export interface BalanceData {
    monthly_payment_amount: number
    total_fines: number
    balance_status: string
}

export interface ReportData {
    id: string
    context: string
    date: string
}

export interface CleaningAbsenceData {
    id: string
    date: string
    reason: string | null
    fine_amount: number
    excused: boolean
}

export interface PaymentData {
    id: string
    type_of_payment: string
    amount: number
    date: string
}

export interface EnhancedBalanceData extends BalanceData {
    current_balance: number
    total_paid: number
    recent_payments: PaymentData[]
}

// DEPRECATED: Using complex schema - replaced with simpler functions
// The functions below are kept for reference but should not be used
// as they reference non-existent tables and cause stack overflow errors

/*
export const fetchUserWithDetails = async (): Promise<UserData | null> => {
    // This function is deprecated - use fetchUserWithDetailsSimple instead
    return null
}

export const fetchUserViolations = async (occupantId: string): Promise<ViolationData[]> => {
    // This function is deprecated - use fetchUserViolationsSimple instead
    return []
}

export const fetchUserBalance = async (occupantId: string): Promise<BalanceData | null> => {
    // This function is deprecated - use fetchUserBalanceSimple instead
    return null
}

export const fetchUserReports = async (occupantId: string): Promise<ReportData[]> => {
    // This function is deprecated - no replacement needed
    return []
}
*/

export const fetchCleaningAbsences = async (userId: string): Promise<CleaningAbsenceData[]> => {
    try {
        const { data, error } = await supabase
            .from('cleaning_absences')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(5)

        if (error) throw error

        return data?.map(absence => ({
            id: absence.id,
            date: absence.date,
            reason: absence.reason,
            fine_amount: absence.fine_amount,
            excused: absence.excused
        })) || []
    } catch (error) {
        console.error('Error fetching cleaning absences:', error)
        return []
    }
}

// Updated fetchUserBalance function to use simpler schema
export const fetchUserBalanceSimple = async (userId: string): Promise<BalanceData | null> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('monthly_payment, fines, balance')
            .eq('id', userId)
            .single()

        if (error) throw error

        return {
            monthly_payment_amount: data?.monthly_payment || 0,
            total_fines: data?.fines || 0,
            balance_status: data?.balance < 0 ? 'overdue' : 'current'
        }
    } catch (error) {
        console.error('Error fetching balance:', error)
        return null
    }
}

// Updated fetchUserViolations function to use simpler schema
export const fetchUserViolationsSimple = async (userId: string): Promise<ViolationData[]> => {
    try {
        const { data, error } = await supabase
            .from('violations')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(5)

        if (error) throw error

        return data?.map(violation => ({
            id: violation.id,
            type_of_violation: violation.type,
            date: violation.date,
            cost: violation.fine_amount,
            count: 1,
            total_fine: violation.fine_amount
        })) || []
    } catch (error) {
        console.error('Error fetching violations:', error)
        return []
    }
}

// Updated fetchUserWithDetails function to use simpler schema
export const fetchUserWithDetailsSimple = async (): Promise<UserData | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) throw error
        if (!userData) return null

        return {
            id: userData.id,
            email: userData.email,
            role: userData.role || 'occupant',
            status: 'approved', // Default status
            occupant: {
                id: userData.id,
                first_name: userData.name?.split(' ')[0] || '',
                last_name: userData.name?.split(' ').slice(1).join(' ') || '',
                email: userData.email
            },
            room: {
                room_name: userData.room_name || 'Not Assigned',
                room_no: 0,
                level: userData.room_level || 'Level 1'
            },
            school_year_admitted: {
                school_year: {
                    semester: userData.semester || '',
                    year: userData.year || 0
                }
            },
            is_active: userData.is_active || false
        }
    } catch (error) {
        console.error('Error fetching user data:', error)
        return null
    }
}

// New function to fetch user payments
export const fetchUserPayments = async (userId: string): Promise<PaymentData[]> => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId)
            .order('payment_date', { ascending: false })
            .limit(5)

        if (error) throw error

        return data?.map(payment => ({
            id: payment.id,
            type_of_payment: payment.payment_type,
            amount: payment.amount,
            date: payment.payment_date
        })) || []
    } catch (error) {
        console.error('Error fetching payments:', error)
        return []
    }
}

// Enhanced balance function with payment details
export const fetchEnhancedBalance = async (occupantId: string): Promise<EnhancedBalanceData | null> => {
    try {
        if (!occupantId) {
            console.warn('No occupantId provided to fetchEnhancedBalance')
            return null
        }

        // Get user data from the simple schema
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', occupantId)
            .single()

        if (userError) {
            console.error('Error fetching user data for balance:', userError)
            throw userError
        }

        if (!userData) {
            console.warn('No user data found for occupantId:', occupantId)
            return null
        }

        // Get recent payments for this user
        const { data: paymentsData, error: paymentsError } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', occupantId)
            .order('payment_date', { ascending: false })
            .limit(5)

        if (paymentsError) {
            console.warn('Error fetching payments (non-critical):', paymentsError)
        }

        // Calculate totals
        const monthlyPayment = userData.monthly_payment || 0
        const totalFines = userData.fines || 0
        const currentBalance = userData.balance || 0
        const totalPaid = paymentsData?.reduce((sum, payment) => sum + payment.amount, 0) || 0

        // Determine balance status
        let balanceStatus = 'current'
        if (currentBalance > 0) {
            balanceStatus = 'unpaid'
        } else if (currentBalance < 0) {
            balanceStatus = 'partial'
        }

        // Format recent payments
        const recentPayments: PaymentData[] = paymentsData?.map(payment => ({
            id: payment.id,
            type_of_payment: payment.payment_type,
            amount: payment.amount,
            date: payment.payment_date
        })) || []

        return {
            monthly_payment_amount: monthlyPayment,
            total_fines: totalFines,
            balance_status: balanceStatus,
            current_balance: currentBalance,
            total_paid: totalPaid,
            recent_payments: recentPayments
        }
    } catch (error) {
        console.error('Error fetching enhanced balance:', error)
        return null
    }
}

// New function to fetch total fines of all occupants
export const fetchAllOccupantsFines = async (): Promise<{ total_fines: number; occupant_count: number } | null> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('fines, name')
            .eq('role', 'occupant')
            .not('fines', 'is', null)

        if (error) throw error

        if (!data || data.length === 0) {
            return { total_fines: 0, occupant_count: 0 }
        }

        const totalFines = data.reduce((sum, user) => sum + (user.fines || 0), 0)
        const occupantCount = data.length

        return {
            total_fines: totalFines,
            occupant_count: occupantCount
        }
    } catch (error) {
        console.error('Error fetching all occupants fines:', error)
        return null
    }
}
