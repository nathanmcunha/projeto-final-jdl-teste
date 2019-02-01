package br.jdl.projetofinal.teste.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of PredioSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class PredioSearchRepositoryMockConfiguration {

    @MockBean
    private PredioSearchRepository mockPredioSearchRepository;

}
