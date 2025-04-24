import { hashPassword } from './server/auth.js';
import { storage } from './server/storage.js';

async function createAdmin() {
  try {
    console.log('Hashing password...');
    const hashedPassword = await hashPassword("j'aimelesprite");
    console.log('Password hashed successfully');
    
    console.log('Creating admin user...');
    const adminUser = await storage.createUser({
      username: 'TheDefenseRamaCEO',
      password: hashedPassword,
      karma: 1000,
      textAvatar: '👑',
    });
    
    console.log('Admin user created:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();