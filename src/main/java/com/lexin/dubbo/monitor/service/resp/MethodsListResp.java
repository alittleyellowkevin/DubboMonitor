package com.lexin.dubbo.monitor.service.resp;

import java.util.List;

import lombok.Data;

/**
 * 方法列表响应
 */
@Data
public class MethodsListResp {
    /**
     * 方法列表
     */
    List<String> methods;
}
