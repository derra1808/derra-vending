const L={a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8};
const V=new Set("aeiouy");
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const sum=(t,f)=>{let n=0;for(const c of t){const x=norm(c);if(!/[a-z]/.test(x))continue;if(f&&!f(x))continue;n+=L[x]||0;}return n;};
const red=(n,k=true)=>{if(k&&[11,22,33].includes(n))return n;while(n>9){if(k&&[11,22,33].includes(n))return n;n=String(n).split("").reduce((a,d)=>a+ +d,0);}return n;};
const rf=n=>{while(n>9)n=String(n).split("").reduce((a,d)=>a+ +d,0);return n;};
const fmt=(n)=>[11,22,33].includes(n)?`${n}/${rf(n)}`:String(red(n));

const fn="Ibrahim", ln="Derra", d=18, m=8, y=1997;
const yr=rf(String(y).split("").reduce((a,n)=>a+ +n,0));
const full=`${fn} ${ln}`;

const expression=red(sum(full));
const lifePath=red(rf(d)+rf(m)+yr);
const trunk=red(d+m);
const dynamique=red(expression+lifePath+trunk);
const bark=red(sum(full,c=>!V.has(c)));
const leaves=red(sum(full,c=>V.has(c)));
const dayT=Math.floor(d/10), dayU=d%10;
const birthdayChallenge=red(Math.abs(dayT-dayU));
const birthGift=red(11-rf(d));
const branches=birthGift;

console.log("TREE", {
  root1: fmt(expression),
  root2: fmt(lifePath),
  trunk: fmt(trunk),
  dynamique: fmt(dynamique),
  bark: fmt(bark),
  branches: fmt(branches),
  leaves: fmt(leaves),
  fruits: fmt(bark),
  birthdayChallenge,
  birthGift,
});

const py2026=red(rf(d)+rf(m)+rf(2026));
const uy2026=red(2026);
const obj=red(py2026+uy2026,false);
console.log("2026", {py:py2026, uy:uy2026, obj});
console.log("PM jul", red(py2026+7));
console.log("PD jul5", red(red(py2026+7)+5));

const md=rf(m), dd=rf(d), yd=yr;
const P=[red(md+dd), red(dd+yd), red(md+dd+yd), red(md+yd)];
console.log("Pinnacles", P);
console.log("LP", lifePath, "p1 end", 36-lifePath);

for(let q=1;q<=4;q++){
  const lastMonth=q*3;
  console.log(`Q${q} last month PM`, red(py2026+lastMonth));
}
