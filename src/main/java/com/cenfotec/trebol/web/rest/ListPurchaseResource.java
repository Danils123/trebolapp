package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.ListPurchase;
import com.cenfotec.trebol.repository.ListPurchaseRepository;
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
 * REST controller for managing ListPurchase.
 */
@RestController
@RequestMapping("/api")
public class ListPurchaseResource {

    private final Logger log = LoggerFactory.getLogger(ListPurchaseResource.class);

    private static final String ENTITY_NAME = "listPurchase";

    private final ListPurchaseRepository listPurchaseRepository;

    public ListPurchaseResource(ListPurchaseRepository listPurchaseRepository) {
        this.listPurchaseRepository = listPurchaseRepository;
    }

    /**
     * POST  /list-purchases : Create a new listPurchase.
     *
     * @param listPurchase the listPurchase to create
     * @return the ResponseEntity with status 201 (Created) and with body the new listPurchase, or with status 400 (Bad Request) if the listPurchase has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/list-purchases")
    public ResponseEntity<ListPurchase> createListPurchase(@RequestBody ListPurchase listPurchase) throws URISyntaxException {
        log.debug("REST request to save ListPurchase : {}", listPurchase);
        if (listPurchase.getId() != null) {
            throw new BadRequestAlertException("A new listPurchase cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ListPurchase result = listPurchaseRepository.save(listPurchase);
        return ResponseEntity.created(new URI("/api/list-purchases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /list-purchases : Updates an existing listPurchase.
     *
     * @param listPurchase the listPurchase to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated listPurchase,
     * or with status 400 (Bad Request) if the listPurchase is not valid,
     * or with status 500 (Internal Server Error) if the listPurchase couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/list-purchases")
    public ResponseEntity<ListPurchase> updateListPurchase(@RequestBody ListPurchase listPurchase) throws URISyntaxException {
        log.debug("REST request to update ListPurchase : {}", listPurchase);
        if (listPurchase.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ListPurchase result = listPurchaseRepository.save(listPurchase);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, listPurchase.getId().toString()))
            .body(result);
    }

    /**
     * GET  /list-purchases : get all the listPurchases.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of listPurchases in body
     */
    @GetMapping("/list-purchases")
    public List<ListPurchase> getAllListPurchases() {
        log.debug("REST request to get all ListPurchases");
        return listPurchaseRepository.findAll();
    }

    /**
     * GET  /list-purchases/:id : get the "id" listPurchase.
     *
     * @param id the id of the listPurchase to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the listPurchase, or with status 404 (Not Found)
     */
    @GetMapping("/list-purchases/{id}")
    public ResponseEntity<ListPurchase> getListPurchase(@PathVariable Long id) {
        log.debug("REST request to get ListPurchase : {}", id);
        Optional<ListPurchase> listPurchase = listPurchaseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(listPurchase);
    }

    /**
     * DELETE  /list-purchases/:id : delete the "id" listPurchase.
     *
     * @param id the id of the listPurchase to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/list-purchases/{id}")
    public ResponseEntity<Void> deleteListPurchase(@PathVariable Long id) {
        log.debug("REST request to delete ListPurchase : {}", id);
        listPurchaseRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
