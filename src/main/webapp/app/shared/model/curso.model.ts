import { IDisciplina } from 'app/shared/model/disciplina.model';
import { IProfessor } from 'app/shared/model/professor.model';

export interface ICurso {
    id?: number;
    nome?: string;
    disciplinas?: IDisciplina[];
    professors?: IProfessor[];
}

export class Curso implements ICurso {
    constructor(public id?: number, public nome?: string, public disciplinas?: IDisciplina[], public professors?: IProfessor[]) {}
}
