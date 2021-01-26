import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: "SourceCodePro";
    src: url("/assets/fonts/SourceCodePro-Regular.ttf");
}

html {
    font-size: 16px;
    box-sizing: border-box;
}

*, *:before, *:after {
    box-sizing: inherit;
}

body {
    margin: 0;
    font-size: 16px;
}
`;
