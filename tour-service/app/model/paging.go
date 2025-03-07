package model

type Paging struct {
	Page      int
	Limit     int
	SortOrder string
	Filter    string
	Offset    int
}
