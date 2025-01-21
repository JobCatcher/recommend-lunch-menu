package job.catcher.restaurant.restaurant.repository;

import job.catcher.restaurant.jobcatcherdb.enums.ThumbnailTableName;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.restaurant.dto.RestaurantResponseDto;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.impl.DSL;

import java.util.*;
import java.util.stream.Collectors;

import static org.jooq.impl.DSL.*;

import java.util.ArrayList;
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
        var r = table("restaurant").as("r");
        var t = table("thumbnail").as("t");

//        return dsl.select(
//                        field("r.id", Long.class).as("restaurantId"),
//                        field("r.title", String.class),
//                        field("r.latitude", Double.class),
//                        field("r.longitude", Double.class),
//                        field("r.rating", Double.class),
//                        field("r.review_count", Integer.class),
//                        field("t.id", Long.class).as("thumbnailId"),
//                        field("t.url", String.class).as("url")
//                )
//                .from(r)
//                .leftJoin(t)
//                .on(field("t.record_id").eq(field("r.id"))
//                        .and(field("t.table_name").eq("RESTAURANT")))
//                .where(field("r.geo_hash").in(geoHashs))
//                .orderBy(field("r.id").asc(), field("t.id").asc())
//                .fetchGroups(
//                        record -> record.get("restaurantId", Long.class), // Group by restaurantId
//                        record -> new RestaurantResponseDto.ThumbnailResponseDto(
//                                record.get("thumbnailId", Long.class) != null
//                                        ? record.get("thumbnailId", Long.class)
//                                        : 0L, // Default ID = 0 if null
//                                record.get("url", String.class) != null
//                                        ? record.get("url", String.class)
//                                        : ""  // Default URL = "" if null
//                        )
//                )
//                .entrySet()
//                .stream()
//                .map(entry -> {
//                    Long restaurantId = entry.getKey();
//                    List<RestaurantResponseDto.ThumbnailResponseDto> thumbnails = entry.getValue();
//
//                    // Fetch one record for restaurant-specific fields
//                    Record record = dsl.select()
//                            .from(r)
//                            .where(field("r.id").eq(restaurantId))
//                            .fetchOne();
//
//                    return new RestaurantResponseDto(
//                            restaurantId,
//                            record.get("title", String.class),
//                            record.get("latitude", Double.class),
//                            record.get("longitude", Double.class),
//                            record.get("rating", Double.class),
//                            record.get("review_count", Integer.class),
//                            thumbnails.isEmpty() ? Collections.emptyList() : thumbnails
//                    );
//                })
//                .collect(Collectors.toList());

        return dsl.select(
                        field("r.id", Long.class).as("restaurantId"),
                        field("r.title", String.class),
                        field("r.latitude", Double.class),
                        field("r.longitude", Double.class),
                        field("r.rating", Double.class),
                        field("r.review_count", Integer.class),
                        field("t.id", Long.class).as("thumbnailId"),
                        field("t.url", String.class).as("url")
                )
                .from(r)
                .leftJoin(t)
                .on(field("t.record_id").eq(field("r.id"))
                        .and(field("t.table_name").eq("RESTAURANT")))
                .where(field("r.geo_hash").in(geoHashs))
                .orderBy(field("r.id").asc(), field("t.id").asc())
                .fetchGroups(
                        record -> new RestaurantResponseDto(
                                record.get("restaurantId", Long.class),
                                record.get("r.title", String.class),
                                record.get("r.latitude", Double.class),
                                record.get("r.longitude", Double.class),
                                record.get("r.rating", Double.class),
                                record.get("r.review_count", Integer.class),
                                new ArrayList<>()
                        ),
                        record -> new RestaurantResponseDto.ThumbnailResponseDto(
                                record.get("thumbnailId", Long.class) != null
                                        ? record.get("thumbnailId", Long.class)
                                        : 0L,
                                record.get("url", String.class)
                        )
                )
                .entrySet()
                .stream()
                .peek(entry -> {
                    List<RestaurantResponseDto.ThumbnailResponseDto> thumbnails = entry.getValue();
                    thumbnails = (thumbnails.size() == 1 && thumbnails.get(0).thumbnailId() == 0L) ? new ArrayList<>() : thumbnails;
                    entry.getKey().thumbnails().addAll(thumbnails);
                })
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
