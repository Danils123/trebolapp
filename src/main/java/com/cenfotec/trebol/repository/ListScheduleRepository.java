package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ListSchedule;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ListSchedule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ListScheduleRepository extends JpaRepository<ListSchedule, Long> {

}
