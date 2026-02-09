package com.pydungeon.api.repository;

import com.pydungeon.api.domain.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LevelRepository extends JpaRepository<Level, Long> {
    boolean existsByName(String name);

    Level findByName(String name);
}
