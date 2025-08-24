package com.lexin.dubbo.monitor.service.controller;

import java.util.List;

import com.lexin.dubbo.monitor.service.req.DeleteExecuteReq;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lexin.dubbo.monitor.dao.domain.ExecuteRequestDo;
import com.lexin.dubbo.monitor.service.req.InsertExecuteReq;
import com.lexin.dubbo.monitor.service.req.ListExecuteReq;
import com.lexin.dubbo.monitor.service.service.ExecuteRequestService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/execute")
@CrossOrigin
public class ExcuteRequestController {

    @Autowired
    private ExecuteRequestService executeRequestService;

    /**
     * 插入执行记录
     */
    @PostMapping("/insert")
    public Long insertExecuteRequest(@RequestBody InsertExecuteReq request) {
        Class<InsertExecuteReq> insertExecuteReqClass = InsertExecuteReq.class;

        log.info("插入执行记录: {}", request);
        return executeRequestService.saveRequest(request);
    }

    /**
     * 显示所有执行记录
     */
    @PostMapping("/list")
    public List<ExecuteRequestDo> listExecuteRequest(@RequestBody ListExecuteReq request) {
        log.info("获取端口下所有执行记录: {}", request);
        return executeRequestService.getRequestsByPort(request);
    }

    /**
     * 更新执行记录
     */
    @PostMapping("/update")
    public void updateExecuteRequest(@RequestBody ExecuteRequestDo request) {
        log.info("更新执行记录: {}", request);
        executeRequestService.updateRequest(request);
    }

    /**
     * 删除执行记录
     */
    @PostMapping("/delete")
    public void deleteExecuteRequest(@RequestBody DeleteExecuteReq request) {
        log.info("删除执行记录: {}", request);
        executeRequestService.deleteRequest(request);
    }

}
