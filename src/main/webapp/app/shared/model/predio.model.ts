import { ISala } from 'app/shared/model/sala.model';

export interface IPredio {
    id?: number;
    numero?: string;
    salas?: ISala[];
}

export class Predio implements IPredio {
    constructor(public id?: number, public numero?: string, public salas?: ISala[]) {}
}
