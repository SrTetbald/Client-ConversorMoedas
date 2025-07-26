import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IMoeda {
    Moeda: string;
    Nome: string;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiUrl = 'https://conversordemoedas-h7cg.onrender.com/cotacao/converter';
    constructor(private http: HttpClient) {}

    converterMoeda(
        de: string,
        para: string,
        valor: string,
    ): Observable<number> {
        const params = new HttpParams()
            .set('de', de)
            .set('para', para)
            .set('valor', valor);

        return this.http.get<number>(this.apiUrl, { params });
    }

    getMoedas(): Observable<IMoeda[]> {
        return this.http.get<IMoeda[]>(
            'https://conversordemoedas-h7cg.onrender.com/cotacao/moedas',
        );
    }
}
