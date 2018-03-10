import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

import { Hero } from './hero';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';

@Injectable()
export class HeroService {

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private baseURL = 'api';

  getHeroes(): Observable<Hero[]> {
    const url = `${this.baseURL}/heroes`;
    return this.http.get<Hero[]>(url)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', [])));
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.baseURL}/heroes/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id: ${id}`)),
        catchError(this.handleError<Hero>(`getHero id: ${id}`)));
  }

  updateHero(hero: Hero): Observable<any> {
    const url = `${this.baseURL}/heroes`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put(url, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id: ${hero.id}`)),
        catchError(this.handleError<Hero>('updateHero')));
  }

  addHero(hero: Hero): Observable<Hero> {
    const url = `${this.baseURL}/heroes`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<Hero>(url, hero, httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`added hero w/ id: ${hero.id}`)),
        catchError(this.handleError<Hero>('addHero')));
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.baseURL}/heroes/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id: ${id}`)),
        catchError(this.handleError<Hero>('deleteHero')));
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) { return of([]) }

    const url = `${this.baseURL}/heroes/?name=${term}`;

    return this.http.get<Hero[]>(url)
      .pipe(
        tap(_ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHero', [])));
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.log('error', error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }
}
