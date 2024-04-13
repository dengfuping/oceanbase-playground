-- CreateTable
CREATE TABLE `car_orders` (
    `order_id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `car_price` DECIMAL(65, 30) NOT NULL,
    `car_color` TEXT NOT NULL,
    `sale_region` VARCHAR(191) NOT NULL,
    `sale_nation` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
