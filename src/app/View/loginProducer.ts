import { useState } from 'react';
import { Kafka, CompressionTypes } from 'kafkajs';

function LoginProducer() {
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (data: any) => {
    try {
      // Configura el cliente Kafka
      const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092'] // Reemplaza con tus brokers de Kafka
      });

      // Crea un productor Kafka
      const producer = kafka.producer();

      // Conecta al productor Kafka
      await producer.connect();

      // Envia el mensaje al tópico
      await producer.send({
        topic: 'login-topic', // Reemplaza con el nombre de tu tópico Kafka
        compression: CompressionTypes.GZIP,
        messages: [
          { value: JSON.stringify(data) } // Envía los datos del formulario como un JSON
        ],
      });

      // Desconecta el productor Kafka
      await producer.disconnect();

      setError(null); // Limpia cualquier error previo
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message'); // Maneja el error si ocurre
    }
  };

  const onSubmit = async (data: any) => {
    await sendMessage(data); // Envía los datos del formulario al consumidor Kafka
  };

  // Resto de tu código de formulario de inicio de sesión...

  
}

export default LoginProducer;
