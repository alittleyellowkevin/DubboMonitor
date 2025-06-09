package com.lexin.dubbo.monitor.impl.impl;

import com.alibaba.fastjson2.JSON;
import com.lexin.dubbo.monitor.impl.common.constant.DubboContants;
import com.lexin.dubbo.monitor.impl.logic.DubboCommandLogic;
import com.lexin.dubbo.monitor.service.req.InvokeMethodReq;
import com.lexin.dubbo.monitor.service.req.MethodsQueryReq;
import com.lexin.dubbo.monitor.service.req.ServicesQueryReq;
import com.lexin.dubbo.monitor.service.resp.InvokeMethodResp;
import com.lexin.dubbo.monitor.service.resp.MethodsListResp;
import com.lexin.dubbo.monitor.service.resp.ServicesListResp;
import com.lexin.dubbo.monitor.service.service.DubboMonitorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
public class DubboMonitorServiceImpl implements DubboMonitorService {

    @Autowired
    private DubboCommandLogic dubboCommandLogic;

    @Override
    public ServicesListResp getAllServices(ServicesQueryReq request) {
        String host = DubboContants.DUBBO_HOST;
        Integer port = request.getPort();
        List<String> services = dubboCommandLogic.ls(host, port, null);
        ServicesListResp servicesListResp = new ServicesListResp();
        servicesListResp.setServices(services);
        return servicesListResp;
    }

    @Override
    public MethodsListResp getMethods(MethodsQueryReq request) {
        String host = DubboContants.DUBBO_HOST;
        Integer port = request.getPort();
        String service = request.getService();
        List<String> methods = dubboCommandLogic.ls(host, port, service);
        MethodsListResp methodsListResp = new MethodsListResp();
        methodsListResp.setMethods(methods);
        return methodsListResp;
    }

    @Override
    public InvokeMethodResp invokeMethod(InvokeMethodReq request) {
        String host = DubboContants.DUBBO_HOST;
        Integer port = request.getPort();
        String service = request.getServiceName();
        String method = request.getMethodName();
        String jsonParams = request.getJsonParams();

        return dubboCommandLogic.invoke(host, port, service, method, jsonParams);
    }

}
