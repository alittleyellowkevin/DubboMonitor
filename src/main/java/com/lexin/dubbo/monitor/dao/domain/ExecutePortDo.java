package com.lexin.dubbo.monitor.dao.domain;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ExecutePortDo {
    /**
     * 1. 主键ID
     */
    private Long id;

    /**
     * 2. 端口名称
     */
    private String portName;

    /**
     * 3. 端口号
     */
    private Integer port;

    /**
     * 4. 本地地址
     */
    private String localAddr;

    /**
     * 5. 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 6. 更新时间
     */
    private LocalDateTime updateTime;
}
