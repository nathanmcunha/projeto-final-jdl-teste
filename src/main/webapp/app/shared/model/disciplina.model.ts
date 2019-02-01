import { ISala } from 'app/shared/model/sala.model';
import { ICurso } from 'app/shared/model/curso.model';

export const enum Turno {
    MANHA = 'MANHA',
    NOITE = 'NOITE'
}

export interface IDisciplina {
    id?: number;
    nome?: string;
    turno?: Turno;
    sala?: ISala;
    cursos?: ICurso[];
}

export class Disciplina implements IDisciplina {
    constructor(public id?: number, public nome?: string, public turno?: Turno, public sala?: ISala, public cursos?: ICurso[]) {}
}
