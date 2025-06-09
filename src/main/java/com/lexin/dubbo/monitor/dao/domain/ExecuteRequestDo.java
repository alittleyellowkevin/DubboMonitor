package com.lexin.dubbo.monitor.dao.domain;

import lombok.Data;

@Data
public class ExecuteRequestDo {
    /**
     * 执行端口
     */
    private Integer port;

    /**
     * 执行服务
     */
    private Integer service;

    /**
     * 执行方法
     */
    private String method;

    /**
     * 执行文件名
     */
    private String name;

    /**
     * 执行参数
     */
    private String jsonParams;
}
