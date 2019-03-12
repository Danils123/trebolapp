package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ScheduleCommerce;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ScheduleCommerce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScheduleCommerceRepository extends JpaRepository<ScheduleCommerce, Long> {

}
