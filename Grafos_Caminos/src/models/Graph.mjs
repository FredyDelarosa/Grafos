import LinkedList from "./LinkendList.mjs";

export default class Graph {
    #adjacencyMatrix = [];
    #vertexMap = new Map();

    constructor() {}

    addLocations(...locations) {
        for (let location of locations) {
            this.#adjacencyMatrix.push(new LinkedList());
            this.#vertexMap.set(location, this.#adjacencyMatrix.length - 1);
        }
    }

    addLocation(location) {
        if (!this.#vertexMap.has(location)) {
            this.#adjacencyMatrix.push(new LinkedList());
            this.#vertexMap.set(location, this.#adjacencyMatrix.length - 1);
        }
    }

    addConnection(start, end, weight = 1) {
        if (this.#vertexMap.has(start) && this.#vertexMap.has(end)) {
            this.#adjacencyMatrix[this.#vertexMap.get(start)].push(end, weight);
            return true;
        }
        return false;
    }


    depthFirstSearch(callback) {
        let visited = [];
        const entries = [...structuredClone(this.#vertexMap)];
        for (let i = 0; i < this.#adjacencyMatrix.length; i++)
            visited[i] = false;
    
        const dfs = (vertex) => {
            visited[this.#vertexMap.get(vertex)] = true;
            callback(vertex);
            let neighbors = [...this.#adjacencyMatrix[this.#vertexMap.get(vertex)].toArray()];
            for (let neighbor of neighbors) {
                if (!visited[this.#vertexMap.get(neighbor.name)]) {
                    dfs(neighbor.name);
                }
            }
        };
    
        let [key] = entries[0];
        dfs(key);
    }

    dijkstra(start) {
        const distances = {};
        const previous = {};
        const queue = new Set(this.#vertexMap.keys());

        for (let vertex of this.#vertexMap.keys()) {
            distances[vertex] = Infinity;
            previous[vertex] = null;
        }
        distances[start] = 0;

        while (queue.size > 0) {
            let minNode = null;
            for (let vertex of queue) {
                if (minNode === null || distances[vertex] < distances[minNode]) {
                    minNode = vertex;
                }
            }
            queue.delete(minNode);
            let neighbors = [...this.#adjacencyMatrix[this.#vertexMap.get(minNode)].toArray()];
            for (let neighbor of neighbors) {
                let alt = distances[minNode] + neighbor.distance;
                if (alt < distances[neighbor.name]) {
                    distances[neighbor.name] = alt;
                    previous[neighbor.name] = minNode;
                }
            }
        }

        return { distances, previous };
    }

    getAllShortestPaths(start) {
        const { distances, previous } = this.dijkstra(start);
        const paths = {};

        for (let end of this.#vertexMap.keys()) {
            const path = [];
            let current = end;

            while (current !== null) {
                path.unshift(current);
                current = previous[current];
            }

            if (path[0] === start) {
                paths[end] = path;
            } else {
                paths[end] = [];
            }
        }

        return { distances, paths };
    }
}
