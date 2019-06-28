import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lift } from 'src/domain/Lift';
import { Observable, throwError, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class LiftstatusService {

  private liftStatusUrl: string = "https://liftstatus20190627122559.azurewebsites.net/api/";
  private azureFunctionKey: string = "rGjcXwF82abrbdBNhGx5m78qfYmsim3cJg6KC8pa9NBVkR45hxbV2Q==";

  constructor(private _http: HttpClient) { }

  getAll(): Observable<Lift[]> {

    const httpParams = new HttpParams()
      .set('code', this.azureFunctionKey)

    return this._http.get<Lift[]>(this.liftStatusUrl + 'Get',{
        params: httpParams
      })
      .pipe(catchError(this.handleError));
  }  

  getSingle(id: string, location: string): Observable<Lift> {

    const httpParams = new HttpParams()
    .set('code', this.azureFunctionKey)
    .set('lift-id', id)
    .set('location', location);

    return this._http.get<Lift>(this.liftStatusUrl + 'GetSingle',{
        params: httpParams
      })
      .pipe(catchError(this.handleError));
  }

  handleError(err: any) {
    let errorMessage: string;  
    if (err.error instanceof ErrorEvent) {  
      errorMessage = `An error occurred: ${err.error.message}`;  
    } else {  
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;  
    }  
    console.error(err);  
    return throwError(errorMessage);  
  }

}
