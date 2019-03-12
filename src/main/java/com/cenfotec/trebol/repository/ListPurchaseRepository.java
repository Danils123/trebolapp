package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ListPurchase;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ListPurchase entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ListPurchaseRepository extends JpaRepository<ListPurchase, Long> {

}
