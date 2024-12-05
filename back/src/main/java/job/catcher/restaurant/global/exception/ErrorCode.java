package job.catcher.restaurant.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    EXCEPTION_EXAMPLE(HttpStatus.BAD_REQUEST, "Exception Example")
    ;

    private final HttpStatus httpStatus;
    private final String message;
}
