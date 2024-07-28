# Project Name
This is StudyBuddy Server Application with MongoDB

## Getting Started

### Prerequisites

- Ensure you have Docker installed on your machine. You can download Docker from [here](https://www.docker.com/products/docker-desktop).

### Building the Docker Image

To build the Docker image, follow these steps:
1. Clone the repository:
    ```sh
    git clone https://github.com/StudyBuddyCorps/Back-end.git
    cd Back-end
    ```

2. Build and start the Docker containers:
    ```sh
    docker-compose up --build
    ```
   This command will:
   - Build the Docker images specified in the `docker-compose.yml` file.

### Automatically Reflect Code Changes with Nodemon
This project uses nodemon to automatically restart the server and reflect code changes without needing to rebuild the Docker image. This makes the development process more efficient.

