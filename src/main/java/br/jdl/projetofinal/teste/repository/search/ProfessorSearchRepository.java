package br.jdl.projetofinal.teste.repository.search;

import br.jdl.projetofinal.teste.domain.Professor;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Professor entity.
 */
public interface ProfessorSearchRepository extends ElasticsearchRepository<Professor, Long> {
}
