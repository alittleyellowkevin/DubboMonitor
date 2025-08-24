CREATE TABLE `execute_request` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
    `port` int(11) NOT NULL COMMENT '执行端口',
    `service` varchar(255) NOT NULL COMMENT '执行服务',
    `method` varchar(255) NOT NULL COMMENT '执行方法',
    `name` varchar(255) NOT NULL COMMENT '执行文件名',
    `json_params` text NOT NULL COMMENT '执行参数',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `modify_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    `is_valid` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态 0: 有效 1: 无效',
    PRIMARY KEY (`id`),
    KEY `idx_service` (`service`),
    KEY `idx_method` (`method`),
    KEY `idx_port` (`port`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='执行请求记录表'; 