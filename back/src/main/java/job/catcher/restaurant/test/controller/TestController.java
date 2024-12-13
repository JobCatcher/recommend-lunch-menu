package job.catcher.restaurant.test.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
public class TestController {

    @GetMapping
    public String hello() {
        return "hello restaurant";
    }

    @GetMapping("/test")
    public String getServerIp(HttpServletRequest request) {
        try {
            // 서버 IP
            InetAddress localHost = InetAddress.getLocalHost();
            String serverIp = localHost.getHostAddress();

            // 클라이언트 요청 IP
            String clientIp = request.getRemoteAddr();

            return "Server IP: " + serverIp + ", Client IP: " + clientIp;
        } catch (UnknownHostException e) {
            return "Unable to determine server IP.";
        }
    }
}
