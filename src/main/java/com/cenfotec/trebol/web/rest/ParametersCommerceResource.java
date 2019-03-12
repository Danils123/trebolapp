package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.ParametersCommerce;
import com.cenfotec.trebol.repository.ParametersCommerceRepository;
import com.cenfotec.trebol.web.rest.errors.BadRequestAlertException;
import com.cenfotec.trebol.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ParametersCommerce.
 */
@RestController
@RequestMapping("/api")
public class ParametersCommerceResource {

    private final Logger log = LoggerFactory.getLogger(ParametersCommerceResource.class);

    private static final String ENTITY_NAME = "parametersCommerce";

    private final ParametersCommerceRepository parametersCommerceRepository;

    public ParametersCommerceResource(ParametersCommerceRepository parametersCommerceRepository) {
        this.parametersCommerceRepository = parametersCommerceRepository;
    }

    /**
     * POST  /parameters-commerces : Create a new parametersCommerce.
     *
     * @param parametersCommerce the parametersCommerce to create
     * @return the ResponseEntity with status 201 (Created) and with body the new parametersCommerce, or with status 400 (Bad Request) if the parametersCommerce has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/parameters-commerces")
    public ResponseEntity<ParametersCommerce> createParametersCommerce(@RequestBody ParametersCommerce parametersCommerce) throws URISyntaxException {
        log.debug("REST request to save ParametersCommerce : {}", parametersCommerce);
        if (parametersCommerce.getId() != null) {
            throw new BadRequestAlertException("A new parametersCommerce cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ParametersCommerce result = parametersCommerceRepository.save(parametersCommerce);
        return ResponseEntity.created(new URI("/api/parameters-commerces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /parameters-commerces : Updates an existing parametersCommerce.
     *
     * @param parametersCommerce the parametersCommerce to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated parametersCommerce,
     * or with status 400 (Bad Request) if the parametersCommerce is not valid,
     * or with status 500 (Internal Server Error) if the parametersCommerce couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/parameters-commerces")
    public ResponseEntity<ParametersCommerce> updateParametersCommerce(@RequestBody ParametersCommerce parametersCommerce) throws URISyntaxException {
        log.debug("REST request to update ParametersCommerce : {}", parametersCommerce);
        if (parametersCommerce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ParametersCommerce result = parametersCommerceRepository.save(parametersCommerce);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, parametersCommerce.getId().toString()))
            .body(result);
    }

    /**
     * GET  /parameters-commerces : get all the parametersCommerces.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of parametersCommerces in body
     */
    @GetMapping("/parameters-commerces")
    public List<ParametersCommerce> getAllParametersCommerces() {
        log.debug("REST request to get all ParametersCommerces");
        return parametersCommerceRepository.findAll();
    }

    /**
     * GET  /parameters-commerces/:id : get the "id" parametersCommerce.
     *
     * @param id the id of the parametersCommerce to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the parametersCommerce, or with status 404 (Not Found)
     */
    @GetMapping("/parameters-commerces/{id}")
    public ResponseEntity<ParametersCommerce> getParametersCommerce(@PathVariable Long id) {
        log.debug("REST request to get ParametersCommerce : {}", id);
        Optional<ParametersCommerce> parametersCommerce = parametersCommerceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parametersCommerce);
    }

    /**
     * DELETE  /parameters-commerces/:id : delete the "id" parametersCommerce.
     *
     * @param id the id of the parametersCommerce to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/parameters-commerces/{id}")
    public ResponseEntity<Void> deleteParametersCommerce(@PathVariable Long id) {
        log.debug("REST request to delete ParametersCommerce : {}", id);
        parametersCommerceRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
