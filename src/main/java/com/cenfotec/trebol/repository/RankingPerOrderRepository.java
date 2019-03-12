package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.RankingPerOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the RankingPerOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RankingPerOrderRepository extends JpaRepository<RankingPerOrder, Long> {

    @Query(value = "select distinct ranking_per_order from RankingPerOrder ranking_per_order left join fetch ranking_per_order.buyers left join fetch ranking_per_order.sellers",
        countQuery = "select count(distinct ranking_per_order) from RankingPerOrder ranking_per_order")
    Page<RankingPerOrder> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct ranking_per_order from RankingPerOrder ranking_per_order left join fetch ranking_per_order.buyers left join fetch ranking_per_order.sellers")
    List<RankingPerOrder> findAllWithEagerRelationships();

    @Query("select ranking_per_order from RankingPerOrder ranking_per_order left join fetch ranking_per_order.buyers left join fetch ranking_per_order.sellers where ranking_per_order.id =:id")
    Optional<RankingPerOrder> findOneWithEagerRelationships(@Param("id") Long id);

}
