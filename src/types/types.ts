export interface Token {
    token: string
    expires: Date
}

export interface AuthTokens {
    access: Token
    refresh?: Token
}
