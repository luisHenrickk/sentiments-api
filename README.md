
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
