package com.lexin.dubbo.monitor.dao.dao;

import com.lexin.dubbo.monitor.dao.domain.ExecutePortDo;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ExecutePortMapper {

    /**
     * 1. 插入端口配置
     */
    int insert(ExecutePortDo executePortDo);

    /**
     * 2. 根据端口名称删除端口配置
     */
    int deleteByPortName(String portName);

    /**
     * 3. 根据端口号删除端口配置
     */
    int deleteByPort(Integer port);

    /**
     * 4. 更新端口配置
     */
    int update(ExecutePortDo executePortDo);

    /**
     * 5. 根据端口名称查询端口配置
     */
    ExecutePortDo selectByPortName(String portName);

    /**
     * 6. 根据端口号查询端口配置
     */
    ExecutePortDo selectByPort(Integer port);

    /**
     * 7. 查询所有端口配置
     */
    List<ExecutePortDo> selectAll();

    /**
     * 8. 根据本地地址查询端口配置
     */
    List<ExecutePortDo> selectByLocalAddr(String localAddr);

    /**
     * 9. 检查端口名称是否存在
     */
    int countByPortName(String portName);

    /**
     * 10. 检查端口号是否存在
     */
    int countByPort(Integer port);
}