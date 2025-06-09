package com.lexin.dubbo.monitor.impl.logic;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.telnet.TelnetClient;
import org.checkerframework.checker.units.qual.degrees;
import org.springframework.stereotype.Component;

import com.lexin.dubbo.monitor.impl.common.constant.DubboContants;
import com.lexin.dubbo.monitor.service.resp.InvokeMethodResp;

import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.PWD;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.LS;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.CD;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.PS;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.LOG;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.CLEAR;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.SPACE;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.STATUS;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.TRACE;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.INVOKE;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.COUNT;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.HELP;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.CRLF;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.DUBBO_PROMPT;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.DOT;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.LEFT_PARENTHESIS;
import static com.lexin.dubbo.monitor.impl.common.constant.DubboCommandContants.RIGHT_PARENTHESIS;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class DubboCommandLogic {

    /**
     * 列出服务和方法
     */
    public List<String> ls(String host, Integer port, String service) {
        try (Socket socket = new Socket(host, port);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8))) {

            // 1. 设置socket超时
            socket.setSoTimeout(DubboContants.SOCKET_TIMEOUT);

            // 2. 发送ls命令
            String command = service != null ? LS + SPACE + service + CRLF : LS + CRLF;
            out.print(command);
            out.flush();

            // 3. 读取服务列表
            List<String> result = new ArrayList<>();
            StringBuilder buffer = new StringBuilder();
            char[] charBuffer = new char[1024];
            int totalRead = 0;
            int readCount;

            // 4. 循环读取数据
            while (totalRead < DubboContants.MAX_BUFFER_SIZE && (readCount = in.read(charBuffer)) != -1) {
                String chunk = new String(charBuffer, 0, readCount);
                log.debug("读取到数据块: {}", chunk);

                // 5. 检查是否读取完毕
                if (chunk.contains(DUBBO_PROMPT)) {
                    // 找到dubbo>提示符，处理之前的数据
                    String data = chunk.substring(0, chunk.indexOf(DUBBO_PROMPT));
                    processServiceOrMethodData(data, result);
                    break;
                } else {
                    // 6. 继续累积数据
                    buffer.append(chunk);
                    totalRead += readCount;

                    // 7. 检查是否有完整的服务数据
                    int lastDot = buffer.lastIndexOf(".");
                    if (lastDot > 0) {
                        String data = buffer.substring(0, lastDot + 1);
                        processServiceOrMethodData(data, result);
                        buffer.delete(0, lastDot + 1);
                    }
                }

                // 8. 防止无限等待
                if (totalRead >= DubboContants.MAX_BUFFER_SIZE) {
                    log.warn("达到最大缓冲区大小，停止读取");
                    break;
                }
            }

            // 9. 处理剩余数据
            if (buffer.length() > 0) {
                processServiceOrMethodData(buffer.toString(), result);
            }

            return result;
        } catch (Exception e) {
            log.error("获取服务列表失败", e);
            throw new RuntimeException("获取服务列表失败: " + e.getMessage(), e);
        }
    }

    /**
     * 处理服务数据
     */
    private void processServiceOrMethodData(String data, List<String> result) {
        // 1. 分割数据
        String[] lines = data.split("[\\r\\n\\s]+");
        // 2. 遍历处理每一行
        for (String line : lines) {
            // 3. 分割服务名
            String[] fullServiceName = line.split("\\.");
            // 4. 获取最后一部分作为服务名
            String serviceName = fullServiceName[fullServiceName.length - 1];
            // 5. 添加到结果列表
            if (!result.contains(serviceName)) {
                result.add(serviceName);
                log.info("添加服务: {}", serviceName);
            }
        }
    }

    /**
     * 调用服务方法
     */
    public InvokeMethodResp invoke(String host, Integer port, String service, String method, String jsonParams) {
        try (Socket socket = new Socket(host, port);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8))) {

            // 1. 构建调用命令
            String command = INVOKE + SPACE + service + DOT + method + LEFT_PARENTHESIS + jsonParams
                    + RIGHT_PARENTHESIS;
            out.println(command);

            // 2. 读取调用结果
            StringBuilder result = new StringBuilder();
            char[] buffer = new char[4096];
            int len;
            while ((len = in.read(buffer)) != -1) {
                // 3. 处理读取到的内容
                String content = new String(buffer, 0, len);
                if (content.contains(DUBBO_PROMPT)) {
                    // 4. 找到结束标记，提取有效内容
                    int endIndex = content.indexOf(DUBBO_PROMPT);
                    result.append(content.substring(0, endIndex));
                    break;
                }
                result.append(content);
            }

            // 5. 返回处理后的结果
            String resultStr = result.toString().trim();
            return processInvokeResult(resultStr);
        } catch (Exception e) {
            // 6. 异常处理
            throw new RuntimeException("调用服务方法失败: " + e.getMessage(), e);
        }
    }

    /**
     * 处理 invoke 命令的返回结果
     * 
     * @param resultStr 返回结果
     * @return 处理后的结果
     */
    private InvokeMethodResp processInvokeResult(String resultStr) {
        InvokeMethodResp resp = new InvokeMethodResp();

        // 提取JSON数组部分和执行时间
        if (resultStr.contains("\r\n")) {
            // 如果包含换行，说明后面跟着elapsed信息，需要分割
            String[] parts = resultStr.split("\r\n");
            resp.setResult(parts[0]); // 只取JSON数组部分

            // 提取执行时间
            if (parts.length > 1 && parts[1].contains("elapsed:")) {
                String timeStr = parts[1].substring(parts[1].indexOf("elapsed:") + 8, parts[1].indexOf("ms"))
                        .trim();
                resp.setTime(Long.parseLong(timeStr));
            }
        } else {
            resp.setResult(resultStr);
            resp.setTime(0L); // 如果没有时间信息，设置为0
        }
        return resp;
    }

    /**
     * 查看服务状态
     */
    public String status(String host, Integer port) {
        try (Socket socket = new Socket(host, port);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8))) {

            // 发送status命令
            out.println("status");

            // 读取状态信息
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                if (line.startsWith("dubbo>"))
                    break;
                result.append(line).append("\n");
            }

            return result.toString().trim();
        } catch (Exception e) {
            throw new RuntimeException("获取服务状态失败: " + e.getMessage(), e);
        }
    }

    /**
     * 打印当前服务
     */
    public String pwd(String host, Integer port) {
        return executeDubboCommand(host, port, PWD);
    }

    /**
     * 跟踪服务调用
     */
    public String trace(String host, Integer port, String service, String method, Integer times) {
        try (Socket socket = new Socket(host, port);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8))) {

            // 发送trace命令
            String command = String.format("trace %s %s %d", service, method, times);
            out.println(command);

            // 读取跟踪结果
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                if (line.startsWith(DUBBO_PROMPT))
                    break;
                result.append(line).append("\n");
            }

            return result.toString().trim();
        } catch (Exception e) {
            throw new RuntimeException("跟踪服务调用失败: " + e.getMessage(), e);
        }
    }

    /**
     * 统计服务调用
     */
    public String count(String host, Integer port, String service, String method, Integer times) {
        try (Socket socket = new Socket(host, port);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8))) {

            // 发送count命令
            String command = String.format("count %s %s %d", service, method, times);
            out.println(command);

            // 读取统计结果
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                if (line.startsWith("dubbo>"))
                    break;
                result.append(line).append("\n");
            }

            return result.toString().trim();
        } catch (Exception e) {
            throw new RuntimeException("统计服务调用失败: " + e.getMessage(), e);
        }
    }

    /**
     * 清除屏幕
     */
    public String clear(String host, Integer port, Integer lines) {
        String command = lines != null ? CLEAR + " " + lines : CLEAR;
        return executeDubboCommand(host, port, command);
    }

    /**
     * 更改日志级别
     */
    public String log(String host, Integer port, String level) {
        String command = LOG + " " + level;
        return executeDubboCommand(host, port, command);
    }

    /**
     * 打印服务器端口和连接信息
     */
    public String ps(String host, Integer port) {
        return executeDubboCommand(host, port, PS);
    }

    /**
     * 切换默认服务
     */
    public String cd(String host, Integer port, String service) {
        String command = service != null ? CD + " " + service : CD;
        return executeDubboCommand(host, port, command);
    }

    /**
     * 显示帮助信息
     */
    public String help(String host, Integer port, String command) {
        try (Socket socket = new Socket(host, port);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8))) {

            // 发送help命令
            String helpCommand = command != null ? "help " + command : "help";
            out.println(helpCommand);

            // 读取帮助信息
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                if (line.startsWith("dubbo>"))
                    break;
                result.append(line).append("\n");
            }

            return result.toString().trim();
        } catch (Exception e) {
            throw new RuntimeException("获取帮助信息失败: " + e.getMessage(), e);
        }
    }

    /**
     * 执行Dubbo命令并返回结果
     *
     * @param host    主机地址
     * @param port    端口号
     * @param command 命令
     * @return 命令执行结果
     */
    public String executeDubboCommand(String host, Integer port, String command) {
        try (Socket socket = new Socket(host, port);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

            // 发送 ls 命令获取服务列表
            out.println(command);
            String line;

            while ((line = in.readLine()) != null) {
                if (line.startsWith("dubbo>"))
                    break;
                if (line.trim().isEmpty())
                    continue;

                // 解析服务信息
                if (line.startsWith("com.") || line.startsWith("org.")) {

                    // 获取方法列表
                    out.println("ls " + line.trim());
                    String methodLine;
                    while ((methodLine = in.readLine()) != null) {
                        if (methodLine.startsWith("dubbo>"))
                            break;
                        if (methodLine.trim().isEmpty())
                            continue;
                    }
                }
            }

            return null;
        } catch (Exception e) {
            throw new RuntimeException("获取服务列表失败: " + e.getMessage(), e);
        }
    }
}
