import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Sala } from 'app/shared/model/sala.model';
import { SalaService } from './sala.service';
import { SalaComponent } from './sala.component';
import { SalaDetailComponent } from './sala-detail.component';
import { SalaUpdateComponent } from './sala-update.component';
import { SalaDeletePopupComponent } from './sala-delete-dialog.component';
import { ISala } from 'app/shared/model/sala.model';

@Injectable({ providedIn: 'root' })
export class SalaResolve implements Resolve<ISala> {
    constructor(private service: SalaService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISala> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Sala>) => response.ok),
                map((sala: HttpResponse<Sala>) => sala.body)
            );
        }
        return of(new Sala());
    }
}

export const salaRoute: Routes = [
    {
        path: '',
        component: SalaComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.sala.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: SalaDetailComponent,
        resolve: {
            sala: SalaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.sala.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: SalaUpdateComponent,
        resolve: {
            sala: SalaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.sala.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: SalaUpdateComponent,
        resolve: {
            sala: SalaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.sala.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const salaPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: SalaDeletePopupComponent,
        resolve: {
            sala: SalaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.sala.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
