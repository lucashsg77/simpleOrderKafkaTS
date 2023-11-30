# simpleOrderKafkaTS

This project provides a Kafka-based order processing system. It simulates creating random orders, sends them to Kafka, and processes them through a consumer service.

## Requirements

- Docker
- Node.js
- TypeScript
- Kafka (Set up using Docker)

## Setup

1. **Clone the Repository**

2. **Start Kafka and Zookeeper Services**
- Using Docker Compose, this will start Zookeeper and Kafka services, with a Kafka topic named "order-topic".:
```bash
  docker-compose up -d
```

3. **Install Dependencies**

npm install

## Running the Application

1. **Start the Producer and Consumer**

npm start

This command runs both the order producer (`src/index.ts`) and consumer (`src/runConsumer.ts`) simultaneously.

2. **Running Tests**

npm test

This will run the test suite using Jest.

## Project Structure

- `src/models/`: Contains order model definitions.
- `src/services/`: Includes Kafka service, order processor logic.
- `src/index.ts`: Entry point for order producer.
- `src/runConsumer.ts`: Entry point for Kafka consumer.

## Docker Compose

The `docker-compose.yml` file sets up the Kafka and Zookeeper services. The Kafka service is configured to create a topic named "order-topic" upon startup.

## Contributing

Contributions to the project are welcome. Please feel free to open an issue or create a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
