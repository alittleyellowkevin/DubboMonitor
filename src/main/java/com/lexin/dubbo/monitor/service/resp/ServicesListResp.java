package com.lexin.dubbo.monitor.service.resp;

import java.util.List;

import lombok.Data;

@Data
public class ServicesListResp {
    /**
     * 是否成功
     */
    private boolean success;

    /**
     * 错误信息
     */
    private String errorMsg;

    /**
     * 服务列表
     */
    private List<String> services;

    /**
     * 方法列表
     */
    private List<String> methods;
}
