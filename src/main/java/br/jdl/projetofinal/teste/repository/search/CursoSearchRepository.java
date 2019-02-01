package br.jdl.projetofinal.teste.repository.search;

import br.jdl.projetofinal.teste.domain.Curso;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Curso entity.
 */
public interface CursoSearchRepository extends ElasticsearchRepository<Curso, Long> {
}
