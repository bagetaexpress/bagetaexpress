CREATE TABLE `reservation` (
	`school_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`remaining` integer NOT NULL,
	PRIMARY KEY(`item_id`, `school_id`),
	FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `order` ADD `is_reservation` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `school_store` ADD `reservation_close` text DEFAULT CURRENT_TIMESTAMP NOT NULL;
