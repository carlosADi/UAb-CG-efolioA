/*
  UC:   Computação Gráfica
  Efólio : A
  Autor: Carlos Inácio
  Número Aluno Universidade Aberta : 1701879
  Curso: Licenciatura em Engenharia Informática
*/

import lineMP from '../lineMP.mjs';
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';


var scene, camera, renderer, cube, controls, mouse, raycaster;

let P = {x:0,y:0};
let Q = {x:3, y:1};
let R = lineMP(P,Q);

let t = [];
let coord;
let coord2;
let points = [];


function init(){
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight , 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);                          //Definir o ratio dos pixel no renderer
  
  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  const square = new THREE.BoxGeometry(1,1,0.1);
  const plane = new THREE.Group();

  createEixos(); //criar eixo positivo de x e y com cores solicitadas

  //criar plano para conseguir colocar alternar as cores 
  for(let x =-10; x<11; x++){
    for(let z=-10; z<11; z++){
        let cube;
        const lightsquare = new THREE.MeshBasicMaterial({color:0xFF8F00});
        const darksquare = new THREE.MeshBasicMaterial({color: 0xB253B5});
        if(z % 2 ==0){
          cube = new THREE.Mesh(square, x % 2 == 0 ? lightsquare : darksquare);
        }else{
          cube = new THREE.Mesh(square, x % 2 == 0 ? darksquare : lightsquare);
        }
        cube.position.set(x,z,0);
        plane.add(cube);
    }
  }

  scene.add(plane); //adiciona o plano à scene

  camera.position.z = 15; //posiciona a uma distância de 15
  camera.lookAt(0,0,0); //posiciona a câmara na posição 0,0,0

  controls = new OrbitControls(camera, renderer.domElement); //ativa o modo OrbitControls
  
  controls.enablePan = false; // evita o deslizar para fora do plano , bloqueando o utilizador para ficar a visualizar apenas o plano
  
  window.requestAnimationFrame(animate);
}

//função para criar eixo x e y positivos
function createEixos(){
  const eixoMaterialX = new THREE.LineBasicMaterial(                               //Propriedades dos eixos
      {
          color: 0x020c4f4,
          linewidth: 2
      }
  );
  const eixoMaterialY = new THREE.LineBasicMaterial(                               //Propriedades dos eixos
    {
        color: 0xf45020,
        linewidth: 2
    }
  );
  const eixoPontosX = [];                                                                                     //Pontos dos eixos
  const eixoPontosY = [];
                                                                                       //x e y
  eixoPontosY.push( new THREE.Vector3(0, 10.5,0.1));   //Cria Ponto Limite superior de Y
  eixoPontosY.push( new THREE.Vector3(0, 0,0.2));   //cria ponto limite inferior de Y
  eixoPontosX.push( new THREE.Vector3(10.5, 0,0.1));   //Cria Ponto Limite Inferior de X
  eixoPontosX.push( new THREE.Vector3(0, 0,0.1));   //Cria Ponto Limite Superior de X

  const eixoGeometriaX = new THREE.BufferGeometry().setFromPoints(eixoPontosX);                               //Geometria dos Eixos
  const eixoGeometriaY = new THREE.BufferGeometry().setFromPoints(eixoPontosY);                               //Geometria dos Eixos
  const eixoX = new THREE.Line(eixoGeometriaX, eixoMaterialX);                                                 //Cria Eixos 
  const eixoY = new THREE.Line(eixoGeometriaY, eixoMaterialY);                                                 //x e y

  eixoX.name="Eixo X";
  eixoY.name="Eixo Y";

  scene.add(eixoX);                                                                                            //Adiciona na scene os eixos
  scene.add(eixoY);
}

function animate(){
  controls.update();
  renderer.render(scene, camera);  
  window.requestAnimationFrame(animate);
}
//funçao para reajustar tamanho da janela 
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
var timer = setTimeout(onMouseStop, 500);
//Função para aceitar os eventos do rato para desenhar
window.addEventListener( 'mousemove', onMouseMove, false );
function onMouseMove( event ) {
  
  clearTimeout(timer);
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;                                        //Obter coordenada x clicada com o rato
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;                                     //Obter coordenada y clicada com o rato
  
  timer;
  
  
}
function onMouseStop(){
  raycaster.setFromCamera( mouse, camera ); 
  var point = raycaster.intersectObjects( scene.children[2].children );
  var pointCoord = point[0].object.position;
  var count;
  clearTimeout(timer);
  if(count = 1){
    count++;
    console.log('Pontos: ', pointCoord);
    
    
  }
  
  
}
//Função para detetar o pressionar da tecla do teclado
window.addEventListener('keydown',onkeydown, false);
function onkeydown( event ) {
  let key = event.which;
  
  switch(key){
    case 88:  //verifica tecla 'x' selecciona quadrado
      obterPontoClicado();
      break;
    case 8: //verifica tecla 'backspace' e limpa plano
      init();
      break;
  }
}

//Obter as posições do ecrã selecionados pelo rato ao clicar na tecla X 
function obterPontoClicado() {
  raycaster.setFromCamera( mouse, camera );                                            //Definir área de visualização clicavel
  const intersects = raycaster.intersectObjects( scene.children[2].children );                                     //Obter objetos clicados com o rato
  
  if(coord == undefined) {    //associar valores intersetados a coord se este for undefined
    coord = intersects[0].object.position;
    intersects[0].object.material.color.r = 255;
    intersects[0].object.material.color.g =0;
    intersects[0].object.material.color.b = 0;                                              //Definir uma cor diferente para sinalizar a posição clicada
    console.log("Coordenadas do Ponto 1: ", coord);
    return; //retorna para sair da função após alocação ao coord e escrever na consola
  }
  if(coord != undefined) // no caso de a var coord for diferente de undefined inicia if
  {
    coord2 = intersects[0].object.position;
    intersects[0].object.material.color.r = 255;
    intersects[0].object.material.color.g =0;
    intersects[0].object.material.color.b = 0;                                              //Definir uma cor diferente para sinalizar a posição clicada
    console.log("Coordenadas do Ponto 2: ", coord2); // escrevee na consola a coordenadas do ponto 2
  }
  if(coord != undefined && coord2 != undefined) // se ambas as coordenadas estiverem preenchidas executa este if 
  {
    t= lineMP(coord, coord2); // executa a função com as coordenadas coord e coord2
    drawPixel(t); // com os valores obtidos anteriormente, usamos o array obtido (t) e mandamos para o drawPixel para escrever 
  }
  renderer.render( scene, camera );                                                                   //Atualizar scene
}

//Desenhar o Pixel nas posiçoes fornecidas
function drawPixel(t){
  let cena = scene.children[2].children;
  const Linematerial = new THREE.LineBasicMaterial({
    color: 0x000000
  });

  for(let h = 0; h<cena.length; h++){
    for(let p  = 0; p<t.length; p++){
      
        if(cena[h].position.x === t[p][0] && cena[h].position.y === t[p][1]){
          
          const geomPixel = new THREE.BoxGeometry(1,1,0.25);
          const materialPixel = new THREE.MeshBasicMaterial({color:0xFFFF00, transparent: true, opacity: 0.75});
          const cube = new THREE.Mesh( geomPixel, materialPixel );
          
          cube.position.x = cena[h].position.x;
          cube.position.y = cena[h].position.y;
          cube.position.z = 0.25;
          
          scene.add(cube);
          console.log(cube);
        }
      }
    }

    let x1 = t[0][0];
    let y1 = t[0][1];
    let z1 = 0.25;
    let x2 = t[t.length-1][0];
    let y2 = t[t.length-1][1];
    let z2 = 0.25;

    points.push(new THREE.Vector3(x1,y1,z1));
    points.push(new THREE.Vector3(x2,y2,z2));
    const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    const LineGEOM = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(LineGEOM, material)
    scene.add(line); // adicionar linha de coord a coord 2

    //definir coord e coord2 undefined e points a vazio 
    points = [];
    coord = undefined;
    coord2 = undefined;                                                                              //Adicionar Cubo na cena
}

//Função para controlar o zoom da camera
document.addEventListener("wheel", changeZoom);
function changeZoom(event) {
  if(event.deltaY <0 ){                                                                           //Opção de Aumentar o Zoom
     if(camera.zoom < 10)                                                                        //Limita o aumento do zoom da camara
      camera.zoom++;
    } else {                                                                                        //Opção de diminuir zoom
      if(camera.zoom > 1)                                                                         //Evita que a camera inverta a imagem ao diminuir
        camera.zoom--;                                                                          //o zoom de mais
    }
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
}

window.addEventListener('resize', onWindowResize);
window.onload =init;



