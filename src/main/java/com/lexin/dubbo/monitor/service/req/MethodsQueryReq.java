package com.lexin.dubbo.monitor.service.req;

import lombok.Data;

@Data
/**
 * 方法查询请求参数
 */
public class MethodsQueryReq {
    /**
     * 服务名称
     */
    private String service;

    /**
     * 端口号
     */
    private Integer port;
}
