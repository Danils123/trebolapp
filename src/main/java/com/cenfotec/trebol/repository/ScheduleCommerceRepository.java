package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ProductList;
import com.cenfotec.trebol.domain.ScheduleCommerce;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the ScheduleCommerce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScheduleCommerceRepository extends JpaRepository<ScheduleCommerce, Long> {
    List<ScheduleCommerce> findByCommerce_id(Long commerce_id);
}
