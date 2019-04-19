package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ListPurchase;
import com.cenfotec.trebol.domain.ProductList;
import com.cenfotec.trebol.domain.ScheduleCommerce;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the ListPurchase entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ListPurchaseRepository extends JpaRepository<ListPurchase, Long> {

}
