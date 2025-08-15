import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import standalone components instead of declaring
import { LoginComponent } from './components/login/login.component';
import { AudioFormComponent } from './components/audio-form/audio-form.component';
import { AudioListComponent } from './components/audio-list/audio-list.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';

// Import AuthInterceptor
import { AuthInterceptor } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent // ✅ only non-standalone components here
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    LoginComponent,
    AudioFormComponent,
    AudioListComponent,
    AudioPlayerComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
