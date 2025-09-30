import type {Campaign, CampaignRegister, Mission, Pairing, User} from "../generated/prisma";

require('dotenv').config();

interface CampaignRegisterExt extends CampaignRegister {
    player: User
}

exports.verificationEmail = (token: string): string => {
    return `<h3>Thank you for joining Endless Campaigns!</h3>
        <p>To end your verification, please
        <a href="${process.env.FRONTED_URL}/auth/verify/${token}">click this link</a>.</p>`
}

exports.restoreAccessEmail = (token: string): string => {
    return `<h3>We've got your request!</h3>
            <p>To restore access to your account, please follow <a href="${process.env.FRONTED_URL}/auth/restore-access/${token}">the link</a>.</p>`
}

exports.newPlayerRegisteredEmail = (campaign: Campaign, register: CampaignRegisterExt): string => {
    return `<h3>${campaign.title}</h3>
    <p>New player just registered for your campaign.</p>
    <ul>
    <li>User: ${register.player.username}</li>
    <li>Formation: ${register.formationName}</li>
    <li>Roster: <a href="${register.rosterLink}">${register.rosterLink}</a></li>
    </ul>
    ${campaign.requiresRegisterApproval
        ? '<p>To approve the registration, visit your ' +
        `<a href="${process.env.FRONTED_URL}/campaigns/${campaign.id}">campaign page</a>.</p>`
        : ''}`
}

exports.newQuestionEmail = (mission: Mission) => {
    return `<h3>${mission.title}</h3>
    <p>New quetion was asked.</p>
    <p>For details: <a href="${process.env.FRONTED_URL}/missions/${mission.id}">
        ${process.env.FRONTED_URL}/missions/${mission.id}
    </a></p>`
}

exports.newPairingEmail = (campaign: Campaign, pairing: Pairing) => {
    return `<h3>${campaign.title}</h3>
    <p>New pairing assigned.</p>
    <p>For more details: <a href="${process.env.FRONTED_URL}/pairings/${pairing.id}">
        ${process.env.FRONTED_URL}/pairings/${pairing.id}
    </a></p>`
}

exports.pairingPlayedEmail = (campaign: Campaign, playersString: string) => {
    return `<h3>${campaign.title}</h3>
    <p>${playersString} just sent their pairing results.</p>
    <p>To verify: <a href="${process.env.FRONTED_URL}/campaigns/${campaign.id}">
        ${process.env.FRONTED_URL}/campaigns/${campaign.id}
    </a></p>`
}

exports.resultsRejectedEmail = (campaign: Campaign, pairing: Pairing) => {
    return `<h3>${campaign.title}</h3>
    <p>One of your last pairing\'s result was rejected.</p>
    <p>For: details: <a href="${process.env.FRONTED_URL}/pairings/${pairing.id}">
        ${process.env.FRONTED_URL}/pairings/${pairing.id}
    </a></p>`
}