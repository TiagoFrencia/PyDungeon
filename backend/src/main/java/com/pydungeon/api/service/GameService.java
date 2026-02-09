package com.pydungeon.api.service;

import com.pydungeon.api.domain.Level;
import com.pydungeon.api.repository.LevelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameService.class);

    @Autowired
    private LevelRepository levelRepository;

    public Level jumpToLevel(Long levelId) {
        return levelRepository.findById(levelId)
                .orElseThrow(() -> new RuntimeException("Level not found: " + levelId));
    }

    public ExecutionResult submitCode(Long levelId, String code) {
        logger.info("Received code submission for Level ID: {}", levelId);
        logger.debug("Submitted Code: {}", code);

        // Validation: Ensure level exists
        if (levelId != null) {
            levelRepository.findById(levelId).ifPresentOrElse(
                    level -> logger.info("Processing submission for level: {}", level.getName()),
                    () -> logger.warn("Level ID {} not found", levelId));
        }

        // Logic check (Simulated for now as actual execution is in Frontend)
        // In a real scenario, we would save the progress here, e.g.,
        // progressRepository.save(...)

        logger.info("Code submission processed successfully (Backend execution skipped).");
        return new ExecutionResult(true, "Submission received. Execution handled by client.");
    }

    // DTO for the result
    public static class ExecutionResult {
        public boolean success;
        public String message;
        // Fields kept for backward compatibility if needed, though unused now
        public List<String> logs;
        public String output;

        public ExecutionResult(boolean success, String message) {
            this.success = success;
            this.message = message;
            this.logs = List.of();
            this.output = "";
        }
    }
}
