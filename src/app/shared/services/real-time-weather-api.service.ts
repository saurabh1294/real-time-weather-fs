import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // singleton service
})
export class WeatherAPIService {
  port = '3456';
  baseUrl = `http://localhost:${this.port}`;
  numRetries = 3;
  errorOutput;

  constructor(private http: HttpClient) {}

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.errorOutput.weatherDataOutput = `${errorMessage}. Please check your NodeJS server logs.
    "Try restarting the server"`;
    window.alert(this.errorOutput.weatherDataOutput);
    return throwError(this.errorOutput.weatherDataOutput);
  }

  getLatLong(location, model, spinner): Observable<any> {
    this.errorOutput = model;
    // hide the spinner after 1 sec.
    setTimeout(() => spinner.hide(), 1000);
    return this.http.get<any>(`${this.baseUrl}/getLatLong?q=${location}`).pipe(catchError(err => this.handleError(err)));
  }

  getWeatherDataForLocation(data, model): Observable<any> {
    console.log('Request payload for all time weather data for locaiton', data);
    this.errorOutput = model;
    return this.http.post<any>(`${this.baseUrl}/weather/Sydney`, { latLong: data }).pipe(catchError(err => this.handleError(err)));
  }

  getWeatherDataForWeekday(data, model): Observable<any> {
    console.log('Request payload for weekday', data);
    this.errorOutput = model;
    return this.http.post<any>(`${this.baseUrl}/weather/Sydney/${data}`, { latLong: data }).pipe(catchError(err => this.handleError(err)));
  }

  getWeatherDataForToday(data, model): Observable<any> {
    console.log('Request payload for today', data);
    this.errorOutput = model;
    return this.http.post<any>(`${this.baseUrl}/weather/Sydney/today`, { latLong: data }).pipe(catchError(err => this.handleError(err)));
  }
}
