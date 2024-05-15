import threading
import time
from signal import signal

import pexpect
import sys

from pexpect import ExceptionPexpect

from aim.storage.types import Singleton

_DEFAULT_COMMAND = "npu-smi info watch -s ptaicmb"

_NPU_MONITOR_ENABLED = True
class NpuInfo:
    def __init__(self, chip_id, power, temperature, ai_core, ai_cpu, ctrl_cpu, memory, memory_bw):
        self.chip_id = chip_id
        self.power = power
        self.temperature = temperature
        self.ai_core = ai_core
        self.ai_cpu = ai_cpu
        self.ctrl_cpu = ctrl_cpu
        self.memory = memory
        self.memory_bw = memory_bw

    def __repr__(self):
        return (f"NpuInfo(chip_id={self.chip_id}, power={self.power}, temperature={self.temperature}, "
                f"ai_core={self.ai_core}, ai_cpu={self.ai_cpu}, ctrl_cpu={self.ctrl_cpu}, "
                f"memory={self.memory}, memory_bw={self.memory_bw})")

class NpuMonitor:
    def __init__(self, command = _DEFAULT_COMMAND):
        self.command = command
        self.latest_data = {}
        self.lock = threading.Lock()
        self.thread = threading.Thread(target=self._run)
        self.thread.daemon = True
        self.thread.start()

    def _parse_line(self, line):
        sys.stdout.flush()
        parts = line.split()
        if len(parts) >= 9:  # 调整为至少9个部分
            try:
                npu_id = int(parts[0])
                chip_id = int(parts[1])
                power = float(parts[2])
                temperature = int(parts[3])
                ai_core = int(parts[4]) / 100.0
                ai_cpu = int(parts[5]) / 100.0
                ctrl_cpu = int(parts[6]) / 100.0
                memory = int(parts[7]) / 100.0
                memory_bw = int(parts[8]) / 100.0
                return npu_id, NpuInfo(chip_id, power, temperature, ai_core, ai_cpu, ctrl_cpu, memory, memory_bw)
            except ValueError as e:
                print(f"WARN: ValueError while parsing line: {line} with error: {e}")
                sys.stdout.flush()
                _NPU_MONITOR_ENABLED = False
                return None
        else:
            sys.stdout.flush()
        return None

    def _run(self):
        sys.stdout.flush()
        try:
            process = pexpect.spawn(self.command, encoding='utf-8')
            _NPU_MONITOR_ENABLED = True
        except ExceptionPexpect:
            return

        try:
            while True:
                try:
                    line = process.readline().strip()
                    sys.stdout.flush()
                    if line:
                        if "NpuID(Idx)" in line:
                            sys.stdout.flush()
                            continue  # 跳过表头行
                        parsed_data = self._parse_line(line)
                        if parsed_data:
                            npu_id, info = parsed_data
                            with self.lock:
                                self.latest_data[npu_id] = info
                                sys.stdout.flush()
                    else:
                        sys.stdout.flush()
                        break
                except pexpect.TIMEOUT:
                    # 打印超时日志
                    timeout_message = f"{time.strftime('%Y-%m-%d %H:%M:%S')} - Timeout occurred while reading output."
                    print(timeout_message)
                    sys.stdout.flush()
        finally:
            process.close()
            sys.stdout.flush()
            _NPU_MONITOR_ENABLED = False

    def is_enabled(self):
        return _NPU_MONITOR_ENABLED

    def get_info(self):
        with self.lock:
            data_copy = self.latest_data.copy()
            sys.stdout.flush()
            return data_copy

_NPU_MONITOR = NpuMonitor()

def get_info():
    return _NPU_MONITOR.get_info()

def is_enabled():
    return _NPU_MONITOR.is_enabled()

if __name__ == "__main__":
    monitor = NpuMonitor()

    while True:
        latest_data = monitor.get_latest_data()
        if latest_data:
            for npu_id, info in latest_data.items():
                print(f"NPU ID: {npu_id}, Info: {info}")
            sys.stdout.flush()
        else:
            print("Debug: No data available")
            sys.stdout.flush()
        time.sleep(1)  # 休眠一段时间以避免忙等待
