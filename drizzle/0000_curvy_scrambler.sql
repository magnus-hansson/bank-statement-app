CREATE TABLE `account_statements` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`date_from` text,
	`date_to` text,
	`customer_name` text,
	`book_balance` real,
	`clearing_number` text,
	`amount_of_transactions` integer,
	`import_date` text,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`chosen_name` text,
	`account_holder` text,
	`account_form` text,
	`account_name` text,
	`account_number` text,
	`system` text,
	`status` text,
	`import_date` text
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_statement_id` text,
	`transaction_text` text,
	`transaction_date` text,
	`ledger_date` text,
	`transaction_amount` real,
	`system_name` text,
	`serial_number` text,
	`bankgiro_plusgiro_number` text,
	`event_time` text,
	`is_marked` integer DEFAULT 0,
	`category` text,
	`notes` text,
	`import_date` text,
	FOREIGN KEY (`account_statement_id`) REFERENCES `account_statements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`age` integer
);
