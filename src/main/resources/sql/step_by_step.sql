-- 步骤1：创建数据库
CREATE DATABASE IF NOT EXISTS `dubbo_monitor` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 步骤2：使用数据库
USE `dubbo_monitor`;

-- 步骤3：创建执行记录表
CREATE TABLE `execute_request` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `service_name` VARCHAR(255) NOT NULL COMMENT '服务名称',
    `method_name` VARCHAR(255) NOT NULL COMMENT '方法名称',
    `request_params` TEXT COMMENT '请求参数',
    `response_data` TEXT COMMENT '响应数据',
    `execute_time` BIGINT(20) COMMENT '执行时间(毫秒)',
    `port` INT(11) COMMENT '端口号',
    `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='执行记录表';

-- 步骤4：创建端口配置表
CREATE TABLE `execute_port` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `port_name` VARCHAR(100) NOT NULL COMMENT '端口名称',
    `port` INT(11) NOT NULL COMMENT '端口号',
    `local_addr` VARCHAR(255) DEFAULT NULL COMMENT '本地地址',
    `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_port_name` (`port_name`),
    UNIQUE KEY `uk_port` (`port`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='端口配置表';

-- 步骤5：插入端口配置示例数据
INSERT INTO `execute_port` (`port_name`, `port`, `local_addr`) VALUES
('默认端口', 20880, '127.0.0.1'),
('测试端口', 20881, '127.0.0.1'),
('开发端口', 20882, '127.0.0.1');

-- 步骤6：插入执行记录示例数据
INSERT INTO `execute_request` (`service_name`, `method_name`, `request_params`, `response_data`, `execute_time`, `port`) VALUES
('com.example.UserService', 'getUserById', '{"userId": 1}', '{"id": 1, "name": "张三", "age": 25}', 150, 20880),
('com.example.OrderService', 'createOrder', '{"userId": 1, "productId": 100}', '{"orderId": "ORD001", "status": "SUCCESS"}', 200, 20880),
('com.example.ProductService', 'getProductInfo', '{"productId": 100}', '{"id": 100, "name": "商品A", "price": 99.99}', 80, 20881); 