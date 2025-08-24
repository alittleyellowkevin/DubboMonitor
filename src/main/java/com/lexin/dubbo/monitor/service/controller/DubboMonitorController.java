package com.lexin.dubbo.monitor.service.controller;

import com.lexin.dubbo.monitor.service.req.InvokeMethodReq;
import com.lexin.dubbo.monitor.service.req.MethodsQueryReq;
import com.lexin.dubbo.monitor.service.req.ServicesQueryReq;
import com.lexin.dubbo.monitor.service.resp.InvokeMethodResp;
import com.lexin.dubbo.monitor.service.resp.MethodsListResp;
import com.lexin.dubbo.monitor.service.resp.ServicesListResp;
import com.lexin.dubbo.monitor.service.service.DubboMonitorService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/dubbo")
@CrossOrigin
public class DubboMonitorController {

    @Autowired
    private DubboMonitorService dubboMonitorService;

    /**
     * 获取所有服务
     * 
     * @return 服务列表
     */
    @PostMapping("/services")
    public ServicesListResp getAllServices(@RequestBody ServicesQueryReq request) {
        log.info("开始获取服务列表");
        ServicesListResp services = dubboMonitorService.getAllServices(request);
        log.info("获取到 {} 个服务", services.getServices().size());
        return services;
    }

    /**
     * 获取方法
     * 
     * @param request 请求参数
     * @return 方法列表
     */
    @PostMapping("/methods")
    public MethodsListResp getMethods(@RequestBody MethodsQueryReq request) {
        log.info("开始获取方法列表");
        MethodsListResp methods = dubboMonitorService.getMethods(request);
        log.info("获取到 {} 个方法", methods.getMethods().size());
        return methods;
    }

    /**
     * 调用方法
     * 
     * @param request 请求参数
     * @return 调用结果
     */
    @PostMapping("/invoke")
    public InvokeMethodResp invokeMethod(@RequestBody InvokeMethodReq request) {
        log.info("调用服务: {}, 方法: {}", request.getServiceName(), request.getMethodName());
        InvokeMethodResp resp = dubboMonitorService.invokeMethod(request);
        log.info("调用结果: {}", resp.getResult());
        return resp;
    }

}