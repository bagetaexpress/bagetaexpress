CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `allergen` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` integer NOT NULL,
	`name` text NOT NULL,
	`store_id` integer NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cart` (
	`user_id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cart_item` (
	`cart_id` text NOT NULL,
	`item_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`cart_id`, `item_id`),
	FOREIGN KEY (`cart_id`) REFERENCES `cart`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customer` (
	`user_id` text PRIMARY KEY NOT NULL,
	`school_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `employee` (
	`user_id` text PRIMARY KEY NOT NULL,
	`store_id` integer NOT NULL,
	`is_owner` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ingredient` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` integer NOT NULL,
	`name` text NOT NULL,
	`store_id` integer NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`weight` integer DEFAULT 0 NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`price` real NOT NULL,
	`store_id` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item_allergen` (
	`allergen_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	PRIMARY KEY(`allergen_id`, `item_id`),
	FOREIGN KEY (`allergen_id`) REFERENCES `allergen`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item_ingredient` (
	`ingredient_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	PRIMARY KEY(`ingredient_id`, `item_id`),
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`pin` text(4) NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_item` (
	`order_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`item_id`, `order_id`),
	FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `school` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`website_url` text NOT NULL,
	`email_domain` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `school_store` (
	`school_id` integer NOT NULL,
	`store_id` integer NOT NULL,
	`order_close` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`school_id`, `store_id`),
	FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `seller` (
	`user_id` text PRIMARY KEY NOT NULL,
	`store_id` integer NOT NULL,
	`school_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`school_id`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `store` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`website_url` text NOT NULL,
	`adress` text DEFAULT '' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`isAdmin` integer DEFAULT false NOT NULL,
	`emailVerified` integer,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
