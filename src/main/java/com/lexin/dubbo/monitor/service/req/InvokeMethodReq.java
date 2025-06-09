package com.lexin.dubbo.monitor.service.req;

import com.alibaba.fastjson2.JSON;

import lombok.Data;

@Data
public class InvokeMethodReq {
    /**
     * 端口
     */
    private Integer port;

    /**
     * 服务名称
     */
    private String serviceName;

    /**
     * 方法名称
     */
    private String methodName;

    /**
     * JSON格式的请求参数
     */
    private String jsonParams;
}
