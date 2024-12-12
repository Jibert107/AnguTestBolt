import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistComponent } from '../components/playlist/playlist.component';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar.component';
import { PlaylistService } from '../services/playlist.service';
import { AudioService } from '../services/audio.service';
import { Song } from '../models/song.model';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule, PlaylistComponent, ProgressBarComponent],
  template: `
    <div class="music-player">
      <h2>Music Player</h2>
      
      <div class="controls">
        <button (click)="playPrevious()" class="control-button">
          ⏮️
        </button>
        <button (click)="togglePlay()" class="play-button">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button (click)="playNext()" class="control-button">
          ⏭️
        </button>
      </div>

      <div class="now-playing">
        <h3>Now Playing:</h3>
        <p>{{ currentSong?.title }} - {{ currentSong?.artist }}</p>
      </div>

      <app-progress-bar
        [progress]="progress"
        [currentTime]="currentTime"
        [duration]="duration"
        (seek)="onSeek($event)">
      </app-progress-bar>

      <app-playlist
        [songs]="playlist"
        [currentSong]="currentSong"
        (songSelect)="onSongSelect($event)">
      </app-playlist>
    </div>
  `,
  styles: [`
    .music-player {
      text-align: center;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .controls {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 20px 0;
    }
    .control-button, .play-button {
      padding: 10px 20px;
      font-size: 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .control-button:hover, .play-button:hover {
      background-color: #45a049;
    }
    .now-playing {
      margin: 20px 0;
      padding: 10px;
      background-color: #f8f8f8;
      border-radius: 4px;
    }
    .now-playing h3 {
      margin: 0;
      color: #333;
    }
    .now-playing p {
      margin: 5px 0 0;
      color: #666;
    }
  `]
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  isPlaying = false;
  progress = 0;
  currentTime = 0;
  duration = 0;
  playlist: Song[] = [];
  currentSong: Song | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private playlistService: PlaylistService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.playlist = this.playlistService.getPlaylist();
    
    this.subscriptions.push(
      this.playlistService.currentSong$.subscribe(song => {
        this.currentSong = song;
        if (song && this.isPlaying) {
          this.audioService.play(song.url);
        }
      }),

      this.audioService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
      })
    );

    // Set up audio time update handler
    this.audioService.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audioService.addEventListener('ended', this.onSongEnd.bind(this));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.audioService.removeEventListener('timeupdate', this.updateProgress.bind(this));
    this.audioService.removeEventListener('ended', this.onSongEnd.bind(this));
  }

  togglePlay() {
    if (this.currentSong) {
      this.audioService.toggle(this.currentSong.url);
    }
  }

  updateProgress() {
    this.currentTime = this.audioService.getCurrentTime();
    this.duration = this.audioService.getDuration();
    this.progress = (this.currentTime / this.duration) * 100;
  }

  onSongEnd() {
    this.playNext();
  }

  playNext() {
    if (this.currentSong) {
      const nextSong = this.playlistService.getNextSong(this.currentSong);
      this.playlistService.setCurrentSong(nextSong);
    }
  }

  playPrevious() {
    if (this.currentSong) {
      const previousSong = this.playlistService.getPreviousSong(this.currentSong);
      this.playlistService.setCurrentSong(previousSong);
    }
  }

  onSongSelect(song: Song) {
    this.playlistService.setCurrentSong(song);
    this.audioService.play(song.url);
  }

  onSeek(progress: number) {
    const newTime = (progress / 100) * this.duration;
    this.audioService.setCurrentTime(newTime);
  }
}