ALTER TABLE `item` RENAME COLUMN `weigth` TO `weight`;--> statement-breakpoint
ALTER TABLE `item` MODIFY COLUMN `weight` int NOT NULL;--> statement-breakpoint
ALTER TABLE `item` MODIFY COLUMN `weight` int NOT NULL DEFAULT 0;