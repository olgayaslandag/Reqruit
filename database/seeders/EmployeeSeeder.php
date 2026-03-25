<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\EmployeeCertificate;
use App\Models\EmployeeEducation;
use App\Models\EmployeePositionHistory;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // Create departments if not exist
        $departments = $this->createDepartments();

        // Seed employees
        $employees = $this->seedEmployees($departments);

        // Seed employee education
        $this->seedEducation($employees);

        // Seed employee certificates
        $this->seedCertificates($employees);

        // Seed employee position history
        $this->seedPositionHistory($employees, $departments);
    }

    private function createDepartments(): array
    {
        $departmentData = [
            ['title' => 'Bilgi Teknolojileri', 'slug' => 'bilgi-teknolojileri'],
            ['title' => 'İnsan Kaynakları', 'slug' => 'insan-kaynaklari'],
            ['title' => 'Proje Yönetimi', 'slug' => 'proje-yonetimi'],
            ['title' => 'Muhasebe', 'slug' => 'muhasebe'],
        ];

        $departments = [];
        $slugs = ['bilgi-teknolojileri', 'insan-kaynaklari', 'proje-yonetimi', 'muhasebe'];
        
        foreach ($departmentData as $index => $data) {
            $department = Department::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
            $departments[$slugs[$index]] = $department;
        }

        return $departments;
    }

    private function seedEmployees(array $departments): array
    {
        $employees = [];

        // 1. Ahmet Yılmaz - Yazılım Geliştirici
        $employees['ahmet'] = Employee::create([
            'identity_no' => '12345678901',
            'first_name' => 'Ahmet',
            'last_name' => 'Yılmaz',
            'birth_date' => '1990-05-15',
            'gender' => 'male',
            'phone' => '+90 532 123 4567',
            'email' => 'ahmet.yilmaz@company.com',
            'marital_status' => 'married',
            'children_count' => 2,
            'hire_date' => '2022-01-10',
            'position_title' => 'Yazılım Geliştirici',
            'department_id' => $departments['bilgi-teknolojileri']->id,
            'employment_type' => 'full_time',
            'contract_type' => 'permanent',
        ]);

        // 2. Ayşe Demir - İK Uzmanı
        $employees['ayse'] = Employee::create([
            'identity_no' => '23456789012',
            'first_name' => 'Ayşe',
            'last_name' => 'Demir',
            'birth_date' => '1992-08-22',
            'gender' => 'female',
            'phone' => '+90 532 234 5678',
            'email' => 'ayse.demir@company.com',
            'marital_status' => 'single',
            'children_count' => 0,
            'hire_date' => '2021-03-15',
            'position_title' => 'İK Uzmanı',
            'department_id' => $departments['insan-kaynaklari']->id,
            'employment_type' => 'full_time',
            'contract_type' => 'permanent',
        ]);

        // 3. Mehmet Kaya - Proje Yöneticisi
        $employees['mehmet'] = Employee::create([
            'identity_no' => '34567890123',
            'first_name' => 'Mehmet',
            'last_name' => 'Kaya',
            'birth_date' => '1985-12-03',
            'gender' => 'male',
            'phone' => '+90 532 345 6789',
            'email' => 'mehmet.kaya@company.com',
            'marital_status' => 'married',
            'children_count' => 1,
            'hire_date' => '2020-06-01',
            'position_title' => 'Proje Yöneticisi',
            'department_id' => $departments['proje-yonetimi']->id,
            'employment_type' => 'hybrid',
            'contract_type' => 'permanent',
            'manager_id' => null,
        ]);

        // 4. Fatma Şahin - Muhasebe Uzmanı
        $employees['fatma'] = Employee::create([
            'identity_no' => '45678901234',
            'first_name' => 'Fatma',
            'last_name' => 'Şahin',
            'birth_date' => '1988-03-18',
            'gender' => 'female',
            'phone' => '+90 532 456 7890',
            'email' => 'fatma.sahin@company.com',
            'marital_status' => 'widowed',
            'children_count' => 0,
            'hire_date' => '2023-09-01',
            'position_title' => 'Muhasebe Uzmanı',
            'department_id' => $departments['muhasebe']->id,
            'employment_type' => 'part_time',
            'contract_type' => 'fixed_term',
        ]);

        // 5. Ali Öztürk - Stajyer
        $employees['ali'] = Employee::create([
            'identity_no' => '56789012345',
            'first_name' => 'Ali',
            'last_name' => 'Öztürk',
            'birth_date' => '2000-07-10',
            'gender' => 'male',
            'phone' => '+90 532 567 8901',
            'email' => 'ali.ozturk@company.com',
            'marital_status' => 'single',
            'children_count' => 0,
            'hire_date' => '2024-01-15',
            'position_title' => 'Stajyer',
            'department_id' => $departments['bilgi-teknolojileri']->id,
            'employment_type' => 'full_time',
            'contract_type' => 'probation',
            'manager_id' => $employees['ahmet']->id,
        ]);

        return $employees;
    }

    private function seedEducation(array $employees): void
    {
        // Ahmet Yılmaz - Bilgisayar Mühendisliği Lisans
        EmployeeEducation::create([
            'employee_id' => $employees['ahmet']->id,
            'school_name' => 'İstanbul Teknik Üniversitesi',
            'department' => 'Bilgisayar Mühendisliği',
            'degree' => 'bachelor',
            'graduation_year' => 2014,
        ]);

        // Ayşe Demir - İşletme Lisans + İK Yüksek Lisans
        EmployeeEducation::create([
            'employee_id' => $employees['ayse']->id,
            'school_name' => 'Ankara Üniversitesi',
            'department' => 'İşletme',
            'degree' => 'bachelor',
            'graduation_year' => 2016,
        ]);

        EmployeeEducation::create([
            'employee_id' => $employees['ayse']->id,
            'school_name' => 'İstanbul Üniversitesi',
            'department' => 'İnsan Kaynakları Yönetimi',
            'degree' => 'master',
            'graduation_year' => 2019,
        ]);

        // Mehmet Kaya - Endüstri Mühendisliği Lisans
        EmployeeEducation::create([
            'employee_id' => $employees['mehmet']->id,
            'school_name' => 'Orta Doğu Teknik Üniversitesi',
            'department' => 'Endüstri Mühendisliği',
            'degree' => 'bachelor',
            'graduation_year' => 2008,
        ]);

        // Fatma Şahin - İktisat Lisans
        EmployeeEducation::create([
            'employee_id' => $employees['fatma']->id,
            'school_name' => 'Marmara Üniversitesi',
            'department' => 'İktisat',
            'degree' => 'bachelor',
            'graduation_year' => 2012,
        ]);

        // Ali Öztürk - Bilgisayar Programcılığı Önlisans (devam ediyor)
        EmployeeEducation::create([
            'employee_id' => $employees['ali']->id,
            'school_name' => 'Anadolu Üniversitesi',
            'department' => 'Bilgisayar Programcılığı',
            'degree' => 'associate',
            'graduation_year' => null, // Devam ediyor
        ]);
    }

    private function seedCertificates(array $employees): void
    {
        // Ahmet Yılmaz - AWS Solutions Architect
        EmployeeCertificate::create([
            'employee_id' => $employees['ahmet']->id,
            'name' => 'AWS Solutions Architect',
            'institution' => 'Amazon Web Services',
            'date' => '2023-06-15',
            'file_path' => 'certificates/aws-solutions-architect.pdf',
        ]);

        // Mehmet Kaya - PMP
        EmployeeCertificate::create([
            'employee_id' => $employees['mehmet']->id,
            'name' => 'Project Management Professional (PMP)',
            'institution' => 'Project Management Institute',
            'date' => '2021-03-20',
            'file_path' => 'certificates/pmp-certificate.pdf',
        ]);
    }

    private function seedPositionHistory(array $employees, array $departments): void
    {
        // Mehmet Kaya - Pozisyon geçmişi
        // 2020-2022 Yazılım Takım Lideri
        EmployeePositionHistory::create([
            'employee_id' => $employees['mehmet']->id,
            'position_title' => 'Yazılım Takım Lideri',
            'department_id' => $departments['bilgi-teknolojileri']->id,
            'start_date' => '2020-06-01',
            'end_date' => '2022-05-31',
            'description' => 'Yazılım ekibinin liderliğini üstlendi.',
        ]);

        // 2022+ Proje Yöneticisi
        EmployeePositionHistory::create([
            'employee_id' => $employees['mehmet']->id,
            'position_title' => 'Proje Yöneticisi',
            'department_id' => $departments['proje-yonetimi']->id,
            'start_date' => '2022-06-01',
            'end_date' => null,
            'description' => 'Proje yönetimi departmanını yönetiyor.',
        ]);

        // Ahmet Yılmaz - Pozisyon geçmişi
        EmployeePositionHistory::create([
            'employee_id' => $employees['ahmet']->id,
            'position_title' => 'Yazılım Geliştirici',
            'department_id' => $departments['bilgi-teknolojileri']->id,
            'start_date' => '2022-01-10',
            'end_date' => null,
            'description' => 'Backend geliştirme.',
        ]);
    }
}
