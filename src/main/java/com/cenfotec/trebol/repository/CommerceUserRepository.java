package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.CommerceUser;
import com.cenfotec.trebol.domain.UserExtra;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Spring Data  repository for the CommerceUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommerceUserRepository extends JpaRepository<CommerceUser, Long> {
    
    List<CommerceUser> findByIdUser(Long idUser);
    List<CommerceUser> findByIdCommerce(Long idCommerce);
}
