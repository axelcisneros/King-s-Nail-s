import styled from 'styled-components';
import textura from '/textura.jpg';

const Background = styled.div`
  background-color: #e5b8c2; /* Color oro rosa */
  position: relative;
  min-height: 100vh;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${textura});
    background-size: cover;
    opacity: 1;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
    z-index: 1;
    pointer-events: none;
  }
`;

export default Background;