package env

import (
	"strings"
	"sync"

	"github.com/joho/godotenv"
)

const envPath = "cmd/.env,cmd/.env.local"

var once = new(sync.Once)

func LoadOnce(inits ...func()) {
	once.Do(func() {
		_ = godotenv.Overload(strings.Split(envPath, ",")...)
	})

	for _, init := range inits {
		init()
	}
}
