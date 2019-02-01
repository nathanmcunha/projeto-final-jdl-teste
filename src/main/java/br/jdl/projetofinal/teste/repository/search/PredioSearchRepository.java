package br.jdl.projetofinal.teste.repository.search;

import br.jdl.projetofinal.teste.domain.Predio;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Predio entity.
 */
public interface PredioSearchRepository extends ElasticsearchRepository<Predio, Long> {
}
