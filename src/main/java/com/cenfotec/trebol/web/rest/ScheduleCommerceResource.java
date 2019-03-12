package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.ScheduleCommerce;
import com.cenfotec.trebol.repository.ScheduleCommerceRepository;
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
 * REST controller for managing ScheduleCommerce.
 */
@RestController
@RequestMapping("/api")
public class ScheduleCommerceResource {

    private final Logger log = LoggerFactory.getLogger(ScheduleCommerceResource.class);

    private static final String ENTITY_NAME = "scheduleCommerce";

    private final ScheduleCommerceRepository scheduleCommerceRepository;

    public ScheduleCommerceResource(ScheduleCommerceRepository scheduleCommerceRepository) {
        this.scheduleCommerceRepository = scheduleCommerceRepository;
    }

    /**
     * POST  /schedule-commerces : Create a new scheduleCommerce.
     *
     * @param scheduleCommerce the scheduleCommerce to create
     * @return the ResponseEntity with status 201 (Created) and with body the new scheduleCommerce, or with status 400 (Bad Request) if the scheduleCommerce has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/schedule-commerces")
    public ResponseEntity<ScheduleCommerce> createScheduleCommerce(@RequestBody ScheduleCommerce scheduleCommerce) throws URISyntaxException {
        log.debug("REST request to save ScheduleCommerce : {}", scheduleCommerce);
        if (scheduleCommerce.getId() != null) {
            throw new BadRequestAlertException("A new scheduleCommerce cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ScheduleCommerce result = scheduleCommerceRepository.save(scheduleCommerce);
        return ResponseEntity.created(new URI("/api/schedule-commerces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /schedule-commerces : Updates an existing scheduleCommerce.
     *
     * @param scheduleCommerce the scheduleCommerce to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated scheduleCommerce,
     * or with status 400 (Bad Request) if the scheduleCommerce is not valid,
     * or with status 500 (Internal Server Error) if the scheduleCommerce couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/schedule-commerces")
    public ResponseEntity<ScheduleCommerce> updateScheduleCommerce(@RequestBody ScheduleCommerce scheduleCommerce) throws URISyntaxException {
        log.debug("REST request to update ScheduleCommerce : {}", scheduleCommerce);
        if (scheduleCommerce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ScheduleCommerce result = scheduleCommerceRepository.save(scheduleCommerce);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, scheduleCommerce.getId().toString()))
            .body(result);
    }

    /**
     * GET  /schedule-commerces : get all the scheduleCommerces.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of scheduleCommerces in body
     */
    @GetMapping("/schedule-commerces")
    public List<ScheduleCommerce> getAllScheduleCommerces() {
        log.debug("REST request to get all ScheduleCommerces");
        return scheduleCommerceRepository.findAll();
    }

    /**
     * GET  /schedule-commerces/:id : get the "id" scheduleCommerce.
     *
     * @param id the id of the scheduleCommerce to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the scheduleCommerce, or with status 404 (Not Found)
     */
    @GetMapping("/schedule-commerces/{id}")
    public ResponseEntity<ScheduleCommerce> getScheduleCommerce(@PathVariable Long id) {
        log.debug("REST request to get ScheduleCommerce : {}", id);
        Optional<ScheduleCommerce> scheduleCommerce = scheduleCommerceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(scheduleCommerce);
    }

    /**
     * DELETE  /schedule-commerces/:id : delete the "id" scheduleCommerce.
     *
     * @param id the id of the scheduleCommerce to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/schedule-commerces/{id}")
    public ResponseEntity<Void> deleteScheduleCommerce(@PathVariable Long id) {
        log.debug("REST request to delete ScheduleCommerce : {}", id);
        scheduleCommerceRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
