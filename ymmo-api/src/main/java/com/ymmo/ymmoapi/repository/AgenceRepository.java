package com.ymmo.ymmoapi.repository;

import com.ymmo.ymmoapi.entity.Agence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AgenceRepository extends JpaRepository<Agence, Long> {
    Optional<Agence> findByNom(String nom);
    Optional<Agence> findByVille(String ville);
}