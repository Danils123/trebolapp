package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.Purchase;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Purchase entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long>, JpaSpecificationExecutor<Purchase> {

}
