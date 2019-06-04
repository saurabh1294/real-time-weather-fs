import { Component, OnInit } from '@angular/core';
import { WeatherAPIService } from './shared/services/real-time-weather-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js';

/** @title Simple weather API component */
@Component({
  selector: 'app-root app-real-time-weather-api-demo',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class WeatherAPIComponent implements OnInit {
  model: any = {};
  latLong: any;
  editor: any;
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private weatherAPIService: WeatherAPIService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.model.dayInput = '0';

    // create the editor
    const container = document.getElementById('jsoneditor');
    this.editor = new JSONEditor(container);
    // set some sample json in the jsoneditor initially
    const json = {
      Array: [1, 2, 3],
      Boolean: true,
      Null: null,
      Number: 123,
      Object: { a: 'b', c: 'd' },
      String: 'Sample JSON'
    };
    this.editor.set(json);
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

      this.weatherAPIService.getLatLong(this.model.locationInput, this.model, this.spinner).subscribe(response => {
        this.latLong = response.results[1];
        // get weather data
        const param = this.latLong && this.latLong.geometry;

        console.log(day, 'submit() day');
        const payload = { day: day, latLong: this.latLong && this.latLong.geometry };

        if (day === 'Whole week') {
          this.weatherAPIService.getWeatherDataForLocation(payload, this.model).subscribe(result => {
            console.log(result, 'this is the response of weather forecast for whole week');
            this.setJSON(result);
          });
        } else if (day === 'Today') {
          this.weatherAPIService.getWeatherDataForToday(payload, this.model).subscribe(result => {
            console.log(result, 'this is the response of weather forecast for today');
            this.setJSON(result);
          });
        } else {
          this.weatherAPIService.getWeatherDataForWeekday({ day: day, latLong: param }, this.model).subscribe(result => {
            console.log(result, 'this is the response of weather forecast for weekday');
            this.setJSON(result);
          });
        }
        // hide spinner
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      });
    }
  }

  setJSON(json) {
    this.editor.set(json);
    this.model.weatherDataOutput = JSON.stringify(json, null, 4);
  }

  submit() {
    console.log('in submit()', this.model.locationInput);
    this.invokeWeatherService();
  }

  change() {
    this.invokeWeatherService();
  }
}
