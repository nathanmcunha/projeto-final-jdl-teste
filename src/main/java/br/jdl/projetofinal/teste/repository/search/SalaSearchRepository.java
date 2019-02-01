package br.jdl.projetofinal.teste.repository.search;

import br.jdl.projetofinal.teste.domain.Sala;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Sala entity.
 */
public interface SalaSearchRepository extends ElasticsearchRepository<Sala, Long> {
}
