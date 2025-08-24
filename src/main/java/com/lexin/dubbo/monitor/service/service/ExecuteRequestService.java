package com.lexin.dubbo.monitor.service.service;

import com.lexin.dubbo.monitor.dao.domain.ExecuteRequestDo;
import com.lexin.dubbo.monitor.service.req.DeleteExecuteReq;
import com.lexin.dubbo.monitor.service.req.InsertExecuteReq;
import com.lexin.dubbo.monitor.service.req.ListExecuteReq;

import java.util.List;

public interface ExecuteRequestService {

    /**
     * 保存执行记录
     */
    Long saveRequest(InsertExecuteReq request);

    /**
     * 删除执行记录
     */
    void deleteRequest(DeleteExecuteReq request);

    /**
     * 更新执行记录
     */
    void updateRequest(ExecuteRequestDo request);

    /**
     * 获取所有执行记录
     */
    List<ExecuteRequestDo> getRequestsByPort(ListExecuteReq request);

}