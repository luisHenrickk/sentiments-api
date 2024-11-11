# API de Análise de Sentimento

## Descrição

Esta API foi desenvolvida usando NestJS e AWS pelos alunos Luis Henrick Businaro e Eduardo Alves. Ela utiliza serviços como AWS Lambda, DynamoDB e AWS Comprehend para realizar análise de sentimentos em textos fornecidos.

## Pré-requisitos

Antes de começar, certifique-se de ter o Node.js e o NPM instalados em sua máquina. Sua máquina deve estar executando a versão do Node.js 18.16.0 ou superior, mas abaixo de 21.0.0, e NPM versão 9 ou superior.

## Configuração da AWS

1. **Criar um usuário IAM:**

   - Acesse o console da AWS e vá para o serviço IAM (Identity and Access Management).
   - Crie um novo usuário com acesso programático. Isso gerará um ID de chave de acesso e uma chave de acesso secreta que você usará mais tarde.
   - Anexe as políticas `AdministratorAccess` e `AWSCloudFormationFullAccess` ao usuário. Isso garante que o usuário tenha as permissões necessárias para operar os recursos requeridos pela aplicação.

2. **Configurar o AWS CLI:**

   - Se ainda não estiver instalado, instale o AWS CLI seguindo as instruções no [site oficial da AWS](https://aws.amazon.com/pt/cli/).
   - Configure o AWS CLI com suas credenciais:

     ```bash
     aws configure
     ```

   - Quando solicitado, insira o ID da chave de acesso e a chave de acesso secreta do usuário IAM que você criou. Defina também a região padrão e o formato de saída conforme suas preferências.

## Configuração do Projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:

   - Preencha as variáveis de ambiente no arquivo `.env` com as configurações apropriadas para seu ambiente AWS.

3. Build do Projeto:

   ```bash
   npm run build
   ```

   - Este comando compila a aplicação e prepara os arquivos para execução.

## Executando Localmente

Para rodar a API localmente, após o build, utilize o seguinte comando:

```bash
npm start
```

Este comando iniciará o servidor local usando Serverless Offline, que simula o AWS Lambda e o API Gateway localmente.

## Executando com Docker

Esta aplicação pode ser executada em um contêiner Docker. Siga os seguintes passos para criar e executar o contêiner:

1. **Build da Imagem Docker:**

   ```bash
   npm run dockerBuild
   ```

   - Esse comando cria uma imagem Docker da aplicação.

2. **Executar o Contêiner:**

   ```bash
   npm run dockerStart
   ```

   - Isso executa a aplicação dentro de um contêiner e expõe a porta 3000 para acesso local.

## Endpoints Disponíveis

### 1. **GET /sentiments**

- Retorna todos os sentimentos armazenados, com a possibilidade de aplicar filtros.
- **Parâmetros de Query (Opcional):** `sentiment`

### 2. **GET /sentiments/:id**

- Retorna um sentimento específico com base no `id` fornecido.

### 3. **POST /sentiments**

- Cria um novo sentimento com base no texto fornecido.
- **Corpo da Requisição:** `{ "message": "Seu texto aqui" }`

### 4. **PUT /sentiments/:id**

- Atualiza informações de um sentimento específico.
- **Corpo da Requisição:** `{ "sentiment": "POSITIVE" }`

### 5. **DELETE /sentiments/:id**

- Remove um sentimento específico com base no `id` fornecido.

## Handlers Disponíveis

### 1. **Sentiment Analysis Handler**

- Responsável por analisar o sentimento de um texto fornecido e salvar os resultados no DynamoDB.

### 2. **Analyze Sentiment Distribution Handler**

- Processa e fornece informações sobre a distribuição de sentimentos armazenados.

Estes handlers são utilizados para realizar tarefas específicas com a AWS Lambda, permitindo a integração dos serviços AWS Comprehend e DynamoDB.

## Executando com Serverless

Você pode executar a aplicação utilizando o Serverless Framework de forma offline, que simula o comportamento da aplicação como se estivesse no ambiente AWS. Para isso, utilize o seguinte comando:

```bash
npm run start:serverless
```

Este comando iniciará um servidor local que simula o AWS Lambda e o API Gateway, permitindo testar a aplicação antes da implantação.

## Implantação

Para implantar a API no seu ambiente AWS, use:

```bash
npm run deploy:dev
```

Isso implantará sua aplicação no estágio de desenvolvimento.

## Remoção

Se precisar remover a aplicação implantada da AWS, você pode usar:

```bash
npm run remove:dev
```

Isso removerá os serviços implantados da sua conta AWS.
