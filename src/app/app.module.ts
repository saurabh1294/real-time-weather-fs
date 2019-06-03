import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WeatherAPIComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { WeatherAPIService } from './shared/services/real-time-weather-api.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [WeatherAPIComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, NgxSpinnerModule],
  providers: [{ provide: WeatherAPIService, useClass: WeatherAPIService }],
  bootstrap: [WeatherAPIComponent]
})
export class AppModule {}
