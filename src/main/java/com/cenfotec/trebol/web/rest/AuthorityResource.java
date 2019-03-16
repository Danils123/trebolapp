package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.domain.Authority;
import com.cenfotec.trebol.repository.AuthorityRepository;
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

@RestController
@RequestMapping("/api")
public class AuthorityResource {
    private final Logger log = LoggerFactory.getLogger(AuthorityResource.class);
    private static final String ENTITY_NAME = "Authority";
    private final AuthorityRepository authorityRepository;

    public AuthorityResource(AuthorityRepository authorityRepository){this.authorityRepository = authorityRepository;}

    /**
     * POST  /Authorities : Create a new category.
     *
     * @param authority the authority to create
     * @return the ResponseEntity with status 201 (Created) and with body the new authority, or with status 400 (Bad Request) if the authority has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/authorities")
    public ResponseEntity<Authority> createAuthority(@RequestBody Authority authority) throws URISyntaxException {
        log.debug("REST request to save Authority : {}", authority);
        if (authority.getName() != null) {
            throw new BadRequestAlertException("A new authority cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Authority result = authorityRepository.save(authority);
        return ResponseEntity.created(new URI("/api/authorities/" + result.getName()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getName().toString()))
            .body(result);
    }

    /**
     * PUT  /authorities : Updates an existing authority.
     *
     * @param authority the authority to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated authority,
     * or with status 400 (Bad Request) if the authority is not valid,
     * or with status 500 (Internal Server Error) if the authority couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/authorities")
    public ResponseEntity<Authority> updateAuthority(@RequestBody Authority authority) throws URISyntaxException {
        log.debug("REST request to update Authority : {}", authority);
        if (authority.getName() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Authority result = authorityRepository.save(authority);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, authority.getName().toString()))
            .body(result);
    }

    /**
     * GET  /authorities : get all the authorities.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of authorities in body
     */
    @GetMapping("/authorities")
    public List<Authority> getAllAuthorities() {
        log.debug("REST request to get all Authorities");
        return authorityRepository.findAll();
    }

    /**
     * GET  /authorities/:name : get the "name" authority.
     *
     * @param name the name of the authority to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the category, or with status 404 (Not Found)
     */
    @GetMapping("/authorities/{name}")
    public ResponseEntity<Authority> getAuthority(@PathVariable String name) {
        log.debug("REST request to get Authority : {}", name);
        Optional<Authority> authority = authorityRepository.findById(name);
        return ResponseUtil.wrapOrNotFound(authority);
    }

    /**
     * DELETE  /authorities/:name : delete the "name" authority.
     *
     * @param name the name of the authority to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/authorities/{name}")
    public ResponseEntity<Void> deleteAuthority(@PathVariable String name) {
        log.debug("REST request to delete Authority : {}", name);
        authorityRepository.deleteById(name);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, name.toString())).build();
    }
}
