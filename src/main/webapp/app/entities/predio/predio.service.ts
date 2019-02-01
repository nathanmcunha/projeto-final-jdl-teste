import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPredio } from 'app/shared/model/predio.model';

type EntityResponseType = HttpResponse<IPredio>;
type EntityArrayResponseType = HttpResponse<IPredio[]>;

@Injectable({ providedIn: 'root' })
export class PredioService {
    public resourceUrl = SERVER_API_URL + 'api/predios';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/predios';

    constructor(protected http: HttpClient) {}

    create(predio: IPredio): Observable<EntityResponseType> {
        return this.http.post<IPredio>(this.resourceUrl, predio, { observe: 'response' });
    }

    update(predio: IPredio): Observable<EntityResponseType> {
        return this.http.put<IPredio>(this.resourceUrl, predio, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPredio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPredio[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPredio[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
