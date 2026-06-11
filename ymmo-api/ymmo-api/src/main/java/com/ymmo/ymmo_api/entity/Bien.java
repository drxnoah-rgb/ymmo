package com.ymmo.ymmo_api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "biens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double prix;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String codePostal;

    @Column(nullable = false)
    private Double surface;

    @Column(nullable = false)
    private Integer nbPieces;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeBien type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutBien statut;

    @ManyToOne
    @JoinColumn(name = "agence_id")
    private Agence agence;

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL)
    private List<Photo> photos;

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL)
    private List<Transaction> transactions;

    public enum TypeBien {
        APPARTEMENT, MAISON, BUREAU, TERRAIN, COMMERCE
    }

    public enum StatutBien {
        DISPONIBLE, VENDU, EN_COURS
    }
}
