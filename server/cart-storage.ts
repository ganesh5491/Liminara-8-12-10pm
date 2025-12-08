import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'cartItems.json');

export interface CartItem {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt: string;
}

export interface InsertCartItem {
    userId: string;
    productId: string;
    quantity: number;
}

async function readCartItems(): Promise<CartItem[]> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeCartItems(items: CartItem[]): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2));
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
    const items = await readCartItems();
    return items.filter(item => item.userId === userId);
}

export async function addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItem> {
    const items = await readCartItems();

    // Check if item already exists
    const existingIndex = items.findIndex(item => item.userId === userId && item.productId === productId);

    if (existingIndex !== -1) {
        // Update quantity
        items[existingIndex].quantity += quantity;
        await writeCartItems(items);
        return items[existingIndex];
    }

    // Create new cart item
    const newItem: CartItem = {
        id: uuidv4(),
        userId,
        productId,
        quantity,
        createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    await writeCartItems(items);
    return newItem;
}

export async function updateCartItem(userId: string, productId: string, quantity: number): Promise<CartItem | undefined> {
    const items = await readCartItems();
    const index = items.findIndex(item => item.userId === userId && item.productId === productId);

    if (index === -1) {
        return undefined;
    }

    items[index].quantity = quantity;
    await writeCartItems(items);
    return items[index];
}

export async function removeFromCart(userId: string, productId: string): Promise<boolean> {
    const items = await readCartItems();
    const index = items.findIndex(item => item.userId === userId && item.productId === productId);

    if (index === -1) {
        return false;
    }

    items.splice(index, 1);
    await writeCartItems(items);
    return true;
}

export async function clearCart(userId: string): Promise<void> {
    const items = await readCartItems();
    const filtered = items.filter(item => item.userId !== userId);
    await writeCartItems(filtered);
}

export async function getCartItemCount(userId: string): Promise<number> {
    const items = await getCartItems(userId);
    return items.reduce((total, item) => total + item.quantity, 0);
}
