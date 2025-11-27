# Org Chart Visualizer

A React TypeScript application to visualize organizational charts from CSV data.

## Features

- **CSV Upload**: Upload a CSV file containing employee data.
- **Interactive Chart**: Expand/collapse nodes, pan, and zoom.
- **Custom Design**: Clean, card-based node design showing image, name, and position.
- **Multiple Roots**: Automatically handles multiple root nodes.

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Open [http://localhost:5173](http://localhost:5173) to view the app.

## CSV Format

The CSV file should have the following columns:
- `id`: Unique identifier for the employee.
- `name`: Full name.
- `position`: Job title.
- `manager_id`: (Optional) ID of the manager. Leave empty for root nodes.
- `image_url`: (Optional) URL to the employee's photo.

A sample file is provided at `public/sample.csv`.
