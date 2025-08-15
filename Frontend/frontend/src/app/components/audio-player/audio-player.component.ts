import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioItem } from '../../services/audio.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() item!: AudioItem;
  @ViewChild('audioElement', { static: true }) audioElement!: ElementRef<HTMLAudioElement>;
  
  playing = false;
  loading = false;
  error = false;

  ngOnInit() {
    this.setupAudioListeners();
  }

  ngOnDestroy() {
    this.removeAudioListeners();
  }

  setupAudioListeners() {
    const audio = this.audioElement.nativeElement;
    
    audio.addEventListener('play', () => {
      this.playing = true;
      this.loading = false;
      this.stopOtherAudios();
    });

    audio.addEventListener('pause', () => {
      this.playing = false;
      this.loading = false;
    });

    audio.addEventListener('loadstart', () => {
      this.loading = true;
      this.error = false;
    });

    audio.addEventListener('canplay', () => {
      this.loading = false;
      this.error = false;
    });

    audio.addEventListener('error', (e) => {
      this.loading = false;
      this.error = true;
      this.playing = false;
      console.error('Audio loading error:', audio.error, e);
    });

    audio.addEventListener('ended', () => {
      this.playing = false;
    });

    // Add CORS error handling
    audio.addEventListener('abort', () => {
      console.error('Audio loading aborted');
      this.loading = false;
      this.error = true;
    });
  }

  removeAudioListeners() {
    const audio = this.audioElement.nativeElement;
    audio.pause();
    audio.src = '';
  }

  stopOtherAudios() {
    // Stop all other audio elements on the page
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
      if (audio !== this.audioElement.nativeElement && !audio.paused) {
        audio.pause();
      }
    });
  }

  async toggle() {
    const audio = this.audioElement.nativeElement;
    
    try {
      if (audio.paused) {
        this.loading = true;
        this.error = false;
        
        // Set crossOrigin for CORS
        audio.crossOrigin = 'anonymous';
        
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error('Audio play error:', error);
      this.loading = false;
      this.error = true;
      this.playing = false;
    }
  }

  getButtonText(): string {
    if (this.error) return '❌';
    if (this.loading) return '⏳';
    return this.playing ? '⏸️' : '▶️';
  }

  getButtonTitle(): string {
    if (this.error) return 'Error loading audio';
    if (this.loading) return 'Loading...';
    return this.playing ? 'Pause' : 'Play';
  }
}
