export interface SystemHealth {
  overall: 'healthy' | 'unhealthy';
  database: string;
  redis: string;
  ai_agent: string;
  malware_scanner: string;
}
