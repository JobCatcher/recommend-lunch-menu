package job.catcher.restaurant.thumbnail.domain;

import job.catcher.restaurant.global.exception.ApiException;
import lombok.Getter;

import static job.catcher.restaurant.global.exception.ErrorCode.INVALID_TABLE_NAME;

@Getter
public enum TableName {

    RESTAURANT("restaurant");

    private final String value;

    TableName(String value) {
        this.value = value;
    }

    public static TableName findByValue(String value) {
        for (TableName tableName: TableName.values()) {
            if (tableName.value.equals(value)) {
                return tableName;
            }
        }
        throw new ApiException(INVALID_TABLE_NAME);
    }
}
