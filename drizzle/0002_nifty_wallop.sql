ALTER TABLE `employee` ADD `is_owner` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `store` ADD `adress` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `store` ADD `image_url` varchar(255) NOT NULL;