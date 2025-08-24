package com.lexin.dubbo.monitor.impl.impl;

import com.lexin.dubbo.monitor.dao.dao.ExecuteRequestMapper;
import com.lexin.dubbo.monitor.dao.domain.ExecuteRequestDo;
import com.lexin.dubbo.monitor.service.req.DeleteExecuteReq;
import com.lexin.dubbo.monitor.service.req.InsertExecuteReq;
import com.lexin.dubbo.monitor.service.req.ListExecuteReq;
import com.lexin.dubbo.monitor.service.service.ExecuteRequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ExecuteRequestServiceImpl implements ExecuteRequestService {

    @Autowired
    private ExecuteRequestMapper executeRequestMapper;

    @Override
    @Transactional
    public Long saveRequest(InsertExecuteReq request) {
        ExecuteRequestDo executeRequestDo = new ExecuteRequestDo();
        executeRequestDo.setPort(request.getPort());
        executeRequestDo.setService(request.getService());
        executeRequestDo.setMethod(request.getMethod());
        executeRequestDo.setName(request.getName());
        executeRequestDo.setJsonParams(request.getJsonParams());
        executeRequestDo.setIsValid(0);
        executeRequestDo.setCreateTime(new Date(System.currentTimeMillis()));
        executeRequestDo.setModifyTime(new Date(System.currentTimeMillis()));
        executeRequestMapper.insert(executeRequestDo);
        return executeRequestDo.getId(); // 返回插入后的ID
    }

    @Override
    @Transactional
    public void deleteRequest(DeleteExecuteReq request) {
        executeRequestMapper.deleteById(request.getId());
    }

    @Override
    @Transactional
    public void updateRequest(ExecuteRequestDo request) {
        log.info("开始更新执行记录，接收到的参数: id={}, name={}, port={}, service={}, method={}, jsonParams={}",
                request.getId(), request.getName(), request.getPort(), request.getService(), request.getMethod(),
                request.getJsonParams());

        try {
            int updatedRows = executeRequestMapper.update(request);
            log.info("更新执行记录完成，影响行数: {}", updatedRows);

            if (updatedRows == 0) {
                log.warn("更新执行记录失败，没有找到匹配的记录或记录已被删除");
            }
        } catch (Exception e) {
            log.error("更新执行记录时发生异常: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<ExecuteRequestDo> getRequestsByPort(ListExecuteReq request) {
        return executeRequestMapper.selectByPort(request.getPort());
    }

}