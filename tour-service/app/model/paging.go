package model

type Paging struct {
	Page      int
	Limit     int32
	SortOrder string
	Filter    string
	Offset    int32
}
