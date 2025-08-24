package com.lexin.dubbo.monitor.service.service;

import com.lexin.dubbo.monitor.service.req.InsertExecuteReq;
import com.lexin.dubbo.monitor.service.req.InvokeMethodReq;
import com.lexin.dubbo.monitor.service.req.MethodsQueryReq;
import com.lexin.dubbo.monitor.service.req.ServicesQueryReq;
import com.lexin.dubbo.monitor.service.resp.InvokeMethodResp;
import com.lexin.dubbo.monitor.service.resp.MethodsListResp;
import com.lexin.dubbo.monitor.service.resp.ServicesListResp;

/**
 * Dubbo 服务监控接口
 */
public interface DubboMonitorService {
    /**
     * 获取所有可用的 Dubbo 服务列表
     *
     * @return Dubbo服务列表
     */
    ServicesListResp getAllServices(ServicesQueryReq request);

    /**
     * 获取方法列表
     * 
     * @param request 请求参数
     * @return 方法列表
     */
    MethodsListResp getMethods(MethodsQueryReq request);

    /**
     * 调用指定服务的方法
     *
     * @param request 请求参数
     * @return 方法调用结果
     */
    InvokeMethodResp invokeMethod(InvokeMethodReq request);

}