package com.lexin.dubbo.monitor.impl.common.constant;

/**
 * Dubbo 命令常量
 */
public class DubboCommandContants {
    /**
     * 查看服务状态命令
     * 使用方法: status
     * 示例: dubbo> status
     */
    public static final String STATUS = "status";

    /**
     * 打印当前服务命令
     * 使用方法: pwd
     * 示例: dubbo> pwd
     */
    public static final String PWD = "pwd";

    /**
     * 跟踪服务调用命令
     * 使用方法: trace [服务名] [方法名] [次数]
     * 示例: dubbo> trace com.foo.BarService sayHello 10
     */
    public static final String TRACE = "trace";

    /**
     * 调用服务方法命令
     * 使用方法: invoke [服务名].[方法名]([参数])
     * 示例: dubbo> invoke com.foo.BarService.sayHello("world")
     */
    public static final String INVOKE = "invoke";

    /**
     * 统计服务调用命令
     * 使用方法: count [服务名] [方法名] [次数]
     * 示例: dubbo> count com.foo.BarService sayHello 10
     */
    public static final String COUNT = "count";

    /**
     * 清除屏幕命令
     * 使用方法: clear [行数]
     * 示例: dubbo> clear 100
     */
    public static final String CLEAR = "clear";

    /**
     * 列出服务和方法命令
     * 使用方法: ls [服务名]
     * 示例: dubbo> ls
     * dubbo> ls com.foo.BarService
     */
    public static final String LS = "ls";

    /**
     * 更改日志级别命令
     * 使用方法: log [级别]
     * 示例: dubbo> log debug
     */
    public static final String LOG = "log";

    /**
     * 打印服务器端口和连接信息
     * 使用方法: ps
     * 示例: dubbo> ps
     */
    public static final String PS = "ps";

    /**
     * 切换默认服务
     * 使用方法: cd [服务名]
     * 示例: dubbo> cd com.foo.BarService
     */
    public static final String CD = "cd";

    /**
     * 打印帮助信息
     * 使用方法: help [命令]
     * 示例: dubbo> help status
     */
    public static final String HELP = "help";

    /**
     * dubbo>
     */
    public static final String DUBBO_PROMPT = "dubbo>";

    /**
     * 换行符
     */
    public static final String CRLF = "\n";

    /**
     * 空格
     */
    public static final String SPACE = " ";

    /**
     * 点
     */
    public static final String DOT = ".";

    /**
     * 左括号
     */
    public static final String LEFT_PARENTHESIS = "(";

    /**
     * 右括号
     */
    public static final String RIGHT_PARENTHESIS = ")";
}
