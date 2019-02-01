import { ICurso } from 'app/shared/model/curso.model';

export interface IProfessor {
    id?: number;
    nome?: string;
    cursos?: ICurso[];
}

export class Professor implements IProfessor {
    constructor(public id?: number, public nome?: string, public cursos?: ICurso[]) {}
}
