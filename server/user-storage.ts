import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

export interface User {
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at: string;
    updated_at?: string;
}

export async function readUsers(): Promise<Record<string, User>> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

export async function writeUsers(users: Record<string, User>): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
}

export async function getUser(identifier: string): Promise<User | null> {
    const users = await readUsers();
    return users[identifier] || null;
}

export async function createOrUpdateUser(identifier: string, userData: Partial<User>): Promise<User> {
    const users = await readUsers();

    if (!users[identifier]) {
        users[identifier] = {
            name: userData.name || '',
            email: userData.email || identifier,
            phone: userData.phone || '',
            address: userData.address || '',
            created_at: new Date().toISOString(),
        };
    } else {
        users[identifier] = {
            ...users[identifier],
            ...userData,
            updated_at: new Date().toISOString(),
        };
    }

    await writeUsers(users);
    return users[identifier];
}

export async function updateUserProfile(identifier: string, profileData: Partial<User>): Promise<User | null> {
    const users = await readUsers();

    if (!users[identifier]) {
        return null;
    }

    users[identifier] = {
        ...users[identifier],
        ...profileData,
        updated_at: new Date().toISOString(),
    };

    await writeUsers(users);
    return users[identifier];
}

export async function deleteUser(identifier: string): Promise<boolean> {
    const users = await readUsers();

    if (!users[identifier]) {
        return false;
    }

    delete users[identifier];
    await writeUsers(users);
    return true;
}

export async function getAllUsers(): Promise<User[]> {
    const users = await readUsers();
    return Object.values(users);
}
