package com.pydungeon.api.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT", name = "initial_code")
    private String initialCode;

    @Column(name = "solution_criteria")
    private String solutionCriteria;

    @Column(columnDefinition = "TEXT", name = "grid_layout")
    private String gridLayout;

    @Column(name = "type")
    private String type; // "GRID" or "GRAPHIC"
}
