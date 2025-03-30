<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import type { HourWeather } from '../types/weather';
import { Chart, registerables } from 'chart.js';

// TODO: If you shrink the chart down to basically 0, and size up, it struggles.
Chart.register(...registerables);

interface Props {
  hours: HourWeather[] | undefined;
  timeRange: {
    label: string;
    startHour: number;
    endHour: number;
  } | undefined | null;
}

const props = defineProps<Props>();
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function handleResize() {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// Filter based on the selected time range
function getFilteredHours() {
  if (!props.hours || !props.timeRange) return [];
  
  return props.hours.filter(hour => {
    const hourTime = parseInt(hour.datetime.split(':')[0]);
    return hourTime >= props.timeRange!.startHour && hourTime < props.timeRange!.endHour;
  });
};

// NOTE: A lot of this is solveable with Vue-chartjs, but sometimes it acts up.
function updateChart() {
  if (!chartCanvas.value) return;
  
  const filteredHours = getFilteredHours();
  if (filteredHours.length === 0) return;
  
  // Prepare data for chart
  const labels = filteredHours.map(hour => {
    const hourTime = parseInt(hour.datetime.split(':')[0]);
    const hour12 = hourTime % 12 || 12; // Convert from military.
    const ampm = hourTime < 12 ? 'am' : 'pm';
    return `${hour12}${ampm}`;
  });
  
  const tempData = filteredHours.map(hour => hour.temp);
  const precipData = filteredHours.map(hour => hour.precipprob || 0);
  const humidityData = filteredHours.map(hour => hour.humidity);
  
  // Safety mechanism to prevent two charts. Might not be necessary.
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  // Create new chart
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;
  
  // TODO: Extract chart options and plugin to separate variables.
  // Draw vertical grid lines that align with hour marks
  const verticalLinePlugin = {
    id: 'verticalLines',
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;
      
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      
      // Draw a line for each hour label
      xAxis.ticks.forEach((tick: any, index: number) => {
        const x = xAxis.getPixelForTick(index);
        ctx.beginPath();
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);
        ctx.stroke();
      });
      
      ctx.restore();
    }
  };
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: 'Temperature (°F)',
          data: tempData,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          yAxisID: 'y',
        },
        {
          type: 'line',
          // type: 'bar', // NOTE: Consider bar + line approach.
          label: 'Precipitation (%)',
          data: precipData,
          backgroundColor: 'rgba(244, 67, 54, 0.6)',
          borderColor: 'rgba(244, 67, 54, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
          // barPercentage: 0.6, // TODO: Make sure 0% bars are visible.
        },
        {
          type: 'line',
          label: 'Humidity (%)',
          data: humidityData,
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderDash: [5, 5],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 2,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // This freaking thing, man.
      plugins: {
        legend: {
          display: false,
          position: 'top',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 10
            }
          }
        },
        y: {
          type: 'linear',
          display: false, // TODO: Do we want these? I think we might. Tooltips on mobile?
          position: 'left',
          min: Math.max(0, Math.min(...tempData) - 10),
          max: Math.max(...tempData) + 10,
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 10
            }
          }
        },
        y1: {
          type: 'linear',
          display: false,
          position: 'right',
          min: 0,
          max: 100,
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 10
            }
          }
        }
      }
    },
    plugins: [verticalLinePlugin]
  });
};

watch(() => props.hours, updateChart, { deep: true });
watch(() => props.timeRange, updateChart);

onMounted(() => {
  window.addEventListener('resize', handleResize);
  updateChart();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div class="time-chart-container">
    <div class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <div class="time-label">{{ timeRange?.label.toUpperCase() }}</div>
  </div>
</template>

<style scoped lang="scss">
.time-chart-container {
  position: relative;
  margin-top: 15px;
  padding: 10px 0;
  box-sizing: border-box;
  
  .chart-wrapper {
    width: 100%;
    min-height: 150px;
  }
  
  canvas {
    width: 100% !important; // Truly, there must be another way, but this has been mine for years.
    height: 100% !important;
    display: block;
  }
  
  .time-label {
    text-align: center;
    font-size: 0.7rem;
    color: #666;
    padding: 5px 0;
    margin-top: 10px;
    
    @media (min-width: 768px) {
      font-size: 0.8rem;
    }
  }
}
</style>