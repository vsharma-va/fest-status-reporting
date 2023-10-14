import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

const projectionTypes = {
    _id: 0,
};
const optionsTypes = {
    projection: projectionTypes,
};

//@ts-ignore
const client = new MongoClient(process.env.MONGO_URL);

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
        name: "BattleGrounds Mayhem",
        type: "team",
        strapiId: "ES_BGDMHM",
    },
    {
        name: "Beats and Carrots",
        type: "solo",
        strapiId: "C_BTSCAR",
    },
    {
        name: "COD:EXECUTION",
        type: "team",
        strapiId: "ES_CODEXE",
    },
    {
        name: "Valorant: Rising",
        type: "team",
        strapiId: "ES_VALRIS",
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
        name: "Crown Quest",
        type: "team",
        strapiId: "ES_CRWQST",
    },
    {
        name: "Focus & Frame",
        type: "solo",
        strapiId: "C_FCSFRM",
    },
    {
        name: "Goal Quest",
        type: "solo",
        strapiId: "ES_GOLQST",
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

//@ts-ignore
export const load = async (event) => {
    const session = await event.locals.getSession();
    if (!session?.user) {
        throw redirect(302, "/");
    } else {
        //@ts-ignore
        const client = new MongoClient(process.env.MONGO_URL);
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
    // @ts-ignore
    default: async (event) => {
        const session = await event.locals.getSession();
        if (!session?.user) {
            throw redirect(302, "/");
        } else {
            const perPage = 5;
            const formData = await event.request.formData();
            let eventId = formData.get("eventName");
            let pageNumber = formData.get("pageNumber");
            let dataSetting = formData.get("dataSetting");
            if (dataSetting && eventId) {
                // console.log("hello");
                let requiredEventObj;
                events.forEach((indiObj) => {
                    if (indiObj.strapiId == eventId) {
                        requiredEventObj = indiObj;
                    }
                });
                //@ts-ignore
                const teamDatabase = client.db("teams");
                if (requiredEventObj) {
                    if (dataSetting === "reg") {
                        //@ts-ignore
                        if (requiredEventObj.type === "solo") {
                            const soloRegs =
                                teamDatabase.collection("t_soloregs");
                            let reg = await soloRegs
                                .find(
                                    {
                                        //@ts-ignore
                                        event: requiredEventObj.strapiId,
                                    },
                                    optionsTypes
                                )
                                .skip(Number(pageNumber) * perPage)
                                .limit(perPage)
                                .toArray();
                            let map = await getUserDetails(false, reg);
                            if (Number(pageNumber) == 0) {
                                return {
                                    success: true,
                                    team: false,
                                    registrationObj: map,
                                    firstPage: true,
                                };
                            } else {
                                return {
                                    success: true,
                                    team: false,
                                    registrationObj: map,
                                    firstPage: false,
                                };
                            }
                            //@ts-ignore
                        } else if (requiredEventObj.type === "team") {
                            const teamRegs = teamDatabase.collection("t_teams");
                            let reg = await teamRegs
                                .find(
                                    {
                                        //@ts-ignore
                                        event: requiredEventObj.strapiId,
                                    },
                                    optionsTypes
                                )
                                .skip(Number(pageNumber) * perPage)
                                .limit(perPage)
                                .toArray();
                            let map = await getUserDetails(true, reg);
                            if (Number(pageNumber) == 0) {
                                return {
                                    success: true,
                                    team: true,
                                    registrationObj: map,
                                    firstPage: true,
                                };
                            } else {
                                return {
                                    success: true,
                                    team: true,
                                    registrationObj: map,
                                    firstPage: false,
                                };
                            }
                        }
                    } else if (dataSetting === "unreg") {
                        const ticketingDatabase = client.db("ticketing");
                        const teamsDatabase = client.db("teams");
                        const passes = ticketingDatabase.collection("passes");
                        const userMap = [];
                        let passName;
                        //@ts-ignore
                        if (requiredEventObj["strapiId"].charAt(0) == "S") {
                            //@ts-ignore
                            passName = requiredEventObj["strapiId"].replace(
                                "S",
                                "SPORT"
                            );
                        } else if (
                            //@ts-ignore
                            requiredEventObj["strapiId"].charAt(0) == "C"
                        ) {
                            // required since there has been a bit of a naming error with pass codes
                            // the short code for group dance is C_GRW but the pass code is CLTR_GRD
                            if (requiredEventObj["strapiId"] == "C_GRW") {
                                passName = "CLTR_GRD";
                            } else {
                                //@ts-ignore
                                passName = requiredEventObj["strapiId"].replace(
                                    "C",
                                    "CLTR"
                                );
                            }
                        }
                        // console.log(passName);
                        const foundUsers = await passes
                            .find({ type: passName }, optionsTypes)
                            // .skip(Number(pageNumber) * perPage)
                            // .limit(perPage)
                            .toArray();
                        const usersCollection =
                            teamsDatabase.collection("t_users");
                        // console.log(foundUsers);
                        for (let index in foundUsers) {
                            // console.log(typeof foundUsers[index].email);

                            let foundReg = await usersCollection.findOne({
                                email: {
                                    $eq: foundUsers[index].email.trim(),
                                },
                            });
                            // console.log(foundReg);
                            // console.log(foundReg == null);
                            if (foundReg == null) {
                                userMap.push(foundUsers[index]);
                            }
                        }
                        // console.log(userMap);
                        return {
                            success: true,
                            team: true,
                            registrationObj: userMap,
                            firstPage: false,
                            unReg: true,
                        };
                    }
                    // console.log(requiredEventObj["strapiId"].charAt(0));
                }
            } else {
                throw redirect(302, "/");
            }
        }
    },
};

//@ts-ignore
async function getUserDetails(team, users) {
    if (!team) {
        const database = client.db("teams");
        const userData = database.collection("t_users");
        let userMap = [];
        //@ts-ignore
        for (let index in users) {
            //@ts-ignore
            let userDetail = await userData.findOne(
                { email: { $eq: users[index].email.toString() } },
                optionsTypes
            );
            userMap.push(userDetail);
        }
        //@ts-ignore
        return userMap;
    } else {
        const database = client.db("teams");
        const userData = database.collection("t_users");
        let userMap = {};
        for (let index in users) {
            let ownerDetail = await userData.findOne(
                {
                    email: { $eq: users[index].owner.toString() },
                },
                optionsTypes
            );
            //@ts-ignore
            userMap[index] = [ownerDetail];
            if (users[index].members.length != 0) {
                for (let ti in users[index].members) {
                    //@ts-ignore
                    if (ti == 0) {
                        continue;
                    }
                    let userDetail = await userData.findOne(
                        {
                            email: { $eq: users[index].members[ti].email },
                        },
                        optionsTypes
                    );
                    //@ts-ignore
                    userMap[index].push(userDetail);
                }
            }
        }
        // console.log(userMap);
        return userMap;
    }
}
