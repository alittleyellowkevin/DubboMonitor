package com.lexin.dubbo.monitor.service.resp;

import lombok.Data;

/**
 * 调用方法响应
 */
@Data
public class InvokeMethodResp {
    /**
     * 调用结果
     */
    private String result;

    /**
     * 运行时间
     */
    private Long time;
}
