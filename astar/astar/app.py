from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq
import math

app = Flask(__name__)
CORS(app)  # Allow all origins

# Heuristic function (Euclidean Distance)
def heuristic(a, b):
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

# A* Algorithm for shortest path
def a_star(start, goal):
    open_list = []
    closed_list = set()
    
    heapq.heappush(open_list, (0 + heuristic(start, goal), 0, start))  # (f, g, node)
    g_score = {start: 0}
    came_from = {}

    while open_list:
        _, current_g, current = heapq.heappop(open_list)

        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path  # Return the shortest path

        closed_list.add(current)

        # Move in 4 possible directions (N, S, E, W)
        for dr, dc in [(-0.001, 0), (0.001, 0), (0, -0.001), (0, 0.001)]:  
            neighbor = (round(current[0] + dr, 6), round(current[1] + dc, 6))

            if neighbor not in closed_list:
                tentative_g_score = current_g + 1  # Assuming uniform weight

                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    g_score[neighbor] = tentative_g_score
                    f_score = tentative_g_score + heuristic(neighbor, goal)
                    came_from[neighbor] = current
                    heapq.heappush(open_list, (f_score, tentative_g_score, neighbor))

    return []  # No path found

@app.route('/find_path', methods=['POST'])
def find_path():
    data = request.json
    start = tuple(data['start'])  # Example: [19.076, 72.877] -> (19.076, 72.877)
    goal = tuple(data['goal'])

    shortest_path = a_star(start, goal)

    return jsonify({'path': shortest_path})

if __name__ == '__main__':
    app.run(debug=True)
