package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.ProductCommerce;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the ProductCommerce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductCommerceRepository extends JpaRepository<ProductCommerce, Long> {

    @Query(value = "select distinct product_commerce from ProductCommerce product_commerce left join fetch product_commerce.productLists",
        countQuery = "select count(distinct product_commerce) from ProductCommerce product_commerce")
    Page<ProductCommerce> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct product_commerce from ProductCommerce product_commerce left join fetch product_commerce.productLists")
    List<ProductCommerce> findAllWithEagerRelationships();

    @Query("select product_commerce from ProductCommerce product_commerce left join fetch product_commerce.productLists where product_commerce.id =:id")
    Optional<ProductCommerce> findOneWithEagerRelationships(@Param("id") Long id);

    @Query(value = "select product_commerce from ProductCommerce product_commerce where product_commerce.commerce_id=:id")
    List<ProductCommerce> findByCommerceId(@Param("id") Long id);

}
