package com.lexin.dubbo.monitor.dao.dao;

import com.lexin.dubbo.monitor.dao.domain.ExecuteRequestDo;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ExecuteRequestMapper {

    /**
     * 插入执行记录
     */
    int insert(ExecuteRequestDo request);

    /**
     * 根据ID删除执行记录
     */
    int deleteById(Long id);

    /**
     * 更新执行记录
     */
    int update(ExecuteRequestDo request);

    /**
     * 根据ID查询执行记录
     */
    ExecuteRequestDo selectById(Long id);

    /**
     * 查询所有执行记录
     */
    List<ExecuteRequestDo> selectAll();

    /**
     * 根据服务ID查询执行记录
     */
    List<ExecuteRequestDo> selectByService(Integer serviceId);

    /**
     * 根据方法名查询执行记录
     */
    List<ExecuteRequestDo> selectByMethod(String method);
}