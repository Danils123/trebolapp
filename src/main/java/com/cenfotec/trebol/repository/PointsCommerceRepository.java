package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.PointsCommerce;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PointsCommerce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointsCommerceRepository extends JpaRepository<PointsCommerce, Long> {

}
