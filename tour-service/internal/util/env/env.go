package env

import (
	"github.com/joho/godotenv"
	"strings"
	"sync"
)

const envPath = ".env,.env.local"

var once = new(sync.Once)

func LoadOnce(inits ...func()) {
	once.Do(func() {
		_ = godotenv.Overload(strings.Split(envPath, ",")...)
	})

	for _, init := range inits {
		init()
	}
}
