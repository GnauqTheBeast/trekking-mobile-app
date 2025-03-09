package entity

func (*Tour) TableName() string {
	return "tour"
}

type Tour struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

type TourPatchData struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
}
