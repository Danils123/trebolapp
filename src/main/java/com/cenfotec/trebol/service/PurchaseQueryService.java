package com.cenfotec.trebol.service;

import java.util.List;

import javax.persistence.criteria.JoinType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import com.cenfotec.trebol.domain.Purchase;
import com.cenfotec.trebol.domain.*; // for static metamodels
import com.cenfotec.trebol.repository.PurchaseRepository;
import com.cenfotec.trebol.service.dto.PurchaseCriteria;

/**
 * Service for executing complex queries for Purchase entities in the database.
 * The main input is a {@link PurchaseCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Purchase} or a {@link Page} of {@link Purchase} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class PurchaseQueryService extends QueryService<Purchase> {

    private final Logger log = LoggerFactory.getLogger(PurchaseQueryService.class);

    private final PurchaseRepository purchaseRepository;

    public PurchaseQueryService(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    /**
     * Return a {@link List} of {@link Purchase} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Purchase> findByCriteria(PurchaseCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Purchase> specification = createSpecification(criteria);
        return purchaseRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Purchase} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Purchase> findByCriteria(PurchaseCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Purchase> specification = createSpecification(criteria);
        return purchaseRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(PurchaseCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Purchase> specification = createSpecification(criteria);
        return purchaseRepository.count(specification);
    }

    /**
     * Function to convert PurchaseCriteria to a {@link Specification}
     */
    private Specification<Purchase> createSpecification(PurchaseCriteria criteria) {
        Specification<Purchase> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), Purchase_.id));
            }
            if (criteria.getState() != null) {
                specification = specification.and(buildStringSpecification(criteria.getState(), Purchase_.state));
            }
            if (criteria.getHomeDelivery() != null) {
                specification = specification.and(buildSpecification(criteria.getHomeDelivery(), Purchase_.homeDelivery));
            }
            if (criteria.getPaymentId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getPaymentId(), Purchase_.paymentId));
            }
            if (criteria.getOrderId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getOrderId(), Purchase_.orderId));
            }
        }
        return specification;
    }
}
