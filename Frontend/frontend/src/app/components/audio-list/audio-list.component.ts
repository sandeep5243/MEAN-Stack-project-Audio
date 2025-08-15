import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AudioService, AudioItem } from '../../services/audio.service';
import { AuthService } from '../../services/auth.service';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, AudioPlayerComponent]
})
export class AudioListComponent implements OnInit {
  items: AudioItem[] = [];
  page = 1; limit = 5; total = 0; pages = 0;

  constructor(
    private api: AudioService, 
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit() { 
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.load(); 
  }

  load() {
    this.api.list(this.page, this.limit).subscribe({
      next: (res) => {
        this.items = res.items; 
        this.page = res.page; 
        this.limit = res.limit;
        this.total = res.total; 
        this.pages = res.pages;
      },
      error: (error) => {
        console.error('Error loading audio list:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  delete(id: string) {
    if (!confirm('Delete this audio?')) return;
    this.api.delete(id).subscribe({
      next: () => this.load(),
      error: (error) => {
        console.error('Error deleting audio:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onImageError(event: any) {
    console.error('Image failed to load:', event.target.src);
    // Set a default image or placeholder
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAyNUMyNy43NjE0IDI1IDMwIDIyLjc2MTQgMzAgMjBDMzAgMTcuMjM4NiAyNy43NjE0IDE1IDI1IDE1QzIyLjIzODYgMTUgMjAgMTcuMjM4NiAyMCAyMEMyMCAyMi43NjE0IDIyLjIzODYgMjUgMjUgMjVaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yNSAzNUMyNy43NjE0IDM1IDMwIDMyLjc2MTQgMzAgMzBDMzAgMjcuMjM4NiAyNy43NjE0IDI1IDI1IDI1QzIyLjIzODYgMjUgMjAgMjcuMjM4NiAyMCAzMEMyMCAzMi43NjE0IDIyLjIzODYgMzUgMjUgMzVaIiBmaWxsPSIjQ0NDIi8+Cjwvc3ZnPgo=';
  }

  onImageLoad(event: any) {
    console.log('Image loaded successfully:', event.target.src);
  }
}
