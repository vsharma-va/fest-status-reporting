import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";
import { fetchRegisteredUsers } from "$lib/common/RegistrationFetching.js";

//@ts-ignore
const client = new MongoClient(process.env.MONGO_URL_WRITE);

const projectionTypes = {
    _id: 0,
    token: 0,
};
const optionsTypes = {
    projection: projectionTypes,
};

const events = [
    {
        name: "Saarang",
        type: "solo",
        strapiId: "C_SAARANG",
    },
    {
        name: "Battle Of Bands",
        type: "team",
        strapiId: "C_BOB",
    },
    {
        name: "MindScribe",
        type: "solo",
        strapiId: "C_MNDSCR",
    },
    {
        name: "Beats and Carrots",
        type: "solo",
        strapiId: "C_BTSCAR",
    },
    {
        name: "Echoes",
        type: "solo",
        strapiId: "C_ECHOES",
    },
    {
        name: "Natyam Nirvana",
        type: "team",
        strapiId: "C_GRC",
    },
    {
        name: "Street Beat",
        type: "solo",
        strapiId: "C_STRBET",
    },
    {
        name: "Bat Bowl Bid",
        type: "team",
        strapiId: "C_BTBLBD",
    },
    {
        name: "Logolympic",
        type: "solo",
        strapiId: "C_LOGLYM",
    },
    {
        name: "Beat2Beat",
        type: "team",
        strapiId: "C_GRW",
    },
    {
        name: "Focus & Frame",
        type: "solo",
        strapiId: "C_FCSFRM",
    },
    {
        name: "Zenith",
        type: "solo",
        strapiId: "C_ZENITH",
    },
    {
        name: "Shark Tank",
        type: "team",
        strapiId: "C_SHKTNK",
    },
    {
        name: "Runway Rendezvous",
        type: "team",
        strapiId: "C_FAS",
    },
    {
        name: "Surge Safari",
        type: "team",
        strapiId: "C_SRGSAF",
    },
    {
        name: "Brushstroke Battle",
        type: "solo",
        strapiId: "C_BSHBTL",
    },
    {
        name: "Manga Odyssey",
        type: "solo",
        strapiId: "C_MNGODY",
    },
    {
        name: "Rangavalli",
        type: "team",
        strapiId: "C_RANCOM",
    },
    {
        name: "Theatrical Showdown",
        type: "team",
        strapiId: "C_THESHD",
    },
    {
        name: "Street Spotlight",
        type: "team",
        strapiId: "C_STRBET",
    },
    {
        name: "Market Mayhem",
        type: "team",
        strapiId: "C_MKTMHM",
    },
    {
        name: "CineCraft",
        type: "team",
        strapiId: "C_CINCRF",
    },
    {
        name: "BrainWave",
        type: "team",
        strapiId: "C_BRNWAV",
    },
    {
        name: "Quiz-a-palooza",
        type: "team",
        strapiId: "C_QZAPLZ",
    },
    {
        name: "Battle Of Babble",
        type: "team",
        strapiId: "C_BTLBAB",
    },
    {
        name: "Athletics",
        type: "solo",
        strapiId: "S_ATH",
    },
    {
        name: "Women's Basketball",
        type: "team",
        starpiId: "S_BB_F",
    },
    {
        name: "Men's Basketball",
        type: "team",
        strapiId: "S_BB_M",
    },
    {
        name: "Chess",
        type: "team",
        strapiId: "S_CHS",
    },
    {
        name: "Men's Football",
        type: "team",
        strapiId: "S_FB_M",
    },
    {
        name: "Women's Tennis",
        type: "solo",
        strapiId: "S_TN_F",
    },
    {
        name: "Men's Tennis",
        type: "team",
        strapiId: "S_TN_M",
    },
    {
        name: "Women's Table Tennis",
        type: "solo",
        strapiId: "S_TT_F",
    },
    {
        name: "Men's Table Tennis",
        type: "team",
        strapiId: "S_TT_M",
    },
    {
        name: "Men's Volleyball",
        type: "team",
        strapiId: "S_VB_M",
    },
];

export const load = async (event) => {
    const session = await event.locals.getSession();
    if (!session?.user) {
        throw redirect(302, "/");
    } else {
        //@ts-ignore

        const saDatabase = client.db("status_app");
        const accounts = saDatabase.collection("sa_accounts");
        const foundAccount = await accounts.findOne({
            email: session.user.email,
        });
        if (!foundAccount) {
            return { authorised: false };
        } else {
            if (
                foundAccount.role === "gen+" ||
                foundAccount.role === "gen-" ||
                foundAccount.role === "event_lead"
            ) {
                return { authorised: true, events: events };
            } else {
                return { authorised: false };
            }
        }
    }
};

export const actions = {
    //@ts-ignore
    default: async (event) => {
        const session = await event.locals.getSession();
        if (!session?.user) {
            throw redirect(302, "/");
        } else {
            const formData = await event.request.formData();
            let eventId = formData.get("eventName");
            let dataType = formData.get("dataType");
            if (dataType == "event") {
                let requiredEventObj;
                events.forEach((indiObj) => {
                    if (indiObj.strapiId == eventId) {
                        requiredEventObj = indiObj;
                    }
                });
                //@ts-ignore
                const teamDatabase = client.db("teams");
                if (requiredEventObj) {
                    let registeredUsersMap = await fetchRegisteredUsers(
                        requiredEventObj,
                        teamDatabase,
                        1,
                        -1
                    );
                    if (registeredUsersMap?.team == false) {
                        return {
                            success: true,
                            csvData: registeredUsersMap?.registrationObj,
                            fileName: eventId,
                        };
                    } else if (registeredUsersMap?.team == true) {
                        let csvData = [];
                        //@ts-ignore
                        delete registeredUsersMap.registrationObj["teams"];
                        let data = Object.entries(
                            registeredUsersMap.registrationObj
                        );
                        // console.log(registeredUsersMap.registrationObj);
                        for (let index in data) {
                            for (let i = 0; i < data[index][1].length; i++) {
                                if (data[index][1][i] != null) {
                                    data[index][1][i]["teamNumber"] =
                                        data[index][0];
                                    csvData.push(data[index][1][i]);
                                }
                            }
                        }
                        return {
                            success: true,
                            csvData: csvData,
                            fileName: eventId,
                        };
                    }
                } else {
                    throw redirect(302, "/export-data");
                }
            } else if (dataType == "pass") {
                // VERY HEAVY ON THE DB THEREFORE A USER CAN ONLY PERFORM THIS ACTION ONCE EVERY 30 MINUTES;
                //@ts-ignore
                let userFound = await client
                    .db("status_app")
                    .collection("sa_export")
                    .findOne({ email: session.user.email });
                if (!userFound) {
                    //@ts-ignore
                    await client
                        .db("status_app")
                        .collection("sa_export")
                        .insertOne({
                            email: session.user.email,
                            last_accessed: new Date(),
                        });
                    let data = await getAllPassHolderData();
                    return {
                        success: true,
                        csvData: data,
                        fileName: "allData",
                    };
                } else {
                    let lastAccessed = userFound["last_accessed"];
                    //@ts-ignore
                    let diffInMs = new Date() - lastAccessed;
                    let diffInMi = Math.round(
                        ((diffInMs % 86400000) % 3600000) / 60000
                    );
                    if (diffInMi >= 30) {
                        await client
                            .db("status_app")
                            .collection("sa_export")
                            .updateOne(
                                { email: session.user.email },
                                { $set: { last_accessed: new Date() } }
                            );
                        let data = await getAllPassHolderData();
                        return {
                            success: true,
                            csvData: data,
                            fileName: "allData",
                        };
                    } else {
                        return {
                            success: false,
                            csvData: "",
                            fileName: "cooldown",
                            tryAgain: true,
                            tryAgainIn: 30 - diffInMi,
                        };
                    }
                }
            }
        }
    },
};

async function getAllPassHolderData() {
    const ticketingDb = client.db("ticketing");
    const passesCollection = ticketingDb.collection("passes");
    const foundPasses = passesCollection
        .find(
            {
                generated: true,
            },
            optionsTypes
        )
        .toArray();

    return foundPasses;
}
