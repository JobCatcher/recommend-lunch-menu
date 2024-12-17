package job.catcher.restaurant.thumbnail.repository;

import job.catcher.restaurant.thumbnail.domain.Thumbnail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThumbnailRepository extends JpaRepository<Thumbnail, Long> {
}
