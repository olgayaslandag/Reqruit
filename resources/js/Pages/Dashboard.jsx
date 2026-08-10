import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import DashboardSection from '@/Components/DashboardSection';
import ReactApexChart from 'react-apexcharts';

const moneyFormatter = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

const statusLabels = {
    new: 'Yeni',
    reviewing: 'İnceleniyor',
    interview: 'Görüşmede',
    offer: 'Teklif',
    hired: 'İşe Alınan',
    rejected: 'Reddedilen',
};

export default function Dashboard({ recruitment, employees, attendance, leave, payroll, weeklySubmissions }) {
    const recruitmentData = recruitment || {};
    const employeesData = employees || {};
    const attendanceData = attendance || {};
    const leaveData = leave || {};
    const payrollData = payroll || {};
    const submissions = weeklySubmissions || [];

    const statusDistribution = recruitmentData.statusDistribution || [];
    const byDepartment = employeesData.byDepartment || [];
    const genderDistribution = employeesData.genderDistribution || [];
    const monthlyHires = employeesData.monthlyHires || [];
    const weeklyAttendance = attendanceData.weeklyAttendance || [];
    const typeDistribution = leaveData.typeDistribution || [];
    const monthlyPayrollTrend = payrollData.monthlyPayrollTrend || [];

    const formatMoney = (value) => `${moneyFormatter.format(value ?? 0)} ₺`;
    const formatPercent = (value) => `${(value ?? 0).toFixed(1)}%`;

    const employeeCards = [
        { label: 'Toplam Kayıt', value: employeesData.total ?? 0, icon: '📇', color: 'text-success', href: '/admin/employees' },
        { label: 'Aktif Çalışan', value: employeesData.active ?? 0, icon: '👥', color: 'text-success', href: '/admin/employees' },
        { label: 'Bu Ay İşe Alınan', value: employeesData.newHiresThisMonth ?? 0, icon: '➕', color: 'text-success', href: '/admin/employees' },
        { label: 'Bu Ay Ayrılan', value: employeesData.terminationsThisMonth ?? 0, icon: '➖', color: 'text-success', href: '/admin/employees' },
    ];

    const recruitmentCards = [
        { label: 'Toplam Başvuru', value: recruitmentData.total ?? 0, icon: '📝', color: 'text-primary', href: '/admin/submissions' },
        { label: 'Yeni', value: recruitmentData.new ?? 0, icon: '🆕', color: 'text-primary', href: '/admin/submissions' },
        { label: 'İnceleniyor', value: recruitmentData.reviewing ?? 0, icon: '🔍', color: 'text-primary', href: '/admin/submissions' },
        { label: 'Görüşmede', value: recruitmentData.interview ?? 0, icon: '🗣️', color: 'text-primary', href: '/admin/submissions' },
        { label: 'Teklif', value: recruitmentData.offer ?? 0, icon: '📨', color: 'text-primary', href: '/admin/submissions' },
        { label: 'İşe Alınan', value: recruitmentData.hired ?? 0, icon: '✅', color: 'text-primary', href: '/admin/submissions' },
        { label: 'Reddedilen', value: recruitmentData.rejected ?? 0, icon: '❌', color: 'text-primary', href: '/admin/submissions' },
        { label: 'Dönüşüm Oranı', value: formatPercent(recruitmentData.conversionRate), icon: '📈', color: 'text-primary', href: '/admin/submissions' },
    ];

    const attendanceCards = [
        { label: 'Bugün Present', value: attendanceData.todayPresent ?? 0, icon: '✅', color: 'text-warning', href: '/admin/attendance' },
        { label: 'Bugün Absent', value: attendanceData.todayAbsent ?? 0, icon: '❌', color: 'text-warning', href: '/admin/attendance' },
        { label: 'Bugün Geç Kalan', value: attendanceData.todayLate ?? 0, icon: '⏰', color: 'text-warning', href: '/admin/attendance' },
        { label: 'Bu Ay Fazla Mesai', value: attendanceData.monthlyOvertimeHours ?? 0, icon: '⏱️', color: 'text-warning', href: '/admin/attendance' },
    ];

    const leaveCards = [
        { label: 'Bekleyen Talep', value: leaveData.pending ?? 0, icon: '⏳', color: 'text-purple-500', href: '/admin/leave/requests' },
        { label: 'Aktif İzinli', value: leaveData.active ?? 0, icon: '🏖️', color: 'text-purple-500', href: '/admin/leave/requests' },
        { label: 'Bu Ay Onaylı', value: leaveData.approvedThisMonth ?? 0, icon: '✅', color: 'text-purple-500', href: '/admin/leave/requests' },
        { label: 'Reddedilen', value: leaveData.rejected ?? 0, icon: '❌', color: 'text-purple-500', href: '/admin/leave/requests' },
    ];

    const payrollCards = [
        { label: 'Son Bordro Toplamı', value: formatMoney(payrollData.latestPeriodTotal), icon: '💰', color: 'text-danger', href: '/admin/payrolls' },
        { label: 'Bekleyen Onay', value: payrollData.pendingApprovals ?? 0, icon: '⏳', color: 'text-danger', href: '/admin/payrolls' },
        { label: 'Bekleyen Avans', value: payrollData.pendingAdvances ?? 0, icon: '💳', color: 'text-danger', href: '/admin/advances' },
        { label: 'Bu Ay Ödenen Avans', value: formatMoney(payrollData.paidAdvancesThisMonth), icon: '💸', color: 'text-danger', href: '/admin/advances' },
    ];

    const menuItems = [
        { title: 'Başvurular', description: 'Gelen başvuruları görüntüle ve yönet', href: '/admin/submissions', icon: '📋' },
        { title: 'Formlar', description: 'Başvuru formlarını oluştur ve yönet', href: '/admin/forms', icon: '📝' },
        { title: 'Departmanlar', description: 'Departmanları yönet', href: '/admin/departments', icon: '🏢' },
        { title: 'Kalifiye Elemanlar', description: 'Aday havuzunu görüntüle', href: '/admin/candidates', icon: '⭐' },
        { title: 'Çalışanlar', description: 'Çalışan kayıtlarını yönet', href: '/admin/employees', icon: '👥' },
        { title: 'Devam Takibi', description: 'Günlük devam durumunu izle', href: '/admin/attendance', icon: '⏱️' },
        { title: 'İzin Talepleri', description: 'İzin taleplerini onayla', href: '/admin/leave/requests', icon: '🗓️' },
        { title: 'Bordrolar', description: 'Bordro ve maaş işlemleri', href: '/admin/payrolls', icon: '💰' },
    ];

    const statusDonutOptions = useMemo(() => ({
        chart: { type: 'donut', toolbar: { show: false } },
        labels: statusDistribution.map((item) => statusLabels[item.status] || item.status),
        colors: ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#6b7280'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Toplam',
                            formatter: () => String(recruitmentData.total ?? 0),
                        },
                    },
                },
            },
        },
    }), [statusDistribution, recruitmentData.total]);

    const statusDonutSeries = useMemo(
        () => statusDistribution.map((item) => item.count ?? 0),
        [statusDistribution],
    );

    const weeklyBarOptions = useMemo(() => ({
        chart: {
            type: 'bar',
            height: 300,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '70%',
                distributed: true,
            },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            categories: submissions.map((item) => item.label),
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            title: { text: 'Başvuru Sayısı' },
            min: 0,
        },
        colors: ['#3b82f6'],
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
        },
    }), [submissions]);

    const weeklyBarSeries = useMemo(
        () => [{ name: 'Başvurular', data: submissions.map((item) => item.count ?? 0) }],
        [submissions],
    );

    const employeeDonutData = byDepartment.length > 0 ? byDepartment : genderDistribution;

    const employeeDonutOptions = useMemo(() => ({
        chart: { type: 'donut', toolbar: { show: false } },
        labels: employeeDonutData.map((item) => item.department || item.gender),
        colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669', '#047857'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: false },
    }), [employeeDonutData]);

    const employeeDonutSeries = useMemo(
        () => employeeDonutData.map((item) => item.count ?? 0),
        [employeeDonutData],
    );

    const monthlyHiresOptions = useMemo(() => ({
        chart: { type: 'bar', height: 280, toolbar: { show: false } },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '60%',
                distributed: true,
            },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            categories: monthlyHires.map((item) => item.month),
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { min: 0 },
        colors: ['#10b981'],
        grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
    }), [monthlyHires]);

    const monthlyHiresSeries = useMemo(
        () => [{ name: 'İşe Alınan', data: monthlyHires.map((item) => item.count ?? 0) }],
        [monthlyHires],
    );

    const attendanceStackedOptions = useMemo(() => ({
        chart: { type: 'bar', height: 300, stacked: true, toolbar: { show: false } },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '55%',
                stacked: true,
            },
        },
        dataLabels: { enabled: false },
        legend: { position: 'bottom' },
        xaxis: {
            categories: weeklyAttendance.map((item) => item.day),
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { min: 0 },
        colors: ['#10b981', '#ef4444', '#f59e0b'],
        grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
    }), [weeklyAttendance]);

    const attendanceStackedSeries = useMemo(
        () => [
            { name: 'Gelen', data: weeklyAttendance.map((item) => item.present ?? 0) },
            { name: 'Gelmeyen', data: weeklyAttendance.map((item) => item.absent ?? 0) },
            { name: 'Geç Kalan', data: weeklyAttendance.map((item) => item.late ?? 0) },
        ],
        [weeklyAttendance],
    );

    const leaveDonutOptions = useMemo(() => ({
        chart: { type: 'donut', toolbar: { show: false } },
        labels: typeDistribution.map((item) => item.type),
        colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: false },
    }), [typeDistribution]);

    const leaveDonutSeries = useMemo(
        () => typeDistribution.map((item) => item.count ?? 0),
        [typeDistribution],
    );

    const payrollLineOptions = useMemo(() => ({
        chart: { type: 'line', height: 300, toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        dataLabels: { enabled: false },
        markers: { size: 5 },
        xaxis: {
            categories: monthlyPayrollTrend.map((item) => item.month),
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (value) => moneyFormatter.format(value ?? 0),
            },
        },
        colors: ['#ef4444'],
        grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
    }), [monthlyPayrollTrend]);

    const payrollLineSeries = useMemo(
        () => [{ name: 'Bordro Toplamı', data: monthlyPayrollTrend.map((item) => item.total ?? 0) }],
        [monthlyPayrollTrend],
    );

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-5">
                <div className="container-xl">
                    <div className="mb-4">
                        <h1 className="display-5 fw-bold text-dark">Hoş Geldiniz</h1>
                        <p className="fs-6 text-muted">İK Yönetim Platformu</p>
                    </div>

                    <DashboardSection title="Çalışanlar" subtitle="Çalışan istatistikleri ve dağılımlar" icon="👥">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
                            {employeeCards.map((card) => (
                                <div key={card.label} className="col">
                                    <StatCard {...card} />
                                </div>
                            ))}
                        </div>
                        <div className="row row-cols-1 row-cols-lg-2 g-3">
                            <div className="col">
                                <ReactApexChart options={employeeDonutOptions} series={employeeDonutSeries} type="donut" height={280} />
                            </div>
                            <div className="col">
                                <ReactApexChart options={monthlyHiresOptions} series={monthlyHiresSeries} type="bar" height={280} />
                            </div>
                        </div>
                    </DashboardSection>

                    <DashboardSection title="Başvurular" subtitle="Başvuru süreçleri ve dönüşüm" icon="📋">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
                            {recruitmentCards.map((card) => (
                                <div key={card.label} className="col">
                                    <StatCard {...card} />
                                </div>
                            ))}
                        </div>
                        <div className="row row-cols-1 row-cols-lg-2 g-3">
                            <div className="col">
                                <ReactApexChart options={statusDonutOptions} series={statusDonutSeries} type="donut" height={300} />
                            </div>
                            <div className="col">
                                <ReactApexChart options={weeklyBarOptions} series={weeklyBarSeries} type="bar" height={300} />
                            </div>
                        </div>
                    </DashboardSection>

                    <DashboardSection title="Devam Takibi" subtitle="Bugünkü devam durumu ve fazla mesai" icon="⏱️">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
                            {attendanceCards.map((card) => (
                                <div key={card.label} className="col">
                                    <StatCard {...card} />
                                </div>
                            ))}
                        </div>
                        <ReactApexChart options={attendanceStackedOptions} series={attendanceStackedSeries} type="bar" height={300} />
                    </DashboardSection>

                    <DashboardSection title="İzinler" subtitle="İzin talepleri ve dağılımı" icon="🗓️">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
                            {leaveCards.map((card) => (
                                <div key={card.label} className="col">
                                    <StatCard {...card} />
                                </div>
                            ))}
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <ReactApexChart options={leaveDonutOptions} series={leaveDonutSeries} type="donut" height={300} />
                            </div>
                        </div>
                    </DashboardSection>

                    <DashboardSection title="Bordro" subtitle="Bordro ve avans özeti" icon="💰">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
                            {payrollCards.map((card) => (
                                <div key={card.label} className="col">
                                    <StatCard {...card} />
                                </div>
                            ))}
                        </div>
                        <ReactApexChart options={payrollLineOptions} series={payrollLineSeries} type="line" height={300} />
                    </DashboardSection>

                    <DashboardSection title="Hızlı Erişim" subtitle="Sık kullanılan modüllere hızlı erişim" icon="⚡">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
                            {menuItems.map((item) => (
                                <div key={item.title} className="col">
                                    <Link
                                        href={item.href}
                                        className="bg-light card border-0 shadow-sm p-4 text-decoration-none h-100"
                                    >
                                        <div className="fs-2 mb-3 text-dark">{item.icon}</div>
                                        <h5 className="fw-medium">{item.title}</h5>
                                        <p className="small text-body-secondary mb-0">{item.description}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </DashboardSection>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}