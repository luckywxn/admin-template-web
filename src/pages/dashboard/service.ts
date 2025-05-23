import { request } from '@umijs/max';
import type { AnalysisData } from './data';

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request('/api/dashboard/analysisChartData', {
    method: 'POST',
  });
}
