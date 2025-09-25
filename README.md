# Palendar

Make scheduling outings with friends easier!

![Demo App](/frontend/public/read-me.png/)

### Motivation

- I find that I often overbook my week with meet-ups and plans. This site was designed to help me organize my and my friend's schedule.

### Table of Contents

- Tech Stack: Flask, React, SQLite, SQLAlchemy, Chakra UI
- CRUD Functionality: Create, read, update, and delete friends and events from your contact book.
- Authentication: JWT Tokens
- Stay Organized: Use the calendar to organize your social/business life by adding events.
- Stylish UI Components: Enhanced user experience with UI components provided by Chakra UI.
- Theme Change: User interface experience with light and dark mode options.
- Responsive Design: Designed to adapt to various screen sizes.

### Run the App Locally

1. Clone the repository


2. Navigate to the project directory:

```bash
cd palendar
```

3. Navigate to the backend directory:

```bash
cd backend
```

4. Create a virtual environment:

- On macOS and Linux:

```bash
python3 -m venv venv
```

- On Windows:

```bash
python -m venv venv
```

5. Activate the virtual environment:

- On macOS and Linux:

```bash
source venv/bin/activate
```

- On Windows:

```bash
venv\Scripts\activate
```

6. Install the dependencies:

- On macOS and Linux:

```bash
pip3 install -r requirements.txt
```

- On Windows:

```bash
pip install -r requirements.txt
```

7. Navigate to the frontend directory:

```bash
cd ../frontend
```

8. Install the dependencies:

```bash
npm install
```

9. Build the frontend:

```bash
npm run build
```

10. Navigate to the backend directory:

```bash
cd ../backend
```

11. Run the Flask app:

```bash
flask run
```

12. Open your browser and go to `http://localhost:5000/` to view the app.

