export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

export const UserMock: User = {
    id: 1,
    username: "mock_user",
    first_name: "Mock",
    last_name: "User"
};