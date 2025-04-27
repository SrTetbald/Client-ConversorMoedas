import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiUrl = 'http://localhost:3000/cotacao/converter';
    constructor(private http: HttpClient) {}

    converterMoeda(de: string, para: string, valor: string): Observable<number> {
        const params = new HttpParams().set('de', de).set('para', para).set('valor', valor);

        return this.http.get<number>(this.apiUrl, { params });
    }
}
