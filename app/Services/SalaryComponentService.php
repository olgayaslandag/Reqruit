<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\ISalaryComponentRepository;
use App\Models\SalaryComponent;
use Illuminate\Database\Eloquent\Collection;

class SalaryComponentService
{
    public function __construct(
        protected ISalaryComponentRepository $salaryComponentRepository
    ) {}

    /**
     * Tüm maaş kalemlerini getirir.
     */
    public function getAll(array $filters = [], array $with = ['employeeSalaries'])
    {
        return $this->salaryComponentRepository->getAll($filters, $with);
    }

    /**
     * Paginated maaş kalemlerini getirir.
     */
    public function getPaginated(array $filters = [], array $with = [], int $perPage = 15)
    {
        return $this->salaryComponentRepository->getPaginated($filters, $with, $perPage);
    }

    /**
     * ID ile maaş kalemi getirir.
     */
    public function getById(int $id, array $with = [])
    {
        return $this->salaryComponentRepository->getById($id, $with);
    }

    /**
     * Kod ile maaş kalemi getirir.
     */
    public function getByCode(string $code)
    {
        return $this->salaryComponentRepository->getByCode($code);
    }

    /**
     * Maaş kalemi oluşturur.
     */
    public function create(array $data): SalaryComponent
    {
        // Kodun benzersiz olup olmadığını kontrol et
        if ($this->salaryComponentRepository->getByCode($data['code'])) {
            throw new \Exception('Bu kodla bir maaş kalemi zaten mevcut.');
        }

        return $this->salaryComponentRepository->create($data);
    }

    /**
     * Maaş kalemi günceller.
     */
    public function update(int $id, array $data): SalaryComponent
    {
        // Kod değişiyorsa benzersizlik kontrolü yap
        if (isset($data['code'])) {
            $existing = $this->salaryComponentRepository->getByCode($data['code']);
            if ($existing && $existing->id !== $id) {
                throw new \Exception('Bu kodla bir maaş kalemi zaten mevcut.');
            }
        }

        return $this->salaryComponentRepository->update($id, $data);
    }

    /**
     * Maaş kalemi siler.
     */
    public function delete(int $id): bool
    {
        return $this->salaryComponentRepository->delete($id);
    }

    /**
     * Aktif maaş kalemlerini getirir.
     */
    public function getActive(): Collection
    {
        return $this->salaryComponentRepository->getActive();
    }

    /**
     * Aktif kazanç kalemlerini getirir.
     */
    public function getEarnings(): Collection
    {
        return $this->salaryComponentRepository->getEarnings();
    }

    /**
     * Aktif kesinti kalemlerini getirir.
     */
    public function getDeductions(): Collection
    {
        return $this->salaryComponentRepository->getDeductions();
    }

    /**
     * Sabit kalemleri getirir.
     */
    public function getFixed(): Collection
    {
        return $this->salaryComponentRepository->getFixed();
    }

    /**
     * Değişken kalemleri getirir.
     */
    public function getVariable(): Collection
    {
        return $this->salaryComponentRepository->getVariable();
    }
}
