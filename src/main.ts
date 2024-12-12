import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { MusicPlayerComponent } from './app/music-player/music-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MusicPlayerComponent],
  template: `
    <div class="app-container">
      <h1>Angular Music Player</h1>
      <app-music-player></app-music-player>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
  `]
})
export class App {
}

bootstrapApplication(App);