import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import User from './models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentId!: number;
  url = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
    this.getUsers()
      .pipe()
      .subscribe(
        (users) => (this.currentId = Number(users[users.length - 1].id)+1)
      );
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.url}/`)
      .pipe(catchError(this.handleError));
  }

  getUserbyId(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addUser(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.url}`, { ...user, id: user.id.toString() })
      .pipe(catchError(this.handleError));
  }

  updateUser(user: User): Observable<User> {
    console.log('first');
    return this.http
      .put<User>(`${this.url}/${user.id}`, { ...user, id: user.id.toString() })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.url}/${userId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  increaseID(): number {
    return this.currentId++;
  }

  decreaseID(): number {
    return this.currentId--;
  }
}
