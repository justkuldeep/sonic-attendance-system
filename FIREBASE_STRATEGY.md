# Firebase Strategy: Zero to Hero

You have a Firebase project (Gemini enabled). That's a great start!
Here is exactly what you need to do to get the "keys" required to connect your Sonic Attend app.

---

## 🛑 Frontend Configuration (Client Keys)
These keys allow your Website (Frontend) to talk to Firebase (Login, etc.).

1.  Go to **Project Settings** (Gear icon ⚙️ next to Project Overview in top-left).
2.  **If you see "Your apps" but it's empty**:
    *   Click the **Web** icon (it looks like `</>`).
    *   Enter a name (e.g., "Sonic Attend Web").
    *   Uncheck "Firebase Hosting" (not needed yet).
    *   Click **Register app**.
3.  **Now** you will see the configuration code block.
4.  Copy the code block inside `const firebaseConfig = { ... }`.
    *   It looks like this:
        ```javascript
        apiKey: "AIzaSy...",
        authDomain: "sonic-attend.firebaseapp.com",
        projectId: "sonic-attend",
        storageBucket: "sonic-attend.appspot.com",
        messagingSenderId: "12345...",
        appId: "1:12345..."
        ```
4.  **Action**: Open the file `SECRETS_TEMPLATE.txt` I created on your Desktop (or see below), and paste these values into the "FRONTEND" section.

---

## 🛑 Backend Configuration (Server Keys)
These keys allow your Backend (Node.js) to be the "Authority" (verify tokens, manage database).

1.  Still in **Project Settings**, click the **Service accounts** tab.
2.  Click **Generate new private key** -> **Generate key**.
3.  A file named `sonic-attend-firebase-adminsdk-....json` will download.
4.  **Action**: Open that downloaded file with Notepad.
5.  Copy the **entire content** (it starts with `{` and ends with `}`).
6.  Paste it into the "BACKEND" section of `SECRETS_TEMPLATE.txt`.

---

## 🛑 Enable Authentication (Login System)
1.  On the Left Sidebar, click **Build** -> **Authentication**.
2.  Click **Get started**.
3.  Under "Sign-in method", click **Email/Password**.
4.  Toggle **Enable** (leave "Email link" disabled).
5.  Click **Save**.

---

## 🛑 Enable Database (Session Storage)
1.  On the Left Sidebar, click **Build** -> **Firestore Database**.
2.  Click **Create database**.
3.  Choose **Start in test mode** (Easier for development).
    *   *Note: It will warn you about security rules, ignore for now.*
4.  Click **Next**, choose a location (default is fine), and click **Enable**.

---

## ✅ Final Step
Once you have filled out the `SECRETS_TEMPLATE.txt` file (or just gathered the info), reply to me saying "Ready".
**If you paste the content of the file here in the chat, I will automatically configure everything for you.**
