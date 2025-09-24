require('dotenv').config();

function verificationEmail (token: string): string {
    return `<h3>Thank you for joining Endless Campaigns!</h3>
<p>To end your verification, please <a href="${process.env.FRONTED_URL}/auth/verify/${token}">click this link</a>.</p>`
}

function restoreAccessEmail (token: string): string {
    return `<h3>We've got your request!</h3>
<p>To restore access to your account, please follow <a href="${process.env.FRONTED_URL}/auth/restore-access/${token}">the link</a>.</p>`
}

module.exports = {verificationEmail, restoreAccessEmail}