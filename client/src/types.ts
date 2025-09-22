export interface User {
    id: string
    username: string
    email: string
}

export interface UserRegister {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface Campaign {
    [key: string]: string | boolean

    id: string
    ownerId: string
    title: string
    description: string
    regulations: string
    dateStart: string
    dateEnd: string
    requiresRegisterApproval: boolean
}

export interface CampaignRegister {
    [key: string]: string | boolean

    id: string
    playerId: string
    campaignId: string
    formationName: string
    rosterLink: string
    approved: boolean
}

export interface CampaignRegisterCreate {
    [key: string]: string

    campaignId: string
    formationName: string
    rosterLink: string
}

export interface CampaignPeriod {
    [key: string]: string

    id: string
    campaignId: string
    dateStart: string
    dateEnd: string
}

export interface CampaignPeriodCreate {
    [key: string]: string

    campaignId: string
    dateStart: string
    dateEnd: string
}

export interface SimpleMission {
    [key: string]: string

    id: string
    creatorId: string
    title: string
    narrativeDescription: string
    missionConditions: string
}

export interface SimpleMissionCreate {
    [key: string]: string

    title: string
    narrativeDescription: string
    missionConditions: string
}

export interface Pairing {
    [key: string]: any

    id: string
    campaignId: string
    campaign?: Campaign
    periodId: string
    period?: CampaignPeriod
    simpleMissionId: string
    simpleMission?: SimpleMission
    players: User[]
}

export interface PairingData {
    [key: string]: string | PlayersOnPairings[]

    id: string
    campaignId: string
    periodId: string
    simpleMissionId: string
    players: PlayersOnPairings[]
}

export interface PlayersOnPairings {
    player: User
    pairing: Pairing
}

export interface PlayerRegister {
    id: string;
    playerId: string;
    playerUsername: string;
}