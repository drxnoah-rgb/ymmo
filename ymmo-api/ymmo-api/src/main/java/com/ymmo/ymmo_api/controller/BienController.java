package com.ymmo.ymmo_api.controller;

import com.ymmo.ymmo_api.entity.Bien;
import com.ymmo.ymmo_api.service.BienService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/biens")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BienController {

    private final BienService bienService;

    @GetMapping
    public ResponseEntity<List<Bien>> getAll() {
        return ResponseEntity.ok(bienService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bien> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bienService.getById(id));
    }

    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<Bien>> getByVille(@PathVariable String ville) {
        return ResponseEntity.ok(bienService.getByVille(ville));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Bien>> getByType(@PathVariable Bien.TypeBien type) {
        return ResponseEntity.ok(bienService.getByType(type));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Bien>> getByStatut(@PathVariable Bien.StatutBien statut) {
        return ResponseEntity.ok(bienService.getByStatut(statut));
    }

    @GetMapping("/prix")
    public ResponseEntity<List<Bien>> getByPrix(@RequestParam Double min, @RequestParam Double max) {
        return ResponseEntity.ok(bienService.getByPrix(min, max));
    }

    @PostMapping
    public ResponseEntity<Bien> create(@RequestBody Bien bien) {
        return ResponseEntity.ok(bienService.create(bien));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bien> update(@PathVariable Long id, @RequestBody Bien bien) {
        return ResponseEntity.ok(bienService.update(id, bien));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bienService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
