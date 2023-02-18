// console.log(gsap);
const canvas = document.querySelector("canvas");
const score = document.querySelector("#score");
const finalScore = document.querySelector("#finalScore");
const gameOver = document.querySelector(".gameOver");
document.querySelector("#reloadGame").onclick = () => {
  location.reload();
};

// console.log(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 20, "white");


const projecttiles = [];
const enemies = [];
const particles = [];

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * 30 + 10;
    // console.log('ke dich moi da xuat hien');

    let x;
    let y;
    // tao ke dich ngau nhien tu 4 canh cua canvas
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width - radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height - radius;
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    // lay tam man hinh tru cho vi tri hien tai cua ke dich
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    // console.log(angle);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}


let animationId;
let scoreValue = 0;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projecttiles.forEach((projectile, index) => {
    projectile.update();
    // remove projectile
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projecttiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distance - enemy.radius - player.radius < 1) {
      //console.log("end game");
      cancelAnimationFrame(animationId);
      gameOver.classList.toggle("active");
    }

    projecttiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );
      // console.log(distance);

      // khi cham vao ke thu
      if (distance - enemy.radius - projectile.radius < 1) {
        // tang diem so
        scoreValue += 100;
        score.innerHTML = scoreValue;
        finalScore.innerHTML = scoreValue;

        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            // gia tri cua velocitty se dao dong tu khoang -0.5 -> 0.5
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 4),
                y: (Math.random() - 0.5) * (Math.random() * 4),
              }
            )
          );
        }
        if (enemy.radius - 10 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });

          setTimeout(() => {
            projecttiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(index, 1);
            projecttiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

// console.log(player);
addEventListener("click", (event) => {
  // console.log(event);
  // console.log(projecttiles);

  // dung atan2() dung de tim ra goc giua noi click chuot
  // => x: cos(angle), y => sin(angle)
  //=> ve lai projectile o vi tri moi sau do xoa cai cu di
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  //  console.log(angle);
  const velocity = {
    x: Math.cos(angle) * 9,
    y: Math.sin(angle) * 9,
  };
  

  // sau khi lay duoc vi tri thi se dua tao ra 1 vien dan moi
  projecttiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

animate();
spawnEnemies();

// https://www.youtube.com/watch?v=eI9idPTT0c4&t=5816s  => 参考リンク
// git@github.com:Hoangvu2208/case_study2.git => ソースコードリンク
