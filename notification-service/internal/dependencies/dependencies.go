package dependencies

var defaultDependencies = make([]func() error, 0)

func Register(f func() error) {
	defaultDependencies = append(defaultDependencies, f)
}

func Init() error {
	for _, f := range defaultDependencies {
		if err := f(); err != nil {
			return err
		}
	}

	return nil
}
