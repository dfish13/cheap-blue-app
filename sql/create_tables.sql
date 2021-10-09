CREATE TABLE IF NOT EXISTS players (
    player_id SERIAL,
    player_name VARCHAR(250) NOT NULL,
    player_hash VARCHAR(250) NOT NULL, 
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (player_id)
);

INSERT INTO players (player_name, player_token, is_admin)
VALUES ('admin', '$2a$10$a5KN/rJzzjX/h77r0E5W/eNE1On9LxyJGpmFMu/H9f91/gPnZSPI6', TRUE);
INSERT INTO players (player_name, player_token)
VALUES ('duncanfish', '$2a$10$cvaJQqxZ6KY0ht3husTk/O.zn/bnGml2LpGO3skIGLhMX5wlvMUc2');

CREATE TABLE IF NOT EXISTS games (
    game_id SERIAL,
    player_id INT NOT NULL,
    player_color CHAR(5) NOT NULL,
    pgn TEXT,
    result CHAR(4),
    PRIMARY KEY (game_id),

    CONSTRAINT fk_player
        FOREIGN KEY (player_id)
        REFERENCES players(player_id)
);

CREATE TABLE IF NOT EXISTS moves (
    move_id SERIAL,
    game_id INT NOT NULL,
    player_id INT NOT NULL,
    move_number INT NOT NULL,
    side CHAR(5) NOT NULL,
    move_text VARCHAR(20) NOT NULL,
    is_player_move BOOLEAN NOT NULL,
    PRIMARY KEY (move_id, game_id, player_id), 

    CONSTRAINT fk_player
        FOREIGN KEY (player_id)
        REFERENCES players(player_id),
    
    CONSTRAINT fk_game
        FOREIGN KEY (game_id)
        REFERENCES games(game_id)
);