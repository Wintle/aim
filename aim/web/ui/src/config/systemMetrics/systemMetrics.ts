import { systemMetricsDictType } from 'types/utils/formatSystemMetricName';

export const systemMetricsDict: systemMetricsDictType = {
  __system__cpu: 'CPU (%)',
  __system__p_memory_percent: 'Process Memory (%)',
  __system__memory_percent: 'Memory (%)',
  __system__disk_percent: 'Disk (%)',
  __system__gpu: 'GPU (%)',
  __system__gpu_memory_percent: 'GPU Memory (%)',
  __system__gpu_power_watts: 'GPU Power (W)',
  __system__gpu_temp: 'GPU Temperature (°C)',
  __system__npu_chip_id: 'NPU Chip ID',
  __system__npu_power: 'NPU Power (W)',
  __system__npu_temperature: 'NPU Temperature (°C)',
  __system__npu_ai_core_percent: 'NPU AI Core (%)',
  __system__npu_ai_cpu_percent: 'NPU AI CPU (%)',
  __system__npu_ctrl_cpu_percent: 'NPU Control CPU (%)',
  __system__npu_memory_percent: 'NPU Memory (%)',
  __system__npu_memory_bw_percent: 'NPU Memory Bandwidth (%)',
};
