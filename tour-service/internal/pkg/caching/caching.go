package caching

import (
	"context"
	"errors"
	"github.com/go-redis/cache/v9"
	"github.com/trekking-mobile-app/app/database/redis"
	"time"
)

func FetchFromCallback[T any](c *redis.CacheRedis, key string, ttl time.Duration, callback func() (T, error)) (T, error) {
	var v T
	err := c.Get(context.Background(), key, &v)
	if !errors.Is(err, cache.ErrCacheMiss) {
		return v, err
	}

	v, err = callback()
	if err != nil {
		return v, err
	}

	c.Set(context.Background(), key, v, ttl)
	return v, nil
}
