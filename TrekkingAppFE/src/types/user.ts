export interface Role {
    id: string;
    name: string
}

export interface User {
    id: string;
    email: string;
    fullname: string;
    dob: string | null;
    address: string | null;
    phoneNumber: string | null;
    gender: string | null;
    image: string | null
    role: Role,
    permissions: string[]
}