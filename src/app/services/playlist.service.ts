import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private playlist: Song[] = [
    {
      id: 1,
      title: 'Song 1',
      artist: 'Artist 1',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 2,
      title: 'Song 2',
      artist: 'Artist 2',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: 3,
      title: 'Song 3',
      artist: 'Artist 3',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }
  ];

  private currentSongSubject = new BehaviorSubject<Song>(this.playlist[0]);
  currentSong$ = this.currentSongSubject.asObservable();

  getPlaylist(): Song[] {
    return this.playlist;
  }

  setCurrentSong(song: Song): void {
    this.currentSongSubject.next(song);
  }

  getNextSong(currentSong: Song): Song {
    const currentIndex = this.playlist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % this.playlist.length;
    return this.playlist[nextIndex];
  }

  getPreviousSong(currentSong: Song): Song {
    const currentIndex = this.playlist.findIndex(song => song.id === currentSong.id);
    const previousIndex = currentIndex === 0 ? this.playlist.length - 1 : currentIndex - 1;
    return this.playlist[previousIndex];
  }
}