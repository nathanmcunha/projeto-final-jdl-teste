package br.jdl.projetofinal.teste.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Curso.
 */
@Entity
@Table(name = "curso")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "curso")
public class Curso implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "curso_disciplina",
               joinColumns = @JoinColumn(name = "curso_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "disciplina_id", referencedColumnName = "id"))
    private Set<Disciplina> disciplinas = new HashSet<>();

    @ManyToMany(mappedBy = "cursos")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Professor> professors = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Curso nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Disciplina> getDisciplinas() {
        return disciplinas;
    }

    public Curso disciplinas(Set<Disciplina> disciplinas) {
        this.disciplinas = disciplinas;
        return this;
    }

    public Curso addDisciplina(Disciplina disciplina) {
        this.disciplinas.add(disciplina);
        disciplina.getCursos().add(this);
        return this;
    }

    public Curso removeDisciplina(Disciplina disciplina) {
        this.disciplinas.remove(disciplina);
        disciplina.getCursos().remove(this);
        return this;
    }

    public void setDisciplinas(Set<Disciplina> disciplinas) {
        this.disciplinas = disciplinas;
    }

    public Set<Professor> getProfessors() {
        return professors;
    }

    public Curso professors(Set<Professor> professors) {
        this.professors = professors;
        return this;
    }

    public Curso addProfessor(Professor professor) {
        this.professors.add(professor);
        professor.getCursos().add(this);
        return this;
    }

    public Curso removeProfessor(Professor professor) {
        this.professors.remove(professor);
        professor.getCursos().remove(this);
        return this;
    }

    public void setProfessors(Set<Professor> professors) {
        this.professors = professors;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Curso curso = (Curso) o;
        if (curso.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), curso.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Curso{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
