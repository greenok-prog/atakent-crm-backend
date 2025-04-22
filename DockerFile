FROM node:20

WORKDIR /app

# Копируем только package.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Теперь копируем остальное
COPY . .

# Собираем приложение
RUN npm run build

EXPOSE 8888

CMD ["npm", "run", "start:prod"]
