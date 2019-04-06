package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.CommerceUser;
import com.cenfotec.trebol.repository.CommerceUserRepository;
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
 * REST controller for managing CommerceUser.
 */
@RestController
@RequestMapping("/api")
public class CommerceUserResource {

    private final Logger log = LoggerFactory.getLogger(CommerceUserResource.class);

    private static final String ENTITY_NAME = "commerceUser";

    private final CommerceUserRepository commerceUserRepository;

    public CommerceUserResource(CommerceUserRepository commerceUserRepository) {
        this.commerceUserRepository = commerceUserRepository;
    }

    /**
     * POST  /commerce-users : Create a new commerceUser.
     *
     * @param commerceUser the commerceUser to create
     * @return the ResponseEntity with status 201 (Created) and with body the new commerceUser, or with status 400 (Bad Request) if the commerceUser has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/commerce-users")
    public ResponseEntity<CommerceUser> createCommerceUser(@RequestBody CommerceUser commerceUser) throws URISyntaxException {
        log.debug("REST request to save CommerceUser : {}", commerceUser);
        if (commerceUser.getId() != null) {
            throw new BadRequestAlertException("A new commerceUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CommerceUser result = commerceUserRepository.save(commerceUser);
        return ResponseEntity.created(new URI("/api/commerce-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /commerce-users : Updates an existing commerceUser.
     *
     * @param commerceUser the commerceUser to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated commerceUser,
     * or with status 400 (Bad Request) if the commerceUser is not valid,
     * or with status 500 (Internal Server Error) if the commerceUser couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/commerce-users")
    public ResponseEntity<CommerceUser> updateCommerceUser(@RequestBody CommerceUser commerceUser) throws URISyntaxException {
        log.debug("REST request to update CommerceUser : {}", commerceUser);
        if (commerceUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CommerceUser result = commerceUserRepository.save(commerceUser);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, commerceUser.getId().toString()))
            .body(result);
    }

    /**
     * GET  /commerce-users : get all the commerceUsers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of commerceUsers in body
     */
    @GetMapping("/commerce-users")
    public List<CommerceUser> getAllCommerceUsers() {
        log.debug("REST request to get all CommerceUsers");
        return commerceUserRepository.findAll();
    }

    /**
     * GET  /commerce-users/:id : get the "id" commerceUser.
     *
     * @param id the id of the commerceUser to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the commerceUser, or with status 404 (Not Found)
     */
    @GetMapping("/commerce-users/{id}")
    public ResponseEntity<CommerceUser> getCommerceUser(@PathVariable Long id) {
        log.debug("REST request to get CommerceUser : {}", id);
        Optional<CommerceUser> commerceUser = commerceUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(commerceUser);
    }

    /**
     * DELETE  /commerce-users/:id : delete the "id" commerceUser.
     *
     * @param id the id of the commerceUser to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/commerce-users/{id}")
    public ResponseEntity<Void> deleteCommerceUser(@PathVariable Long id) {
        log.debug("REST request to delete CommerceUser : {}", id);
        commerceUserRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
