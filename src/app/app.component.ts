import { Component, OnInit } from '@angular/core';
import { WeatherAPIService } from './shared/services/real-time-weather-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

/** @title Simple weather API component */
@Component({
  selector: 'app-root app-real-time-weather-api-demo',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class WeatherAPIComponent implements OnInit {
  model: any = {};
  latLong: any;
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private weatherAPIService: WeatherAPIService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.model.dayInput = '0';
  }

  invokeWeatherService() {
    const day = this.weekDays[this.model.dayInput - 3]
      ? this.weekDays[this.model.dayInput - 3]
      : this.model.dayInput - 3 === -1
        ? 'Today'
        : this.model.dayInput - 3 === -2
          ? 'Whole week'
          : null;
    if (day && this.model.locationInput) {
      this.spinner.show(); // show spinner

      this.weatherAPIService.getLatLong(this.model.locationInput).subscribe(response => {
        this.latLong = response.results[1];
        // get weather data
        const param = this.latLong && this.latLong.geometry;

        console.log(day, 'submit() day');
        const payload = { day: day, latLong: this.latLong && this.latLong.geometry };

        if (day === 'Whole week') {
          this.weatherAPIService.getWeatherDataForLocation(payload, this.model).subscribe(result => {
            console.log(result, 'this is the response of weather forecast for whole week');
          });
        } else if (day === 'Today') {
          this.weatherAPIService.getWeatherDataForToday(payload, this.model).subscribe(result => {
            console.log(result, 'this is the response of weather forecast for today');
          });
        } else {
          this.weatherAPIService.getWeatherDataForWeekday({ day: day, latLong: param }, this.model).subscribe(result => {
            console.log(result, 'this is the response of weather forecast for weekday');
          });
        }
        // hide spinner
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      });
    }
  }

  submit() {
    console.log('in submit()', this.model.locationInput);
    this.invokeWeatherService();
  }

  change() {
    this.invokeWeatherService();
  }
}
