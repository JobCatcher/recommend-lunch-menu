package job.catcher.restaurant.thumbnail.service;

import job.catcher.restaurant.global.service.S3Service;
import job.catcher.restaurant.thumbnail.domain.TableName;
import job.catcher.restaurant.thumbnail.domain.Thumbnail;
import job.catcher.restaurant.thumbnail.repository.ThumbnailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ThumbnailService {

    @Value("${cloud.aws.s3.path}")
    private String path;

    private final ThumbnailRepository thumbnailRepository;

    private final S3Service s3Service;

    public Thumbnail uploadThumbnail(MultipartFile multipartFile, Long recordId) {
        String originalName = multipartFile.getOriginalFilename();
        String name = path + UUID.randomUUID() + getFileExtension(originalName);
        String url = s3Service.uploadFile(multipartFile, name);
        Thumbnail thumbnail = Thumbnail.builder()
                .name(name)
                .originalName(originalName)
                .url(url)
                .tableName(TableName.RESTAURANT)
                .recordId(recordId)
                .build();
        thumbnailRepository.save(thumbnail);
        return thumbnail;
    }

    private String getFileExtension(String originalName) {
        if (originalName != null && originalName.contains(".")) {
            return originalName.substring(originalName.lastIndexOf("."));
        } else {
            return "";
        }
    }
}
