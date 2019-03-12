package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ParametersCommerce;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ParametersCommerce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParametersCommerceRepository extends JpaRepository<ParametersCommerce, Long> {

}
