package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.CommerceUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CommerceUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommerceUserRepository extends JpaRepository<CommerceUser, Long> {

}
