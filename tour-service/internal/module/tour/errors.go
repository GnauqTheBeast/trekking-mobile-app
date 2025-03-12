package tour

import "errors"

var (
	ErrTourNotFound       = errors.New("tour not found")
	ErrInvalidTourData    = errors.New("invalid tour data")
	ErrTourAlreadyExists  = errors.New("tour already exists")
	ErrUnauthorizedAccess = errors.New("unauthorized access to tour")
	ErrInvalidPagination  = errors.New("invalid pagination parameters")
)

type Error struct {
	Err     error
	Message string
	Code    string
}

func (e *Error) Error() string {
	if e.Message != "" {
		return e.Message
	}
	return e.Err.Error()
}

func (e *Error) Unwrap() error {
	return e.Err
}
