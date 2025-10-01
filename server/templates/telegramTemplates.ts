import type {Campaign, CampaignRegister, Mission, Pairing, User} from "../generated/prisma";

interface CampaignRegisterExt extends CampaignRegister {
    player: User
}

exports.newPlayerRegisteredMessage = (campaign: Campaign, register: CampaignRegisterExt) => {
    return `
${campaign.title}
${'-'.repeat(30)}
New player just registered for your campaign.
User: ${register.player.username}
Formation: ${register.formationName}
Roster: ${register.rosterLink}

${campaign.requiresRegisterApproval
        ? `To approve the registration, visit your campaign page: ${process.env.FRONTED_URL}/campaigns/${campaign.id}`
        : ''}`
}

exports.newQuestionMessage = (mission: Mission) => {
    return `
${mission.title}
${'-'.repeat(30)}
New question was asked.
For details: ${process.env.FRONTED_URL}/missions/${mission.id}`
}

exports.newPairingMessage = (campaign: Campaign, pairing: Pairing) => {
    return `
${campaign.title}
${'-'.repeat(30)}
New pairing assigned.
For more details: ${process.env.FRONTED_URL}/pairings/${pairing.id}`
}

exports.pairingPlayedMessage = (campaign: Campaign, playersString: string) => {
    return `
${campaign.title}
${'-'.repeat(30)}
${playersString} just sent their pairing results.
To verify: ${process.env.FRONTED_URL}/campaigns/${campaign.id}`
}

exports.resultsRejectedMessage = (campaign: Campaign, pairing: Pairing) => {
    return `
${campaign.title}
${'-'.repeat(30)}
One of your last pairing's result was rejected.
For: details: ${process.env.FRONTED_URL}/pairings/${pairing.id}`
}