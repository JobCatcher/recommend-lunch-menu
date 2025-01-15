package job.catcher.restaurant.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "파일은 10MB 미만이어야 합니다."),
    INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "파일은 이미지 형식만 업로드할 수 있습니다."),
    UPLOAD_FAILED(HttpStatus.BAD_REQUEST, "파일 업로드 중 문제가 발생했습니다."),

    INVALID_TABLE_NAME(HttpStatus.BAD_REQUEST, "올바르지 않은 테이블 이름 값입니다.")
    ;

    private final HttpStatus httpStatus;
    private final String message;
}
