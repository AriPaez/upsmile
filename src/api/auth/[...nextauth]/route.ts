import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@/libs/prisma';
import bcrypt from 'bcrypt';
import { connectionToRedis } from '@/libs/redis';

interface Credentials {
  email: string;
  password: string;
}
 
  
 const clientRedis = connectionToRedis();

const authOptions = { 
  secret: process.env.AUTH_SECRET,
  
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'apaez' },
        password: { label: 'Password', type: 'password', placeholder: '*****' },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined, req: any): Promise<any> {
       
       
        if (!credentials) {
          throw new Error('Credentials are missing');
        }
       
        


        console.log('Email:' + credentials.email);
        console.log('Password:' + credentials.password);

       

        const authenticateUser = async () => {
          if (clientRedis) {
            try {
              const pass = await clientRedis.get(credentials.email);
              return pass ? pass.toString() : null;
            } catch (error) {
              console.error('Error capturing data from Redis', error);
              throw new Error('Error capturing data from Redis');
            }
          } else {
            throw new Error('Redis is not available');
          }
        };

        if ((await authenticateUser()) === null) {
          console.log('It is not saved in redis');
         
          const user = await db.users.findFirst({
            where: {
              username: credentials.email,
            },
          });
        
          if (!user) {
            console.log('User not found');
            throw new Error('No user found');
          }
          else
           {
            await clientRedis.set(credentials.email, await bcrypt.hash(credentials.password, 10), 'EX', 3600);

            const hashedPassword = await authenticateUser();

            if (hashedPassword !== null) {
              
              const passwordMatch = await bcrypt.compare(credentials.password, hashedPassword);
              
              if (passwordMatch) 
              {
                console.log('The password is found in the redis database: ' + (await authenticateUser()));
                console.log(' Pass: ' + (await authenticateUser()));
                console.log(' Email: ' + credentials.email);
                return true;
              } 
              else 
              {
                throw new Error('Wrong password');
              }
            } 
            else 
            {
               return false;
            }
          }
        } 
        else
        {

          const hashedPassword =await authenticateUser();

          
          if (hashedPassword !== null) {
          
            const passwordMatch = await bcrypt.compare(credentials.password, hashedPassword);
            if (passwordMatch) 
            {
              console.log('The password is found in the redis database: ' +hashedPassword);
              console.log(' Pass: ' + hashedPassword);
              console.log(' Email: ' + credentials.email);
              return true;
            } 
            else 
            {
              throw new Error('Wrong password');
            }
          
          }

          
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
};

const handler: NextApiHandler = NextAuth(authOptions);

export { handler as GET, handler as POST };
