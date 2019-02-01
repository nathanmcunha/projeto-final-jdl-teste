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
 * A Predio.
 */
@Entity
@Table(name = "predio")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "predio")
public class Predio implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero")
    private String numero;

    @OneToMany(mappedBy = "predio")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Sala> salas = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public Predio numero(String numero) {
        this.numero = numero;
        return this;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Set<Sala> getSalas() {
        return salas;
    }

    public Predio salas(Set<Sala> salas) {
        this.salas = salas;
        return this;
    }

    public Predio addSala(Sala sala) {
        this.salas.add(sala);
        sala.setPredio(this);
        return this;
    }

    public Predio removeSala(Sala sala) {
        this.salas.remove(sala);
        sala.setPredio(null);
        return this;
    }

    public void setSalas(Set<Sala> salas) {
        this.salas = salas;
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
        Predio predio = (Predio) o;
        if (predio.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), predio.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Predio{" +
            "id=" + getId() +
            ", numero='" + getNumero() + "'" +
            "}";
    }
}
