package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.PointsCommerce;
import com.cenfotec.trebol.repository.PointsCommerceRepository;
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
 * REST controller for managing PointsCommerce.
 */
@RestController
@RequestMapping("/api")
public class PointsCommerceResource {

    private final Logger log = LoggerFactory.getLogger(PointsCommerceResource.class);

    private static final String ENTITY_NAME = "pointsCommerce";

    private final PointsCommerceRepository pointsCommerceRepository;

    public PointsCommerceResource(PointsCommerceRepository pointsCommerceRepository) {
        this.pointsCommerceRepository = pointsCommerceRepository;
    }

    /**
     * POST  /points-commerces : Create a new pointsCommerce.
     *
     * @param pointsCommerce the pointsCommerce to create
     * @return the ResponseEntity with status 201 (Created) and with body the new pointsCommerce, or with status 400 (Bad Request) if the pointsCommerce has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/points-commerces")
    public ResponseEntity<PointsCommerce> createPointsCommerce(@RequestBody PointsCommerce pointsCommerce) throws URISyntaxException {
        log.debug("REST request to save PointsCommerce : {}", pointsCommerce);
        if (pointsCommerce.getId() != null) {
            throw new BadRequestAlertException("A new pointsCommerce cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PointsCommerce result = pointsCommerceRepository.save(pointsCommerce);
        return ResponseEntity.created(new URI("/api/points-commerces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /points-commerces : Updates an existing pointsCommerce.
     *
     * @param pointsCommerce the pointsCommerce to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated pointsCommerce,
     * or with status 400 (Bad Request) if the pointsCommerce is not valid,
     * or with status 500 (Internal Server Error) if the pointsCommerce couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/points-commerces")
    public ResponseEntity<PointsCommerce> updatePointsCommerce(@RequestBody PointsCommerce pointsCommerce) throws URISyntaxException {
        log.debug("REST request to update PointsCommerce : {}", pointsCommerce);
        if (pointsCommerce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PointsCommerce result = pointsCommerceRepository.save(pointsCommerce);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, pointsCommerce.getId().toString()))
            .body(result);
    }

    /**
     * GET  /points-commerces : get all the pointsCommerces.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of pointsCommerces in body
     */
    @GetMapping("/points-commerces")
    public List<PointsCommerce> getAllPointsCommerces() {
        log.debug("REST request to get all PointsCommerces");
        return pointsCommerceRepository.findAll();
    }

    /**
     * GET  /points-commerces/:id : get the "id" pointsCommerce.
     *
     * @param id the id of the pointsCommerce to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the pointsCommerce, or with status 404 (Not Found)
     */
    @GetMapping("/points-commerces/{id}")
    public ResponseEntity<PointsCommerce> getPointsCommerce(@PathVariable Long id) {
        log.debug("REST request to get PointsCommerce : {}", id);
        Optional<PointsCommerce> pointsCommerce = pointsCommerceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pointsCommerce);
    }

    /**
     * DELETE  /points-commerces/:id : delete the "id" pointsCommerce.
     *
     * @param id the id of the pointsCommerce to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/points-commerces/{id}")
    public ResponseEntity<Void> deletePointsCommerce(@PathVariable Long id) {
        log.debug("REST request to delete PointsCommerce : {}", id);
        pointsCommerceRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
