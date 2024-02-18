import { Kafka, Consumer } from 'kafkajs';

// Configuración del cliente Kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});

// Configuración del consumidor
const consumer = kafka.consumer({ groupId: 'user-existence-group' });

async function run() {
  // Conectarse al broker de Kafka
  await consumer.connect();

  // Suscribirse al tema de eventos
  await consumer.subscribe({ topic: 'login', fromBeginning: true });

  // Procesar los mensajes recibidos
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message && message.value) { // Verificación de nulidad
        // Parsear el mensaje
        const event = JSON.parse(message.value.toString());

        // Evaluar si el usuario existe
        const usuarioExiste = evaluarUsuario(event.usuario);

        // Retornar el resultado de la evaluación
        console.log(`El usuario ${event.usuario} ${usuarioExiste ? 'existe' : 'no existe'}`);
      }
    },
  });
}

// Función para evaluar si un usuario existe
function evaluarUsuario(usuario: any): boolean {
  // Aquí iría tu lógica para verificar si el usuario existe en tu sistema
  // Por ejemplo, podrías consultar una base de datos o algún otro servicio
  // En este ejemplo, simplemente se devuelve true aleatoriamente
  return Math.random() < 0.5; // Simula una evaluación aleatoria
}

// Iniciar el consumidor
run().catch(console.error);
