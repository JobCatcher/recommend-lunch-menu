package job.catcher.restaurant.restaurant.repository;

import job.catcher.restaurant.restaurant.domain.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query("SELECT r, t FROM Restaurant r " +
            "LEFT JOIN Thumbnail t ON t.recordId = r.id AND t.tableName = 'RESTAURANT' " +
            "WHERE r.geoHash IN :geoHashs " +
            "ORDER BY r.id ASC, t.id ASC")
    List<Object[]> findRestaurantInRange(@Param("geoHashs") List<String> geoHashs);
}
