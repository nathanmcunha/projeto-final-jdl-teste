package br.jdl.projetofinal.teste.web.rest;
import br.jdl.projetofinal.teste.domain.Predio;
import br.jdl.projetofinal.teste.repository.PredioRepository;
import br.jdl.projetofinal.teste.repository.search.PredioSearchRepository;
import br.jdl.projetofinal.teste.web.rest.errors.BadRequestAlertException;
import br.jdl.projetofinal.teste.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Predio.
 */
@RestController
@RequestMapping("/api")
public class PredioResource {

    private final Logger log = LoggerFactory.getLogger(PredioResource.class);

    private static final String ENTITY_NAME = "predio";

    private final PredioRepository predioRepository;

    private final PredioSearchRepository predioSearchRepository;

    public PredioResource(PredioRepository predioRepository, PredioSearchRepository predioSearchRepository) {
        this.predioRepository = predioRepository;
        this.predioSearchRepository = predioSearchRepository;
    }

    /**
     * POST  /predios : Create a new predio.
     *
     * @param predio the predio to create
     * @return the ResponseEntity with status 201 (Created) and with body the new predio, or with status 400 (Bad Request) if the predio has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/predios")
    public ResponseEntity<Predio> createPredio(@RequestBody Predio predio) throws URISyntaxException {
        log.debug("REST request to save Predio : {}", predio);
        if (predio.getId() != null) {
            throw new BadRequestAlertException("A new predio cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Predio result = predioRepository.save(predio);
        predioSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/predios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /predios : Updates an existing predio.
     *
     * @param predio the predio to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated predio,
     * or with status 400 (Bad Request) if the predio is not valid,
     * or with status 500 (Internal Server Error) if the predio couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/predios")
    public ResponseEntity<Predio> updatePredio(@RequestBody Predio predio) throws URISyntaxException {
        log.debug("REST request to update Predio : {}", predio);
        if (predio.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Predio result = predioRepository.save(predio);
        predioSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, predio.getId().toString()))
            .body(result);
    }

    /**
     * GET  /predios : get all the predios.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of predios in body
     */
    @GetMapping("/predios")
    public List<Predio> getAllPredios() {
        log.debug("REST request to get all Predios");
        return predioRepository.findAll();
    }

    /**
     * GET  /predios/:id : get the "id" predio.
     *
     * @param id the id of the predio to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the predio, or with status 404 (Not Found)
     */
    @GetMapping("/predios/{id}")
    public ResponseEntity<Predio> getPredio(@PathVariable Long id) {
        log.debug("REST request to get Predio : {}", id);
        Optional<Predio> predio = predioRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(predio);
    }

    /**
     * DELETE  /predios/:id : delete the "id" predio.
     *
     * @param id the id of the predio to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/predios/{id}")
    public ResponseEntity<Void> deletePredio(@PathVariable Long id) {
        log.debug("REST request to delete Predio : {}", id);
        predioRepository.deleteById(id);
        predioSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/predios?query=:query : search for the predio corresponding
     * to the query.
     *
     * @param query the query of the predio search
     * @return the result of the search
     */
    @GetMapping("/_search/predios")
    public List<Predio> searchPredios(@RequestParam String query) {
        log.debug("REST request to search Predios for query {}", query);
        return StreamSupport
            .stream(predioSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
