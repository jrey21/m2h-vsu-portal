# M2H VSU Portal - Enhanced Home Screen

## Overview
The Home screen has been enhanced to work with the existing M2H VSU Portal database structure and provides a comprehensive dashboard for dormitory residents with the following features:

## Features

### 1. **Welcome Section**
- Displays welcome message with current date
- Shows "Welcome to M2H VSU Portal" with today's date formatted as "Weekday, Month Day, Year"

### 2. **Student Information**
- Shows student's full name (first, middle, last)
- Displays room assignment
- Shows user status (Active/Inactive) and approval status (Approved/Pending/Rejected)
- Indicates if user is registered for current semester

### 3. **Balance Summary**
- Monthly payment amount
- Total fines (red text)
- Payment status (Paid/Partial/Unpaid) with color-coded badges

### 4. **Recent Violations**
- Lists up to 5 most recent violations
- Shows violation type, date, count, and total fine amount
- Warning icon for each violation

### 5. **Recent Reports**
- Lists up to 5 recent reports about the student
- Shows report context and date
- Report icon for each entry

## Database Integration

### Tables Used
1. **users** - User authentication and role information
2. **occupants** - Student personal information
3. **assigned_rooms** - Room assignments
4. **rooms** - Room details
5. **school_year_admitted** - Enrollment information
6. **school_year** - Academic year and semester data
7. **violators** - Violation records
8. **violations** - Violation types and costs
9. **fines** - Fine calculations
10. **balances** - Payment status and amounts
11. **monthly_payment** - Payment type information
12. **occupants_reported** - Reports about students
13. **reports** - Report details

### Data Relationships
- **Users** are linked to **Occupants** through `occupants_id`
- **Occupants** are linked to **Rooms** through `assigned_rooms` table
- **Violations** are tracked through `violators` table linking occupants to violations
- **Fines** are calculated from violations
- **Balances** combine monthly payments and fines
- **Reports** about occupants are tracked through `occupants_reported` table

## Features Breakdown

### User Status Determination
- **Active Status**: User must be approved AND enrolled in current academic year
- **Room Assignment**: Retrieved from `assigned_rooms` table
- **Registration Status**: Based on latest `school_year_admitted` record

### Balance Calculation
- Monthly payment amount from `monthly_payment` table
- Total fines from `fines` table
- Payment status from `balances` table

### Violation Tracking
- Retrieves violation records from `violators` table
- Shows violation type, count, and associated fines
- Displays most recent 5 violations

### Report System
- Shows reports filed against the student
- Retrieved from `occupants_reported` and `reports` tables
- Displays report context and date

## Usage

### For Students
1. Log in to see personalized dashboard
2. View student information and room assignment
3. Check registration and approval status
4. Review balance and payment status
5. Check recent violations and associated fines
6. View any reports filed
7. Pull down to refresh data

### For Administrators
1. Ensure users are linked to occupants records
2. Assign rooms through `assigned_rooms` table
3. Record violations and calculate fines
4. Update payment statuses in `balances` table
5. File reports through `reports` and `occupants_reported` tables

## Technical Implementation

### Data Service
- Created `dataService.ts` with utility functions for data fetching
- Optimized queries with proper joins and relationships
- Error handling and fallback data

### Security
- Uses Supabase Row Level Security (RLS)
- Users can only access their own data
- Proper authentication checks

### Performance
- Efficient queries with selective field retrieval
- Pagination for large datasets (limit 5 recent records)
- Proper indexing recommendations

## Error Handling
- Graceful handling of missing data
- Console logging for debugging
- Fallback UI states for empty data
- Loading states during data fetch

## Dependencies
- `@rneui/themed` - UI components
- `@supabase/supabase-js` - Database integration
- React Native's ScrollView with RefreshControl

## Future Enhancements
- Real-time updates using Supabase subscriptions
- Push notifications for new violations or reports
- Payment integration for fine settlement
- Photo uploads for violation evidence
- Analytics dashboard for administrators
- Calendar integration for room assignments and payments
