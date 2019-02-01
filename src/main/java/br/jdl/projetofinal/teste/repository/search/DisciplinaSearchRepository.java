package br.jdl.projetofinal.teste.repository.search;

import br.jdl.projetofinal.teste.domain.Disciplina;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Disciplina entity.
 */
public interface DisciplinaSearchRepository extends ElasticsearchRepository<Disciplina, Long> {
}
