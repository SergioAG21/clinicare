import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { StatsService, TopSpeciality } from '@shared/services/stats.service';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'top-specialities-chart',
  imports: [],
  templateUrl: './top-specialities-chart.html',
})
export class TopSpecialitiesChart {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.statsService
      .getTopSpecialities()
      .subscribe((data: TopSpeciality[]) => {
        const labels = data.map((d) => d.name); // Aquí cogemos los nombres de las especialidades
        const totals = data.map((d) => d.total);
        const colors = [
          '#f39c12',
          '#e74c3c',
          '#2ecc71',
          '#3498db',
          '#9b59b6',
          '#1abc9c',
          '#e67e22',
        ];

        const config: ChartConfiguration = {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                data: totals,
                backgroundColor: colors,
                borderColor: colors.map((color) => color + 'AA'),
                borderWidth: 1,
                borderRadius: 10,
                barPercentage: 0.8,
                categoryPercentage: 0.8,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: { weight: 'bold' },
                bodyFont: { weight: 'normal' },
                padding: 10,
                caretPadding: 10,
              },
            },
            scales: {
              x: {
                ticks: {
                  color: '#3498db',
                  font: {
                    weight: 'bold',
                  },
                  precision: 0,
                },
                grid: {
                  display: false,
                },
              },
              y: {
                ticks: {
                  color: '#3498db',
                },
                grid: {
                  color: '#444',
                },
              },
            },
          },
        };

        this.chart = new Chart(this.chartCanvas.nativeElement, config);
      });
  }
}
