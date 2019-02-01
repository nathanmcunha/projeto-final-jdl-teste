package br.jdl.projetofinal.teste.web.rest;

import br.jdl.projetofinal.teste.ProjetofinaljdltesteApp;

import br.jdl.projetofinal.teste.domain.Predio;
import br.jdl.projetofinal.teste.repository.PredioRepository;
import br.jdl.projetofinal.teste.repository.search.PredioSearchRepository;
import br.jdl.projetofinal.teste.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static br.jdl.projetofinal.teste.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PredioResource REST controller.
 *
 * @see PredioResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ProjetofinaljdltesteApp.class)
public class PredioResourceIntTest {

    private static final String DEFAULT_NUMERO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO = "BBBBBBBBBB";

    @Autowired
    private PredioRepository predioRepository;

    /**
     * This repository is mocked in the br.jdl.projetofinal.teste.repository.search test package.
     *
     * @see br.jdl.projetofinal.teste.repository.search.PredioSearchRepositoryMockConfiguration
     */
    @Autowired
    private PredioSearchRepository mockPredioSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restPredioMockMvc;

    private Predio predio;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PredioResource predioResource = new PredioResource(predioRepository, mockPredioSearchRepository);
        this.restPredioMockMvc = MockMvcBuilders.standaloneSetup(predioResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Predio createEntity(EntityManager em) {
        Predio predio = new Predio()
            .numero(DEFAULT_NUMERO);
        return predio;
    }

    @Before
    public void initTest() {
        predio = createEntity(em);
    }

    @Test
    @Transactional
    public void createPredio() throws Exception {
        int databaseSizeBeforeCreate = predioRepository.findAll().size();

        // Create the Predio
        restPredioMockMvc.perform(post("/api/predios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(predio)))
            .andExpect(status().isCreated());

        // Validate the Predio in the database
        List<Predio> predioList = predioRepository.findAll();
        assertThat(predioList).hasSize(databaseSizeBeforeCreate + 1);
        Predio testPredio = predioList.get(predioList.size() - 1);
        assertThat(testPredio.getNumero()).isEqualTo(DEFAULT_NUMERO);

        // Validate the Predio in Elasticsearch
        verify(mockPredioSearchRepository, times(1)).save(testPredio);
    }

    @Test
    @Transactional
    public void createPredioWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = predioRepository.findAll().size();

        // Create the Predio with an existing ID
        predio.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPredioMockMvc.perform(post("/api/predios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(predio)))
            .andExpect(status().isBadRequest());

        // Validate the Predio in the database
        List<Predio> predioList = predioRepository.findAll();
        assertThat(predioList).hasSize(databaseSizeBeforeCreate);

        // Validate the Predio in Elasticsearch
        verify(mockPredioSearchRepository, times(0)).save(predio);
    }

    @Test
    @Transactional
    public void getAllPredios() throws Exception {
        // Initialize the database
        predioRepository.saveAndFlush(predio);

        // Get all the predioList
        restPredioMockMvc.perform(get("/api/predios?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(predio.getId().intValue())))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO.toString())));
    }
    
    @Test
    @Transactional
    public void getPredio() throws Exception {
        // Initialize the database
        predioRepository.saveAndFlush(predio);

        // Get the predio
        restPredioMockMvc.perform(get("/api/predios/{id}", predio.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(predio.getId().intValue()))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPredio() throws Exception {
        // Get the predio
        restPredioMockMvc.perform(get("/api/predios/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePredio() throws Exception {
        // Initialize the database
        predioRepository.saveAndFlush(predio);

        int databaseSizeBeforeUpdate = predioRepository.findAll().size();

        // Update the predio
        Predio updatedPredio = predioRepository.findById(predio.getId()).get();
        // Disconnect from session so that the updates on updatedPredio are not directly saved in db
        em.detach(updatedPredio);
        updatedPredio
            .numero(UPDATED_NUMERO);

        restPredioMockMvc.perform(put("/api/predios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPredio)))
            .andExpect(status().isOk());

        // Validate the Predio in the database
        List<Predio> predioList = predioRepository.findAll();
        assertThat(predioList).hasSize(databaseSizeBeforeUpdate);
        Predio testPredio = predioList.get(predioList.size() - 1);
        assertThat(testPredio.getNumero()).isEqualTo(UPDATED_NUMERO);

        // Validate the Predio in Elasticsearch
        verify(mockPredioSearchRepository, times(1)).save(testPredio);
    }

    @Test
    @Transactional
    public void updateNonExistingPredio() throws Exception {
        int databaseSizeBeforeUpdate = predioRepository.findAll().size();

        // Create the Predio

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPredioMockMvc.perform(put("/api/predios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(predio)))
            .andExpect(status().isBadRequest());

        // Validate the Predio in the database
        List<Predio> predioList = predioRepository.findAll();
        assertThat(predioList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Predio in Elasticsearch
        verify(mockPredioSearchRepository, times(0)).save(predio);
    }

    @Test
    @Transactional
    public void deletePredio() throws Exception {
        // Initialize the database
        predioRepository.saveAndFlush(predio);

        int databaseSizeBeforeDelete = predioRepository.findAll().size();

        // Delete the predio
        restPredioMockMvc.perform(delete("/api/predios/{id}", predio.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Predio> predioList = predioRepository.findAll();
        assertThat(predioList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Predio in Elasticsearch
        verify(mockPredioSearchRepository, times(1)).deleteById(predio.getId());
    }

    @Test
    @Transactional
    public void searchPredio() throws Exception {
        // Initialize the database
        predioRepository.saveAndFlush(predio);
        when(mockPredioSearchRepository.search(queryStringQuery("id:" + predio.getId())))
            .thenReturn(Collections.singletonList(predio));
        // Search the predio
        restPredioMockMvc.perform(get("/api/_search/predios?query=id:" + predio.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(predio.getId().intValue())))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Predio.class);
        Predio predio1 = new Predio();
        predio1.setId(1L);
        Predio predio2 = new Predio();
        predio2.setId(predio1.getId());
        assertThat(predio1).isEqualTo(predio2);
        predio2.setId(2L);
        assertThat(predio1).isNotEqualTo(predio2);
        predio1.setId(null);
        assertThat(predio1).isNotEqualTo(predio2);
    }
}
