package utils

import (
	"fmt"
	"strings"
)

func ValidateToken(token string) (string, error) {
	if strings.HasPrefix(token, "Bearer ") {
		userId := strings.TrimPrefix(token, "Bearer ")
		return userId, nil
	}
	return "", fmt.Errorf("invalid token")
}
