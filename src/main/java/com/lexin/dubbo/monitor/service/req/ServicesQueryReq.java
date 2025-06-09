package com.lexin.dubbo.monitor.service.req;

import lombok.Data;

@Data
/**
 * 服务查询请求参数
 */
public class ServicesQueryReq {
    /**
     * Dubbo 服务端口
     */
    private Integer port;

}
