<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ContractTypeEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\MaritalStatusEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RecentHiresSeeder extends Seeder
{
    public function run(): void
    {
        $existing = DB::table('employees')
            ->where('hire_date', '>', now()->subMonths(6)->toDateString())
            ->count();

        if ($existing > 0) {
            $this->command->info("Recent hires already seeded ({$existing}). Skipping.");

            return;
        }

        $departments = DB::table('departments')->pluck('id')->toArray();

        if (empty($departments)) {
            $this->command->warn('No departments found.');

            return;
        }

        $firstNames = ['Aslı', 'Berk', 'Ceren', 'Deniz', 'Ege', 'Feride', 'Görkem', 'Hande', 'Ilgın', 'Kaan', 'Lara', 'Mina', 'Naz', 'Ozan', 'Pelin', 'Rüzgar', 'Selin', 'Tuna', 'Yağmur', 'Zara'];
        $lastNames = ['Acar', 'Bilgin', 'Coşkun', 'Demirel', 'Ergin', 'Fidan', 'Güneş', 'Hakyemez', 'İnan', 'Koç', 'Levent', 'Mutlu', 'Narin', 'Oğuz', 'Polat', 'Sarı', 'Tekin', 'Uysal', 'Yalçın', 'Zeybek'];
        $positions = ['Uzman', 'Mühendis', 'Analist', 'Koordinatör', 'Temsilci', 'Asistan', 'Sorumlu'];
        $genders = [GenderEnum::MALE->value, GenderEnum::FEMALE->value];
        $employmentTypes = EmploymentTypeEnum::cases();
        $contractTypes = ContractTypeEnum::cases();
        $maritalStatuses = MaritalStatusEnum::cases();

        $employees = [];
        $usedEmails = [];

        // Her aya 4-5 işe alım olacak şekilde son 6 aya dağıt
        for ($monthOffset = 5; $monthOffset >= 0; $monthOffset--) {
            $count = rand(4, 5);
            $month = now()->subMonths($monthOffset);

            for ($i = 0; $i < $count; $i++) {
                $firstName = $firstNames[array_rand($firstNames)];
                $lastName = $lastNames[array_rand($lastNames)];
                $email = strtolower($firstName.'.'.$lastName.'@reqruitsistem.com');
                $email = $this->makeUniqueEmail($email, $usedEmails);

                $hireDate = $month->copy()->subDays($i * 2)->subDays(rand(0, 4));
                if ($hireDate->isFuture()) {
                    $hireDate = now()->copy()->subDays(rand(1, 20));
                }

                $employees[] = [
                    'identity_no' => $this->uniqueIdentityNo($employees),
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'birth_date' => now()->subYears(rand(24, 45))->subDays(rand(1, 300))->toDateString(),
                    'gender' => $genders[array_rand($genders)],
                    'phone' => '+90 5'.rand(30, 39).' '.rand(100, 999).' '.rand(1000, 9999),
                    'email' => $email,
                    'marital_status' => $maritalStatuses[array_rand($maritalStatuses)]->value,
                    'children_count' => rand(0, 2),
                    'hire_date' => $hireDate->toDateString(),
                    'position_title' => $positions[array_rand($positions)],
                    'department_id' => $departments[array_rand($departments)],
                    'employment_type' => $employmentTypes[array_rand($employmentTypes)]->value,
                    'contract_type' => $contractTypes[array_rand($contractTypes)]->value,
                    'termination_date' => null,
                    'termination_reason' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($employees, 100) as $chunk) {
            DB::table('employees')->insert($chunk);
        }

        $this->command->info('Created '.count($employees).' recent hires.');
    }

    private function makeUniqueEmail(string $email, array &$used): string
    {
        $base = $email;
        $i = 1;

        while (in_array($email, $used, true)) {
            $email = substr($base, 0, strpos($base, '@')).$i.'@'.substr($base, strpos($base, '@') + 1);
            $i++;
        }

        $used[] = $email;

        return $email;
    }

    private function uniqueIdentityNo(array $employees): string
    {
        do {
            $no = (string) rand(10000000000, 99999999999);
            $exists = DB::table('employees')->where('identity_no', $no)->exists()
                || in_array($no, array_column($employees, 'identity_no'), true);
        } while ($exists);

        return $no;
    }
}