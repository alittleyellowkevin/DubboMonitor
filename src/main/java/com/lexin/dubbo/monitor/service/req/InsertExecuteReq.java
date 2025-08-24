package com.lexin.dubbo.monitor.service.req;

import lombok.Data;

import java.sql.Date;

import javax.validation.constraints.NotNull;

@Data
public class InsertExecuteReq {
    /**
     * 执行端口
     */
    private Integer port;

    /**
     * 执行服务
     */
    private String service;

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
