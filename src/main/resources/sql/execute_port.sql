-- 创建端口配置表
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

-- 插入一些示例数据
INSERT INTO `execute_port` (`port_name`, `port`, `local_addr`) VALUES
('默认端口', 20880, '127.0.0.1'),
('测试端口', 20881, '127.0.0.1'),
('开发端口', 20882, '127.0.0.1'); 