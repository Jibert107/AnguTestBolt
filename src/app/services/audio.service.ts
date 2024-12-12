import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement = new Audio();
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  
  isPlaying$ = this.isPlayingSubject.asObservable();

  constructor() {
    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
    });
  }

  play(url: string): Promise<void> {
    if (this.audio.src !== url) {
      this.audio.src = url;
    }
    this.isPlayingSubject.next(true);
    return this.audio.play();
  }

  pause(): void {
    this.audio.pause();
    this.isPlayingSubject.next(false);
  }

  toggle(url: string): void {
    if (this.audio.paused) {
      this.play(url);
    } else {
      this.pause();
    }
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration;
  }

  setCurrentTime(time: number): void {
    this.audio.currentTime = time;
  }

  addEventListener(event: string, callback: () => void): void {
    this.audio.addEventListener(event, callback);
  }

  removeEventListener(event: string, callback: () => void): void {
    this.audio.removeEventListener(event, callback);
  }
}