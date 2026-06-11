package com.ymmo.ymmo_api.service;

import com.ymmo.ymmo_api.entity.Bien;
import com.ymmo.ymmo_api.repository.BienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BienService {

    private final BienRepository bienRepository;

    public List<Bien> getAll() {
        return bienRepository.findAll();
    }

    public Bien getById(Long id) {
        return bienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bien non trouvé"));
    }

    public List<Bien> getByVille(String ville) {
        return bienRepository.findByVille(ville);
    }

    public List<Bien> getByType(Bien.TypeBien type) {
        return bienRepository.findByType(type);
    }

    public List<Bien> getByStatut(Bien.StatutBien statut) {
        return bienRepository.findByStatut(statut);
    }

    public List<Bien> getByPrix(Double min, Double max) {
        return bienRepository.findByPrixBetween(min, max);
    }

    public Bien create(Bien bien) {
        return bienRepository.save(bien);
    }

    public Bien update(Long id, Bien bienDetails) {
        Bien bien = getById(id);
        bien.setTitre(bienDetails.getTitre());
        bien.setDescription(bienDetails.getDescription());
        bien.setPrix(bienDetails.getPrix());
        bien.setAdresse(bienDetails.getAdresse());
        bien.setVille(bienDetails.getVille());
        bien.setCodePostal(bienDetails.getCodePostal());
        bien.setSurface(bienDetails.getSurface());
        bien.setNbPieces(bienDetails.getNbPieces());
        bien.setType(bienDetails.getType());
        bien.setStatut(bienDetails.getStatut());
        return bienRepository.save(bien);
    }

    public void delete(Long id) {
        bienRepository.deleteById(id);
    }
}
