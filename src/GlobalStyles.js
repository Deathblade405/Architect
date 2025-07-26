import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display&display=swap');

  *, *::before, *::after {
    margin: 0; padding: 0; box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.black};
    color: ${({ theme }) => theme.colors.gold};
    overflow-x: hidden;
  }

  a {
    color: ${({ theme }) => theme.colors.gold};
    text-decoration: none;
  }

  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.accent};
    font-weight: 700;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.black};
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.gold};
    border-radius: 10px;
  }
`;
