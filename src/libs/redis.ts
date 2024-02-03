import Redis from 'ioredis';


export function  connectionToRedis()
{
    
const client = new Redis({
    host: 'localhost',
    port: 6379, 
});


client.on('connect', () => {
    console.log('Connected to Redis');
  });


  client.on('error', (err) => {
    console.error('Error of connection to Redis:', err);
  }); 


  return client;


}
