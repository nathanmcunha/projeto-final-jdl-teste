package br.jdl.projetofinal.teste.web.rest;

import br.jdl.projetofinal.teste.ProjetofinaljdltesteApp;

import br.jdl.projetofinal.teste.domain.Professor;
import br.jdl.projetofinal.teste.repository.ProfessorRepository;
import br.jdl.projetofinal.teste.repository.search.ProfessorSearchRepository;
import br.jdl.projetofinal.teste.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
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
 * Test class for the ProfessorResource REST controller.
 *
 * @see ProfessorResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ProjetofinaljdltesteApp.class)
public class ProfessorResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private ProfessorRepository professorRepository;

    @Mock
    private ProfessorRepository professorRepositoryMock;

    /**
     * This repository is mocked in the br.jdl.projetofinal.teste.repository.search test package.
     *
     * @see br.jdl.projetofinal.teste.repository.search.ProfessorSearchRepositoryMockConfiguration
     */
    @Autowired
    private ProfessorSearchRepository mockProfessorSearchRepository;

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

    private MockMvc restProfessorMockMvc;

    private Professor professor;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProfessorResource professorResource = new ProfessorResource(professorRepository, mockProfessorSearchRepository);
        this.restProfessorMockMvc = MockMvcBuilders.standaloneSetup(professorResource)
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
    public static Professor createEntity(EntityManager em) {
        Professor professor = new Professor()
            .nome(DEFAULT_NOME);
        return professor;
    }

    @Before
    public void initTest() {
        professor = createEntity(em);
    }

    @Test
    @Transactional
    public void createProfessor() throws Exception {
        int databaseSizeBeforeCreate = professorRepository.findAll().size();

        // Create the Professor
        restProfessorMockMvc.perform(post("/api/professors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(professor)))
            .andExpect(status().isCreated());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeCreate + 1);
        Professor testProfessor = professorList.get(professorList.size() - 1);
        assertThat(testProfessor.getNome()).isEqualTo(DEFAULT_NOME);

        // Validate the Professor in Elasticsearch
        verify(mockProfessorSearchRepository, times(1)).save(testProfessor);
    }

    @Test
    @Transactional
    public void createProfessorWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = professorRepository.findAll().size();

        // Create the Professor with an existing ID
        professor.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProfessorMockMvc.perform(post("/api/professors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(professor)))
            .andExpect(status().isBadRequest());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeCreate);

        // Validate the Professor in Elasticsearch
        verify(mockProfessorSearchRepository, times(0)).save(professor);
    }

    @Test
    @Transactional
    public void getAllProfessors() throws Exception {
        // Initialize the database
        professorRepository.saveAndFlush(professor);

        // Get all the professorList
        restProfessorMockMvc.perform(get("/api/professors?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(professor.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllProfessorsWithEagerRelationshipsIsEnabled() throws Exception {
        ProfessorResource professorResource = new ProfessorResource(professorRepositoryMock, mockProfessorSearchRepository);
        when(professorRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restProfessorMockMvc = MockMvcBuilders.standaloneSetup(professorResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restProfessorMockMvc.perform(get("/api/professors?eagerload=true"))
        .andExpect(status().isOk());

        verify(professorRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllProfessorsWithEagerRelationshipsIsNotEnabled() throws Exception {
        ProfessorResource professorResource = new ProfessorResource(professorRepositoryMock, mockProfessorSearchRepository);
            when(professorRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restProfessorMockMvc = MockMvcBuilders.standaloneSetup(professorResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restProfessorMockMvc.perform(get("/api/professors?eagerload=true"))
        .andExpect(status().isOk());

            verify(professorRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getProfessor() throws Exception {
        // Initialize the database
        professorRepository.saveAndFlush(professor);

        // Get the professor
        restProfessorMockMvc.perform(get("/api/professors/{id}", professor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(professor.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingProfessor() throws Exception {
        // Get the professor
        restProfessorMockMvc.perform(get("/api/professors/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProfessor() throws Exception {
        // Initialize the database
        professorRepository.saveAndFlush(professor);

        int databaseSizeBeforeUpdate = professorRepository.findAll().size();

        // Update the professor
        Professor updatedProfessor = professorRepository.findById(professor.getId()).get();
        // Disconnect from session so that the updates on updatedProfessor are not directly saved in db
        em.detach(updatedProfessor);
        updatedProfessor
            .nome(UPDATED_NOME);

        restProfessorMockMvc.perform(put("/api/professors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProfessor)))
            .andExpect(status().isOk());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
        Professor testProfessor = professorList.get(professorList.size() - 1);
        assertThat(testProfessor.getNome()).isEqualTo(UPDATED_NOME);

        // Validate the Professor in Elasticsearch
        verify(mockProfessorSearchRepository, times(1)).save(testProfessor);
    }

    @Test
    @Transactional
    public void updateNonExistingProfessor() throws Exception {
        int databaseSizeBeforeUpdate = professorRepository.findAll().size();

        // Create the Professor

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfessorMockMvc.perform(put("/api/professors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(professor)))
            .andExpect(status().isBadRequest());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Professor in Elasticsearch
        verify(mockProfessorSearchRepository, times(0)).save(professor);
    }

    @Test
    @Transactional
    public void deleteProfessor() throws Exception {
        // Initialize the database
        professorRepository.saveAndFlush(professor);

        int databaseSizeBeforeDelete = professorRepository.findAll().size();

        // Delete the professor
        restProfessorMockMvc.perform(delete("/api/professors/{id}", professor.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Professor in Elasticsearch
        verify(mockProfessorSearchRepository, times(1)).deleteById(professor.getId());
    }

    @Test
    @Transactional
    public void searchProfessor() throws Exception {
        // Initialize the database
        professorRepository.saveAndFlush(professor);
        when(mockProfessorSearchRepository.search(queryStringQuery("id:" + professor.getId())))
            .thenReturn(Collections.singletonList(professor));
        // Search the professor
        restProfessorMockMvc.perform(get("/api/_search/professors?query=id:" + professor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(professor.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Professor.class);
        Professor professor1 = new Professor();
        professor1.setId(1L);
        Professor professor2 = new Professor();
        professor2.setId(professor1.getId());
        assertThat(professor1).isEqualTo(professor2);
        professor2.setId(2L);
        assertThat(professor1).isNotEqualTo(professor2);
        professor1.setId(null);
        assertThat(professor1).isNotEqualTo(professor2);
    }
}
