require('dotenv').config();

module.exports = function (token: string): string {
    return `<h3>Thank you for joining Endless Campaigns!</h3>
<p>To end your verification, please <a href="${process.env.FRONTED_URL}/auth/verify/${token}">click this link</a>.</p>`
}