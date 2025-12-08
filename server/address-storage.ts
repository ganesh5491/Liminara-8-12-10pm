import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'addresses.json');

export interface UserAddress {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface InsertUserAddress {
    userId: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

async function readAddresses(): Promise<UserAddress[]> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeAddresses(addresses: UserAddress[]): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(addresses, null, 2));
}

export async function getUserAddresses(userId: string): Promise<UserAddress[]> {
    const addresses = await readAddresses();
    return addresses.filter(addr => addr.userId === userId);
}

export async function getAddress(addressId: string): Promise<UserAddress | undefined> {
    const addresses = await readAddresses();
    return addresses.find(addr => addr.id === addressId);
}

export async function createAddress(addressData: InsertUserAddress): Promise<UserAddress> {
    const addresses = await readAddresses();

    // If this is marked as default, unset other default addresses for this user
    if (addressData.isDefault) {
        addresses.forEach(addr => {
            if (addr.userId === addressData.userId) {
                addr.isDefault = false;
            }
        });
    }

    const newAddress: UserAddress = {
        id: uuidv4(),
        ...addressData,
        isDefault: addressData.isDefault ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    addresses.push(newAddress);
    await writeAddresses(addresses);
    return newAddress;
}

export async function updateAddress(
    addressId: string,
    data: Partial<InsertUserAddress>
): Promise<UserAddress | undefined> {
    const addresses = await readAddresses();
    const index = addresses.findIndex(addr => addr.id === addressId);

    if (index === -1) {
        return undefined;
    }

    // If setting this as default, unset other defaults for this user
    if (data.isDefault) {
        const userId = addresses[index].userId;
        addresses.forEach(addr => {
            if (addr.userId === userId && addr.id !== addressId) {
                addr.isDefault = false;
            }
        });
    }

    addresses[index] = {
        ...addresses[index],
        ...data,
        updatedAt: new Date().toISOString(),
    };

    await writeAddresses(addresses);
    return addresses[index];
}

export async function deleteAddress(addressId: string, userId: string): Promise<boolean> {
    const addresses = await readAddresses();
    const index = addresses.findIndex(addr => addr.id === addressId && addr.userId === userId);

    if (index === -1) {
        return false;
    }

    addresses.splice(index, 1);
    await writeAddresses(addresses);
    return true;
}

export async function setDefaultAddress(userId: string, addressId: string): Promise<UserAddress | undefined> {
    const addresses = await readAddresses();

    // Unset all defaults for this user
    addresses.forEach(addr => {
        if (addr.userId === userId) {
            addr.isDefault = false;
        }
    });

    // Set the specified address as default
    const index = addresses.findIndex(addr => addr.id === addressId && addr.userId === userId);
    if (index === -1) {
        return undefined;
    }

    addresses[index].isDefault = true;
    addresses[index].updatedAt = new Date().toISOString();

    await writeAddresses(addresses);
    return addresses[index];
}

export async function getDefaultAddress(userId: string): Promise<UserAddress | undefined> {
    const addresses = await readAddresses();
    return addresses.find(addr => addr.userId === userId && addr.isDefault);
}
