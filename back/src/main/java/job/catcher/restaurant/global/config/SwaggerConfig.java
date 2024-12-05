package job.catcher.restaurant.global.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(title = "JobCatcher API 명세서",
                description = "JobCatcher API 명세서",
                version = "v1"),
        servers = @Server(url = "/", description = "Default Server URL")
)
@Configuration
public class SwaggerConfig {

}
