import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="playlist">
      <h3>Playlist</h3>
      <ul class="song-list">
        <li *ngFor="let song of songs"
            [class.active]="song.id === currentSong?.id"
            (click)="onSongSelect(song)">
          <div class="song-info">
            <span class="song-title">{{ song.title }}</span>
            <span class="song-artist">{{ song.artist }}</span>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .playlist {
      margin: 20px 0;
      padding: 15px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .song-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .song-list li {
      padding: 10px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      transition: background-color 0.2s;
    }
    .song-list li:hover {
      background-color: #f5f5f5;
    }
    .song-list li.active {
      background-color: #e8f5e9;
    }
    .song-info {
      display: flex;
      flex-direction: column;
    }
    .song-title {
      font-weight: bold;
    }
    .song-artist {
      font-size: 0.9em;
      color: #666;
    }
  `]
})
export class PlaylistComponent {
  @Input() songs: Song[] = [];
  @Input() currentSong: Song | null = null;
  @Output() songSelect = new EventEmitter<Song>();

  onSongSelect(song: Song): void {
    this.songSelect.emit(song);
  }
}