ALTER TABLE `item` ADD `weigth` decimal(4,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `item` ADD `deleted` boolean DEFAULT false NOT NULL;