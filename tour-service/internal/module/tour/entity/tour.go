package entity

type Tour struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

type TourCreationData struct {
	Id          string `json:"-"` // just carry inserted id, so json tag is omitted
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

type TourPatchData struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
}
