
-- Bảng Users
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE INDEX idx_users_username ON users(username);

-- Bảng Session 
CREATE TABLE IF NOT EXISTS session (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_user_id ON session(user_id);

-- Bảng Quiz 
CREATE TABLE IF NOT EXISTS quiz (
    quiz_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Questions 
CREATE TABLE IF NOT EXISTS question (
    question_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    type VARCHAR(50),
    is_public BOOLEAN DEFAULT true,
    author_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);

-- Mapping Quiz và Questions 
CREATE TABLE IF NOT EXISTS quizquestion (
    quiz_id INTEGER REFERENCES quiz(quiz_id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES question(question_id) ON DELETE CASCADE,
    PRIMARY KEY (quiz_id, question_id)
);

-- Bảng Answer cho Questions 
CREATE TABLE IF NOT EXISTS question_answer (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES question(question_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_true BOOLEAN DEFAULT false
);

-- Bảng Rooms 
CREATE TABLE IF NOT EXISTS room (
    room_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    quiz_id INTEGER REFERENCES quiz(quiz_id) ON DELETE CASCADE,
    host_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    mode VARCHAR(50), -- e.g., "practice" or "test"
    is_private BOOLEAN DEFAULT false,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rooms_code ON room(code);
CREATE INDEX idx_rooms_host ON room(host_id);

-- Room Participants 
CREATE TABLE IF NOT EXISTS room_participant (
    room_participant_id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES room(room_id) ON DELETE CASCADE,
    participant_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    opened_at TIMESTAMP,
    UNIQUE(room_id, participant_id)
);

-- Bảng Feedback 
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES room(room_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    comments TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Participant Answer 
CREATE TABLE IF NOT EXISTS participant_answer (
    room_participant_id INTEGER REFERENCES room_participant(room_participant_id) ON DELETE CASCADE,
    question_quiz_id INTEGER REFERENCES quizquestion(quiz_id) ON DELETE CASCADE,
    answer_id INTEGER REFERENCES question_answer(id) ON DELETE CASCADE,
    PRIMARY KEY (room_participant_id, question_quiz_id)
);
