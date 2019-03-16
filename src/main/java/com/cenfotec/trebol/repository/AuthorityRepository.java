package com.cenfotec.trebol.repository;

import com.cenfotec.trebol.domain.Authority;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Authority entity.
 */
@Repository
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
