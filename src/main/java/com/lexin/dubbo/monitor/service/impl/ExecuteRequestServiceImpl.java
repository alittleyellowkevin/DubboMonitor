package com.lexin.dubbo.monitor.service.impl;

import com.lexin.dubbo.monitor.dao.dao.ExecuteRequestMapper;
import com.lexin.dubbo.monitor.dao.domain.ExecuteRequestDo;
import com.lexin.dubbo.monitor.service.ExecuteRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExecuteRequestServiceImpl implements ExecuteRequestService {

    @Autowired
    private ExecuteRequestMapper executeRequestMapper;

    @Override
    @Transactional
    public Long saveRequest(ExecuteRequestDo request) {
        executeRequestMapper.insert(request);
        return request.getId();
    }

    @Override
    @Transactional
    public boolean deleteRequest(Long id) {
        return executeRequestMapper.deleteById(id) > 0;
    }

    @Override
    @Transactional
    public boolean updateRequest(ExecuteRequestDo request) {
        return executeRequestMapper.update(request) > 0;
    }

    @Override
    public ExecuteRequestDo getRequestById(Long id) {
        return executeRequestMapper.selectById(id);
    }

    @Override
    public List<ExecuteRequestDo> getAllRequests() {
        return executeRequestMapper.selectAll();
    }

    @Override
    public List<ExecuteRequestDo> getRequestsByService(Integer serviceId) {
        return executeRequestMapper.selectByService(serviceId);
    }

    @Override
    public List<ExecuteRequestDo> getRequestsByMethod(String method) {
        return executeRequestMapper.selectByMethod(method);
    }
}