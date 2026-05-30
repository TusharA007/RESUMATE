import fs from 'node:fs/promises';
import path from 'node:path';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/mongodb';

const localDataDir = path.join(process.cwd(), '.data');
const localUsersFile = path.join(localDataDir, 'users.json');

async function readLocalUsers() {
  try {
    const content = await fs.readFile(localUsersFile, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeLocalUsers(users) {
  await fs.mkdir(localDataDir, { recursive: true });
  await fs.writeFile(localUsersFile, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const users = await getUsersCollection();

  if (users) return users.findOne({ email: normalizedEmail });

  if (process.env.NODE_ENV === 'production') return null;
  const localUsers = await readLocalUsers();
  return localUsers.find((user) => user.email === normalizedEmail) || null;
}

export async function createUserAccount({ name, email, passwordHash }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const users = await getUsersCollection();
  const user = {
    name,
    email: normalizedEmail,
    passwordHash,
    image: null,
    createdAt: new Date(),
    profile: {
      readinessScore: 81,
      targetRole: 'Target Role'
    }
  };

  if (users) {
    const result = await users.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MongoDB is not configured yet.');
  }

  const localUsers = await readLocalUsers();
  const localUser = { ...user, _id: new ObjectId().toString() };
  localUsers.push(localUser);
  await writeLocalUsers(localUsers);
  return localUser;
}
