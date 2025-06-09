CREATE TABLE `execute_request` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `port` int(11) NOT NULL COMMENT '执行端口',
    `service` int(11) NOT NULL COMMENT '执行服务',
    `method` varchar(255) NOT NULL COMMENT '执行方法',
    `name` varchar(255) DEFAULT NULL COMMENT '执行文件名',
    `json_params` text COMMENT '执行参数',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_service` (`service`),
    KEY `idx_method` (`method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='执行请求记录表'; 