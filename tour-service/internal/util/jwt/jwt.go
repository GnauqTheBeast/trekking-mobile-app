package jwt

import (
	"crypto/md5"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/trekking-mobile-app/internal/util/env"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	envJWTSecret     = "JWT_SECRET"
	envDomainWebsite = "DOMAIN_WEBSITE"
)

var (
	secret = ""
	issuer = ""
)

func init() {
	env.LoadOnce(loadJWTSecret, loadIssuer)
}

func loadJWTSecret() {
	secret = fmt.Sprintf("%x", md5.Sum([]byte(strings.TrimSpace(os.Getenv(envJWTSecret)))))
}

func loadIssuer() {
	issuer = strings.ToLower(strings.TrimSpace(os.Getenv(envDomainWebsite)))
}

type UserInfoClaims struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func Generate(uid int64, name string, username string) string {
	now := time.Now().UTC()

	value, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, &UserInfoClaims{
		Name:     name,
		Username: strings.ToLower(strings.TrimPrefix(username, "@")),
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.AddDate(0, 0, 30)),
			Issuer:    issuer,
			Subject:   fmt.Sprintf("%d", uid),
		},
	}).SignedString([]byte(secret))

	return value
}

func ParseToken(tokenStr string) (int64, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &UserInfoClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	}, jwt.WithExpirationRequired())

	if err != nil {
		return 0, err
	}

	sub, err := token.Claims.GetSubject()
	if err != nil {
		return 0, err
	}

	return parseInt64(sub), nil
}

func parseInt64(value string) int64 {
	result, _ := strconv.ParseInt(value, 10, 64)
	return result
}
