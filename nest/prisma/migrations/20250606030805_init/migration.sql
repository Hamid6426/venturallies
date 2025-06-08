-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(100) NULL,
    `last_name` VARCHAR(100) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `country` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `address` VARCHAR(191) NULL,
    `newsletter_frequency` ENUM('daily', 'weekly', 'monthly') NOT NULL DEFAULT 'weekly',
    `transaction_notification` BOOLEAN NOT NULL DEFAULT true,
    `latest_news_notification` BOOLEAN NOT NULL DEFAULT true,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `email_verified_at` DATETIME(3) NULL,
    `verification_token` INTEGER NULL,
    `verification_token_expires_at` DATETIME(3) NULL,
    `login_token` INTEGER NULL,
    `login_token_expires_at` DATETIME(3) NULL,
    `reset_token` CHAR(64) NULL,
    `reset_token_expires_at` DATETIME(3) NULL,
    `remember_token` CHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kyc_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `lemverify_system_id` VARCHAR(191) NOT NULL,
    `lemverify_friendly_id` VARCHAR(191) NOT NULL,
    `lemverify_type` ENUM('COMBINATION', 'DOCUMENT', 'LIVENESS', 'AML_ALERT') NOT NULL,
    `lemverify_result` ENUM('PASSED', 'REFER', 'ERROR', 'ALERT') NOT NULL,
    `lemverify_processed_at` DATETIME(3) NOT NULL,
    `lemverify_started_at` DATETIME(3) NULL,
    `lemverify_deletion_at` DATETIME(3) NULL,
    `lemverify_balance_at_check` INTEGER NULL,
    `lemverify_refer_message` VARCHAR(191) NULL,
    `lemverify_extracted_person` JSON NULL,
    `lemverify_extracted_documents` JSON NULL,
    `lemverify_extracted_live_person` JSON NULL,
    `lemverify_alerts` JSON NULL,
    `client_ref_sent` VARCHAR(255) NOT NULL,
    `status_in_your_system` ENUM('pending_lemverify', 'complete_lemverify') NOT NULL DEFAULT 'pending_lemverify',
    `full_webhook_payload` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kyc_verifications_lemverify_system_id_key`(`lemverify_system_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `short_description` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `photo_url` VARCHAR(191) NULL,
    `country` VARCHAR(100) NULL,
    `status` ENUM('new', 'coming_soon', 'funded', 'repaid') NOT NULL,
    `loan_type` ENUM('business', 'sme', 'leasing', 'realestate') NOT NULL,
    `target_amount` DECIMAL(12, 2) NOT NULL,
    `expected_return` DECIMAL(5, 2) NOT NULL,
    `investment_period` INTEGER NOT NULL,
    `amount_funded` DECIMAL(12, 2) NOT NULL,
    `date_issued` DATETIME(3) NULL,
    `closing_date` DATETIME(3) NOT NULL,
    `collateral_value` DECIMAL(12, 2) NULL,
    `loan_to_value` DECIMAL(5, 2) NULL,
    `is_convertible` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kyc_verifications` ADD CONSTRAINT `kyc_verifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
