package com.pydungeon.api.controller;

import com.pydungeon.api.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @Autowired
    private GameService gameService;

    @PostMapping("/execute")
    public ResponseEntity<GameService.ExecutionResult> executeCode(@RequestBody ExecuteRequest request) {
        logger.info("Executing code request for Level: {}", request.getLevelId());

        GameService.ExecutionResult result = gameService.submitCode(request.getLevelId(), request.getCode());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/jump/{levelId}")
    public ResponseEntity<com.pydungeon.api.domain.Level> jumpToLevel(@PathVariable Long levelId) {
        return ResponseEntity.ok(gameService.jumpToLevel(levelId));
    }

    // DTO kept within controller for now, or could be moved to shared/dto package
    public static class ExecuteRequest {
        private String code;
        private Long levelId;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public Long getLevelId() {
            return levelId;
        }

        public void setLevelId(Long levelId) {
            this.levelId = levelId;
        }
    }
}
