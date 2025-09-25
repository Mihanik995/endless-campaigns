interface ValidatePasswordInput {
    password: string
    confirmPassword: string
}

export default function<T extends ValidatePasswordInput>(data: T) {
    if (data.password !== data.confirmPassword) {
        throw new Error("Password doesn't match")
    }
}