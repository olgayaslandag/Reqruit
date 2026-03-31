'use strict';

// Türkçe para formatlama fonksiyonu
function formatMoney(amount) {
    if (isNaN(amount)) return '0,00₺';
    const num = parseFloat(amount) || 0;
    const rounded = Math.round(num * 100) / 100;
    const parts = rounded.toString().split('.');
    let integerPart = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (parts.length > 1) {
        let decimalPart = parts[1].substring(0, 2);
        return integerPart + ',' + decimalPart + '₺';
    }
    return integerPart + ',00₺';
}

// DOM yüklendiğinde chartları başlat
document.addEventListener('DOMContentLoaded', function() {
    // Dashboard verilerini al
    const dashboardData = window.dashboardData || {};

    const monthlyIncome = dashboardData.monthlyIncome || 0;
    const monthlyExpense = dashboardData.monthlyExpense || 0;
    const totalCashAndBank = dashboardData.totalCashAndBank || 0;

    // Net kâr hesapla
    const netProfit = monthlyIncome - monthlyExpense;

    // 1. HAFTALIK GELİR/GİDER CHART (#visitor-chart)
    const visitorChartEl = document.getElementById('visitor-chart');
    if (visitorChartEl) {
        // Haftalık veri oluştur (örnek - gerçek verilerle değiştirilebilir)
        const weeklyIncome = [
            Math.round(monthlyIncome / 7),
            Math.round(monthlyIncome / 7 * 1.1),
            Math.round(monthlyIncome / 7 * 0.9),
            Math.round(monthlyIncome / 7 * 1.2),
            Math.round(monthlyIncome / 7 * 1.1),
            Math.round(monthlyIncome / 7 * 0.8),
            Math.round(monthlyIncome / 7 * 0.7)
        ];

        const weeklyExpense = [
            Math.round(monthlyExpense / 7),
            Math.round(monthlyExpense / 7 * 1.1),
            Math.round(monthlyExpense / 7 * 0.9),
            Math.round(monthlyExpense / 7 * 1.2),
            Math.round(monthlyExpense / 7 * 1.1),
            Math.round(monthlyExpense / 7 * 0.8),
            Math.round(monthlyExpense / 7 * 0.7)
        ];

        const visitorChartOptions = {
            chart: {
                height: 450,
                type: 'area',
                toolbar: { show: false }
            },
            dataLabels: { enabled: false },
            colors: ['#2ecc71', '#e74c3c'],
            series: [
                {
                    name: 'Gelir',
                    data: weeklyIncome
                },
                {
                    name: 'Gider',
                    data: weeklyExpense
                }
            ],
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                categories: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz']
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return formatMoney(val);
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: function(val) {
                        return formatMoney(val);
                    }
                }
            }
        };

        new ApexCharts(visitorChartEl, visitorChartOptions).render();
    }

    // 2. AYLIK GELİR/GİDER CHART (#visitor-chart-1)
    const visitorChart1El = document.getElementById('visitor-chart-1');
    if (visitorChart1El) {
        const monthlyChartOptions = {
            chart: {
                height: 450,
                type: 'area',
                toolbar: { show: false }
            },
            dataLabels: { enabled: false },
            colors: ['#2ecc71', '#e74c3c'],
            series: [
                {
                    name: 'Gelir',
                    data: [
                        Math.round(monthlyIncome * 0.8),
                        Math.round(monthlyIncome * 0.9),
                        monthlyIncome
                    ]
                },
                {
                    name: 'Gider',
                    data: [
                        Math.round(monthlyExpense * 0.8),
                        Math.round(monthlyExpense * 0.9),
                        monthlyExpense
                    ]
                }
            ],
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                categories: ['Önceki Ay', 'Geçen Ay', 'Bu Ay']
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return formatMoney(val);
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: function(val) {
                        return formatMoney(val);
                    }
                }
            }
        };

        new ApexCharts(visitorChart1El, monthlyChartOptions).render();
    }

    // 3. NET KÂR CHART (#income-overview-chart)
    const incomeOverviewEl = document.getElementById('income-overview-chart');
    if (incomeOverviewEl) {
        const incomeOverviewOptions = {
            chart: {
                type: 'bar',
                height: 365,
                toolbar: { show: false }
            },
            colors: ['#0d6efd'],
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    borderRadius: 4
                }
            },
            dataLabels: { enabled: false },
            series: [{
                name: 'Net Kâr',
                data: [
                    Math.round(netProfit * 0.6),
                    Math.round(netProfit * 0.8),
                    Math.round(netProfit * 0.9),
                    Math.round(netProfit * 1.0),
                    Math.round(netProfit * 1.1),
                    netProfit
                ]
            }],
            xaxis: {
                categories: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: { show: false },
            grid: { show: false },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return formatMoney(val);
                    }
                }
            }
        };

        new ApexCharts(incomeOverviewEl, incomeOverviewOptions).render();
    }

    // 4. NAKİT AKIŞI TREND CHART (#analytics-report-chart)
    const analyticsChartEl = document.getElementById('analytics-report-chart');
    if (analyticsChartEl) {
        const analyticsChartOptions = {
            chart: {
                type: 'line',
                height: 340,
                toolbar: { show: false }
            },
            colors: ['#f39c12'],
            stroke: {
                curve: 'smooth',
                width: 2
            },
            grid: {
                strokeDashArray: 4
            },
            series: [{
                name: 'Nakit Akışı',
                data: [
                    Math.round(totalCashAndBank * 0.5),
                    Math.round(totalCashAndBank * 0.6),
                    Math.round(totalCashAndBank * 0.7),
                    Math.round(totalCashAndBank * 0.8),
                    Math.round(totalCashAndBank * 0.9),
                    Math.round(totalCashAndBank)
                ]
            }],
            xaxis: {
                categories: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: { show: false },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return formatMoney(val);
                    }
                }
            }
        };

        new ApexCharts(analyticsChartEl, analyticsChartOptions).render();
    }
});
