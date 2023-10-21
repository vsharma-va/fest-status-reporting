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

//@ts-ignore
export async function fetchUnregisteredUsers(requiredEventObj) {
    const ticketingDatabase = client.db("ticketing");
    const teamsDatabase = client.db("teams");
    const passes = ticketingDatabase.collection("passes");
    const userMap = [];
    let passName;
    //@ts-ignore
    if (requiredEventObj["strapiId"].charAt(0) == "S") {
        //@ts-ignore
        passName = requiredEventObj["strapiId"].replace("S", "SPORT");
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
            passName = requiredEventObj["strapiId"].replace("C", "CLTR");
        }
    }
    // console.log(passName);
    const foundUsers = await passes
        .find({ type: passName }, optionsTypes)
        // .skip(Number(pageNumber) * perPage)
        // .limit(perPage)
        .toArray();
    const usersCollection = teamsDatabase.collection("t_users");
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
        } else {
            let foundTeam = await teamsDatabase.collection("t_teams").findOne({
                owner: foundUsers[index].email.trim(),
            });
            if (foundTeam == null) {
                userMap.push(foundUsers[index]);
            }
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

export async function fetchRegisteredUsers(
    //@ts-ignore
    requiredEventObj,
    //@ts-ignore
    teamDatabase,
    //@ts-ignore
    pageNumber,
    //@ts-ignore
    perPage
) {
    if (requiredEventObj.type === "solo") {
        const soloRegs = teamDatabase.collection("t_soloregs");
        let reg;
        if (perPage == -1) {
            reg = await soloRegs
                .find(
                    {
                        //@ts-ignore
                        event: requiredEventObj.strapiId,
                    },
                    optionsTypes
                )
                .toArray();
        } else {
            reg = await soloRegs
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
        }
        let map = await getUserDetails(false, reg);
        if (Number(pageNumber) == 0) {
            return {
                success: true,
                team: false,
                registrationObj: map,
                firstPage: true,
                pageSize: perPage,
            };
        } else {
            return {
                success: true,
                team: false,
                registrationObj: map,
                firstPage: false,
                pageSize: perPage,
            };
        }
        //@ts-ignore
    } else if (requiredEventObj.type === "team") {
        const teamRegs = teamDatabase.collection("t_teams");
        let reg;
        if (perPage == -1) {
            reg = await teamRegs
                .find(
                    {
                        //@ts-ignore
                        event: requiredEventObj.strapiId,
                    },
                    optionsTypes
                )
                .toArray();
        } else {
            reg = await teamRegs
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
        }

        let map = await getUserDetails(true, reg);
        if (Number(pageNumber) == 0) {
            console.log(map);
            return {
                success: true,
                team: true,
                registrationObj: map,
                firstPage: true,
                pageSize: perPage,
            };
        } else {
            console.log(map);
            return {
                success: true,
                team: true,
                registrationObj: map,
                firstPage: false,
                pageSize: perPage,
            };
        }
    }
}

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
