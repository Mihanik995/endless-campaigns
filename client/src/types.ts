export interface User {
    [key: string]: any

    id: string
    username: string
    email: string
    nodesPassedOnPairing?: NodesPassedOnPairing[]
    telegramId?: string
    notifications: 'none' | 'email' | 'telegram'
    allowPlatformNotification: boolean
}

export interface UserRegister {
    [key: string]: any

    username: string
    email: string
    password: string
    confirmPassword: string
    notifications: 'none' | 'email' | 'telegram'
    allowPlatformNotification: boolean
}

export interface UserLogin {
    [key: string]: any

    username: string;
    password: string;
    rememberMe: boolean
}

export interface Campaign {
    [key: string]: any

    id: string
    ownerId: string
    title: string
    description: string
    regulations: string
    dateStart: string
    dateEnd: string
    requiresRegisterApproval: boolean
    requiresPairingResultsApproval: boolean
    requiresPairingReport: boolean
    campaignRegisters?: CampaignRegister[]
    customNotifications?: CustomNotification[]
}

export interface CampaignCreate {
    [key: string]: any

    title: string
    description: string
    regulations: string
    dateStart: string
    dateEnd: string
    requiresRegisterApproval: boolean
    requiresPairingResultsApproval: boolean
    requiresPairingReport: boolean
}

export interface CampaignRegister {
    [key: string]: any

    id: string
    playerId: string
    campaignId: string
    formationName: string
    rosterLink: string
    approved: boolean
    player?: User
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

export interface Mission {
    [key: string]: any

    id: string
    creatorId: string
    title: string
    narrativeDescription: string
    missionConditions?: string
    nodes?: MissionNode[]
}

export interface MissionNode {
    [key: string]: any

    id: string
    mission: Mission
    missionId: string
    isMissionStart: boolean
    nextLinks: NodeLink[]
    prevLinks: NodeLink[]
    label: string
    buttonLabel: string
    narrativeDescription: string
    missionConditions: string
    positionX: number
    positionY: number
    nodesPassedOnPairing: NodesPassedOnPairing[]
}

export interface MissionNodeCreate {
    [key: string]: any

    label: string
    buttonLabel: string
    narrativeDescription: string
    missionConditions: string
    missionId: string
    isMissionStart: boolean
    positionX: number
    positionY: number
}

export interface MissionNodeData {
    [key: string]: any

    label: string
    buttonLabel: string
    narrativeDescription: string
    missionConditions: string
}

export interface NodeLink {
    id: string
    from: MissionNode
    fromId: string
    to: MissionNode
    toId: string
}

export interface MissionCreate {
    [key: string]: any

    title: string
    narrativeDescription: string
    missionConditions?: string
}

export interface Question {
    [key: string]: any

    id: string
    creatorId: string
    creator?: User
    missionId: string
    mission?: Mission
    text: string
    answer?: string
}

export interface Pairing {
    [key: string]: any

    id: string
    campaignId: string
    campaign?: Campaign
    periodId: string
    period?: CampaignPeriod
    missionId: string
    mission?: Mission
    players: PlayersOnPairings[]
    played: boolean
    winners: WinnersOnPairings[]

    resultsApproved: boolean
    reportLink?: string
    resultsRejected: boolean
    rejectMessage?: string
    nodesPassedOnPairing: NodesPassedOnPairing[]
}

export interface PairingCreate {
    [key: string]: any

    campaignId: string
    periodId: string
    missionId: string
    players: {
        [key: string]: any

        playerId: string
    }[]
}

export interface PlayersOnPairings {
    [key: string]: any

    player: User
    playerId: string
    pairing: Pairing
    pairingId: string
    personalMission?: Mission
    personalMissionId?: string
}

export interface PlayerRegister {
    [key: string]: any

    id: string;
    playerId: string;
    playerUsername: string;
    personalMissionId?: string
}

interface WinnersOnPairings {
    [key: string]: any

    player?: User
    playerId: String
    pairing?: Pairing
    pairingId: String
}

export interface NodesPassedOnPairing {
    node?: MissionNode
    nodeId: string
    pairing?: Pairing
    pairingId: string
    player?: User
    playerId: string
}

export interface CustomNotification {
    [key: string]: any

    id: string
    campaign?: Campaign
    campaignId: string
    heading: string
    text: string
    createdAt: string
}

export interface CustomNotificationCreate {
    [key: string]: any

    campaignId: string
    heading: string
    text: string
}