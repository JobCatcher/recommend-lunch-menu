package job.catcher.restaurant.thumbnail.controller;

import job.catcher.restaurant.global.response.ApiResponse;
import job.catcher.restaurant.thumbnail.service.ThumbnailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/thumbnails")
public class ThumbnailController {

    private final ThumbnailService thumbnailService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Object> uploadThumbnail(
            @RequestPart("thumbnail") MultipartFile multipartFile,
            @RequestParam("recordId") Long recordId
    ) {
        return ApiResponse.success(thumbnailService.uploadThumbnail(multipartFile, recordId));
    }
}
