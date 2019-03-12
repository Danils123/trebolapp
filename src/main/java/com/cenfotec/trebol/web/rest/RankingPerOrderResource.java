package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.RankingPerOrder;
import com.cenfotec.trebol.repository.RankingPerOrderRepository;
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
 * REST controller for managing RankingPerOrder.
 */
@RestController
@RequestMapping("/api")
public class RankingPerOrderResource {

    private final Logger log = LoggerFactory.getLogger(RankingPerOrderResource.class);

    private static final String ENTITY_NAME = "rankingPerOrder";

    private final RankingPerOrderRepository rankingPerOrderRepository;

    public RankingPerOrderResource(RankingPerOrderRepository rankingPerOrderRepository) {
        this.rankingPerOrderRepository = rankingPerOrderRepository;
    }

    /**
     * POST  /ranking-per-orders : Create a new rankingPerOrder.
     *
     * @param rankingPerOrder the rankingPerOrder to create
     * @return the ResponseEntity with status 201 (Created) and with body the new rankingPerOrder, or with status 400 (Bad Request) if the rankingPerOrder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/ranking-per-orders")
    public ResponseEntity<RankingPerOrder> createRankingPerOrder(@RequestBody RankingPerOrder rankingPerOrder) throws URISyntaxException {
        log.debug("REST request to save RankingPerOrder : {}", rankingPerOrder);
        if (rankingPerOrder.getId() != null) {
            throw new BadRequestAlertException("A new rankingPerOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RankingPerOrder result = rankingPerOrderRepository.save(rankingPerOrder);
        return ResponseEntity.created(new URI("/api/ranking-per-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /ranking-per-orders : Updates an existing rankingPerOrder.
     *
     * @param rankingPerOrder the rankingPerOrder to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated rankingPerOrder,
     * or with status 400 (Bad Request) if the rankingPerOrder is not valid,
     * or with status 500 (Internal Server Error) if the rankingPerOrder couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/ranking-per-orders")
    public ResponseEntity<RankingPerOrder> updateRankingPerOrder(@RequestBody RankingPerOrder rankingPerOrder) throws URISyntaxException {
        log.debug("REST request to update RankingPerOrder : {}", rankingPerOrder);
        if (rankingPerOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        RankingPerOrder result = rankingPerOrderRepository.save(rankingPerOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, rankingPerOrder.getId().toString()))
            .body(result);
    }

    /**
     * GET  /ranking-per-orders : get all the rankingPerOrders.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of rankingPerOrders in body
     */
    @GetMapping("/ranking-per-orders")
    public List<RankingPerOrder> getAllRankingPerOrders(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all RankingPerOrders");
        return rankingPerOrderRepository.findAllWithEagerRelationships();
    }

    /**
     * GET  /ranking-per-orders/:id : get the "id" rankingPerOrder.
     *
     * @param id the id of the rankingPerOrder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the rankingPerOrder, or with status 404 (Not Found)
     */
    @GetMapping("/ranking-per-orders/{id}")
    public ResponseEntity<RankingPerOrder> getRankingPerOrder(@PathVariable Long id) {
        log.debug("REST request to get RankingPerOrder : {}", id);
        Optional<RankingPerOrder> rankingPerOrder = rankingPerOrderRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(rankingPerOrder);
    }

    /**
     * DELETE  /ranking-per-orders/:id : delete the "id" rankingPerOrder.
     *
     * @param id the id of the rankingPerOrder to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/ranking-per-orders/{id}")
    public ResponseEntity<Void> deleteRankingPerOrder(@PathVariable Long id) {
        log.debug("REST request to delete RankingPerOrder : {}", id);
        rankingPerOrderRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
