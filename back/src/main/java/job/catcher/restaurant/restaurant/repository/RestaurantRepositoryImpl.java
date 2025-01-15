package job.catcher.restaurant.restaurant.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import job.catcher.restaurant.restaurant.dto.QRestaurantResponseDto;
import job.catcher.restaurant.restaurant.dto.QRestaurantResponseDto_ThumbnailResponseDto;
import job.catcher.restaurant.restaurant.dto.RestaurantResponseDto;
import job.catcher.restaurant.thumbnail.domain.TableName;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.querydsl.core.group.GroupBy.groupBy;
import static com.querydsl.core.group.GroupBy.list;
import static job.catcher.restaurant.restaurant.domain.QRestaurant.restaurant;
import static job.catcher.restaurant.thumbnail.domain.QThumbnail.thumbnail;

@RequiredArgsConstructor
public class RestaurantRepositoryImpl implements RestaurantRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<RestaurantResponseDto> findRestaurantInRangeV2(List<String> geoHashs) {
        return jpaQueryFactory
                .from(restaurant)
                .leftJoin(thumbnail)
                .on(
                        thumbnail.recordId.eq(restaurant.id)
                                .and(thumbnail.tableName.eq(TableName.RESTAURANT))
                )
                .where(restaurant.geoHash.in(geoHashs))
                .orderBy(restaurant.id.asc(), thumbnail.id.asc())
                .transform(
                        groupBy(restaurant.id)
                        .list(new QRestaurantResponseDto(
                                restaurant.id,
                                restaurant.title,
                                restaurant.latitude,
                                restaurant.longitude,
                                restaurant.rating,
                                restaurant.reviewCount,
                                list(
                                        new QRestaurantResponseDto_ThumbnailResponseDto(
                                                thumbnail.id,
                                                thumbnail.url
                                        )
                                )
                        ))
                );

//        return jpaQueryFactory
//                .select(new QRestaurantResponseDto(
//                        restaurant.id,
//                        restaurant.title,
//                        restaurant.latitude,
//                        restaurant.longitude,
//                        restaurant.rating,
//                        restaurant.reviewCount,
//                        Expressions.list(
//                                new QRestaurantResponseDto_ThumbnailResponseDto(
//                                        thumbnail.id,
//                                        thumbnail.url
//                                )
//                        )
////                        Expressions.cases()
////                                .when(thumbnail.id.isNotNull())
////                                .then(Expressions.list(
////                                        new QRestaurantResponseDto_ThumbnailResponseDto(
////                                                thumbnail.id,
////                                                thumbnail.url
////                                        )
////                                ))
////                                .otherwise(Expressions.list())
//                ))
//                .from(restaurant)
//                .leftJoin(thumbnail)
//                .on(
//                        thumbnail.recordId.eq(restaurant.id)
//                                .and(thumbnail.tableName.eq(TableName.valueOf("restaurant")))
//                )
//                .where(restaurant.geoHash.in(geoHashs))
//                .fetch();
    }
}
