# MyIdeaPad — Міні-блог особистих нотаток

Веб-платформа для особистих нотаток з аутентифікацією та real-time оновленнями.

## Технології

- **Frontend:** React 19, Vite, React Router
- **Backend:** Firebase Authentication, Cloud Firestore
- **Стилі:** CSS (адаптивний дизайн)

## Функціональність

- ✅ Реєстрація та вхід (email/пароль)
- ✅ Вихід з акаунту
- ✅ CRUD для нотаток (створення, читання, редагування, видалення)
- ✅ Real-time оновлення списку нотаток
- ✅ Прив'язка нотаток до користувача (кожен бачить тільки свої)
- ✅ Відображення часу створення/редагування ("2 години тому")
- ✅ Валідація (порожні нотатки заборонені)
- ✅ Підтвердження видалення
- ✅ Роутинг: `/`, `/login`, `/register`, `/my-notes`

## Локальний запуск

### 1. Клонування та встановлення залежностей

```bash
cd MyIdeaPad
npm install
```

### 2. Налаштування Firebase

1. Створіть проєкт на [Firebase Console](https://console.firebase.google.com/)
2. Додайте Web-додаток (</>) і скопіюйте конфігурацію
3. Увімкніть **Authentication** → Sign-in method → **Email/Password**
4. Створіть **Firestore Database** (режим production)
5. Скопіюйте `.env.example` у `.env` і заповніть значеннями:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Правила безпеки Firestore

У Firebase Console → Firestore Database → Rules вставте вміст файлу `firestore.rules` або скопіюйте:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    match /notes/{noteId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
  }
}
```

### 4. Запуск

```bash
npm run dev
```

Відкрийте http://localhost:5173

## Структура Firestore

Колекція `notes`:

```javascript
{
  title: "Заголовок",
  content: "Текст нотатки",
  userId: "uid_з_Firebase_Auth",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

## Правила безпеки (Security Rules)

- **read:** тільки свої нотатки (`resource.data.userId == request.auth.uid`)
- **create:** тільки зі своїм `userId` (`request.resource.data.userId == request.auth.uid`)
- **update, delete:** тільки свої нотатки

Жоден користувач не може отримати або змінити дані іншого через API.

## Деплой

```bash
npm run build
```

Для Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

Альтернативи: Vercel, Netlify.

## Структура проєкту

```
src/
├── components/     # NoteForm, NoteCard, ProtectedRoute
├── context/        # AuthContext
├── pages/          # Home, Login, Register, Notes
├── firebase.js     # Конфігурація Firebase
├── App.jsx
└── App.css
```

## Ліцензія

MIT
