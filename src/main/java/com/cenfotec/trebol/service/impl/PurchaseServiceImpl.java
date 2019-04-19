package com.cenfotec.trebol.service.impl;

import com.cenfotec.trebol.service.PurchaseService;
import com.cenfotec.trebol.domain.Purchase;
import com.cenfotec.trebol.repository.PurchaseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing Purchase.
 */
@Service
@Transactional
public class PurchaseServiceImpl implements PurchaseService {

    private final Logger log = LoggerFactory.getLogger(PurchaseServiceImpl.class);

    private final PurchaseRepository purchaseRepository;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    /**
     * Save a purchase.
     *
     * @param purchase the entity to save
     * @return the persisted entity
     */
    @Override
    public Purchase save(Purchase purchase) {
        log.debug("Request to save Purchase : {}", purchase);
        return purchaseRepository.save(purchase);
    }

    /**
     * Get all the purchases.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Purchase> findAll(Pageable pageable) {
        log.debug("Request to get all Purchases");
        return purchaseRepository.findAll(pageable);
    }


    /**
     * Get one purchase by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Purchase> findOne(Long id) {
        log.debug("Request to get Purchase : {}", id);
        return purchaseRepository.findById(id);
    }

    /**
     * Delete the purchase by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Purchase : {}", id);
        purchaseRepository.deleteById(id);
    }
}
