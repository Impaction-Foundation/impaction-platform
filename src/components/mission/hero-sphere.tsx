'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/components/theme-provider';

const vertex = `
  varying vec2 vUv;
  void main() {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      vUv = uv;
  }
`;

const fragment = `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uTheme; // 0.0 for dark, 1.0 for light

  varying vec2 vUv;
  const int AMOUNT=10;
  vec3 mod289(vec3 x)
  {
      return x-floor(x*(1./289.))*289.;
  }
  vec4 mod289(vec4 x)
  {
      return x-floor(x*(1./289.))*289.;
  }
  vec4 permute(vec4 x)
  {
      return mod289(((x*34.)+1.)*x);
  }
  vec4 taylorInvSqrt(vec4 r)
  {
      return 1.79284291400159-.85373472095314*r;
  }
  vec3 fade(vec3 t){
      return t*t*t*(t*(t*6.-15.)+10.);
  }
  float pnoise(vec3 P,vec3 rep)
  {
      vec3 Pi0=mod(floor(P),rep);
      vec3 Pi1=mod(Pi0+vec3(1.),rep);
      Pi0=mod289(Pi0);
      Pi1=mod289(Pi1);
      vec3 Pf0=fract(P);
      vec3 Pf1=Pf0-vec3(1.);
      vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
      vec4 iy=vec4(Pi0.yy,Pi1.yy);
      vec4 iz0=Pi0.zzzz;
      vec4 iz1=Pi1.zzzz;
      vec4 ixy=permute(permute(ix)+iy);
      vec4 ixy0=permute(ixy+iz0);
      vec4 ixy1=permute(ixy+iz1);
      vec4 gx0=ixy0*(1./7.);
      vec4 gy0=fract(floor(gx0)*(1./7.))-.5;
      gx0=fract(gx0);
      vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
      vec4 sz0=step(gz0,vec4(0.));
      gx0-=sz0*(step(0.,gx0)-.5);
      gy0-=sz0*(step(0.,gy0)-.5);
      vec4 gx1=ixy1*(1./7.);
      vec4 gy1=fract(floor(gx1)*(1./7.))-.5;
      gx1=fract(gx1);
      vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
      vec4 sz1=step(gz1,vec4(0.));
      gx1-=sz1*(step(0.,gx1)-.5);
      gy1-=sz1*(step(0.,gy1)-.5);
      vec3 g000=vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010=vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001=vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011=vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
      vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
      g000*=norm0.x;
      g010*=norm0.y;
      g100*=norm0.z;
      g110*=norm0.w;
      vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
      g001*=norm1.x;
      g011*=norm1.y;
      g101*=norm1.z;
      g111*=norm1.w;
      float n000=dot(g000,Pf0);
      float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
      float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
      float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
      float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
      float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
      float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
      float n111=dot(g111,Pf1);
      vec3 fade_xyz=fade(Pf0);
      vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
      vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
      float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
      return 2.2*n_xyz;
  }
  float snoise(vec3 v)
  {
      const vec2 C=vec2(1./6.,1./3.);
      const vec4 D=vec4(0.,.5,1.,2.);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(
                  i.z+vec4(0.,i1.z,i2.z,1.))
                  +i.y+vec4(0.,i1.y,i2.y,1.))
                  +i.x+vec4(0.,i1.x,i2.x,1.));
      float n_=.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.+1.;
      vec4 s1=floor(b1)*2.+1.;
      vec4 sh=-step(h,vec4(0.));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;
      p1*=norm.y;
      p2*=norm.z;
      p3*=norm.w;
      vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
      m=m*m;
      return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),
      dot(p2,x2),dot(p3,x3)));
  }
  float grain(vec2 vUv,vec2 uResolution,float frame,float multiplier){
      vec2 mult=vUv*uResolution;
      float offset=snoise(vec3(mult/multiplier,frame));
      float n1=pnoise(vec3(mult,offset),vec3(1./vUv*uResolution,1.));
      return n1/2.+.5;
  }
  float grain(vec2 vUv,vec2 uResolution,float frame){
      return grain(vUv,uResolution,frame,2.5);
  }
  float grain(vec2 vUv,vec2 uResolution){
      return grain(vUv + cos(uTime),uResolution,0.);
  }
  void main(){
      vec2 newUv=20.*(vUv.xy-uResolution);
      float len;
      for(int i=0;i<AMOUNT;i++){
          len=length(vec2(newUv.x,newUv.y));
          newUv.x=newUv.x-cos(newUv.y+sin(len))+cos(uTime/9.);
          newUv.y=newUv.y+sin(newUv.x+cos(len))+sin(uTime/9.);
      }
      float grainSize=1.1;
      float g=grain(vUv,uResolution/grainSize);
      float c = (cos(len + g) + 1.0) * 0.5;

      vec3 finalColor;

      if (uTheme > 0.5) { // Light mode
        vec3 colorA = vec3(1.0, 0.75, 0.04); // Yellow
        vec3 colorB = vec3(1.0, 0.34, 0.13); // Orange
        finalColor = mix(colorA, colorB, c);
      } else { // Dark mode
        vec3 colorA = vec3(0.18, 0.51, 0.96); // Blue
        vec3 colorB = vec3(0.12, 0.83, 0.75); // Teal
        finalColor = mix(colorA, colorB, c);
      }
      
      gl_FragColor=vec4(finalColor, 0.10);
  }
`;

function m(a: number, e: number, t: number) {
  return a * (1 - t) + e * t
}

const HeroSphere = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) {
        return;
    }

    class Sketch {
      element: HTMLElement;
      viewport: { width: number; height: number; };
      mouse: { x: number; y: number; };
      clock: THREE.Clock;
      renderer!: THREE.WebGLRenderer;
      canvas!: HTMLCanvasElement;
      scene!: THREE.Scene;
      camera!: THREE.PerspectiveCamera;
      geometry!: THREE.SphereGeometry;
      material!: THREE.ShaderMaterial;
      mesh!: THREE.Mesh;
      animationFrameId!: number;
      theme: string;

      constructor(options: { dom: HTMLElement, theme: string }) {
        this.element = options.dom;
        this.theme = options.theme;
        this.viewport = {
          width: this.element.getBoundingClientRect().width,
          height: this.element.getBoundingClientRect().height,
        };
        this.mouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock;
        this.update = this.update.bind(this);
        this.init();
      }
      
      init() {
        this.addCanvas();
        this.addScene();
        this.addCamera();
        this.addMesh();
        this.addEventListeners();
        this.onResize();
        this.update();
      }
      
      addCanvas() {
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          powerPreference: "high-performance"
        });
        this.canvas = this.renderer.domElement;
        this.canvas.classList.add("webgl");
        this.element.appendChild(this.canvas);
      }
    
      addScene() {
        this.scene = new THREE.Scene();
      }
    
      addCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.viewport.width / this.viewport.height, .1, 10);
        this.camera.position.set(0, 0, 2.5);
        this.scene.add(this.camera);
      }
    
      addMesh() {
        this.geometry = new THREE.SphereGeometry(1.58, 32, 32);
        this.material = new THREE.ShaderMaterial({
          transparent: true,
          fragmentShader: fragment,
          vertexShader: vertex,
          uniforms: {
            uResolution: { value: new THREE.Vector2(this.viewport.width, this.viewport.height) },
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(this.mouse.x, this.mouse.y) },
            uTheme: { value: this.theme === 'light' ? 1.0 : 0.0 }
          }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
      }
      
      addEventListeners() {
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
      }

      removeEventListeners() {
        window.removeEventListener("resize", this.onResize.bind(this));
        window.removeEventListener("mousemove", this.onMouseMove.bind(this));
      }
    
      onResize() {
        this.viewport = {
          width: this.element.getBoundingClientRect().width,
          height: this.element.getBoundingClientRect().height,
        };
        this.camera.aspect = this.viewport.width / this.viewport.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      }
    
      onMouseMove(e: MouseEvent) {
        let t = this.mouse.x, o = this.mouse.y;
        this.mouse.x = m(t, e.clientX / window.innerWidth - .5, 1);
        this.mouse.y = m(o, e.clientY / window.innerHeight - .5, 1);
      }
    
      update() {
        this.render();
        this.mesh.rotation.y = m(this.mesh.rotation.y, this.mouse.x, .075);
        this.mesh.rotation.x = m(this.mesh.rotation.x, this.mouse.y, .075);
        this.material.uniforms.uTime.value = this.clock.getElapsedTime();
        this.animationFrameId = window.requestAnimationFrame(this.update);
      }
    
      render() {
        this.renderer.render(this.scene, this.camera);
      }

      cleanup() {
        if (this.animationFrameId) {
          window.cancelAnimationFrame(this.animationFrameId);
        }
        this.removeEventListeners();
        this.renderer.dispose();
        this.geometry.dispose();
        this.material.dispose();
        if (this.element && this.canvas) {
          try {
            this.element.removeChild(this.canvas);
          } catch(e) {
            // ignore if already removed
          }
        }
      }
    }

    const sketch = new Sketch({ dom: mountRef.current, theme });

    return () => {
      sketch.cleanup();
    };
  }, [theme]);

  return <div ref={mountRef} className="absolute inset-0 z-5" />;
};

export default HeroSphere;
