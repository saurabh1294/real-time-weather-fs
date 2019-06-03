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
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private weatherAPIService: WeatherAPIService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.model.dayInput = '0';
    this.spinner.show(); // show spinner

    this.weatherAPIService.getLatLong().subscribe(response => {
      console.log(response.results[1]);
      this.latLong = response.results[1];

      // get weather data
      const param = this.latLong && this.latLong.geometry;
      this.weatherAPIService.getWeatherDataForLocation(param, this.model).subscribe(result => {
        console.log(result, 'this is the response of weather forecast');
      });
      // hide spinner
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    });
  }

  submit() {
    console.log('in submit()', this.model.locationInput);
  }

  change() {
    const param = (this.weekDays[this.model.dayInput-2]) ? this.weekDays[this.model.dayInput-2] : 
    this.model.dayInput-2 == -1 ? 'Today' : null;
    console.log(param);
    if (param) {
      /*this.spinner.show(); // show spinner

      if (param === 'Today') {
        // call web service endpoint for today
        this.weatherAPIService.getWeatherDataForToday(param, this.model).subscribe(response => {
          console.log(response, 'this is the response');
        });
      } else {
        // call web service for weekday
        this.weatherAPIService.getWeatherDataForWeekday(param, this.model).subscribe(response => {
          console.log(response, 'this is the response');
        });
      }*/
    }
  }
}
