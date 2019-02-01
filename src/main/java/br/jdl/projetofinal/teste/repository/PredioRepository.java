package br.jdl.projetofinal.teste.repository;

import br.jdl.projetofinal.teste.domain.Predio;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Predio entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PredioRepository extends JpaRepository<Predio, Long> {

}
