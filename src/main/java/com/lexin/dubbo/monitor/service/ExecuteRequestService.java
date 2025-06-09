package com.lexin.dubbo.monitor.service;

import com.lexin.dubbo.monitor.dao.domain.ExecuteRequestDo;
import java.util.List;

public interface ExecuteRequestService {

    /**
     * 保存执行记录
     */
    Long saveRequest(ExecuteRequestDo request);

    /**
     * 删除执行记录
     */
    boolean deleteRequest(Long id);

    /**
     * 更新执行记录
     */
    boolean updateRequest(ExecuteRequestDo request);

    /**
     * 根据ID获取执行记录
     */
    ExecuteRequestDo getRequestById(Long id);

    /**
     * 获取所有执行记录
     */
    List<ExecuteRequestDo> getAllRequests();

    /**
     * 根据服务ID获取执行记录
     */
    List<ExecuteRequestDo> getRequestsByService(Integer serviceId);

    /**
     * 根据方法名获取执行记录
     */
    List<ExecuteRequestDo> getRequestsByMethod(String method);
}