package job.catcher.restaurant.global.response;

import job.catcher.restaurant.global.exception.ErrorCode;
import lombok.Builder;
import org.springframework.http.HttpStatus;

import java.util.Collections;

@Builder
public record ApiResponse<T>(
        HttpStatus statusText,
        int status,
        String message,
        T data
) {

    public static final ApiResponse<Object> EMPTY = ApiResponse.builder()
            .statusText(HttpStatus.OK)
            .status(HttpStatus.OK.value())
            .message("Request Success")
            .data(Collections.EMPTY_MAP)
            .build();

    public static <T> ApiResponse<Object> success(T data) {
        return ApiResponse.builder()
                .statusText(HttpStatus.OK)
                .status(HttpStatus.OK.value())
                .message("Request Success")
                .data(data)
                .build();
    }

    public static <T> ApiResponse<Object> create(T data) {
        return ApiResponse.builder()
                .statusText(HttpStatus.CREATED)
                .status(HttpStatus.CREATED.value())
                .message("Create Success")
                .data(data)
                .build();
    }

    public static ApiResponse<Object> exception(ErrorCode errorCode) {
        return ApiResponse.builder()
                .statusText(errorCode.getHttpStatus())
                .status(errorCode.getHttpStatus().value())
                .message(errorCode.getMessage())
                .data(Collections.EMPTY_MAP)
                .build();
    }

    public static ApiResponse<Object> exception(HttpStatus httpStatus, String message) {
        return ApiResponse.builder()
                .statusText(httpStatus)
                .status(httpStatus.value())
                .message(message)
                .data(Collections.EMPTY_MAP)
                .build();
    }
}
