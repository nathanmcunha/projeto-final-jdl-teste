import { IPredio } from 'app/shared/model/predio.model';
import { IDisciplina } from 'app/shared/model/disciplina.model';

export interface ISala {
    id?: number;
    numero?: string;
    predio?: IPredio;
    disciplinas?: IDisciplina[];
}

export class Sala implements ISala {
    constructor(public id?: number, public numero?: string, public predio?: IPredio, public disciplinas?: IDisciplina[]) {}
}
