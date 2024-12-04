package job.catcher.restaurant.restaurant.repository;

import job.catcher.restaurant.restaurant.domain.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query("select r from Restaurant r where r.geoHash in :geoHashs")
    List<Restaurant> findRestaurantInRange(@Param("geoHashs") List<String> geoHashs);
}
