package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ProductList;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the ProductList entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductListRepository extends JpaRepository<ProductList, Long> {
    List<ProductList> findByidlistpurchase(Integer idlistpurchase);
}
