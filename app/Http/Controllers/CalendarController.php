<?php

declare(strict_types=1);
namespace App\Http\Controllers;

use App\Http\Requests\StoreCalendarRequest;
use App\Http\Requests\UpdateCalendarRequest;
use App\Models\WorkCalendar;
use App\Services\CalendarService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    protected CalendarService $calendarService;

    protected \App\Services\HolidayService $holidayService;

    public function __construct(CalendarService $calendarService, \App\Services\HolidayService $holidayService)
    {
        $this->calendarService = $calendarService;
        $this->holidayService = $holidayService;
        $this->authorizeResource(\App\Models\WorkCalendar::class, 'calendar');
    }

    public function index(Request $request)
    {
        $query = WorkCalendar::query();

        if ($request->has('active')) {
            $query->where('is_active', $request->active);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $calendars = $query->paginate(15);

        return inertia('Admin/WorkCalendars/Index', [
            'calendars' => $calendars,
        ]);
    }

    public function show(WorkCalendar $calendar)
    {
        return inertia('Admin/WorkCalendars/Show', [
            'calendar' => $calendar,
        ]);
    }

    public function create()
    {
        return inertia('Admin/WorkCalendars/Create');
    }

    public function store(StoreCalendarRequest $request)
    {
        $data = $request->validated();

        $calendar = $this->calendarService->createWorkCalendar($data);

        return redirect()->route('admin.work-calendars.index')->with('success', 'Çalışma takvimi başarıyla oluşturuldu.');
    }

    public function edit(WorkCalendar $calendar)
    {
        return inertia('Admin/WorkCalendars/Edit', [
            'calendar' => $calendar,
        ]);
    }

    public function update(UpdateCalendarRequest $request, WorkCalendar $calendar)
    {
        $data = $request->validated();

        $updatedCalendar = $this->calendarService->updateWorkCalendar($calendar, $data);

        return redirect()->route('admin.work-calendars.index')->with('success', 'Çalışma takvimi başarıyla güncellendi.');
    }

    public function destroy(WorkCalendar $calendar)
    {
        $calendar->delete();

        return redirect()->route('admin.work-calendars.index')->with('success', 'Çalışma takvimi başarıyla silindi.');
    }

    public function toggleStatus(Request $request, int $calendarId)
    {
        $request->validate([
            'status' => 'required|boolean',
        ]);

        $calendar = $this->calendarService->toggleWorkCalendarStatus($calendarId, $request->status);

        return response()->json([
            'success' => true,
            'calendar' => $calendar,
            'message' => 'Calendar status updated successfully',
        ]);
    }

    public function addHoliday(Request $request)
    {
        $request->validate([
            'calendar_id' => 'required|exists:work_calendars,id',
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:official,company',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
        ]);

        try {
            $holiday = $this->calendarService->addHoliday($request->calendar_id, [
                'name' => $request->name,
                'date' => $request->date,
                'type' => $request->type,
                'description' => $request->description,
                'is_recurring' => $request->boolean('is_recurring', false),
            ]);

            return response()->json([
                'success' => true,
                'holiday' => $holiday,
                'message' => 'Holiday added successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Holiday addition failed', [
                'message' => $e->getMessage(),
                'calendar_id' => $request->calendar_id ?? null,
                'user_id' => auth()->id() ?? null,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to add holiday',
            ], 500);
        }
    }

    public function isBusinessDay(Request $request)
    {
        $request->validate([
            'calendar_id' => 'required|exists:work_calendars,id',
            'date' => 'required|date',
        ]);

        $isBusinessDay = $this->calendarService->isBusinessDay(
            $request->calendar_id,
            Carbon::parse($request->date)
        );

        return response()->json([
            'is_business_day' => $isBusinessDay,
            'date' => $request->date,
        ]);
    }

    public function getHolidaysInRange(Request $request)
    {
        $request->validate([
            'calendar_id' => 'required|exists:work_calendars,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $holidays = $this->calendarService->getHolidaysInRange(
            $request->calendar_id,
            Carbon::parse($request->start_date),
            Carbon::parse($request->end_date)
        );

        return response()->json([
            'holidays' => $holidays,
        ]);
    }

    public function getBusinessDaysCount(Request $request)
    {
        $request->validate([
            'calendar_id' => 'required|exists:work_calendars,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $count = $this->calendarService->getBusinessDaysCount(
            $request->calendar_id,
            Carbon::parse($request->start_date),
            Carbon::parse($request->end_date)
        );

        return response()->json([
            'count' => $count,
        ]);
    }

    // Holiday Management
    public function holidayIndex(Request $request)
    {
        $query = \App\Models\Holiday::query()->with('workCalendar');

        if ($request->has('year')) {
            $query->whereYear('date', $request->year);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $holidays = $query->orderBy('date')->paginate(15);

        return inertia('Admin/Holidays/Index', [
            'holidays' => $holidays,
        ]);
    }

    public function holidayCreate(Request $request)
    {
        $calendars = \App\Models\WorkCalendar::orderBy('name')->get(['id', 'name']);

        return inertia('Admin/Holidays/Create', [
            'calendars' => $calendars,
        ]);
    }

    public function holidayStore(Request $request)
    {
        $request->validate([
            'work_calendar_id' => 'required|exists:work_calendars,id',
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:official,company',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
        ]);

        $holiday = $this->holidayService->create([
            'work_calendar_id' => $request->work_calendar_id,
            'name' => $request->name,
            'date' => $request->date,
            'type' => $request->type,
            'description' => $request->description,
            'is_recurring' => $request->boolean('is_recurring', false),
        ]);

        return redirect()->route('admin.holidays.index')->with('success', 'Tatil başarıyla oluşturuldu.');
    }

    public function holidayEdit(\App\Models\Holiday $holiday)
    {
        $calendars = \App\Models\WorkCalendar::orderBy('name')->get(['id', 'name']);

        return inertia('Admin/Holidays/Edit', [
            'holiday' => $holiday,
            'calendars' => $calendars,
        ]);
    }

    public function holidayUpdate(Request $request, \App\Models\Holiday $holiday)
    {
        $request->validate([
            'work_calendar_id' => 'required|exists:work_calendars,id',
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:official,company',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
        ]);

        $updatedHoliday = $this->holidayService->update($holiday->id, [
            'work_calendar_id' => $request->work_calendar_id,
            'name' => $request->name,
            'date' => $request->date,
            'type' => $request->type,
            'description' => $request->description,
            'is_recurring' => $request->boolean('is_recurring', false),
        ]);

        return redirect()->route('admin.holidays.index')->with('success', 'Tatil başarıyla güncellendi.');
    }

    public function holidayDestroy(\App\Models\Holiday $holiday)
    {
        $deleted = $this->holidayService->delete($holiday->id);

        return redirect()->route('admin.holidays.index')->with('success', 'Tatil başarıyla silindi.');
    }
}
