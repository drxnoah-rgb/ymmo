package com.ymmo.ymmo_api.repository;

import com.ymmo.ymmo_api.entity.Agence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AgenceRepository extends JpaRepository<Agence, Long> {
    Optional<Agence> findByNom(String nom);
    Optional<Agence> findByVille(String ville);
}
