import type { ECOption } from '@vben/plugins/echarts';

import { EchartsUI } from '@vben/plugins/echarts';

const hours = Array.from({ length: 18 }, (_, i) => `${new Intl.NumberFormat('fa-IR').format(i + 6)}:۰۰`);

const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

/** روند ترافیک */
export function AnalyticsTrends() {
  const options: ECOption = {
    grid: { bottom: 0, containLabel: true, left: '1%', right: '1%', top: '2%' },
    series: [
      {
        areaStyle: {},
        data: [111, 2000, 6000, 16_000, 33_333, 55_555, 64_000, 33_333, 18_000, 36_000, 70_000, 42_444, 23_222, 13_000, 8000, 4000, 1200, 333],
        itemStyle: { color: '#5ab1ef' },
        smooth: true,
        type: 'line',
      },
      {
        areaStyle: {},
        data: [33, 66, 88, 333, 3333, 6200, 20_000, 3000, 1200, 13_000, 22_000, 11_000, 2221, 1201, 390, 198, 60, 30],
        itemStyle: { color: '#019680' },
        smooth: true,
        type: 'line',
      },
    ],
    tooltip: { axisPointer: { lineStyle: { color: '#019680', width: 1 } }, trigger: 'axis' },
    xAxis: {
      axisTick: { show: false },
      boundaryGap: false,
      data: hours,
      splitLine: { lineStyle: { type: 'solid', width: 1 }, show: true },
      type: 'category',
    },
    yAxis: [{ axisTick: { show: false }, max: 80_000, splitArea: { show: true }, splitNumber: 4, type: 'value' }],
  };
  return <EchartsUI options={options} />;
}

/** بازدید ماهانه */
export function AnalyticsVisits() {
  const options: ECOption = {
    grid: { bottom: 0, containLabel: true, left: '1%', right: '1%', top: '2%' },
    series: [
      {
        barMaxWidth: 80,
        data: [3000, 2000, 3333, 5000, 3200, 4200, 3200, 2100, 3000, 5100, 6000, 3200],
        type: 'bar',
      },
    ],
    tooltip: { axisPointer: { lineStyle: { width: 1 } }, trigger: 'axis' },
    xAxis: { data: months, type: 'category' },
    yAxis: { max: 8000, splitNumber: 4, type: 'value' },
  };
  return <EchartsUI options={options} />;
}

/** داده‌های بازدید (رادار) */
export function AnalyticsVisitsData() {
  const options: ECOption = {
    legend: { bottom: 0, data: ['بازدید', 'روند'] },
    radar: {
      indicator: [
        { name: 'وب‌سایت' },
        { name: 'موبایل' },
        { name: 'iPad' },
        { name: 'کلاینت' },
        { name: 'برنامه‌ی کاربردی' },
        { name: 'سایر' },
      ],
      radius: '60%',
      splitNumber: 8,
    },
    series: [
      {
        areaStyle: { opacity: 1, shadowBlur: 0, shadowColor: 'rgba(0,0,0,.2)', shadowOffsetX: 0, shadowOffsetY: 10 },
        data: [
          { itemStyle: { color: '#b6a2de' }, name: 'بازدید', value: [90, 50, 86, 40, 50, 20] },
          { itemStyle: { color: '#5ab1ef' }, name: 'روند', value: [70, 75, 70, 76, 20, 85] },
        ],
        itemStyle: { borderRadius: 10, borderWidth: 2 },
        symbolSize: 0,
        type: 'radar',
      },
    ],
    tooltip: {},
  };
  return <EchartsUI options={options} />;
}

/** منبع بازدید (دونات) */
export function AnalyticsVisitsSource() {
  const options: ECOption = {
    legend: { bottom: '2%', left: 'center' },
    series: [
      {
        animationDelay() {
          return Math.random() * 100;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        avoidLabelOverlap: false,
        color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
        data: [
          { name: 'موتور جست‌وجو', value: 1048 },
          { name: 'ورود مستقیم', value: 735 },
          { name: 'ایمیل', value: 580 },
          { name: 'تبلیغات', value: 484 },
        ],
        emphasis: { label: { fontSize: '12', fontWeight: 'bold', show: true } },
        itemStyle: { borderRadius: 10, borderWidth: 2 },
        label: { position: 'center', show: false },
        labelLine: { show: false },
        name: 'منبع بازدید',
        radius: ['40%', '65%'],
        type: 'pie',
      },
    ],
    tooltip: { trigger: 'item' },
  };
  return <EchartsUI options={options} />;
}

/** فروش (گل سرخ) */
export function AnalyticsVisitsSales() {
  const options: ECOption = {
    series: [
      {
        animationDelay() {
          return Math.random() * 400;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        center: ['50%', '50%'],
        color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
        data: [
          { name: 'آنلاین', value: 500 },
          { name: 'حضوری', value: 310 },
          { name: 'نمایندگی', value: 274 },
          { name: 'سایر', value: 400 },
        ].toSorted((a, b) => a.value - b.value),
        name: 'منبع بازدید',
        radius: '80%',
        roseType: 'radius',
        type: 'pie',
      },
    ],
    tooltip: { trigger: 'item' },
  };
  return <EchartsUI options={options} />;
}
