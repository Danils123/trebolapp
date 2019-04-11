package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.Offer;
import com.cenfotec.trebol.domain.Commerce;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Spring Data  repository for the Offer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    @Query(value = "select distinct offer from Offer offer left join fetch offer.commerces",
        countQuery = "select count(distinct offer) from Offer offer")
    Page<Offer> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct offer from Offer offer left join fetch offer.commerces")
    List<Offer> findAllWithEagerRelationships();

    @Query("select offer from Offer offer left join fetch offer.commerces where offer.id =:id")
    Optional<Offer> findOneWithEagerRelationships(@Param("id") Long id);

    List<Offer> findByCommerces(Set<Commerce> commerces);
}
