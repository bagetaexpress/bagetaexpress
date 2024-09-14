ALTER TABLE order_item ADD `is_reservation` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `order` DROP COLUMN `is_reservation`;