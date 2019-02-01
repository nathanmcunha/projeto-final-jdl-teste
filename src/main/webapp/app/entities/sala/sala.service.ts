import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISala } from 'app/shared/model/sala.model';

type EntityResponseType = HttpResponse<ISala>;
type EntityArrayResponseType = HttpResponse<ISala[]>;

@Injectable({ providedIn: 'root' })
export class SalaService {
    public resourceUrl = SERVER_API_URL + 'api/salas';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/salas';

    constructor(protected http: HttpClient) {}

    create(sala: ISala): Observable<EntityResponseType> {
        return this.http.post<ISala>(this.resourceUrl, sala, { observe: 'response' });
    }

    update(sala: ISala): Observable<EntityResponseType> {
        return this.http.put<ISala>(this.resourceUrl, sala, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISala>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISala[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISala[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
