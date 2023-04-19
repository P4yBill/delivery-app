export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    username: string;
}

export interface UnauthorizedResponse {
    success: boolean;
    message: string;
}

