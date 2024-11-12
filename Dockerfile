FROM node:18.16.0

ENV REGION=us-east-1
ENV DYNAMODB_TABLE=sentiment-analysis-table
ENV AWS_ACCESS_KEY_ID= YOUR_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY= YOUR_SECRET_KEY

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
