<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // Create departments if not exist
        $departments = $this->createDepartments();

        // Seed employees - 200+
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
            ['title' => 'Proje Yönetimi', 'slug' => 'proye-yonetimi'],
            ['title' => 'Muhasebe', 'slug' => 'muhasebe'],
            ['title' => 'Satış', 'slug' => 'satıs'],
            ['title' => 'Pazarlama', 'slug' => 'pazarlama'],
            ['title' => 'Üretim', 'slug' => 'uretim'],
            ['title' => 'Müşteri Hizmetleri', 'slug' => 'musteri-hizmetleri'],
            ['title' => 'Ar-Ge', 'slug' => 'ar-ge'],
            ['title' => 'Finans', 'slug' => 'finans'],
        ];

        $departments = [];
        foreach ($departmentData as $data) {
            $department = Department::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
            $departments[$data['slug']] = $department;
        }

        return $departments;
    }

    private function seedEmployees(array $departments): array
    {
        $now = now();
        $employees = [];

        $firstNames = [
            'Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Ali', 'Burak', 'Cem', 'Deniz', 'Elif',
            'Ferdi', 'Gizem', 'Hakan', 'İpek', 'Kaan', 'Lale', 'Mert', 'Nesrin', 'Onur', 'Pınar',
            'Rıza', 'Sevda', 'Tolga', 'Umut', 'Vildan', 'Yasin', 'Zeynep', 'Barış', 'Can', 'Derya',
            'Eren', 'Funda', 'Gökhan', 'Hilal', 'İrem', 'Kadir', 'Leyla', 'Murat', 'Nermin', 'Orhan',
            'Serkan', 'Tuba', 'Ümit', 'Volkan', 'Yasemin', 'Zafer', 'Bahar', 'Cansu', 'Duygu', 'Emre',
            'Gamze', 'Hüseyin', 'Işıl', 'Jale', 'Kamil', 'Lütfiye', 'Mahmut', 'Nuri', 'Olcay', 'Peşin',
        ];

        $lastNames = [
            'Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Öztürk', 'Çelik', 'Erdoğan', 'Kurt', 'Özkan', 'Aydın',
            'Aktaş', 'Arslan', 'Baran', 'Bektaş', 'Bulut', 'Çakır', 'Çetin', 'Doğan', 'Erdem', 'Eroğlu',
            'Güneş', 'Karaca', 'Karahan', 'Köseoğlu', 'Metin', 'Mutlu', 'Nalbantoğlu', 'Oral', 'Özdemir', 'Sayar',
            'Sezen', 'Tan', 'Tekin', 'Turan', 'Uçar', 'Yavuz', 'Yıldız', 'Yücel', 'Zorlu', 'Sert',
            'Aksoy', 'Altun', 'Aydoğdu', 'Bayram', 'Bostancı', 'Cebeci', 'Duran', 'Eryılmaz', 'Güler', 'Işık',
        ];

        $positions = [
            'bilgi-teknolojileri' => ['Yazılım Geliştirici', 'Sistem Yöneticisi', 'Veritabanı Uzmanı', 'DevOps Mühendisi', 'Frontend Geliştirici', 'Backend Geliştirici', 'QA Engineer', 'IT Destek Uzmanı'],
            'insan-kaynaklari' => ['İK Uzmanı', 'İK Müdürü', 'İşe Alım Uzmanı', 'Eğitim ve Gelişim Uzmanı', 'İK Asistanı'],
            'proye-yonetimi' => ['Proje Yöneticisi', 'Proje Koordinatörü', 'Proje Asistanı', 'Planlama Uzmanı'],
            'muhasebe' => ['Muhasebe Uzmanı', 'Muhasebe Müdürü', 'Stajyer', 'Mali Müşavir', 'Bütçe Uzmanı'],
            'satıs' => ['Satış Temsilcisi', 'Satış Müdürü', 'Key Account Manager', 'Satış Destek Uzmanı'],
            'pazarlama' => ['Pazarlama Uzmanı', 'Dijital Pazarlama Uzmanı', 'İçerik Uzmanı', 'Grafik Tasarımcı', 'Marka Yöneticisi'],
            'uretim' => ['Üretim Mühendisi', 'Operatör', 'Kalite Kontrol Uzmanı', 'Üretim Şefi', 'Ambalajcı'],
            'musteri-hizmetleri' => ['Müşteri Temsilcisi', 'Müşteri Hizmetleri Müdürü', 'Şikayet Yöneticisi', 'Call Center Operatörü'],
            'ar-ge' => ['Ar-Ge Mühendisi', 'Araştırmacı', 'Ürün Geliştirme Uzmanı', 'Prototip Uzmanı'],
            'finans' => ['Finans Uzmanı', 'Finans Müdürü', 'Mali Analist', 'Yatırım Uzmanı', 'Banka ilişkileri Uzmanı'],
        ];

        $genders = ['male', 'female'];
        $maritalStatuses = ['single', 'married', 'widowed', 'divorced'];
        $employmentTypes = ['full_time', 'part_time', 'remote', 'hybrid'];
        $contractTypes = ['permanent', 'fixed_term', 'probation'];

        // Create 200 employees
        $employeeData = [];

        for ($i = 0; $i < 220; $i++) {
            $deptSlug = array_rand($departments);
            $dept = $departments[$deptSlug];
            $position = $positions[$deptSlug][array_rand($positions[$deptSlug])];

            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $gender = $genders[array_rand($genders)];
            $maritalStatus = $maritalStatuses[array_rand($maritalStatuses)];
            $employmentType = $employmentTypes[array_rand($employmentTypes)];
            $contractType = $contractTypes[array_rand($contractTypes)];

            // Random birth date between 1970 and 2002
            $birthYear = rand(1970, 2002);
            $birthMonth = rand(1, 12);
            $birthDay = rand(1, 28);
            $birthDate = sprintf('%04d-%02d-%02d', $birthYear, $birthMonth, $birthDay);

            // Random hire date between 2018 and 2024
            $hireYear = rand(2018, 2024);
            $hireMonth = rand(1, 12);
            $hireDay = rand(1, 28);
            $hireDate = sprintf('%04d-%02d-%02d', $hireYear, $hireMonth, $hireDay);

            $childrenCount = $maritalStatus === 'married' ? rand(0, 4) : 0;

            $employeeData[] = [
                'identity_no' => str_pad((string) rand(10000000000, 99999999999), 11, '0', STR_PAD_LEFT),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'birth_date' => $birthDate,
                'gender' => $gender,
                'phone' => '+90 5'.rand(30, 39).' '.rand(100, 999).' '.rand(1000, 9999),
                'email' => strtolower("$firstName.$lastName$i@company.com"),
                'marital_status' => $maritalStatus,
                'children_count' => $childrenCount,
                'hire_date' => $hireDate,
                'position_title' => $position,
                'department_id' => $dept->id,
                'employment_type' => $employmentType,
                'contract_type' => $contractType,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Bulk insert employees
        foreach (array_chunk($employeeData, 50) as $chunk) {
            DB::table('employees')->insert($chunk);
        }

        // Get created employees for relationship seeding
        $allEmployees = DB::table('employees')->get();

        // Create some manager relationships
        $deptEmployees = collect($allEmployees)->groupBy('department_id')->toArray();

        foreach ($deptEmployees as $deptId => $employees) {
            if (count($employees) > 1) {
                // First employee is manager
                $manager = $employees[0];
                $subordinates = array_slice($employees, 1, min(5, count($employees) - 1));

                foreach ($subordinates as $emp) {
                    DB::table('employees')
                        ->where('id', $emp->id)
                        ->update(['manager_id' => $manager->id]);
                }
            }
        }

        $this->command->info('Created '.count($employeeData).' employees');

        return $allEmployees->map(function ($emp) {
            return (array) $emp;
        })->keyBy('id')->toArray();
    }

    private function seedEducation(array $employees): void
    {
        $schools = [
            'İstanbul Teknik Üniversitesi', 'Boğaziçi Üniversitesi', 'Orta Doğu Teknik Üniversitesi',
            'Ankara Üniversitesi', 'İstanbul Üniversitesi', 'Marmara Üniversitesi',
            'Yeditepe Üniversitesi', 'Sabancı Üniversitesi', 'Koç Üniversitesi', 'Bilkent Üniversitesi',
            'Ege Üniversitesi', 'Dokuz Eylül Üniversitesi', 'Anadolu Üniversitesi',
        ];

        $departments = [
            'Bilgisayar Mühendisliği', 'Endüstri Mühendisliği', 'İşletme', 'İktisat', 'Hukuk',
            'Makine Mühendisliği', 'Elektrik-Elektronik Mühendisliği', 'İletişim', 'Psikoloji',
            'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Mimarlık', 'İç Mimarlık',
        ];

        $degrees = ['associate', 'bachelor', 'master', 'doctorate'];

        $educationData = [];

        // Add education for first 100 employees
        $employeeIds = array_slice(array_keys($employees), 0, 100);

        foreach ($employeeIds as $empId) {
            $degreeCount = rand(1, 2);
            for ($i = 0; $i < $degreeCount; $i++) {
                $gradYear = rand(2000, 2024);
                $educationData[] = [
                    'employee_id' => $empId,
                    'school_name' => $schools[array_rand($schools)],
                    'department' => $departments[array_rand($departments)],
                    'degree' => $degrees[array_rand($degrees)],
                    'graduation_year' => $gradYear,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($educationData, 50) as $chunk) {
            DB::table('employee_education')->insert($chunk);
        }

        $this->command->info('Created '.count($educationData).' education records');
    }

    private function seedCertificates(array $employees): void
    {
        $certificates = [
            ['name' => 'AWS Solutions Architect', 'institution' => 'Amazon Web Services'],
            ['name' => 'PMP', 'institution' => 'Project Management Institute'],
            ['name' => 'Scrum Master', 'institution' => 'Scrum Alliance'],
            ['name' => 'ISO 27001', 'institution' => 'BSI'],
            ['name' => 'Six Sigma Green Belt', 'institution' => 'ASQ'],
            ['name' => 'Google Analytics', 'institution' => 'Google'],
            ['name' => 'Microsoft Azure Administrator', 'institution' => 'Microsoft'],
            ['name' => 'CCNA', 'institution' => 'Cisco'],
            ['name' => 'ITIL Foundation', 'institution' => 'AXELOS'],
            ['name' => 'CEH', 'institution' => 'EC-Council'],
        ];

        $certificateData = [];

        // Add certificates for first 50 employees
        $employeeIds = array_slice(array_keys($employees), 0, 50);

        foreach ($employeeIds as $empId) {
            $certCount = rand(1, 3);
            for ($i = 0; $i < $certCount; $i++) {
                $cert = $certificates[array_rand($certificates)];
                $year = rand(2020, 2024);
                $month = rand(1, 12);
                $certificateData[] = [
                    'employee_id' => $empId,
                    'name' => $cert['name'],
                    'institution' => $cert['institution'],
                    'date' => sprintf('%04d-%02d-15', $year, $month),
                    'file_path' => 'certificates/'.strtolower(str_replace(' ', '-', $cert['name'])).'.pdf',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('employee_certificates')->insert($certificateData);

        $this->command->info('Created '.count($certificateData).' certificates');
    }

    private function seedPositionHistory(array $employees, array $departments): void
    {
        $positionHistoryData = [];

        // Add position history for first 30 employees
        $employeeIds = array_slice(array_keys($employees), 0, 30);

        foreach ($employeeIds as $empId) {
            $emp = $employees[$empId];
            $deptId = $emp['department_id'];

            // Current position
            $positionHistoryData[] = [
                'employee_id' => $empId,
                'position_title' => $emp['position_title'],
                'department_id' => $deptId,
                'start_date' => $emp['hire_date'],
                'end_date' => null,
                'description' => $emp['position_title'].' olarak görev yapıyor.',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Add previous position for some employees
            if (rand(0, 1)) {
                $hireYear = (int) date('Y', strtotime($emp['hire_date']));
                if ($hireYear > 2018) {
                    $positionHistoryData[] = [
                        'employee_id' => $empId,
                        'position_title' => 'Stajyer / Junior '.$emp['position_title'],
                        'department_id' => $deptId,
                        'start_date' => date('Y-m-d', strtotime($emp['hire_date'].' -1 year')),
                        'end_date' => $emp['hire_date'],
                        'description' => 'Stajyer olarak görev yaptı.',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        DB::table('employee_position_history')->insert($positionHistoryData);

        $this->command->info('Created '.count($positionHistoryData).' position history records');
    }
}
