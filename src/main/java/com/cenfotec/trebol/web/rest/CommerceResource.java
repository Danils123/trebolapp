package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.Commerce;
import com.cenfotec.trebol.repository.CommerceRepository;
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
 * REST controller for managing Commerce.
 */
@RestController
@RequestMapping("/api")
public class CommerceResource {

    private final Logger log = LoggerFactory.getLogger(CommerceResource.class);

    private static final String ENTITY_NAME = "commerce";

    private final CommerceRepository commerceRepository;

    public CommerceResource(CommerceRepository commerceRepository) {
        this.commerceRepository = commerceRepository;
    }

    /**
     * POST  /commerce : Create a new commerce.
     *
     * @param commerce the commerce to create
     * @return the ResponseEntity with status 201 (Created) and with body the new commerce, or with status 400 (Bad Request) if the commerce has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/commerce")
    public ResponseEntity<Commerce> createCommerce(@RequestBody Commerce commerce) throws URISyntaxException {
        log.debug("REST request to save Commerce : {}", commerce);
        if (commerce.getId() != null) {
            throw new BadRequestAlertException("A new commerce cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Commerce result = commerceRepository.save(commerce);
        return ResponseEntity.created(new URI("/api/commerce/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /commerce : Updates an existing commerce.
     *
     * @param commerce the commerce to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated commerce,
     * or with status 400 (Bad Request) if the commerce is not valid,
     * or with status 500 (Internal Server Error) if the commerce couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/commerce")
    public ResponseEntity<Commerce> updateCommerce(@RequestBody Commerce commerce) throws URISyntaxException {
        log.debug("REST request to update Commerce : {}", commerce);
        if (commerce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Commerce result = commerceRepository.save(commerce);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, commerce.getId().toString()))
            .body(result);
    }

    /**
     * GET  /commerce : get all the commerce.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of commerce in body
     */
    @GetMapping("/commerce")
    public List<Commerce> getAllCommerce() {
        log.debug("REST request to get all Commerce");
        return commerceRepository.findAll();
    }

    /**
     * GET  /commerce/:id : get the "id" commerce.
     *
     * @param id the id of the commerce to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the commerce, or with status 404 (Not Found)
     */
    @GetMapping("/commerce/{id}")
    public ResponseEntity<Commerce> getCommerce(@PathVariable Long id) {
        log.debug("REST request to get Commerce : {}", id);
        Optional<Commerce> commerce = commerceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(commerce);
    }

    /**
     * DELETE  /commerce/:id : delete the "id" commerce.
     *
     * @param id the id of the commerce to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/commerce/{id}")
    public ResponseEntity<Void> deleteCommerce(@PathVariable Long id) {
        log.debug("REST request to delete Commerce : {}", id);
        commerceRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
