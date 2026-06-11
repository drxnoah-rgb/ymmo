package com.ymmo.ymmo_api.repository;

import com.ymmo.ymmo_api.entity.Bien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BienRepository extends JpaRepository<Bien, Long> {
    List<Bien> findByVille(String ville);
    List<Bien> findByType(Bien.TypeBien type);
    List<Bien> findByStatut(Bien.StatutBien statut);
    List<Bien> findByPrixBetween(Double min, Double max);
    List<Bien> findByAgenceId(Long agenceId);
}
