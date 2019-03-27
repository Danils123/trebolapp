package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.Commerce;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Spring Data repository for the Commerce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommerceRepository extends JpaRepository<Commerce, Long> {
    List<Commerce> findByUserExtraId(Long userId);
}
