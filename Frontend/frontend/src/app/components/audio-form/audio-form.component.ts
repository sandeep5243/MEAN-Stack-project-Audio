import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-audio-form',
  templateUrl: './audio-form.component.html',
  styleUrls: ['./audio-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AudioFormComponent implements OnInit {
  id = '';
  name = ''; 
  desc = '';
  image?: File; 
  song?: File;
  durationSec = 0;
  isSubmitting = false;
  imageName = '';
  audioName = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute, 
    private api: AudioService, 
    private router: Router
  ) {}

  ngOnInit() { 
    this.id = this.route.snapshot.paramMap.get('id') || '';
    
    // Check if user is authenticated
    if (!localStorage.getItem('token')) {
      this.errorMessage = 'You must be logged in to access this page';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }
    
    if (this.id) {
      this.loadAudio();
    }
  }

  loadAudio() {
    this.api.get(this.id).subscribe({
      next: (audio) => {
        this.name = audio.name;
        this.desc = audio.desc;
        this.durationSec = audio.durationSec;
      },
      error: (error) => {
        console.error('Error loading audio:', error);
        if (error.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Failed to load audio details';
        }
      }
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.image = file;
      this.imageName = file.name;
    }
  }

  onSongChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.song = file;
      this.audioName = file.name;
      
      // Get audio duration
      const audio = new Audio(URL.createObjectURL(file));
      audio.addEventListener('loadedmetadata', () => {
        this.durationSec = Math.round(audio.duration || 0);
      });
    }
  }

  submit() {
    // Check authentication first
    if (!localStorage.getItem('token')) {
      this.errorMessage = 'You must be logged in to save audio';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    if (!this.name.trim() || !this.desc.trim()) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (!this.id && (!this.image || !this.song)) {
      this.errorMessage = 'Please select both image and audio files';
      return;
    }

    if (this.durationSec < 30) {
      this.errorMessage = 'Audio must be at least 30 seconds long';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const fd = new FormData();
    fd.append('name', this.name.trim());
    fd.append('desc', this.desc.trim());
    fd.append('durationSec', String(this.durationSec));
    
    if (this.image) fd.append('image', this.image);
    if (this.song) fd.append('song', this.song);

    const req = this.id ? this.api.update(this.id, fd) : this.api.create(fd);
    
    req.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error saving audio:', error);
        this.isSubmitting = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = error.error?.message || 'Failed to save audio. Please try again.';
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
