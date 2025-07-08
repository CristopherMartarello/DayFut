# DayFut
> Trabalho da disciplina de Tópicos Especiais em Programação, sétima fase do curso de Ciência da Computação.
> DayFut é um aplicativo mobile para fãs de futebol, permitindo favoritar jogadores, times e ligas, visualizar detalhes e compartilhar suas opiniõesatravés de  comentários!
> O aplicativo foi desenvolvido para proporcionar praticidade e interação para os apaixonados por futebol, centralizando informações e preferências em um só lugar.

## Sobre o DayFut

O DayFut oferece uma experiência completa para quem acompanha futebol, com as seguintes funcionalidades principais:



- **Favoritos:** Permite ao usuário favoritar jogadores, times e ligas, salvando suas preferências no Firebase.
- **Detalhes completos:** Visualização de informações detalhadas sobre jogadores, times e campeonatos, incluindo imagens, estatísticas e histórico.
- **Comentários:** Sistema de comentários em cada entidade (jogador, time, liga), com armazenamento em tempo real no Firebase.
- **Busca inteligente:** Pesquise jogadores, times e ligas por nome, com resultados rápidos via integração com a API TheSportsDB.
- **Temas claro/escuro:** Personalização visual usando Context API para alternar entre temas.
- **Gerenciamento global de favoritos:** Utiliza Redux para manter o estado global dos favoritos do usuário.
- **Autenticação:** Login e cadastro de usuários com autenticação via Firebase Auth.
- **Persistência e sincronização:** Todos os dados de favoritos e comentários são persistidos e sincronizados em tempo real usando Firebase Firestore.
- **Estilização moderna:** Utiliza Tailwind CSS (via NativeWind) para estilização rápida, responsiva e consistente dos componentes.



## Tecnologias utilizadas:
- React Native (Expo)
- Firebase (Auth e Firestore)
- Redux Toolkit
- Context API
- Axios (requisições à API de futebol)
- TheSportsDB API
- Tailwind CSS (NativeWind)

## Como Rodar a Aplicação

É necessário possuir **Node.js** e **Expo CLI** instalado em seu desktop, e um dispositivo móvel com **Expo Go**.

- Verifique a presença do Node.js:
  ```bash
  node --version   # Deve retornar v18.x ou superior
  npm --version    # Deve retornar v9.x ou superior
  ```
  Caso esteja ausente, instale a partir de: [https://nodejs.org/pt](https://nodejs.org/pt)

- Verifique a presença do Expo CLI:
  ```bash
  expo --version   # Deve retornar a versão instalada (ex: 7.x)
  ```
  Caso esteja ausente, execute no terminal:
  ```bash
  npm install -g expo-cli
  ```

- Caso possua problemas com o Expo GO em seu dispositivo mobile, recomenda-se o seguinte tutorial para emulação de dispositivo móvel no desktop:  
  [React Native Tutorial - 6 - Running App on Android Emulator](https://youtu.be/xKGESzemfdw?si=FYsF8Y7M9ywaVL4g)

## Clonando e Rodando o Projeto

1. Clone o repositório.
2. Com o repositório aberto na IDE de sua preferência, execute:
   ```bash
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm start
   ```

4. Você pode agora escanear o QR code que aparecerá no terminal com seu dispositivo móvel para abrir a aplicação, ou pressionar **"a"** para abrir o emulador Android (caso tenha seguido o tutorial mencionado), ou ainda pressionar "w" para abrir no navegador.

---

