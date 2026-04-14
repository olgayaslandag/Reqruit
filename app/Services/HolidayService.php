<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\IHolidayRepository;
use App\Models\Holiday;
use App\Models\WorkCalendar;

class HolidayService
{
    public function __construct(
        protected IHolidayRepository $holidayRepository,
    ) {}

    public function create(array $data): Holiday
    {
        $calendar = WorkCalendar::findOrFail($data['work_calendar_id']);

        return $this->holidayRepository->create($data);
    }

    public function update(int $id, array $data): Holiday
    {
        $this->validateHolidayData($data);

        $calendar = WorkCalendar::findOrFail($data['work_calendar_id']);

        return $this->holidayRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->holidayRepository->delete($id);
    }

    public function findById(int $id, array $with = ['workCalendar']): ?Holiday
    {
        return $this->holidayRepository->find($id, $with);
    }

    public function findByIdOrFail(int $id, array $with = ['workCalendar']): Holiday
    {
        return $this->holidayRepository->findOrFail($id, $with);
    }

    public function getPaginated(array $filters = [], array $with = ['workCalendar'], int $perPage = 15)
    {
        return $this->holidayRepository->getPaginated($filters, $with, $perPage);
    }

    private function validateHolidayData(array $data): void
    {
        // Add any specific validation for holiday creation / updating
        $workCalendar = WorkCalendar::find($data['work_calendar_id']);
        if (! $workCalendar) {
            throw new \Exception('Work calendar not found');
        }
    }
}
