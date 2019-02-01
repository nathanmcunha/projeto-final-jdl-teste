package br.jdl.projetofinal.teste.web.rest;

import br.jdl.projetofinal.teste.ProjetofinaljdltesteApp;

import br.jdl.projetofinal.teste.domain.Disciplina;
import br.jdl.projetofinal.teste.repository.DisciplinaRepository;
import br.jdl.projetofinal.teste.repository.search.DisciplinaSearchRepository;
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

import br.jdl.projetofinal.teste.domain.enumeration.Turno;
/**
 * Test class for the DisciplinaResource REST controller.
 *
 * @see DisciplinaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ProjetofinaljdltesteApp.class)
public class DisciplinaResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final Turno DEFAULT_TURNO = Turno.MANHA;
    private static final Turno UPDATED_TURNO = Turno.NOITE;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    /**
     * This repository is mocked in the br.jdl.projetofinal.teste.repository.search test package.
     *
     * @see br.jdl.projetofinal.teste.repository.search.DisciplinaSearchRepositoryMockConfiguration
     */
    @Autowired
    private DisciplinaSearchRepository mockDisciplinaSearchRepository;

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

    private MockMvc restDisciplinaMockMvc;

    private Disciplina disciplina;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DisciplinaResource disciplinaResource = new DisciplinaResource(disciplinaRepository, mockDisciplinaSearchRepository);
        this.restDisciplinaMockMvc = MockMvcBuilders.standaloneSetup(disciplinaResource)
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
    public static Disciplina createEntity(EntityManager em) {
        Disciplina disciplina = new Disciplina()
            .nome(DEFAULT_NOME)
            .turno(DEFAULT_TURNO);
        return disciplina;
    }

    @Before
    public void initTest() {
        disciplina = createEntity(em);
    }

    @Test
    @Transactional
    public void createDisciplina() throws Exception {
        int databaseSizeBeforeCreate = disciplinaRepository.findAll().size();

        // Create the Disciplina
        restDisciplinaMockMvc.perform(post("/api/disciplinas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isCreated());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeCreate + 1);
        Disciplina testDisciplina = disciplinaList.get(disciplinaList.size() - 1);
        assertThat(testDisciplina.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testDisciplina.getTurno()).isEqualTo(DEFAULT_TURNO);

        // Validate the Disciplina in Elasticsearch
        verify(mockDisciplinaSearchRepository, times(1)).save(testDisciplina);
    }

    @Test
    @Transactional
    public void createDisciplinaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = disciplinaRepository.findAll().size();

        // Create the Disciplina with an existing ID
        disciplina.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDisciplinaMockMvc.perform(post("/api/disciplinas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isBadRequest());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeCreate);

        // Validate the Disciplina in Elasticsearch
        verify(mockDisciplinaSearchRepository, times(0)).save(disciplina);
    }

    @Test
    @Transactional
    public void getAllDisciplinas() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        // Get all the disciplinaList
        restDisciplinaMockMvc.perform(get("/api/disciplinas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(disciplina.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].turno").value(hasItem(DEFAULT_TURNO.toString())));
    }
    
    @Test
    @Transactional
    public void getDisciplina() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        // Get the disciplina
        restDisciplinaMockMvc.perform(get("/api/disciplinas/{id}", disciplina.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(disciplina.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.turno").value(DEFAULT_TURNO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDisciplina() throws Exception {
        // Get the disciplina
        restDisciplinaMockMvc.perform(get("/api/disciplinas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDisciplina() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();

        // Update the disciplina
        Disciplina updatedDisciplina = disciplinaRepository.findById(disciplina.getId()).get();
        // Disconnect from session so that the updates on updatedDisciplina are not directly saved in db
        em.detach(updatedDisciplina);
        updatedDisciplina
            .nome(UPDATED_NOME)
            .turno(UPDATED_TURNO);

        restDisciplinaMockMvc.perform(put("/api/disciplinas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDisciplina)))
            .andExpect(status().isOk());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
        Disciplina testDisciplina = disciplinaList.get(disciplinaList.size() - 1);
        assertThat(testDisciplina.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDisciplina.getTurno()).isEqualTo(UPDATED_TURNO);

        // Validate the Disciplina in Elasticsearch
        verify(mockDisciplinaSearchRepository, times(1)).save(testDisciplina);
    }

    @Test
    @Transactional
    public void updateNonExistingDisciplina() throws Exception {
        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();

        // Create the Disciplina

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDisciplinaMockMvc.perform(put("/api/disciplinas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isBadRequest());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Disciplina in Elasticsearch
        verify(mockDisciplinaSearchRepository, times(0)).save(disciplina);
    }

    @Test
    @Transactional
    public void deleteDisciplina() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        int databaseSizeBeforeDelete = disciplinaRepository.findAll().size();

        // Delete the disciplina
        restDisciplinaMockMvc.perform(delete("/api/disciplinas/{id}", disciplina.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Disciplina in Elasticsearch
        verify(mockDisciplinaSearchRepository, times(1)).deleteById(disciplina.getId());
    }

    @Test
    @Transactional
    public void searchDisciplina() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);
        when(mockDisciplinaSearchRepository.search(queryStringQuery("id:" + disciplina.getId())))
            .thenReturn(Collections.singletonList(disciplina));
        // Search the disciplina
        restDisciplinaMockMvc.perform(get("/api/_search/disciplinas?query=id:" + disciplina.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(disciplina.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].turno").value(hasItem(DEFAULT_TURNO.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Disciplina.class);
        Disciplina disciplina1 = new Disciplina();
        disciplina1.setId(1L);
        Disciplina disciplina2 = new Disciplina();
        disciplina2.setId(disciplina1.getId());
        assertThat(disciplina1).isEqualTo(disciplina2);
        disciplina2.setId(2L);
        assertThat(disciplina1).isNotEqualTo(disciplina2);
        disciplina1.setId(null);
        assertThat(disciplina1).isNotEqualTo(disciplina2);
    }
}
