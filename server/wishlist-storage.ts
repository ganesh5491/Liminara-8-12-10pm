import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'wishlistItems.json');

export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
}

export interface InsertWishlistItem {
    userId: string;
    productId: string;
}

async function readWishlistItems(): Promise<WishlistItem[]> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeWishlistItems(items: WishlistItem[]): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2));
}

export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
    const items = await readWishlistItems();
    return items.filter(item => item.userId === userId);
}

export async function addToWishlist(userId: string, productId: string): Promise<WishlistItem> {
    const items = await readWishlistItems();

    // Check if item already exists
    const existing = items.find(item => item.userId === userId && item.productId === productId);
    if (existing) {
        return existing;
    }

    const newItem: WishlistItem = {
        id: uuidv4(),
        userId,
        productId,
        createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    await writeWishlistItems(items);
    return newItem;
}

export async function removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const items = await readWishlistItems();
    const index = items.findIndex(item => item.userId === userId && item.productId === productId);

    if (index === -1) {
        return false;
    }

    items.splice(index, 1);
    await writeWishlistItems(items);
    return true;
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
    const items = await readWishlistItems();
    return items.some(item => item.userId === userId && item.productId === productId);
}

export async function clearWishlist(userId: string): Promise<void> {
    const items = await readWishlistItems();
    const filtered = items.filter(item => item.userId !== userId);
    await writeWishlistItems(filtered);
}
