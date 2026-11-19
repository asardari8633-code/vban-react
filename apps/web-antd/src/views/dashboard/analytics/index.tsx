import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import { AnalysisChartCard, AnalysisChartsTabs, AnalysisOverview } from '@vben/common-ui';
import { SvgBellIcon, SvgCakeIcon, SvgCardIcon, SvgDownloadIcon } from '@vben/icons';

import {
  AnalyticsTrends,
  AnalyticsVisits,
  AnalyticsVisitsData,
  AnalyticsVisitsSales,
  AnalyticsVisitsSource,
} from './charts';

const overviewItems: AnalysisOverviewItem[] = [
  { icon: SvgCardIcon, title: 'کاربران', totalTitle: 'کل کاربران', totalValue: 120_000, value: 2000 },
  { icon: SvgCakeIcon, title: 'بازدیدها', totalTitle: 'کل بازدیدها', totalValue: 500_000, value: 20_000 },
  { icon: SvgDownloadIcon, title: 'دانلودها', totalTitle: 'کل دانلودها', totalValue: 120_000, value: 8000 },
  { icon: SvgBellIcon, title: 'استفاده', totalTitle: 'کل استفاده', totalValue: 50_000, value: 5000 },
];

const chartTabs: TabOption[] = [
  { label: 'روند ترافیک', value: 'trends' },
  { label: 'بازدید ماهانه', value: 'visits' },
];

/**
 * داشبورد تحلیل‌ها
 */
export default function Analytics() {
  return (
    <div className="p-5">
      <AnalysisOverview items={overviewItems} />
      <AnalysisChartsTabs
        className="mt-5"
        renderTab={(value) => (value === 'trends' ? <AnalyticsTrends /> : <AnalyticsVisits />)}
        tabs={chartTabs}
      />
      <div className="mt-5 w-full gap-4 md:flex">
        <AnalysisChartCard className="mt-5 md:mt-0 md:w-1/3" title="تعداد بازدید">
          <AnalyticsVisitsData />
        </AnalysisChartCard>
        <AnalysisChartCard className="mt-5 md:mt-0 md:w-1/3" title="منبع بازدید">
          <AnalyticsVisitsSource />
        </AnalysisChartCard>
        <AnalysisChartCard className="mt-5 md:mt-0 md:w-1/3" title="کانال فروش">
          <AnalyticsVisitsSales />
        </AnalysisChartCard>
      </div>
    </div>
  );
}
