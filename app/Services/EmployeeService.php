<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\IEmployeeRepository;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use App\Models\EmployeeEducation;
use App\Models\EmployeePositionHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{
    protected array $allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
    ];

    protected int $maxFileSize = 5 * 1024 * 1024; // 5MB

    public function __construct(
        protected IEmployeeRepository $employeeRepository
    ) {}

    /**
     * Tüm employee'ları getirir.
     */
    public function getAll(array $filters = [], array $with = ['department', 'manager'])
    {
        return $this->employeeRepository->getAll($filters, $with);
    }

    /**
     * Paginated employee'ları getirir.
     */
    public function getPaginated(array $filters = [], array $with = ['department', 'manager'], int $perPage = 15)
    {
        return $this->employeeRepository->getPaginated($filters, $with, $perPage);
    }

    /**
     * ID ile employee getirir.
     */
    public function getById(int $id, array $with = ['department', 'manager', 'education', 'certificates', 'documents', 'positionHistory.department'])
    {
        return $this->employeeRepository->getById($id, $with);
    }

    /**
     * Employee oluşturur.
     */
    public function create(array $data): Employee
    {
        return \DB::transaction(function () use ($data) {
            // TC Kimlik no unique kontrolü
            if ($this->employeeRepository->getByIdentityNo($data['identity_no'])) {
                throw new \Exception('Bu TC Kimlik numarasına sahip bir çalışan zaten mevcut.');
            }

            $employee = $this->employeeRepository->create($data);
            \Cache::forget('employees.dropdown.active');
            \Cache::forget('employees.tree');

            return $employee;
        });
    }

    /**
     * Employee günceller.
     */
    public function update(int $id, array $data): Employee
    {
        return \DB::transaction(function () use ($id, $data) {
            // TC Kimlik no unique kontrolü (kendi hariç)
            if (isset($data['identity_no'])) {
                $existing = $this->employeeRepository->getByIdentityNo($data['identity_no']);
                if ($existing && $existing->id !== $id) {
                    throw new \Exception('Bu TC Kimlik numarasına sahip başka bir çalışan mevcut.');
                }
            }

            $employee = $this->employeeRepository->update($id, $data);
            \Cache::forget('employees.dropdown.active');
            \Cache::forget('employees.tree');

            return $employee;
        });
    }

    /**
     * Employee siler (soft delete).
     */
    public function delete(int $id): bool
    {
        return \DB::transaction(function () use ($id) {
            $result = $this->employeeRepository->delete($id);
            \Cache::forget('employees.dropdown.active');
            \Cache::forget('employees.tree');

            return $result;
        });
    }

    /**
     * Employee araması yapar.
     */
    public function search(string $keyword, array $with = ['department'])
    {
        return $this->employeeRepository->search($keyword, $with);
    }

    /**
     * Manager-Subordinate hiyerarşik tree yapısı getirir.
     */
    public function getTree()
    {
        return $this->employeeRepository->getTree();
    }

    /**
     * Employee doküman yükler.
     *
     * @throws \Exception
     */
    public function uploadDocument(int $employeeId, \Illuminate\Http\UploadedFile $file, string $documentType): \App\Models\EmployeeDocument
    {
        return \DB::transaction(function () use ($employeeId, $file, $documentType) {
            // Dosya tipi kontrolü
            if (! in_array($file->getMimeType(), $this->allowedMimeTypes)) {
                throw new \Exception('Sadece PDF, JPG ve PNG dosyaları yüklenebilir.');
            }

            // Dosya boyutu kontrolü
            if ($file->getSize() > $this->maxFileSize) {
                throw new \Exception('Dosya boyutu maksimum 5MB olabilir.');
            }

            $employee = $this->employeeRepository->getById($employeeId);
            if (! $employee) {
                throw new \Exception('Çalışan bulunamadı.');
            }

            // Storage path: storage/app/employees/{employee_id}/documents/
            $path = $file->store("employees/{$employeeId}/documents", 'local');

            return EmployeeDocument::create([
                'employee_id' => $employeeId,
                'document_type' => $documentType,
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ]);
        });
    }

    /**
     * Employee doküman siler.
     *
     * @throws \Exception
     */
    public function deleteDocument(int $documentId): bool
    {
        return \DB::transaction(function () use ($documentId) {
            $document = \App\Models\EmployeeDocument::find($documentId);
            if (! $document) {
                throw new \Exception('Doküman bulunamadı.');
            }

            // Dosyayı storage'dan sil
            if ($document->file_path && \Illuminate\Support\Facades\Storage::disk('local')->exists($document->file_path)) {
                \Illuminate\Support\Facades\Storage::disk('local')->delete($document->file_path);
            }

            return $document->delete();
        });
    }

    /**
     * Pozisyon geçmişi ekler.
     */
    public function addPosition(int $employeeId, array $data): \App\Models\EmployeePositionHistory
    {
        return \DB::transaction(function () use ($employeeId, $data) {
            $employee = $this->employeeRepository->getById($employeeId);
            if (! $employee) {
                throw new \Exception('Çalışan bulunamadı.');
            }

            return EmployeePositionHistory::create([
                'employee_id' => $employeeId,
                'position_title' => $data['position_title'],
                'department_id' => $data['department_id'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'description' => $data['description'] ?? null,
            ]);
        });
    }

    /**
     * Employee işten çıkarma (terminate).
     *
     * @throws \Exception
     */
    public function terminate(int $employeeId, array $data): Employee
    {
        return \DB::transaction(function () use ($employeeId, $data) {
            $employee = $this->employeeRepository->getById($employeeId);
            if (! $employee) {
                throw new \Exception('Çalışan bulunamadı.');
            }

            if ($employee->trashed()) {
                throw new \Exception('Bu çalışan zaten işten çıkarılmış.');
            }

            return $this->employeeRepository->update($employeeId, [
                'termination_date' => $data['termination_date'],
                'termination_reason' => $data['termination_reason'],
            ]);
        });
    }

    /**
     * Employee'a eğitim bilgisi ekler.
     *
     * @throws \Exception
     */
    public function storeEducation(int $employeeId, array $data): \App\Models\EmployeeEducation
    {
        return \DB::transaction(function () use ($employeeId, $data) {
            $employee = $this->employeeRepository->getById($employeeId);
            if (! $employee) {
                throw new \Exception('Çalışan bulunamadı.');
            }

            return EmployeeEducation::create([
                'employee_id' => $employeeId,
                'school_name' => $data['school_name'],
                'department' => $data['department'] ?? null,
                'degree' => $data['degree'],
                'graduation_year' => $data['graduation_year'] ?? null,
            ]);
        });
    }

    /**
     * Employee'ın eğitim bilgilerini toplu ekler (store işlemi için).
     *
     * @throws \Exception
     */
    public function storeEducations(int $employeeId, array $educations): array
    {
        return \DB::transaction(function () use ($employeeId, $educations) {
            $employee = $this->employeeRepository->getById($employeeId);
            if (! $employee) {
                throw new \Exception('Çalışan bulunamadı.');
            }

            $created = [];
            foreach ($educations as $edu) {
                $created[] = EmployeeEducation::create([
                    'employee_id' => $employeeId,
                    'school_name' => $edu['school_name'],
                    'department' => $edu['department'] ?? null,
                    'degree' => $edu['degree'],
                    'graduation_year' => $edu['graduation_year'] ?? null,
                ]);
            }

            return $created;
        });
    }

    /**
     * Employee'ın eğitim bilgilerini günceller.
     *
     * @throws \Exception
     */
    public function updateEducations(int $employeeId, array $educations): array
    {
        return \DB::transaction(function () use ($employeeId, $educations) {
            $employee = $this->employeeRepository->getById($employeeId);
            if (! $employee) {
                throw new \Exception('Çalışan bulunamadı.');
            }

            // Mevcut eğitimleri sil
            $employee->education()->delete();

            // Yeni eğitimleri ekle
            $created = [];
            foreach ($educations as $edu) {
                $created[] = EmployeeEducation::create([
                    'employee_id' => $employeeId,
                    'school_name' => $edu['school_name'],
                    'department' => $edu['department'] ?? null,
                    'degree' => $edu['degree'],
                    'graduation_year' => $edu['graduation_year'] ?? null,
                ]);
            }

            return $created;
        });
    }

    /**
     * İzin verilen mime tiplerini döndürür.
     */
    public function getAllowedMimeTypes(): array
    {
        return $this->allowedMimeTypes;
    }

    /**
     * Max dosya boyutunu döndürür.
     */
    public function getMaxFileSize(): int
    {
        return $this->maxFileSize;
    }

    /**
     * Yeni employee oluşturur (transaction ile birlikte).
     */
    public function createWithEducation(array $data, array $educationData = []): Employee
    {
        DB::beginTransaction();
        try {
            // Employee oluştur
            $employee = $this->create($data);

            // Eğitim bilgilerini ekle
            if (! empty($educationData)) {
                $this->storeEducations($employee->id, $educationData);
            }

            DB::commit();

            return $employee;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Employee günceller (transaction ile birlikte).
     */
    public function updateWithEducation(int $employeeId, array $data, array $educationData = []): Employee
    {
        DB::beginTransaction();
        try {
            // Employee güncelle
            $employee = $this->update($employeeId, $data);

            // Eğitim bilgilerini güncelle (varsa)
            if (! empty($educationData)) {
                $this->updateEducations($employee->id, $educationData);
            }

            DB::commit();

            return $employee;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
