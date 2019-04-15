package com.cenfotec.trebol.repository;

import java.util.List;

import com.cenfotec.trebol.domain.Commerce;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Commerce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommerceRepository extends JpaRepository<Commerce, Long> {

    List<Commerce> findByUserExtraId(Long userId);
    List<Commerce> findByOwnerId(Long userId);
    List<Commerce> findByState(Boolean state);
}
