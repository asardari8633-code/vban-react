import type {
  BarSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
} from 'echarts/charts';
import type {
  DatasetComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

import { BarChart, GaugeChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

export type ECOption = ComposeOption<
  | BarSeriesOption
  | DatasetComponentOption
  | GaugeSeriesOption
  | GridComponentOption
  | LineSeriesOption
  | PieSeriesOption
  | RadarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
>;

echarts.use([
  TitleComponent,
  PieChart,
  RadarChart,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkPointComponent,
]);

export default echarts;
