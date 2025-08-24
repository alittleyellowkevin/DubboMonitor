package com.lexin.dubbo.monitor.dao.domain;

import java.util.Date;

import lombok.Data;

@Data
public class ExecuteRequestDo {
    /**
     * 记录ID
     */
    private Long id;
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

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 修改时间
     */
    private Date modifyTime;

    /**
     * 状态 0: 有效 1: 无效
     */
    private Integer isValid;

}
