package main

// A simple program demonstrating the text input component from the Bubbles
// component library.

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/charmbracelet/bubbles/list"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Passes struct {
	ID        primitive.ObjectID `bson:"_id"`
	Email     string             `bson:"email,omitempty"`
	Token     string             `bson:"token"`
	Generated bool               `bson:"generated"`
	Types     string             `bson:"type"`
	PaymentId string             `bson:"paymentID"`
	RefCode   string             `bson:"refCode"`
}

func mongoDb(m model) {
	var passOccurance map[string]int = map[string]int{
		"SPORT_ATH":  0,
		"SPORT_FB_M": -1,
		"SPORT_VB_M": 0,
		"SPORT_BB_M": 0,
		"SPORT_TN_M": 0,
		"SPORT_TT_M": 0,
		"SPORT_BB_F": 0,
		"SPORT_TB_F": 0,
		"SPORT_TN_F": 0,
		"SPORT_TT_F": 0,
		"SPORT_CHS":  0,
		"CLTR_PRO":   0,
		"CLTR_BOB":   0,
		"CLTR_GRD":   0,
		"CLTR_FAS":   0,
		"ESPORTS":    0,
		"SUP_PRO":    -4,
	}
	// var availablePasses []string = []string{"SPORT_ATH", "SPORT_FB_M", "SPORT_BB_M", "SPORT_VB_M", "SPORT_TN_M", "SPORT_TT_M", "SPORT_BB_F", "SPORT_TB_F", "SPORT_TN_F", "SPORT_TT_F", "SPORT_CHS", "CLTR_PRO", "CLTR_BOB", "CLTR_GRD", "CLTR_FAS", "CLTR_PRO", "ESPORTS"}
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(m.textInput.Value()).SetServerAPIOptions(serverAPI)

	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	// Send a ping to confirm a successful connection
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		panic(err)
	}
	collection := client.Database("ticketing").Collection("passes")
	cursor, error := collection.Find(context.TODO(), bson.D{{}})
	if error != nil {
		fmt.Printf("HELLO")
	}
	for cursor.Next(context.TODO()) {
		var result Passes
		if err := cursor.Decode(&result); err != nil {
			log.Fatal(err)
		}
		passOccurance[result.Types] += 1
	}
	if err := cursor.Err(); err != nil {
		log.Fatal(err)
	}
	b, err := json.MarshalIndent(passOccurance, "", "  ")
	if err != nil {
		fmt.Println("error:", err)
	}
	m.mongoDb = string(b)
	// fmt.Println(string(b))
}

func main() {
	if len(os.Getenv("DEBUG")) > 0 {
		f, err := tea.LogToFile("debug.log", "debug")
		if err != nil {
			fmt.Println("fatal:", err)
			os.Exit(1)
		}
		defer f.Close()
	}

	p := tea.NewProgram(initialModel())
	if _, err := p.Run(); err != nil {
		log.Fatal(err)
	}
}

type (
	errMsg error
)

type Styles struct {
	BorderColor lipgloss.Color
	InputField  lipgloss.Style
}

var docStyle = lipgloss.NewStyle().Margin(1, 2)

func DefaultStyles() *Styles {
	s := new(Styles)
	s.BorderColor = lipgloss.Color("36")
	s.InputField = lipgloss.NewStyle().BorderForeground(s.BorderColor).BorderStyle(lipgloss.DoubleBorder()).Padding(1).Width(80)
	return s
}

func (i item) Title() string       { return i.title }
func (i item) Description() string { return i.desc }
func (i item) FilterValue() string { return i.title }

type item struct {
	title, desc string
}

type model struct {
	textInput         textinput.Model
	list              list.Model
	mongoStringFilled bool
	err               error
	styles            *Styles
	mongoDataReady    bool
	mongoDb           string
}

func initialModel() model {
	styles := DefaultStyles()
	items := []list.Item{
		item{title: "Display Total Number Of Passes Sold", desc: "Shows the distribution of passes sold"},
	}
	list := list.New(items, list.NewDefaultDelegate(), 0, 0)
	list.Title = "Select One Of The Options Below"
	ti := textinput.New()
	ti.Placeholder = "MongoDB Connection String"
	ti.Focus()
	ti.CharLimit = 156
	ti.Width = 20

	return model{
		textInput: ti,
		list:      list,
		err:       nil,
		styles:    styles,
	}
}

func (m model) Init() tea.Cmd {
	return textinput.Blink
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		if msg.String() == "ctrl+c" {
			return m, tea.Quit
		} else if msg.String() == "enter" {
			if m.mongoStringFilled == true {
				// m.mongoDataReady = true
				m.mongoDataReady = true
				mongoDb(m)
			} else {
				m.mongoStringFilled = true
			}
		}
	case tea.WindowSizeMsg:
		h, v := docStyle.GetFrameSize()
		m.list.SetSize(msg.Width-h, msg.Height-v)
	}

	m.textInput, cmd = m.textInput.Update(msg)
	m.list, cmd = m.list.Update(msg)
	return m, cmd
}

func (m model) View() string {
	if m.mongoStringFilled && m.mongoDataReady == false {
		return docStyle.Render(m.list.View())
	} else if m.mongoDataReady == true {
		fmt.Print(m.mongoDb)
		return fmt.Sprintf("%s", m.mongoDb)
	} else {
		return lipgloss.JoinVertical(
			lipgloss.Center, "\nEnter Mongo DB Connection String", m.styles.InputField.Render(m.textInput.View()),
		)
	}
	return fmt.Sprintf("Loading...")

}

// package main

// import (
// 	"fmt"
// 	"os"

// 	"github.com/charmbracelet/bubbles/list"
// 	tea "github.com/charmbracelet/bubbletea"
// 	"github.com/charmbracelet/lipgloss"
// )

// var docStyle = lipgloss.NewStyle().Margin(1, 2)
// var f = true

// type item struct {
// 	title, desc string
// }

// func (i item) Title() string       { return i.title }
// func (i item) Description() string { return i.desc }
// func (i item) FilterValue() string { return i.title }

// type model struct {
// 	list list.Model
// }

// func (m model) Init() tea.Cmd {
// 	return nil
// }

// func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
// 	switch msg := msg.(type) {
// 	case tea.KeyMsg:
// 		if msg.String() == "ctrl+c" {
// 			return m, tea.Quit
// 		}
// 	case tea.WindowSizeMsg:
// 		h, v := docStyle.GetFrameSize()
// 		m.list.SetSize(msg.Width-h, msg.Height-v)
// 	}

// 	var cmd tea.Cmd
// 	m.list, cmd = m.list.Update(msg)
// 	return m, cmd
// }

// func (m model) View() string {

// 	return docStyle.Render(m.list.View())
// }

// func main() {
// 	items := []list.Item{
// 		item{title: "Raspberry Pi’s", desc: "I have ’em all over my house"},
// 		item{title: "Nutella", desc: "It's good on toast"},
// 		item{title: "Bitter melon", desc: "It cools you down"},
// 		item{title: "Nice socks", desc: "And by that I mean socks without holes"},
// 		item{title: "Eight hours of sleep", desc: "I had this once"},
// 		item{title: "Cats", desc: "Usually"},
// 		item{title: "Plantasia, the album", desc: "My plants love it too"},
// 		item{title: "Pour over coffee", desc: "It takes forever to make though"},
// 		item{title: "VR", desc: "Virtual reality...what is there to say?"},
// 		item{title: "Noguchi Lamps", desc: "Such pleasing organic forms"},
// 		item{title: "Linux", desc: "Pretty much the best OS"},
// 		item{title: "Business school", desc: "Just kidding"},
// 		item{title: "Pottery", desc: "Wet clay is a great feeling"},
// 		item{title: "Shampoo", desc: "Nothing like clean hair"},
// 		item{title: "Table tennis", desc: "It’s surprisingly exhausting"},
// 		item{title: "Milk crates", desc: "Great for packing in your extra stuff"},
// 		item{title: "Afternoon tea", desc: "Especially the tea sandwich part"},
// 		item{title: "Stickers", desc: "The thicker the vinyl the better"},
// 		item{title: "20° Weather", desc: "Celsius, not Fahrenheit"},
// 		item{title: "Warm light", desc: "Like around 2700 Kelvin"},
// 		item{title: "The vernal equinox", desc: "The autumnal equinox is pretty good too"},
// 		item{title: "Gaffer’s tape", desc: "Basically sticky fabric"},
// 		item{title: "Terrycloth", desc: "In other words, towel fabric"},
// 	}

// 	m := model{list: list.New(items, list.NewDefaultDelegate(), 0, 0)}
// 	m.list.Title = "My Fave Things"

// 	p := tea.NewProgram(m, tea.WithAltScreen())

// 	if _, err := p.Run(); err != nil {
// 		fmt.Println("Error running program:", err)
// 		os.Exit(1)
// 	}
// }
