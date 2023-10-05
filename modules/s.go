// package main

// import (
// 	"context"
// 	"encoding/json"
// 	"fmt"
// 	"log"

// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"go.mongodb.org/mongo-driver/mongo"
// 	"go.mongodb.org/mongo-driver/mongo/options"
// )

// // This is the url
// // mongodb+srv://stats-fetch-app:L1CVLWrtS42E0bbp@falak-surge-main.rumgiy9.mongodb.net/?retryWrites=true&w=majority
// type Passes struct {
// 	ID        primitive.ObjectID `bson:"_id"`
// 	Email     string             `bson:"email,omitempty"`
// 	Token     string             `bson:"token"`
// 	Generated bool               `bson:"generated"`
// 	Types     string             `bson:"type"`
// 	PaymentId string             `bson:"paymentID"`
// 	RefCode   string             `bson:"refCode"`
// }

// func main() {
// 	var passOccurance map[string]int = map[string]int{
// 		"SPORT_ATH":  0,
// 		"SPORT_FB_M": -1,
// 		"SPORT_VB_M": 0,
// 		"SPORT_BB_M": 0,
// 		"SPORT_TN_M": 0,
// 		"SPORT_TT_M": 0,
// 		"SPORT_BB_F": 0,
// 		"SPORT_TB_F": 0,
// 		"SPORT_TN_F": 0,
// 		"SPORT_TT_F": 0,
// 		"SPORT_CHS":  0,
// 		"CLTR_PRO":   0,
// 		"CLTR_BOB":   0,
// 		"CLTR_GRD":   0,
// 		"CLTR_FAS":   0,
// 		"ESPORTS":    0,
// 		"SUP_PRO":    -4,
// 	}
// 	// var availablePasses []string = []string{"SPORT_ATH", "SPORT_FB_M", "SPORT_BB_M", "SPORT_VB_M", "SPORT_TN_M", "SPORT_TT_M", "SPORT_BB_F", "SPORT_TB_F", "SPORT_TN_F", "SPORT_TT_F", "SPORT_CHS", "CLTR_PRO", "CLTR_BOB", "CLTR_GRD", "CLTR_FAS", "CLTR_PRO", "ESPORTS"}
// 	var mongoDbConnectionString string
// 	fmt.Printf("\n\nEnter the Mongo DB Connection String: ")
// 	fmt.Scanln(&mongoDbConnectionString)
// 	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
// 	opts := options.Client().ApplyURI(mongoDbConnectionString).SetServerAPIOptions(serverAPI)

// 	// Create a new client and connect to the server
// 	client, err := mongo.Connect(context.TODO(), opts)
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer func() {
// 		if err = client.Disconnect(context.TODO()); err != nil {
// 			panic(err)
// 		}
// 	}()
// 	// Send a ping to confirm a successful connection
// 	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
// 		panic(err)
// 	}
// 	collection := client.Database("ticketing").Collection("passes")
// 	cursor, error := collection.Find(context.TODO(), bson.D{{}})
// 	if error != nil {
// 		fmt.Printf("HELLO")
// 	}
// 	for cursor.Next(context.TODO()) {
// 		var result Passes
// 		if err := cursor.Decode(&result); err != nil {
// 			log.Fatal(err)
// 		}
// 		passOccurance[result.Types] += 1
// 	}
// 	if err := cursor.Err(); err != nil {
// 		log.Fatal(err)
// 	}
// 	b, err := json.MarshalIndent(passOccurance, "", "  ")
// 	if err != nil {
// 		fmt.Println("error:", err)
// 	}
// 	fmt.Println(string(b))

// 	fmt.Println("Press Any Key to Exit")

// 	fmt.Scanln()
// }

// // defer cancel()
// // client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoDbConnectionString).SetServerAPIOptions(serverAPI))
// // if err != nil {
// // 	fmt.Printf("HELLO")
// // }
// // defer func() {
// // 	if err = client.Disconnect(ctx); err != nil {
// // 		panic(err)
// // 	}
// // }()
// // if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
// // 	panic(err)
// // }
// // fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")
// // collection := client.Database("ticketing").Collection("passes")
// // cursor, error := collection.Find(context.TODO(), bson.D{{}}, options.Find())
// // if error != nil {
// // 	fmt.Printf("HELLO")
// // }

// // var results []Passes
// // for _, result := range results {
// // 	cursor.Decode(&result)
// // 	output, err := json.MarshalIndent(result, "", "    ")
// // 	if err != nil {
// // 		panic(err)
// // 	}
// // 	fmt.Sprintf("%s", output)
// // }
