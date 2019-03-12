package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ProductsPerOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ProductsPerOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductsPerOrderRepository extends JpaRepository<ProductsPerOrder, Long> {

}
