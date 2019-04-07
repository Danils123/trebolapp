package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.Commerce;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Commerce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommerceRepository extends JpaRepository<Commerce, Long> {
    List<Commerce> findByUserExtraId(Long userId);
    
}
