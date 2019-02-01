package br.jdl.projetofinal.teste.repository;

import br.jdl.projetofinal.teste.domain.Professor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Professor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    @Query(value = "select distinct professor from Professor professor left join fetch professor.cursos",
        countQuery = "select count(distinct professor) from Professor professor")
    Page<Professor> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct professor from Professor professor left join fetch professor.cursos")
    List<Professor> findAllWithEagerRelationships();

    @Query("select professor from Professor professor left join fetch professor.cursos where professor.id =:id")
    Optional<Professor> findOneWithEagerRelationships(@Param("id") Long id);

}
