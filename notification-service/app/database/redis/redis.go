package redis

import (
	"context"
	"github.com/go-redis/cache/v9"
	"github.com/redis/go-redis/v9"
	"os"
	"time"
)

type CacheRedis struct {
	client      *cache.Cache
	redisClient redis.UniversalClient
}

func (c *CacheRedis) Keys(pattern string) ([]string, error) {
	return c.redisClient.Keys(context.Background(), pattern).Result()
}

func (c *CacheRedis) Scans(pattern string, cursor uint64) ([]string, uint64, error) {
	return c.redisClient.Scan(context.Background(), cursor, pattern, 1000).Result()
}

func (c *CacheRedis) Get(ctx context.Context, key string, target any) error {
	return c.client.Get(ctx, key, target)
}

func (c *CacheRedis) Set(ctx context.Context, key string, value any, ttl time.Duration) error {
	return c.client.Set(&cache.Item{Ctx: ctx, Key: key, Value: value, TTL: ttl})
}

func (c *CacheRedis) FetchFromCallback(ctx context.Context, key string, ttl time.Duration, callback func() (any, error)) (any, error) {
	var v any
	err := c.Get(ctx, key, &v)

	v, err = callback()
	if err != nil {
		return v, err
	}

	c.Set(ctx, key, v, ttl)
	return v, nil
}

func (c *CacheRedis) Delete(ctx context.Context, key string) error {
	return c.client.Delete(ctx, key)
}

func NewCacheRedis(withLocalCache bool) (*CacheRedis, error) {
	client, err := GetUniversalClient(0)
	if err != nil {
		return nil, err
	}

	var localCache cache.LocalCache
	if withLocalCache {
		localCache = cache.NewTinyLFU(10000, time.Minute)
	}
	return &CacheRedis{
		client: cache.New(&cache.Options{
			Redis:      client,
			LocalCache: localCache,
		}),
		redisClient: client,
	}, nil
}

func GetUniversalClient(DB int) (redis.UniversalClient, error) {
	clusterCacheRedisURL := os.Getenv("CLUSTER_REDIS_URL")
	if clusterCacheRedisURL != "" {
		clusterOpts, err := redis.ParseClusterURL(clusterCacheRedisURL)
		if err != nil {
			return nil, err
		}

		return redis.NewClusterClient(clusterOpts), nil
	}

	opt, err := redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil {
		return nil, err
	}
	opt.DB = DB

	return redis.NewClient(opt), nil
}
