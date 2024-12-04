package job.catcher.restaurant.global.util;

import ch.hsr.geohash.GeoHash;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class GeoHashUtil {

    // GeoHash 생성
    public static String encode(double latitude, double longitude, int precision) {
        return GeoHash.withCharacterPrecision(latitude, longitude, precision).toBase32();
    }

    public static List<String> getNeighbors(double latitude, double longitude, int precision) {
        GeoHash geoHash = GeoHash.withCharacterPrecision(latitude, longitude, precision);
        List<GeoHash> list = new ArrayList<>(List.of(geoHash.getAdjacent()));
        list.add(geoHash);
        return list.stream().map(GeoHash::toBase32).toList();
    }
}
