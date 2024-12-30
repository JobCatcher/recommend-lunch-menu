package job.catcher.restaurant.restaurant.repository;

import job.catcher.restaurant.jobcatcherdb.enums.ThumbnailTableName;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.restaurant.dto.RestaurantResponseDto;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.util.List;

import static job.catcher.restaurant.jobcatcherdb.tables.Restaurant.RESTAURANT;
import static job.catcher.restaurant.jobcatcherdb.tables.Thumbnail.THUMBNAIL;

@Repository
@RequiredArgsConstructor
public class RestaurantRepositoryJooq {

    private final DSLContext dsl;

    public List<Restaurant> findAllWithJooq() {
        return dsl.selectFrom(RESTAURANT)
                .fetchInto(Restaurant.class);
    }

    public List<RestaurantResponseDto> findRestaurantInRangeV3(List<String> geoHashs) {
        return dsl.select(
                        RESTAURANT.ID,
                        RESTAURANT.TITLE,
                        RESTAURANT.LATITUDE,
                        RESTAURANT.LONGITUDE,
                        RESTAURANT.RATING,
                        RESTAURANT.REVIEW_COUNT,
                        DSL.multiset(
                                DSL.select(
                                                THUMBNAIL.ID,
                                                THUMBNAIL.URL
                                        )
                                        .from(THUMBNAIL)
                                        .where(THUMBNAIL.RECORD_ID.eq(RESTAURANT.ID)
                                                .and(THUMBNAIL.TABLE_NAME.eq(ThumbnailTableName.RESTAURANT)))
                        ).as("thumbnails").convertFrom(r ->
                                r.map(thumbnailRecord ->
                                        new RestaurantResponseDto.ThumbnailResponseDto(
                                                thumbnailRecord.value1(), // THUMBNAIL.ID
                                                thumbnailRecord.value2()  // THUMBNAIL.URL
                                        )
                                )
                        )
                )
                .from(RESTAURANT)
                .where(RESTAURANT.GEO_HASH.in(geoHashs))
                .fetchInto(RestaurantResponseDto.class);
    }
}
