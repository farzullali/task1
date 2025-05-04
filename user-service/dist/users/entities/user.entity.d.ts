export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
