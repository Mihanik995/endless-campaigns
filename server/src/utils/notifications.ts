import type {
    Campaign,
    CampaignRegister,
    Mission,
    Pairing,
    PlayersOnPairings,
    User,
    CustomNotification
} from "../../generated/prisma";

const {
    customNotificationEmail,
    resultsRejectedEmail,
    pairingPlayedEmail,
    newPlayerRegisteredEmail,
    newQuestionEmail,
    newPairingEmail
} = require("../../templates/emailTemplates")
const {
    customNotificationMessage,
    resultsRejectedMessage,
    pairingPlayedMessage,
    newPlayerRegisteredMessage,
    newQuestionMessage,
    newPairingMessage
} = require("../../templates/telegramTemplates")
const tgBot = require('../config/telegramBot')
const mailer = require('../config/nodemailer')

interface PlayersOnPairingsExt extends PlayersOnPairings {
    player: User
}

interface CampaignRegisterExt extends CampaignRegister {
    player: User
}

interface CampaignExt extends Campaign {
    owner: User
    campaignRegisters: CampaignRegisterExt[]
}

interface MissionExt extends Mission {
    creator: User
}

interface PairingExt extends Pairing {
    players: PlayersOnPairingsExt[]
    campaign: CampaignExt
}

exports.newRegisterNotify = (campaign: CampaignExt, register: CampaignRegister) => {
    const owner = campaign.owner
    switch (owner.notifications) {
        case 'email':
            return mailer.sendMail({
                from: process.env.SENDER_EMAIL,
                to: owner.email,
                subject: `${campaign.title} - New player registered`,
                html: newPlayerRegisteredEmail(campaign, register)
            })
        case 'telegram':
            if (owner.telegramId) {
                return tgBot.api.sendMessage(
                    owner.telegramId,
                    newPlayerRegisteredMessage(campaign, register),
                    {parse_mode: 'HTML'}
                )
            }
    }
}

exports.newQuestionNotify = (mission: MissionExt) => {
    const creator = mission.creator
    switch (creator.notifications) {
        case 'email':
            return mailer.sendMail({
                from: process.env.SENDER_EMAIL,
                to: creator.email,
                subject: `${mission.title} - New question`,
                html: newQuestionEmail(mission)
            })
        case 'telegram':
            if (creator.telegramId) {
                return tgBot.api.sendMessage(
                    creator.telegramId,
                    newQuestionMessage(mission),
                    {parse_mode: 'HTML'}
                )
            }
    }
}

exports.newPairingNotify = (pairing: PairingExt) => {
    const players = pairing.players.map(pData => pData.player)
    const campaign = pairing.campaign
    return Promise.all(players.map(player => {
        switch (player.notifications) {
            case 'email':
                return mailer.sendMail({
                    from: process.env.SENDER_EMAIL,
                    to: player.email,
                    subject: `${pairing.campaign.title} - New pairing assigned`,
                    html: newPairingEmail(campaign, pairing)
                })
            case 'telegram':
                if (player.telegramId) return tgBot.api.sendMessage(
                    player.telegramId,
                    newPairingMessage(campaign, pairing),
                    {parse_mode: 'HTML'}
                )
        }
    }))
}

exports.pairingPlayedNotify = (pairing: PairingExt) => {
    const owner = pairing.campaign.owner
    const usernames = pairing.players
        .map(pData => pData.player)
        .map(player => player.username)
    const playersString = usernames.length > 1
        ? `${usernames.slice(0, usernames.length - 1).join(', ')} and ${usernames[usernames.length - 1]}`
        : usernames[0]
    const campaign = pairing.campaign
    switch (owner.notifications) {
        case 'email':
            return mailer.sendMail({
                from: process.env.SENDER_EMAIL,
                to: owner.email,
                subject: `${pairing.campaign.title} - Pairing played`,
                html: pairingPlayedEmail(campaign, playersString)
            })
        case 'telegram':
            if (owner.telegramId) return tgBot.api.sendMessage(
                owner.telegramId,
                pairingPlayedMessage(campaign, playersString),
                {parse_mode: 'HTML'}
            )
    }
}

exports.resultsRejectedNotify = (pairing: PairingExt) => {
    const players = pairing.players.map(pData => pData.player)
    const campaign = pairing.campaign
    return Promise.all(players.map(player => {
        switch (player.notifications) {
            case 'email':
                return mailer.sendMail({
                    from: process.env.SENDER_EMAIL,
                    to: player.email,
                    subject: `${pairing.campaign.title} - Results rejected`,
                    html: resultsRejectedEmail(campaign, pairing)
                })
            case 'telegram':
                if (player.telegramId) return tgBot.api.sendMessage(
                    player.telegramId,
                    resultsRejectedMessage(campaign, pairing),
                    {parse_mode: 'HTML'}
                )
        }
    }))
}

exports.customNotification = (campaign: CampaignExt, notification: CustomNotification) => {
    const campaignPlayers = campaign.campaignRegisters
        .map(reg => reg.player)
    return Promise.all(campaignPlayers.map(player => {
        switch (player.notifications) {
            case 'email':
                return mailer.sendMail({
                    from: process.env.SENDER_EMAIL,
                    to: player.email,
                    subject: `${campaign.title} - ${notification.heading}`,
                    html: customNotificationEmail(campaign, notification)
                })
            case 'telegram':
                if (player.telegramId) return tgBot.api.sendMessage(
                    player.telegramId,
                    customNotificationMessage(campaign, notification),
                    {parse_mode: 'HTML'}
                )
        }
    }))
}