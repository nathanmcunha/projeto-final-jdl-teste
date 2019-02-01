import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Predio } from 'app/shared/model/predio.model';
import { PredioService } from './predio.service';
import { PredioComponent } from './predio.component';
import { PredioDetailComponent } from './predio-detail.component';
import { PredioUpdateComponent } from './predio-update.component';
import { PredioDeletePopupComponent } from './predio-delete-dialog.component';
import { IPredio } from 'app/shared/model/predio.model';

@Injectable({ providedIn: 'root' })
export class PredioResolve implements Resolve<IPredio> {
    constructor(private service: PredioService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPredio> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Predio>) => response.ok),
                map((predio: HttpResponse<Predio>) => predio.body)
            );
        }
        return of(new Predio());
    }
}

export const predioRoute: Routes = [
    {
        path: '',
        component: PredioComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.predio.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PredioDetailComponent,
        resolve: {
            predio: PredioResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.predio.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PredioUpdateComponent,
        resolve: {
            predio: PredioResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.predio.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PredioUpdateComponent,
        resolve: {
            predio: PredioResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.predio.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const predioPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PredioDeletePopupComponent,
        resolve: {
            predio: PredioResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.predio.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
