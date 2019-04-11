package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.OrderItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Set;

/**
 * Spring Data repository for the OrderItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    Set<OrderItem> findByCommerceIdOrderByDateAsc(Long commerceId);
}
