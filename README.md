<h1 align="center">
  Roborun 🤖⚡
</h1>
<p align="center">
<img alt="WebGL using threejs" src="https://img.shields.io/badge/WebGL-three.js-red"/>
<img alt="JavaScript" src="https://aleen42.github.io/badges/src/javascript.svg"/>
<img alt="Node" src="https://aleen42.github.io/badges/src/node.svg"/>
<img alt="Docker" src="https://aleen42.github.io/badges/src/docker.svg"/>
<img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue"/>
</p>
<br>
<div align="center">
    <a href="https://youtu.be/vUzWBIOjoKA"><img alt = "roborun" src="https://user-images.githubusercontent.com/37873745/100441701-41d6aa80-30ea-11eb-95fe-80c81539201c.png"></a>
</div>

<p align="center"><a href="http://52.78.27.117:3000">Click here to start the game.</a></p>

<hr>

<h3> Motivation </h3>
<p>Roborun was created motivated by <a href ="https://chromedino.com/">a Chrome dinosaur game</a>.</p>
<p align = "center">
<img src = "https://lh3.googleusercontent.com/YPSZ9e1wW1z7cIyjkpQUqAdMzlgaPprj3_1n9tKesPfYR8U1nlxcsHFk8Dd-1XWa-ymskRLekQ=w640-h400-e365-rj-sc0x00ffffff">
</p>
<p>The Chrome dinosaur game was a game that could be enjoyed easily by men and women of all ages, but users quickly got tired of 2D and simple motion. So we wanted to take easy operation, which is an advantage of the Chrome dinosaur game, and develop a more interesting game by changing the 2D features into 3D.</p>

<br>
<h3> Three.js </h3>
<p>We used Three.js to draw 3D objects and organize games. Three.js is a library that helps you draw 3D objects easily based on javascript language.</p>

> The aim of the project is to create an easy to use, lightweight, 3D library with a default WebGL renderer. The library also provides Canvas 2D, SVG and CSS3D renderers in the examples.

<p>For more information on Three.js, please refer to <a href = "https://github.com/mrdoob/three.js/">the official Three.js document.</a></p>

<br>
<h3> Game </h3>
<p align="center"><img width="1741" alt="3d" src="https://user-images.githubusercontent.com/37873745/100439203-92e49f80-30e6-11eb-8618-3586a4cf01b3.png"></p>
<h5> 3D scene </h5>
<p>Roborun expressed 2D objects in the existing Chrome dinosaur games as 3D objects.</p>
<p>As the name Roborun suggests, we used robot characters, not dinosaur characters.</p>
<p>In addition, cactus, which used to be existing obstacles, was diversified into 3D stone and cactus to form obstacles randomly.</p>
<p>The background is also composed of 3D in the existing 2D configuration, expressing the robot character running.</p>

<h5> Key board </h5>
<p>When the game starts for the first time, it starts by clicking on the keyboard.</p>
<p>When you enter the game, you can make the robot jump through the space bar, which avoids obstacles.</p>

<h5> Score </h5>
<p>When the game starts, the score continues to increase in proportion to time.</p>
<p>If the robot fails to avoid obstacles, the game is over and the score increase stops, resulting in the final score being printed.</p>

<br>
<h3> Install </h3>
<p>If you want to install and run this project locally, there are two ways.</p>

<h5> Using Github, http-server </h5>
<p>It is a method that downloads projects through Github and executes them through http-server.</p>
<p>To install http-server:</p>
```
npm install http-server -g
```
<p>To run (from Roborun directory):</p>
```
http-server . -p 8000
```
<p>If you connect to 127.0.0.1:8000, you can play Roborun game.</p>

<br>
<h5> Using docker </h5>
<p>The Roborun project is implemented as a web project using express.js and distributed as a docker file.</p>
To get docker image:
```
docker pull tree9295/roborun
```
To run:
```
docker run -p 8000:3000 -d tree9295/roborun
```
<p>If you connect to 127.0.0.1:8000, you can play Roborun game.</p>

<br>
<h3> License </h3>

```xml
MIT License
Copyright (c) 2020 roborun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```