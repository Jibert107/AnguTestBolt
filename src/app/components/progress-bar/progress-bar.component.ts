import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container">
      <div class="progress-bar" (click)="onProgressClick($event)">
        <div class="progress" [style.width.%]="progress"></div>
      </div>
      <div class="time-display">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
      margin: 15px 0;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: #ddd;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
    }
    .progress {
      height: 100%;
      background-color: #4CAF50;
      border-radius: 4px;
      transition: width 0.1s linear;
    }
    .time-display {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
  `]
})
export class ProgressBarComponent {
  @Input() progress: number = 0;
  @Input() currentTime: number = 0;
  @Input() duration: number = 0;
  @Output() seek = new EventEmitter<number>();

  onProgressClick(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    this.seek.emit(Math.max(0, Math.min(100, percentage)));
  }

  formatTime(seconds: number): string {
    if (!seconds) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}