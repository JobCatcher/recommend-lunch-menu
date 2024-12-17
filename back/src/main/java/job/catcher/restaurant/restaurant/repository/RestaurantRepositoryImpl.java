package job.catcher.restaurant.restaurant.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import job.catcher.restaurant.restaurant.dto.RestaurantResponseDto;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class RestaurantRepositoryImpl implements RestaurantRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<RestaurantResponseDto> findRestaurantInRangeV2(List<String> geoHashs) {
        return List.of();
    }
}
