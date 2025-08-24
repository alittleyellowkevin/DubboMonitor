package com.lexin.dubbo.monitor.dao.dao;

import com.lexin.dubbo.monitor.dao.domain.ExecuteRequestDo;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ExecuteRequestMapper {

    /**
     * 插入执行记录
     */
    int insert(ExecuteRequestDo executeRequestDo);

    /**
     * 根据ID删除执行记录
     */
    int deleteById(Long id);

    /**
     * 更新执行记录
     */
    int update(ExecuteRequestDo request);

    /**
     * 根据端口查询执行记录
     */
    List<ExecuteRequestDo> selectByPort(Integer port);

}