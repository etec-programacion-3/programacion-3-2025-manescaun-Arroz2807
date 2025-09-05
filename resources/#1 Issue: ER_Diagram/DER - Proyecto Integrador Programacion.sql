CREATE TABLE `users` (
  `user_id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `registration_date` timestamp DEFAULT (current_timestamp)
);

CREATE TABLE `tasks` (
  `task_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id_FK` integer NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `due_date` date,
  `status` varchar(255) COMMENT 'pending, in_progress, completed',
  `created_at` timestamp DEFAULT (current_timestamp)
);

CREATE TABLE `notes` (
  `note_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id_FK` integer NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `created_at` timestamp DEFAULT (current_timestamp),
  `updated_at` timestamp
);

CREATE TABLE `files` (
  `file_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id_FK` integer NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `path` varchar(255) COMMENT 'file path or URL',
  `uploaded_at` timestamp DEFAULT (current_timestamp)
);

CREATE TABLE `task_collaborators` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `task_id_FK` integer NOT NULL,
  `collaborator_id_FK` integer NOT NULL,
  `added_at` timestamp DEFAULT (current_timestamp)
);

CREATE TABLE `note_collaborators` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `note_id_FK` integer NOT NULL,
  `collaborator_id_FK` integer NOT NULL,
  `added_at` timestamp DEFAULT (current_timestamp)
);

ALTER TABLE `tasks` ADD FOREIGN KEY (`user_id_FK`) REFERENCES `users` (`user_id`);

ALTER TABLE `notes` ADD FOREIGN KEY (`user_id_FK`) REFERENCES `users` (`user_id`);

ALTER TABLE `files` ADD FOREIGN KEY (`user_id_FK`) REFERENCES `users` (`user_id`);

ALTER TABLE `task_collaborators` ADD FOREIGN KEY (`task_id_FK`) REFERENCES `tasks` (`task_id`);

ALTER TABLE `task_collaborators` ADD FOREIGN KEY (`collaborator_id_FK`) REFERENCES `users` (`user_id`);

ALTER TABLE `note_collaborators` ADD FOREIGN KEY (`note_id_FK`) REFERENCES `notes` (`note_id`);

ALTER TABLE `note_collaborators` ADD FOREIGN KEY (`collaborator_id_FK`) REFERENCES `users` (`user_id`);
