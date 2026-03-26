# PDKS - Personel Devam Kontrol Sistemi

## Overview
The Personnel Attendance Control System (PDKS) is a comprehensive solution that manages employee attendance tracking, scheduling, and reporting with automated calculations for overtime, late arrivals, and early departures.

## Components Created

### 1. ENUMERATIONS (app/Enums/)
- **AttendanceSourceEnum**: device, mobile, web, api
- **AttendanceTypeEnum**: check_in, check_out, break_start, break_end
- **AttendanceStatusEnum**: present, absent, late, early_leave, overtime
- **AdjustmentTypeEnum**: missing, wrong, overtime_request
- **AdjustmentStatusEnum**: pending, approved, rejected
- **HolidayTypeEnum**: official, company
- **ShiftTypeEnum**: morning, evening, night, flexible

### 2. MODELS (app/Models/)
- **Shift**: Defines shift configurations (start/end times, breaks, tolerances)
- **WorkCalendar**: Organization's calendar definitions 
- **Holiday**: Calendar-specific holidays (recurring and fixed)
- **ShiftTemplate**: Templates linking shifts to calendar days (recurring)
- **ShiftSchedule**: Actual employee shift assignments by date
- **AttendanceRecord**: Individual check-in/check-out records
- **AttendanceAdjustment**: Manual requests to correct/justify records
- **AttendanceSummary**: Daily calculated attendance reports

### 3. DATABASE MIGRATIONS (database/migrations/)
- **2026_03_25_000010**: Calendar and Holiday tables
- **2026_03_25_000011**: Shift, Template, and Schedule tables
- **2026_03_25_000012**: Attendance Records table
- **2026_03_25_000013**: Attendance Adjustments table
- **2026_03_25_000014**: Attendance Summaries table

### 4. SERVICES (app/Services/)
- **AttendanceService**: Core attendance processing and summary updates
- **ShiftService**: Shift management and assignment logic
- **CalendarService**: Work calendar and holiday functions
- **AttendanceCalculationService**: Duration, overtime, late/early calculations

### 5. CONTROLLERS (app/Http/Controllers/)
- **AttendanceController**: Clock in/out, attendance management
- **ShiftController**: Shift configuration and assignment
- **CalendarController**: Calendar and holiday management
- **AdjustmentController**: Adjustment request handling

### 6. POLICIES (app/Policies/)
- **AttendancePolicy**: Attendance record permissions
- **ShiftPolicy**: Shift configuration permissions
- **AdjustmentPolicy**: Attendance adjustment permissions

### 7. REQUESTS (app/Http/Requests/)
- **Store/Update Attendance/Shift/Calendar/Adjustment Requests**: Validation classes

## Key Features Implemented

### Attendance Tracking
- Multi-source attendance recording (device, mobile app, web, API)
- Geolocation, IP address, and metadata logging
- Check-in/check-out with automatic status determination

### Calculations & Processing
- Automatic overtime calculation based on expected hours
- Late arrival and early departure detection with tolerance settings
- Expected vs. actual working hour comparisons
- Holiday and weekend recognition

### Scheduling
- Flexible shift definitions (morning, evening, night, flexible)
- Recurring and ad-hoc shift scheduling
- Employee-specific shift assignments by date

### Adjustments
- Employee and manager request systems
- Administrator approval workflows
- Adjustment types (missing, wrong, overtime requests)

### Reporting
- Detailed daily attendance summaries per employee
- Monthly statistics and rate calculations
- Business and holiday day identification

## Technical Standards Applied
- Clean Architecture (Domain, Application, Infrastructure layers)
- Repository and Service layer patterns applied
- Policy-based authorization implemented
- Form Request validation for all inputs
- Proper Enum usage with localization support
- Relationship integrity enforcement
- Security-conscious design patterns

The system is designed to scale and accommodate various company policies around attendance, overtime calculation methods, and approval workflows.