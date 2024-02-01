CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`ext_expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` varchar(2048),
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `allergen` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`number` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`store_id` int NOT NULL,
	CONSTRAINT `allergen_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart` (
	`user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `cart_item` (
	`cart_id` varchar(255) NOT NULL,
	`item_id` int NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `cart_item_cart_id_item_id_pk` PRIMARY KEY(`cart_id`,`item_id`)
);
--> statement-breakpoint
CREATE TABLE `customer` (
	`user_id` varchar(255) NOT NULL,
	`school_id` int NOT NULL,
	CONSTRAINT `customer_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `employee` (
	`user_id` varchar(255) NOT NULL,
	`store_id` int NOT NULL,
	CONSTRAINT `employee_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `ingredient` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`number` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`store_id` int NOT NULL,
	CONSTRAINT `ingredient_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`image_url` varchar(255) NOT NULL DEFAULT '',
	`price` decimal(4,2) NOT NULL,
	`store_id` int NOT NULL,
	CONSTRAINT `item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `item_allergen` (
	`allergen_id` int NOT NULL,
	`item_id` int NOT NULL,
	CONSTRAINT `item_allergen_allergen_id_item_id_pk` PRIMARY KEY(`allergen_id`,`item_id`)
);
--> statement-breakpoint
CREATE TABLE `item_ingredient` (
	`ingredient_id` int NOT NULL,
	`item_id` int NOT NULL,
	CONSTRAINT `item_ingredient_ingredient_id_item_id_pk` PRIMARY KEY(`ingredient_id`,`item_id`)
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`pin` varchar(4) NOT NULL,
	`status` enum('ordered','pickedup','unpicked','cancelled') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_item` (
	`order_id` int NOT NULL,
	`item_id` int NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `order_item_order_id_item_id_pk` PRIMARY KEY(`order_id`,`item_id`)
);
--> statement-breakpoint
CREATE TABLE `school` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`website_url` varchar(255) NOT NULL,
	`email_regex` varchar(255) NOT NULL,
	CONSTRAINT `school_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `school_store` (
	`school_id` int NOT NULL,
	`store_id` int NOT NULL,
	`order_close` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `school_store_school_id_store_id_pk` PRIMARY KEY(`school_id`,`store_id`)
);
--> statement-breakpoint
CREATE TABLE `seller` (
	`user_id` varchar(255) NOT NULL,
	`store_id` int NOT NULL,
	`school_id` int NOT NULL,
	CONSTRAINT `seller_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `store` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`website_url` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	CONSTRAINT `store_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`isAdmin` boolean NOT NULL DEFAULT false,
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT (now()),
	`image` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
